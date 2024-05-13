import React, {useEffect} from 'react';
import {createNativeStackNavigator} from '@react-navigation/native-stack';
import RouteName from './RouteName';
import {AppConfigScreen} from './RouteConfig';
// import messaging from '@react-native-firebase/messaging';
import {navigationRef} from 'src/utilities/helper/navigationHelper';
import {init, pushLocal} from 'src/utilities/helper/notificationHelper';
// import notifee, {EventType} from '@notifee/react-native';

const Stack = createNativeStackNavigator();

const AppNavigator = () => {
  useEffect(() => {
    init();
    // messaging().onNotificationOpenedApp(remoteMessage => {
    //   handleNoti(remoteMessage.data);
    //   console.log(
    //     'Notification caused app to open from background state:',
    //     remoteMessage,
    //   );
    // });

    // // Check whether an initial notification is available
    // messaging()
    //   .getInitialNotification()
    //   .then(remoteMessage => {
    //     if (remoteMessage) {
    //       console.log(
    //         'Notification caused app to open from quit state:',
    //         remoteMessage,
    //       );
    //       handleNoti(remoteMessage.data);
    //     }
    //   });

    // messaging().onMessage(async remoteMessage => {
    //   console.log('FCM Message Data:', remoteMessage);
    //   pushLocal({
    //     title: remoteMessage?.notification?.title,
    //     body: remoteMessage?.notification?.body,
    //     data: remoteMessage?.data,
    //   });
    // });

    // const unsubscribe = notifee.onForegroundEvent(({type, detail}) => {
    //   switch (type) {
    //     case EventType.PRESS: {
    //       console.log('User pressed notification', detail.notification);
    //       handleNoti(detail?.notification?.data);
    //       break;
    //     }
    //   }
    // });

    // return () => {
    //   unsubscribe();
    // };
  }, []);

  // const handleNoti = data => {
  //   try {
  //     const {idNoti, key} = data;
  //     if (idNoti) {
  //       return navigationRef.navigate(RouteName.NEWS_LETTER_DETAIL, {
  //         newsLetterId: idNoti,
  //       });
  //     }
  //   } catch (error) {
  //     console.log('error', error);
  //   }
  // };

  return (
    <Stack.Navigator
      screenOptions={{headerShown: false}}
      initialRouteName={RouteName.MAIN}>
      {AppConfigScreen.map(item => (
        <Stack.Screen
          key={item.name}
          name={item.name}
          component={item.component}
        />
      ))}
    </Stack.Navigator>
  );
};

export default AppNavigator;
