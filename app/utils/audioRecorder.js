import { resolve } from "bluebird-lst";

const audioRecorder = async () => {
  const times = [];
  const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
  const mediaRecorder = new MediaRecorder(stream);
  const audioChunks = [];

  mediaRecorder.addEventListener('dataavailable', event => {
    audioChunks.push(event.data);
  });

  const start = () => {
    times.push(performance.now());
    mediaRecorder.start();
  };

  const stop = async () => {
    return new Promise( resolve => {
      mediaRecorder.addEventListener('stop', () => {
        times.push(performance.now());
        const audioBlob = new Blob(audioChunks);
        const audioUrl = URL.createObjectURL(audioBlob);
        const audio = new Audio(audioUrl);
        const play = () => {
          audio.play();
        }
        resolve({ audioBlob, audioUrl, play, times });
      });
      mediaRecorder.stop();
    });
  }

  const resume = () => {
    times.push(performance.now());
    mediaRecorder.resume();
  }

  const pause = () => {
    mediaRecorder.pause();
    times.push(performance.now());
  }

  return { start, stop, pause, resume };
};

export default audioRecorder;