import React, { Component } from 'react';
import PropTypes from 'prop-types';
import Tone from 'tone'

import './MusicPlayer.css';

Tone.Transport.bpm.value = 100;

const pulseOptions = {
  oscillator:{
  	type: "pulse"
  },
  envelope:{
    release: 0.07
  }
};

const triangleOptions = {
  oscillator:{
  	type: "triangle"
  },
  envelope:{
    release: 0.07
  }
};

const squareOptions = {
  oscillator:{
  	type: "square"
  },
  envelope:{
    release: 0.07
  }
};

const pulseAnalyser    = new Tone.Analyser("waveform", 1024);
const squareAnalyser   = new Tone.Analyser("waveform", 1024);
const triangleAnalyser = new Tone.Analyser("waveform", 1024);
const noiseAnalyser    = new Tone.Analyser("waveform", 1024);

export default class MusicPlayer extends Component {
  
  static propTypes = {
    songs: PropTypes.array,
  }

  static defaultProps = {
    songs: [],
  }

  state = {
    play: false,
    selectedSong: null,
  }

  tone = null;

  pulseSynth = new Tone.Synth(pulseOptions).fan(pulseAnalyser).toMaster();
  squareSynth = new Tone.Synth(squareOptions).fan(squareAnalyser).toMaster();
  triangleSynth = new Tone.Synth(triangleOptions).fan(triangleAnalyser).toMaster();
  noiseSynth = new Tone.NoiseSynth().fan(noiseAnalyser).toMaster();

  pulsePart = new Tone.Part();
  squarePart = new Tone.Part();
  trianglePart = new Tone.Part();
  noisePart = new Tone.Part();

  componentWillMount () {
    const { songs } = this.props;
    if (songs.length > 0) {
      this.setState({
        selectedSong: songs[0],
      });
      this.setSong(songs[0])
    }
  }

  componentDidMount () {
    Tone.Transport.on('stop', () => {
      this.setState({
        play: false,
      });
    })
  }

  _start = () => {
    const {
      selectedSong,
    } = this.state;
    Tone.Transport.start('+0.1', 0);   
    if(selectedSong.pulse) {
      this.pulsePart.start(0);
    }
    if(selectedSong.square) {
      this.squarePart.start(0);
    }
    if(selectedSong.triangle) {
      this.trianglePart.start(0);
    }
    if(selectedSong.noise) {
      this.noisePart.start(0); 
    }
    Tone.Transport.stop('+' + selectedSong.length);
  }

  _stop = () => {
    const {
      selectedSong,
    } = this.state;

    Tone.Transport.stop();
    if(selectedSong.pulse) {
      this.pulsePart.stop(0);
    }
    if(selectedSong.square) {
      this.squarePart.stop(0);
    }
    if(selectedSong.triangle) {
      this.trianglePart.stop(0);
    }
    if(selectedSong.noise) {
      this.noisePart.stop(0);
    }
  }

  _isSelectedSong = (song) => this.state.selectedSong === song

  playBtnHandler = (e) => {
    this._start();
    this.setState({
      play: true,
    });
  }

  stopBtnHandler = (e) => {
    this._stop();
    this.setState({
      play: false,
    });
  } 

  renderPlayButton () {
    return (
      <button onClick={this.playBtnHandler}>
        play
      </button>
    )
  }

  renderPauseButton () {
    return (
      <button onClick={this.stopBtnHandler}>
        stop
      </button>
    )
  }

  renderSongList (songs) {
    return (
      <ol className={['song-list']}>
        {
          songs.map(item => (
            <li
              key={item.name} 
              className={[
                'song-list-item',
                this._isSelectedSong(item) ? 'selected' : null,
              ].filter(item => !!item)
              .join(' ')
            }
              onClick={(e) => {
                e.stopPropagation();
                if (!this._isSelectedSong(item)) {
                  this._stop();
                  this.setSong(item);
                  this.setState({
                    selectedSong: item,
                  });
                }
              }}
            >
              {item.name}
            </li>
          ))
        }
      </ol>
    )
  }

  setSong(song) {
  
    this.pulsePart.removeAll();
    this.squarePart.removeAll();
    this.trianglePart.removeAll();
    this.noisePart.removeAll();
    
    if(song.pulse != null) {
      this.pulsePart = new Tone.Part((time, note) => {
        this.pulseSynth.triggerAttackRelease(note.name, note.duration, time, note.velocity);
      }, song.pulse);
    }
    
    if(song.square != null) {
      this.squarePart = new Tone.Part((time, note) => {
        this.squareSynth.triggerAttackRelease(note.name, note.duration, time, note.velocity);
      }, song.square);
    }
    
    if(song.triangle != null) {
      this.trianglePart = new Tone.Part((time, note) => {
        this.triangleSynth.triggerAttackRelease(note.name, note.duration, time, note.velocity);
      }, song.triangle);
    }
    
    if(song.noise != null) {
      this.noisePart = new Tone.Part((time, note) => {
        this.noiseSynth.triggerAttackRelease(note.duration, time, note.velocity);
      }, song.noise);
    }
  }
  
  render () {
    const {
      songs,
    } = this.props;
    const {
      play
    } = this.state;

    return (
      <div className={['music-player']}>
        {this.renderSongList(songs)}
        {
          play ? this.renderPauseButton() : this.renderPlayButton()
        }
      </div>
    )
  }
}
