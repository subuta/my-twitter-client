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
  },

  PHOTO: {
    urls: [],
    media: [{
      id_str: '967319472796180480',
      type: 'photo',
      url: 'https://t.co/uc9iteuAQ8',
      display_url: 'pic.twitter.com/uc9iteuAQ8',
      media_url: 'http://pbs.twimg.com/media/DWyb73hVoAA4RKr.jpg',
      sizes: {
        small: {
          w: 680,
          h: 477,
          resize: 'fit'
        },
        large: {
          w: 1838,
          h: 1290,
          resize: 'fit'
        }
      },
      video_info: null,
      additional_media_info: null
    }]
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
  },

  PHOTO: {
    urls: [],
    media: [
      {
        id_str: '967319472796180480',
        type: 'photo',
        url: 'https://t.co/uc9iteuAQ8',
        display_url: 'pic.twitter.com/uc9iteuAQ8',
        media_url: 'http://pbs.twimg.com/media/DWyb73hVoAA4RKr.jpg',
        sizes: {
          small: { w: 680, h: 477, resize: 'fit' },
          large: { w: 1838, h: 1290, resize: 'fit' }
        },
        video_info: null,
        additional_media_info: null
      }, {
        id_str: '967319508791656448',
        type: 'photo',
        url: 'https://t.co/uc9iteuAQ8',
        display_url: 'pic.twitter.com/uc9iteuAQ8',
        media_url: 'http://pbs.twimg.com/media/DWyb99nVAAAD2pC.jpg',
        sizes: {
          small: { w: 680, h: 477, resize: 'fit' },
          large: { w: 1839, h: 1291, resize: 'fit' }
        },
        video_info: null,
        additional_media_info: null
      }, {
        id_str: '967319543302402048',
        type: 'photo',
        url: 'https://t.co/uc9iteuAQ8',
        display_url: 'pic.twitter.com/uc9iteuAQ8',
        media_url: 'http://pbs.twimg.com/media/DWyb_-LVMAA25Nb.jpg',
        sizes: {
          small: { w: 680, h: 477, resize: 'fit' },
          large: { w: 1839, h: 1291, resize: 'fit' }
        },
        video_info: null,
        additional_media_info: null
      }, {
        id_str: '967319660986183680',
        type: 'photo',
        url: 'https://t.co/uc9iteuAQ8',
        display_url: 'pic.twitter.com/uc9iteuAQ8',
        media_url: 'http://pbs.twimg.com/media/DWycG0lVMAA8u27.jpg',
        sizes: {
          small: { w: 680, h: 477, resize: 'fit' },
          large: { w: 1838, h: 1290, resize: 'fit' }
        },
        video_info: null,
        additional_media_info: null
      }]
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

test('should render with PHOTO.', () => {
  const tree = mount(
    <TweetEntity
      entities={ENTITIES.PHOTO}
    />
  )

  // Testing for snapshot.
  expect(tree).toMatchSnapshot()
})

test('should render with ANIMATED_GIF.', () => {
  const tree = mount(
    <TweetEntity
      entities={ENTITIES.ANIMATED_GIF}
      extendedEntities={EXTENDED_ENTITIES.ANIMATED_GIF}
    />
  )

  // Testing for snapshot.
  expect(tree).toMatchSnapshot()
})
