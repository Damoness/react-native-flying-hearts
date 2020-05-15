import * as React from 'react';
import { StyleSheet, View } from 'react-native';
import FlyingHearts from '../../src';

export default function App() {
  return (
    <View style={styles.container}>
      <FlyingHearts />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
});
