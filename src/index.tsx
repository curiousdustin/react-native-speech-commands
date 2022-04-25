import { NativeModules, NativeEventEmitter } from 'react-native';

let onResultCallback: (result: { command: string }) => void = (result) => {
  console.log('onResultCallback:', { result });
};

const SpeechCommandsEmitter = new NativeEventEmitter(
  NativeModules.SpeechCommands
);

SpeechCommandsEmitter.addListener('result', (result) => {
  if (onResultCallback) {
    onResultCallback(result);
  }
});

const start = async (callback: (result: { command: string }) => void) => {
  onResultCallback = callback;

  return NativeModules.SpeechCommands.startAudioRecognition()
    .then((result: boolean) => {
      console.log('startAudioRecognition', { result });
    })
    .catch((error: Error) => {
      // console.log('startAudioRecognition', error);
      throw error;
    });
};

const stop = async () => {
  return NativeModules.SpeechCommands.stopAudioRecognition()
    .then((result: boolean) => {
      console.log('stopAudioRecognition', { result });
    })
    .catch((error: Error) => {
      // console.log('stopAudioRecognition', error);
      throw error;
    });
};

export default {
  start,
  stop,
};
