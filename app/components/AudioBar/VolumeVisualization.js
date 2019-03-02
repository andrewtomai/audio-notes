import React, { Component } from 'react';
import PropTypes from 'prop-types';
import styles from './VolumeVisualization.css';

const getDefaultBlocks = () => [
  <div key="0" className={styles.empty} />,
  <div key="1" className={styles.empty} />,
  <div key="2" className={styles.empty} />,
  <div key="3" className={styles.empty} />,
  <div key="4" className={styles.empty} />,
  <div key="5" className={styles.empty} />
];

export default class VolumeVisualization extends Component {
  state = {
    volume: 0
  };

  componentDidMount() {
    const { stream } = this.props;
    this.processAudioStream(stream);
  }

  componentDidUpdate(prevProps) {
    const { stream } = this.props;
    if (stream !== prevProps.stream) {
      this.processAudioStream(stream);
    }
  }

  processAudioStream = stream => {
    const audioContext = new AudioContext();
    const analyser = audioContext.createAnalyser();
    const microphone = audioContext.createMediaStreamSource(stream);
    const javascriptNode = audioContext.createScriptProcessor(2048, 1, 1);
    microphone.connect(analyser);
    analyser.connect(javascriptNode);
    javascriptNode.connect(audioContext.destination);
    javascriptNode.onaudioprocess = () => {
      const array = new Uint8Array(analyser.frequencyBinCount);
      analyser.getByteFrequencyData(array);
      let values = 0;
      for (let i = 0; i < array.length; i += 1) {
        values += array[i];
      }
      const average = values / array.length;
      this.setState({ volume: average });
    };
  };

  colorBlocks = volume => {
    const numberToColor = Math.round(volume / 6);
    return getDefaultBlocks().map((block, idx) => {
      if (idx < numberToColor) {
        return <div key={block.key} className={styles.color} />;
      }
      return block;
    });
  };

  render() {
    const { volume } = this.state;
    const blocks = this.colorBlocks(volume);
    return <div className={styles.horizontalBar}>{blocks}</div>;
  }
}

VolumeVisualization.propTypes = {
  stream: PropTypes.instanceOf(MediaStream).isRequired
};
