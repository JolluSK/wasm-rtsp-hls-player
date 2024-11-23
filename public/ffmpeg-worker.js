importScripts('https://unpkg.com/@ffmpeg/ffmpeg@0.11.6/dist/ffmpeg.min.js');

const { createFFmpeg, fetchFile } = FFmpeg;
let ffmpeg = null;

self.onmessage = async (e) => {
  const { type, payload } = e.data;

  if (type === 'load') {
    ffmpeg = createFFmpeg({ log: true });
    await ffmpeg.load();
    self.postMessage({ type: 'ready' });
  } else if (type === 'transcode') {
    const { url } = payload;
    try {
      await ffmpeg.FS('writeFile', 'input.sdp', await fetchFile(url));
      await ffmpeg.run(
        '-i', 'input.sdp',
        '-c:v', 'libx264',
        '-preset', 'ultrafast',
        '-tune', 'zerolatency',
        '-f', 'mpegts',
        'output.ts'
      );
      const data = ffmpeg.FS('readFile', 'output.ts');
      self.postMessage({ type: 'chunk', payload: data.buffer }, [data.buffer]);
    } catch (error) {
      self.postMessage({ type: 'error', payload: error.message });
    }
  }
};

