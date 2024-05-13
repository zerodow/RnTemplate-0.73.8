import {View, Text, StyleSheet} from 'react-native';
import React from 'react';
import {SafeAreaView} from 'react-native-safe-area-context';

const SafeView = ({children, containerStyle}) => {
  return (
    <SafeAreaView style={[styles.container, containerStyle]}>
      {children}
    </SafeAreaView>
  );
};

export default SafeView;

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
});
