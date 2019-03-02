import React, { Component } from 'react';
import IconButton from '@material-ui/core/IconButton';
import MicIcon from '@material-ui/icons/Mic';
import StopIcon from '@material-ui/icons/Stop';
import PauseCircleFilledIcon from '@material-ui/icons/PauseCircleFilled';
import PlayCircleFilledIcon from '@material-ui/icons/PlayCircleFilled';
import audioRecorder from '../utils/audioRecorder';

export default class AudioBar extends Component {

  state = {
    recorder: null,
    isRecording: false,
    isPaused: false,
  };

  handleMicClick = async () => {
    const { recorder } = this.state;
    if (recorder) {
      recorder.start();
      this.setState({ isRecording: true });
    } else {
      const newRecorder = await audioRecorder();
      newRecorder.start();
      this.setState({ recorder: newRecorder, isRecording: true });
    }
  };

  handlePausePlay = async () => {
    const { recorder, isPaused } = this.state;
    if (isPaused) {
      recorder.resume();
    } else {
      recorder.pause();
    }
    this.setState({ isPaused: !this.state.isPaused });
  }

  handleStop = async () => {
    const { recorder } = this.state;
    if (audioRecorder) {
      const audio = await recorder.stop();
      this.setState({ isRecording: false });
      audio.play();
      console.log(audio);
    } else {
      console.log(
        'Cannot stop recording when it was not started in the first place'
      );
    }
  };

  getIcons = (isRecording, isPaused) => {
    if (isRecording) {
      return (
        <React.Fragment>
          <IconButton aria-label="Stop" onClick={this.handleStop}>
            <StopIcon />
          </IconButton>
          <IconButton aria-label="Play/Pause" onClick={this.handlePausePlay}>
            {isPaused ? <PlayCircleFilledIcon /> : <PauseCircleFilledIcon />}
          </IconButton>
        </React.Fragment>
      );
    }
    return (
      <IconButton aria-label="Mic" onClick={this.handleMicClick}>
        <MicIcon />
      </IconButton>
    );
  };

  render() {
    const { isRecording, isPaused } = this.state;
    const icons = this.getIcons(isRecording, isPaused);
    return (
      <React.Fragment>
        {icons}
      </React.Fragment>
    );
  }
}


