import React from 'react';
import { SafeAreaView, StyleSheet, Text, View } from 'react-native';
import Home from './app/index';
import { NavigationContainer } from '@react-navigation/native';

export default function App() {
  return (
    <NavigationContainer>
      <SafeAreaView style={styles.container}>
        <Home />
      </SafeAreaView>
    </NavigationContainer>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1, // Takes the full height of the screen
    // You can apply more styling as needed
  },
});
