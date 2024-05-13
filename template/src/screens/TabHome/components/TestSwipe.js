/* eslint-disable no-use-before-define */
// @ts-nocheck

import React from 'react';
import {useState} from 'react';
import {FlatList, Image, StyleSheet, Text, View} from 'react-native';
import SwipeDeck from 'src/components/SwipeDeck';
import TextView from 'src/components/TextView';
import {deviceWidth} from 'src/utilities/layout';

const DATA = [
  {
    id: 1,
    name: 'Thomas Kramer',
    occupation: 'React Native Developer',
    uri: 'https://avatars.githubusercontent.com/u/6935835?v=4',
    description: 'I enjoy coding, coffee, and watching movies.',
  },
  {
    id: 2,
    name: 'Peter Bearson',
    occupation: 'Fisherman',
    uri: 'https://picsum.photos/id/433/600',
    description: 'I enjoy fish, and sleeping in on cold winter nights.',
  },
  {
    id: 3,
    name: 'Doug Dogson',
    occupation: 'Stay at home son',
    uri: 'https://picsum.photos/id/1025/600',
    description: 'I enjoy treats and belly scratches',
  },
];

type SwipeData = {
  id: number,
  name: string,
  occupation: string,
  uri: string,
  description: string,
};

export default function TestSwipe() {
  const [dataState, setDataState] = useState(DATA);

  const renderCard = (item: SwipeData) => {
    return (
      <Image
        source={{uri: item.uri}}
        style={{
          borderRadius: 12,
          width: deviceWidth - 40,
          height: (deviceWidth - 40) / 1.7,
          marginHorizontal: 20,
        }}
      />
    );
  };

  const renderItem = ({item}: {item: string}) => (
    <View>
      <Text>{item}</Text>
    </View>
  );

  return (
    <View style={styles.container}>
      <View style={styles.deckContainer}>
        <SwipeDeck data={dataState} renderCard={renderCard} />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingTop: 30,
    backgroundColor: '#F5FCFF',
  },
  deckContainer: {
    flex: 1,
    alignItems: 'flex-start',
  },
});
