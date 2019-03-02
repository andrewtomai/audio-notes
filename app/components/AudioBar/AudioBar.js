import React, { Component } from 'react';
import IconButton from '@material-ui/core/IconButton';
import MicIcon from '@material-ui/icons/Mic';
import StopIcon from '@material-ui/icons/Stop';
import PauseCircleFilledIcon from '@material-ui/icons/PauseCircleFilled';
import PlayCircleFilledIcon from '@material-ui/icons/PlayCircleFilled';
import moment from 'moment';
import VisualTimer from './VisualTimer';
import audioRecorder from '../../utils/audioRecorder';
import VolumeVisualization from './VolumeVisualization';
import styles from './AudioBar.css';

export default class AudioBar extends Component {
  state = {
    recorder: null,
    isRecording: false,
    isPaused: false
  };

  async componentDidMount() {
    const recorder = await audioRecorder();
    this.setState({ recorder });
  }

  times = [];

  handleMicClick = async () => {
    const recorder = await audioRecorder();
    recorder.start();
    this.times.push(moment());
    this.setState({ recorder, isRecording: true, isPaused: false });
  };

  handlePausePlay = async () => {
    const { recorder, isPaused } = this.state;
    if (isPaused) {
      recorder.resume();
    } else {
      recorder.pause();
    }
    this.times.push(moment());
    this.setState({ isPaused: !isPaused });
  };

  handleStop = async () => {
    const { recorder } = this.state;
    if (audioRecorder) {
      this.times.push(moment());
      const audio = await recorder.stop();
      this.setState({ isRecording: false });
      audio.play();
      console.log(audio);
      console.log(this.times);
      this.times = [];
    } else {
      console.log(
        'Cannot stop recording when it was not started in the first place'
      );
    }
  };

  getIcons = (isRecording, isPaused) => {
    if (isRecording) {
      return (
        <>
          <IconButton aria-label="Stop" onClick={this.handleStop}>
            <StopIcon />
          </IconButton>
          <IconButton aria-label="Play/Pause" onClick={this.handlePausePlay}>
            {isPaused ? <PlayCircleFilledIcon /> : <PauseCircleFilledIcon />}
          </IconButton>
          <VisualTimer start={this.times[0]} isPaused={isPaused} />
        </>
      );
    }
    return (
      <IconButton aria-label="Mic" onClick={this.handleMicClick}>
        <MicIcon />
      </IconButton>
    );
  };

  render() {
    const { isRecording, isPaused, recorder } = this.state;
    const icons = this.getIcons(isRecording, isPaused);
    const volumeVisuals = recorder ? (
      <VolumeVisualization stream={recorder.stream} />
    ) : (
      ''
    );
    return (
      <div className={styles.navbar}>
        <div className={styles.item}>
          {icons}
          {volumeVisuals}
        </div>
      </div>
    );
  }
}
