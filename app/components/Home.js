import React, { Component } from 'react';
import AudioBar from './AudioBar';
import styles from './Home.css';

export default class Home extends Component {

  render() {
    return (
      <div className={styles.container} data-tid="container">
        <AudioBar />
      </div>
    );
  }
}


