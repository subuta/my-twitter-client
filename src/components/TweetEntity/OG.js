import React from 'react'
import _ from 'lodash'

import ReactPlayer from 'react-player'

import Icon from 'src/components/Icon'

import withStyles from './style'

import {
  compose,
  branch,
  withState,
  renderComponent
} from 'recompose'

const getMeta = (urlEntity) => _.get(urlEntity, 'og.meta', {})
const getIcon = (urlEntity) => {
  const links = getLinks(urlEntity)
  return _.findLast(links.icon)
}
const getLinks = (urlEntity) => _.get(urlEntity, 'og.links', [])
const getPlayer = (entities) => {
  const firstUrl = _.first(entities.urls)
  const { expanded_url } = firstUrl

  // Ignore non-playable player.
  if (!ReactPlayer.canPlay(expanded_url)) {
    return null
  }

  return _.get(firstUrl.og, 'links.player')
}

const getThumbnail = (urlEntity) => {
  const links = getLinks(urlEntity)
  const thumbnail = _.find(links.thumbnail, t => _.includes(t.rel, 'twitter'))
  return thumbnail || _.first(links.thumbnail)
}

const Meta = (props) => {
  const { meta, styles, url, siteIcon } = props

  let className = styles.Meta
  if (props.className) {
    className += ' ' + props.className
  }

  return (
    <div className={className}>
      <a
        className='no-underline text-black hover:underline'
        href={url || '#'}
        target='_blank'
      >
        <h5 className='flex-none mb-2 text-sm'>{meta.title}</h5>
      </a>

      <div
        className='flex-1 text-sm overflow-hidden'
      >
        <p className='leading-tight break-words'>{meta.description}</p>
      </div>

      <span className='block flex-none flex items-center justify-start mt-2 font-bold text-xs text-grey-dark'>
        <SiteIcon
          styles={styles}
          link={siteIcon}
        />
        <span>{meta.site}</span>
      </span>
    </div>
  )
}

const SiteIcon = ({ link, styles }) => {
  if (!link) return null

  const width = _.get(link, 'media.width')

  let style = {
    height: 'auto',
    width: 16
  }

  if (width) {
    style = {
      ...style,
      height: 'auto',
      width: 16
    }
  }

  return (
    <img
      className={styles.SiteIcon}
      src={link.href}
      alt="site-icon"
      style={style}
    />
  )
}

const withPlayer = branch(
  ({ entities, isExpanded }) => {
    if (!isExpanded) return false
    return !_.isEmpty(getPlayer(entities))
  },
  renderComponent(({ entities, styles }) => {
    const firstUrl = _.first(entities.urls)
    const { expanded_url, url } = firstUrl
    const hasPlayer = !_.isEmpty(getPlayer(entities))
    const siteIcon = getIcon(firstUrl)
    const meta = getMeta(firstUrl)

    let className = styles.OG

    if (hasPlayer) {
      className += ' has-player'
    }

    return (
      <div className={`flex-col ${className}`}>
        <ReactPlayer
          url={expanded_url}
          playing={false}
          controls
        />

        <Meta
          url={url}
          className='p-4'
          styles={styles}
          siteIcon={siteIcon}
          meta={meta}
        />
      </div>
    )
  }),
  _.identity
)

const enhance = compose(
  withStyles,
  withState('isExpanded', 'setIsExpanded', false),
  withPlayer
)

export default enhance((props) => {
  const { entities, styles, setIsExpanded } = props
  const lastUrl = _.last(entities.urls)
  const thumbnail = getThumbnail(lastUrl)
  const { url } = lastUrl

  if (!thumbnail) {
    return null
  }

  const meta = getMeta(lastUrl)
  const siteIcon = getIcon(lastUrl)
  const hasPlayer = !_.isEmpty(getPlayer(entities))

  // console.log('Not handled OG type', props)

  let className = styles.OG

  if (hasPlayer) {
    className += ' has-player'
  }

  return (
    <div className={className}>
      <div
        className={styles.SmallOGImage}
        style={{backgroundImage: `url(${thumbnail.href})`}}
      >
        <Icon
          className={styles.PlayIcon}
          icon='play-button-music-interface-sound'
          size='lg'
          onClick={() => {
            if (!hasPlayer) return
            setIsExpanded(true)
          }}
        />
      </div>

      <Meta
        url={url}
        styles={styles}
        className='flex-1 lg:flex-none p-2 border-l'
        siteIcon={siteIcon}
        meta={meta}
      />
    </div>
  )
})
