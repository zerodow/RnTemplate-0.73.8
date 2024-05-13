import React, {Component} from 'react';
import {View, Text, Image, StyleSheet, TouchableOpacity} from 'react-native';
import {img} from 'src/assets';
import {deviceWidth} from 'src/utilities/layout';

export default class MarkOnCamera extends Component {
  constructor(props: Props) {
    super(props);
    this.state = {
      width: deviceWidth,
      height: 0,
    };
    this._onChangeLayout = this._onChangeLayout.bind(this);
  }

  _onChangeLayout(event) {
    const {width, height} = event.nativeEvent.layout;
    this.setState({width, height});
  }

  render() {
    const {onFlashChange} = this.props;
    return (
      <View
        style={{
          justifyContent: 'center',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          position: 'absolute',
          alignItems: 'center',
        }}
        onLayout={e => this._onChangeLayout(e)}>
        <View style={styles.contextScanner}>
          <View style={styles.contextScannerBox}>
            <Image
              source={img.qrConner}
              style={{height: '100%', width: '100%'}}
            />
          </View>
        </View>

        <View
          style={[
            styles.topMark,
            {
              height: (this.state.height - deviceWidth * 0.7) / 2,
            },
          ]}>
          {/* <View style={{justifyContent: 'center', alignItems: 'center'}}>
            <TouchableOpacity onPress={onFlashChange}>
              <Image source={img.flash} style={{width: 43, height: 43}} />
            </TouchableOpacity>
          </View> */}
        </View>
        <View
          style={[
            styles.bottomMark,
            {
              height: (this.state.height - deviceWidth * 0.7) / 2,
            },
          ]}
        />
        <View
          style={[
            styles.leftMark,
            {
              bottom: (this.state.height - deviceWidth * 0.7) / 2,
              top: (this.state.height - deviceWidth * 0.7) / 2,
            },
          ]}
        />
        <View
          style={[
            styles.rightMark,
            {
              bottom: (this.state.height - deviceWidth * 0.7) / 2,
              top: (this.state.height - deviceWidth * 0.7) / 2,
            },
          ]}
        />
      </View>
    );
  }
}

const styles = StyleSheet.create({
  contextScanner: {
    justifyContent: 'center',
    alignItems: 'center',
    height: deviceWidth * 0.7,
    width: deviceWidth * 0.7,
  },
  contextScannerBox: {
    height: deviceWidth * 0.7,
    width: deviceWidth * 0.7,
  },
  // mark
  topMark: {
    backgroundColor: 'rgba(0,0,0,0.5)',
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    justifyContent: 'center',
    alignItems: 'center',
  },
  bottomMark: {
    backgroundColor: 'rgba(0,0,0,0.5)',
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,

    alignItems: 'center',
    paddingTop: 16,
  },
  leftMark: {
    backgroundColor: 'rgba(0,0,0,0.5)',
    position: 'absolute',

    left: 0,
    width: deviceWidth * 0.15,
  },
  rightMark: {
    backgroundColor: 'rgba(0,0,0,0.5)',
    position: 'absolute',

    right: 0,
    width: deviceWidth * 0.15,
  },
});
