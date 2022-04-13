import { NativeModules, NativeEventEmitter } from 'react-native';

let onResultCallback: (result: string) => void = (result) => {
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

const start = async (callback: (result: string) => void) => {
  onResultCallback = callback;

  return NativeModules.SpeechCommands.startAudioRecognition()
    .then((result: boolean) => {
      console.log('startAudioRecognition', { result });
    })
    .catch((error: Error) => {
      console.error('startAudioRecognition', error);
    });
};

const stop = async () => {
  return NativeModules.SpeechCommands.stopAudioRecognition()
    .then((result: boolean) => {
      console.log('stopAudioRecognition', { result });
    })
    .catch((error: Error) => {
      console.error('stopAudioRecognition', error);
    });
};

export default {
  start,
  stop,
};
