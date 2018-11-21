import React from 'react'
import { mount, shallow } from 'enzyme'
import sinon from 'sinon'
import { create } from 'react-test-renderer'

import TweetEntity from '../index'

// SEE: https://github.com/CookPete/react-player/blob/488f82da421ac9a27c2e52137767d19cc7f47a3e/test/players/FilePlayer.js#L12-L18
class MockMediaStream {}

global.navigator = {}
global.window = {
  MediaStream: MockMediaStream,
  URL: {
    createObjectURL: url => 'mockObjectURL'
  }
}

const ENTITIES = {
  ANIMATED_GIF: {
    hashtags: [],
    symbols: [],
    user_mentions: [],
    urls: [],
    media: [
      {
        id: 1049606350135685100,
        id_str: '1049606350135685120',
        indices: [
          12,
          35
        ],
        media_url: 'http://pbs.twimg.com/tweet_video_thumb/DpDzahXU8AAb81_.jpg',
        media_url_https: 'https://pbs.twimg.com/tweet_video_thumb/DpDzahXU8AAb81_.jpg',
        url: 'https://t.co/IIMBa4I4Vp',
        display_url: 'pic.twitter.com/IIMBa4I4Vp',
        expanded_url: 'https://twitter.com/subuta_nico/status/1049606383195152384/photo/1',
        type: 'photo',
        sizes: {
          large: {
            w: 220,
            h: 172,
            resize: 'fit'
          },
          thumb: {
            w: 150,
            h: 150,
            resize: 'crop'
          },
          medium: {
            w: 220,
            h: 172,
            resize: 'fit'
          },
          small: {
            w: 220,
            h: 172,
            resize: 'fit'
          }
        }
      }
    ]
  }
}

const EXTENDED_ENTITIES = {
  ANIMATED_GIF: {
    media: [
      {
        id: 1049606350135685100,
        id_str: '1049606350135685120',
        indices: [
          12,
          35
        ],
        media_url: 'http://pbs.twimg.com/tweet_video_thumb/DpDzahXU8AAb81_.jpg',
        media_url_https: 'https://pbs.twimg.com/tweet_video_thumb/DpDzahXU8AAb81_.jpg',
        url: 'https://t.co/IIMBa4I4Vp',
        display_url: 'pic.twitter.com/IIMBa4I4Vp',
        expanded_url: 'https://twitter.com/subuta_nico/status/1049606383195152384/photo/1',
        type: 'animated_gif',
        sizes: {
          large: {
            w: 220,
            h: 172,
            resize: 'fit'
          },
          thumb: {
            w: 150,
            h: 150,
            resize: 'crop'
          },
          medium: {
            w: 220,
            h: 172,
            resize: 'fit'
          },
          small: {
            w: 220,
            h: 172,
            resize: 'fit'
          }
        },
        video_info: {
          aspect_ratio: [
            55,
            43
          ],
          variants: [
            {
              bitrate: 0,
              content_type: 'video/mp4',
              url: 'https://video.twimg.com/tweet_video/DpDzahXU8AAb81_.mp4'
            }
          ]
        }
      }
    ]
  }
}

test('should render with empty props.', () => {
  const tree = mount(
    <TweetEntity
      entities={{}}
      extendedEntities={{}}
    />
  )

  // Should render nothing
  expect(tree).toMatchSnapshot()
})

test('should render with size.', () => {
  const tree = mount(
    <TweetEntity
      entities={ENTITIES.ANIMATED_GIF}
      extendedEntities={EXTENDED_ENTITIES.ANIMATED_GIF}
    />
  )

  // Testing for snapshot.
  expect(tree).toMatchSnapshot()
})
