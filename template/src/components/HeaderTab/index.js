import {View, Text, StyleSheet} from 'react-native';
import React from 'react';

const HeaderTab = ({containerStyle, title}) => {
  const renderLeft = () => {
    return null;
  };

  const renderRight = () => {
    return null;
  };
  
  return (
    <View style={[styles.container, containerStyle]}>
      <Text style={styles.title}>{title}</Text>
    </View>
  );
};

export default HeaderTab;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingHorizontal: 20,
  },
  title: {
    fontSize: 20,
    fontWeight: '500',
  },
});
