import * as React from 'react';

import { StyleSheet, View, Text, Button } from 'react-native';
import { multiply, startAudioRecognition } from 'react-native-speech-commands';

export default function App() {
  const [result, setResult] = React.useState<number | undefined>();

  React.useEffect(() => {
    multiply(3, 7).then(setResult);
  }, []);

  return (
    <View style={styles.container}>
      <Text>Result: {result}</Text>
      <Button
        title={'Start Audio Recognition'}
        onPress={() => {
          console.log('Should start');
          startAudioRecognition();
        }}
      />
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
