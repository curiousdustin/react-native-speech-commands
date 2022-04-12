import { NativeModules, Platform } from 'react-native';

const LINKING_ERROR =
  `The package 'react-native-speech-commands' doesn't seem to be linked. Make sure: \n\n` +
  Platform.select({ ios: "- You have run 'pod install'\n", default: '' }) +
  '- You rebuilt the app after installing the package\n' +
  '- You are not using Expo managed workflow\n';

const SpeechCommands = NativeModules.SpeechCommands
  ? NativeModules.SpeechCommands
  : new Proxy(
      {},
      {
        get() {
          throw new Error(LINKING_ERROR);
        },
      }
    );

export function multiply(a: number, b: number): Promise<number> {
  return SpeechCommands.multiply(a, b);
}

export function startAudioRecognition(): Promise<boolean> {
  return SpeechCommands.startAudioRecognition()
    .then((result: boolean) => {
      console.log('startAudioRecognition', { result });
    })
    .catch((error: Error) => {
      console.error('startAudioRecognition', error);
    });
}
