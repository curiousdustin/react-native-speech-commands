import * as React from 'react';
import {
  check,
  request,
  PERMISSIONS,
  RESULTS,
  PermissionStatus,
  openSettings,
} from 'react-native-permissions';

import { StyleSheet, View, Text, Button, Platform } from 'react-native';
import { multiply, startAudioRecognition } from 'react-native-speech-commands';

const micPermission = Platform.select({
  ios: PERMISSIONS.IOS.MICROPHONE,
  android: PERMISSIONS.ANDROID.RECORD_AUDIO,
  default: PERMISSIONS.IOS.MICROPHONE,
});

export default function App() {
  const [result, setResult] = React.useState<number | undefined>();

  const [permissionStatus, setPermissionStatus] =
    React.useState<PermissionStatus>(RESULTS.DENIED);

  React.useEffect(() => {
    multiply(3, 7).then(setResult);
  }, []);

  return (
    <View style={styles.container}>
      <Text>Multiple Result: {result}</Text>
      <Text>permissionStatus: {permissionStatus}</Text>
      <Button
        title={`Check Permission`}
        onPress={() => {
          console.log('Check Permission');
          check(micPermission).then((permissionsResult) => {
            console.log({ permissionsResult });
            setPermissionStatus(permissionsResult);
          });
        }}
      />
      {/*  */}
      <Button
        title={`Request Permission`}
        onPress={() => {
          console.log('Request Permission');
          request(micPermission, {
            title: 'Custom title',
            message: 'Custom Message',
            buttonPositive: 'Positive Button',
            buttonNegative: 'Negative Button',
            buttonNeutral: 'Nuetral Button',
          }).then((permissionsResult) => {
            console.log({ permissionsResult });
            setPermissionStatus(permissionsResult);
          });
        }}
      />
      {/*  */}
      <Button
        title={`Open Settings`}
        onPress={() => {
          console.log('Open Settings');
          openSettings().catch(() => console.warn('cannot open settings'));
        }}
      />
      {/*  */}
      {permissionStatus === RESULTS.GRANTED && (
        <Button
          title={'Start Audio Recognition'}
          onPress={() => {
            console.log('Should start');
            startAudioRecognition();
          }}
        />
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  box: {
    width: 60,
    height: 60,
    marginVertical: 20,
  },
});
