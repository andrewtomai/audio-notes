import React, { Component } from 'react';
import PropTypes from 'prop-types';
import moment from 'moment';
import { TIMER_GRANULARITY } from '../../utils/constant';

export default class VisualTimer extends Component {
  state = {
    time: 0
  };

  componentDidMount() {
    const { isPaused } = this.props;
    if (!isPaused) {
      this.startTimer();
    }
  }

  componentDidUpdate(prevProps) {
    // Typical usage (don't forget to compare props):
    const { start: newStart, isPaused: newPause } = this.props;
    const { start: oldStart, isPaused: oldPause } = prevProps;
    if (newStart !== oldStart) {
      this.clearTimer();
      if (!newPause) {
        this.startTimer();
      }
    } else if (oldPause !== newPause) {
      if (newPause) {
        this.pauseTimer();
      } else {
        this.playTimer();
      }
    }
  }

  componentWillUnmount() {
    this.clearTimer();
  }

  pauseTimer = () => {
    if (this.intervalId) {
      window.clearInterval(this.intervalId);
    }
  };

  playTimer = () => {
    const { time } = this.state;
    const startTime = Date.now() - time;
    this.intervalId = setInterval(() => {
      this.setState({ time: Date.now() - startTime });
    }, TIMER_GRANULARITY);
  };

  clearTimer = () => {
    if (this.intervalId) {
      window.clearInterval(this.intervalId);
    }
    this.setState({ time: 0 });
  };

  startTimer = () => {
    const { start } = this.props;
    const { time } = this.state;
    const startTime = start - time;
    this.intervalId = setInterval(() => {
      this.setState({ time: Date.now() - startTime });
    }, TIMER_GRANULARITY);
  };

  intervalId = null;

  render() {
    const { time } = this.state;
    const pretty = moment.utc(time).format('HH:mm:ss');
    return <div>{pretty}s</div>;
  }
}
VisualTimer.propTypes = {
  start: PropTypes.instanceOf(moment).isRequired,
  isPaused: PropTypes.bool.isRequired
};
