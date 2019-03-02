const audioRecorder = async () => {
  const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
  const mediaRecorder = new MediaRecorder(stream);
  const audioChunks = [];

  mediaRecorder.addEventListener('dataavailable', event => {
    audioChunks.push(event.data);
  });

  const start = () => {
    mediaRecorder.start();
  };

  const stop = async () =>
    new Promise(resolve => {
      mediaRecorder.addEventListener('stop', () => {
        const audioBlob = new Blob(audioChunks);
        const audioUrl = URL.createObjectURL(audioBlob);
        const audio = new Audio(audioUrl);
        const play = () => {
          audio.play();
        };
        resolve({ audioBlob, audioUrl, play });
      });
      mediaRecorder.stop();
    });

  const resume = () => {
    mediaRecorder.resume();
  };

  const pause = () => {
    mediaRecorder.pause();
  };

  return { start, stop, pause, resume, stream };
};

export default audioRecorder;
