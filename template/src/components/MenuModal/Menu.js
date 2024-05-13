import React, {
  forwardRef,
  useCallback,
  useEffect,
  useImperativeHandle,
  useMemo,
  useRef,
  useState,
} from 'react';
import {
  Animated,
  Easing,
  I18nManager,
  Platform,
  StatusBar,
  StyleSheet,
  TouchableWithoutFeedback,
  View,
} from 'react-native';
import Modal from 'react-native-modal';
import {delay} from 'src/utilities/helper/functional';
import {deviceHeight, deviceWidth} from 'src/utilities/layout';

const STATES = {
  HIDDEN: 'HIDDEN',
  ANIMATING: 'ANIMATING',
  SHOWN: 'SHOWN',
};

const EASING = Easing.bezier(0.4, 0, 0.2, 1);
const SCREEN_INDENT = 8;

const Menu = (
  {
    testID,
    button,
    style,
    children,
    animationDuration = 100,
    onHidden,
    debounceHide,
    containerStyle,
  },
  _refs,
) => {
  useImperativeHandle(
    _refs,
    () => ({
      show,
      hide: _hide,
    }),
    [],
  );
  const modalRef = useRef();
  const [menuState, setMenuState] = useState(STATES.HIDDEN);
  const [position, setPosition] = useState({top: 0, left: 0});
  const [menuSize, setMenuSize] = useState({menuHeight: 0, menuWidth: 0});
  const [positionSize, setPositionSize] = useState({
    buttonHeight: 0,
    buttonWidth: 0,
  });
  const [menuSizeAnimation, setMenuSizeAnimation] = useState(
    new Animated.ValueXY({x: 0, y: 0}),
  );
  const [opacityAnimation, setOpacityAnimation] = useState(
    new Animated.Value(0),
  );

  const viewContainerRef = useRef();
  const {isRTL} = I18nManager;

  const animationStarted = useMemo(
    () => menuState === STATES.ANIMATING,
    [menuState],
  );
  const modalVisible = useMemo(
    () => menuState === STATES.SHOWN || animationStarted,
    [menuState, animationStarted],
  );
  const windowHeight = useMemo(
    () => deviceHeight - (StatusBar.currentHeight || 0),
    [],
  );

  // const menuAni = useMemo(
  //   () => ({ width: menuSizeAnimation.x, height: menuSizeAnimation.y }),
  //   [],
  // );

  const shadowMenuContainerStyle = useMemo(() => {
    const transforms = [];
    let {left, top} = position;
    const {buttonWidth, buttonHeight} = positionSize;
    const {menuHeight, menuWidth} = menuSize;
    if (
      (isRTL && left + buttonWidth - menuWidth > SCREEN_INDENT) ||
      (!isRTL && left + menuWidth > deviceWidth - SCREEN_INDENT)
    ) {
      transforms.push({
        translateX: Animated.multiply(menuSizeAnimation.x, -1),
      });

      left = Math.min(deviceWidth - SCREEN_INDENT, left + buttonWidth);
    } else if (left < SCREEN_INDENT) {
      left = SCREEN_INDENT;
    }
    // Flip by Y axis if menu hits bottom screen border
    if (top > windowHeight - menuHeight - SCREEN_INDENT) {
      transforms.push({
        translateY: Animated.multiply(menuSizeAnimation.y, -1),
      });

      top = windowHeight - SCREEN_INDENT;
      top = Math.min(windowHeight - SCREEN_INDENT, top + buttonHeight);
    } else if (top < SCREEN_INDENT) {
      top = SCREEN_INDENT;
    }

    return {
      opacity: opacityAnimation,
      transform: transforms,
      top: top,
      // Switch left to right for rtl devices
      ...(isRTL ? {right: left} : {left}),
    };
  }, [position, positionSize, menuSize, menuSizeAnimation, menuState]);

  const _hide = useCallback(() => hide(), []);

  const hide = () => {
    return new Promise(resolve => {
      modalRef.current = resolve;
      Animated.timing(opacityAnimation, {
        toValue: 0,
        duration: animationDuration,
        easing: EASING,
        useNativeDriver: false,
      }).start(() => {
        // Reset state
        setMenuState(STATES.HIDDEN);
        setMenuSizeAnimation(new Animated.ValueXY({x: 0, y: 0}));
        setOpacityAnimation(new Animated.Value(0));
        onHidden && onHidden();
      });
    });
  };

  //start menu animation
  const _onMenuLayout = e => {
    if (menuState === STATES.ANIMATING) {
      return;
    }
    const {width, height} = e.nativeEvent.layout;
    setMenuState(STATES.ANIMATING);
    setMenuSize({menuWidth: width, menuHeight: height});
  };

  const show = useCallback(() => {
    return new Promise(resolve => {
      modalRef.current = resolve;
      viewContainerRef?.current?.measureInWindow(
        (left, top, buttonWidth, buttonHeight) => {
          setPositionSize({
            buttonHeight,
            buttonWidth,
          });
          setPosition({
            left: left - 10,
            top,
          });
          setMenuState(STATES.SHOWN);
        },
      );
    });
  }, [viewContainerRef]);

  const onModalHide = useCallback(async () => {
    if (!!debounceHide) {
      await delay(debounceHide);
    }
    modalRef.current && modalRef.current();
    modalRef.current = null;
  }, [debounceHide]);

  const onModalShow = useCallback(() => {
    modalRef.current && modalRef.current();
    modalRef.current = null;
  }, [debounceHide]);

  useEffect(() => {
    const {menuWidth, menuHeight} = menuSize;
    if (menuState === STATES.ANIMATING) {
      Animated.parallel([
        Animated.timing(menuSizeAnimation, {
          toValue: {x: menuWidth, y: menuHeight},
          duration: animationDuration,
          easing: EASING,
          useNativeDriver: false,
        }),
        Animated.timing(opacityAnimation, {
          toValue: 1,
          duration: animationDuration,
          easing: EASING,
          useNativeDriver: false,
        }),
      ]).start();
    }
  }, [menuSize, menuState, menuSizeAnimation, opacityAnimation]);

  return (
    <View ref={viewContainerRef} collapsable={false} testID={testID}>
      <View>{button}</View>

      <Modal
        onModalHide={onModalHide}
        onModalShow={onModalShow}
        isVisible={modalVisible}
        backdropOpacity={0.5}
        useNativeDriver
        supportedOrientations={[
          'portrait',
          'portrait-upside-down',
          'landscape',
          'landscape-left',
          'landscape-right',
        ]}
        animationIn="bounceIn"
        animationOut="fadeOut"
        useNativeDriverForBackdrop
        hideModalContentWhileAnimating
        // style={{ flex: 1 }}
      >
        <TouchableWithoutFeedback onPress={_hide} accessible={false}>
          <View style={StyleSheet.absoluteFill}>
            <Animated.View
              onLayout={_onMenuLayout}
              style={[
                styles.shadowMenuContainer,
                shadowMenuContainerStyle,
                style,
              ]}>
              <Animated.View
                style={[
                  styles.menuContainer,
                  containerStyle,
                  animationStarted && menuSize,
                ]}>
                {children}
              </Animated.View>
            </Animated.View>
          </View>
        </TouchableWithoutFeedback>
      </Modal>
    </View>
  );
};

const styles = StyleSheet.create({
  shadowMenuContainer: {
    position: 'absolute',
    backgroundColor: 'white',
    borderRadius: 4,
    opacity: 0,
    // Shadow
    ...Platform.select({
      ios: {
        shadowColor: 'black',
        shadowOffset: {width: 0, height: 2},
        shadowOpacity: 0.14,
        shadowRadius: 2,
      },
      // android: {
      //   elevation: 8,
      // },
    }),
  },
  menuContainer: {
    overflow: 'hidden',
  },
});

export default forwardRef(Menu);
