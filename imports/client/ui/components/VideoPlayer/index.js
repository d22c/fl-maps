import React, { Component } from 'react'
import ReactPlayer from 'react-player'
import './styles.scss'
import allPlaylists from '/imports/both/i18n/en/video.json'

class VideoPlayer extends Component {
  constructor (props) {
    super(props)
    this.state = {
      nextVideo: false
    }
  }

  componentDidUpdate () {
    this.setState({ nextVideo: false })
  }

  shouldComponentUpdate (nextProps, nextState) {
    if (nextState.nextVideo === true) return true
    // NOTE: otherwise the player will keep re-rendering on every page click
    return false
  }

  render () {
    const { categories } = this.props

    return (
      <div
        className="videoContainer"
      >
        <ReactPlayer
          className="videoPlayer"
          url={buildURL(categories)}
          width='100%'
          height='100%'
          volume={0.5}
          playing
          // onEnded={this.setState({ nextVideo: true })}
          onEnded={() => {
            this.setState({ nextVideo: true })
          }}
        />
      </div>
    )
  }
}

function buildURL (categories) {
  const playlist = generatePlaylist(allPlaylists, categories, [])
  const video = getRandomVideo(playlist)
  const url = `https://www.youtube.com/watch?v=${video}&modestbranding=1&rel=0&disablekb=1`
  return url
}

function getRandomVideo (playlist) {
  const length = playlist.length
  const randomIndex = Math.floor(Math.random() * length)
  return playlist[randomIndex]
}
function generatePlaylist (playlists, eventCategories, outputArray) {
  playlists.forEach((playlist) => {
    eventCategories.forEach((eventCategory) => {
      if (playlist.categories.includes(eventCategory.name)) {
        playlist.videos.forEach((video) => {
          if (!outputArray.includes(video)) {
            outputArray.push(video)
          }
        })
      }
    })
  })

  // NOTE: if event category does not have a dedicated playlist then we generate default
  if (outputArray.length === 0) {
    generatePlaylist(playlists, [{ 'name': 'default' }], outputArray)
  }

  return outputArray
}

export default VideoPlayer
