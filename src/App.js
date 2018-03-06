import React, { Component } from 'react';

import MusicPlayer from './components/musicPlayer/MusicPlayer';
import Mario from './songs/mario';
import Zelda from './songs/zelda';

import logo from './logo.svg';
import './App.css';

const songs = [
  Zelda,
  Mario,
];

class App extends Component {
  render() {
    return (
      <div className="App">
        <header className="App-header">
          <img src={logo} className="App-logo" alt="logo" />
          <h1 className="App-title">8 Bit Music With React</h1>
        </header>
        <div className="App-content">
          <MusicPlayer songs={songs} />
        </div>
      </div>
    );
  }
}

export default App;
