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
        className='flex-1 no-underline text-black overflow-hidden hover:underline lg:flex-none'
        href={url || '#'}
        target='_blank'
      >
        <p className='text-sm break-words break-all lg:font-bold'>{meta.title}</p>
      </a>

      <div
        className='mt-1 flex-1 text-sm overflow-y-scroll hidden lg:block'
      >
        <p className='leading-tight break-words break-all'>{meta.description}</p>
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

const enhanceSiteIcon = compose(
  withState('hasIcon', 'setHasIcon', ({ link }) => !!link)
)

const SiteIcon = enhanceSiteIcon((props) => {
  const {
    setHasIcon,
    hasIcon,
    link,
    styles
  } = props

  if (!hasIcon) return null

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
      // Handle img 404.
      onError={() => setHasIcon(false)}
    />
  )
})

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

const withReader = branch(
  ({ entities }) => {
    const firstUrl = _.first(entities.urls)
    const thumbnail = getThumbnail(firstUrl)
    const mediaType = _.get(firstUrl, 'og.meta.media')
    if (!thumbnail) return false

    const hasTwitter = _.includes(thumbnail.rel, 'twitter')
    const isReader = mediaType === 'reader'

    const hasPlayer = !_.isEmpty(getPlayer(entities))

    return !_.isEmpty(thumbnail) && !hasPlayer && (hasTwitter || isReader)
  },
  renderComponent(({ entities, styles }) => {
    const firstUrl = _.first(entities.urls)
    const { url } = firstUrl

    const siteIcon = getIcon(firstUrl)
    const meta = getMeta(firstUrl)
    const thumbnail = getThumbnail(firstUrl)

    let className = styles.OG

    return (
      <div className={`flex-col ${className}`}>
        <div
          className={styles.LargeOGImage}
          style={{backgroundImage: `url(${thumbnail.href})`}}
        />

        <Meta
          url={url}
          className='p-4 border-t'
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
  withPlayer,
  withReader
)

export default enhance((props) => {
  const {
    entities,
    styles,
    setIsExpanded,
    isMobile
  } = props
  const lastUrl = _.last(entities.urls)
  const thumbnail = getThumbnail(lastUrl)
  const { url } = lastUrl

  if (!thumbnail) {
    return null
  }

  const meta = getMeta(lastUrl)
  const siteIcon = getIcon(lastUrl)
  const hasPlayer = !_.isEmpty(getPlayer(entities))

  // if (meta.media === 'reader') {
  //   console.log('meta', meta, lastUrl)
  // }

  // console.log('Not handled OG type', props)

  let className = styles.OG

  if (hasPlayer && !isMobile) {
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
            if (!hasPlayer || isMobile) return
            setIsExpanded(true)
          }}
        />
      </div>

      <Meta
        url={url}
        styles={styles}
        className='flex-1 lg:flex-none p-2 border-l h-24 lg:h-32'
        siteIcon={siteIcon}
        meta={meta}
      />
    </div>
  )
})
