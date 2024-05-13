// import notifee from '@notifee/react-native';

export const init = async () => {
  // Create a channel (required for Android)
  // await notifee.createChannel({
  //   id: 'default',
  //   name: 'DigiPro',
  // });
};

export const pushLocal = async ({title, body, data}) => {
  // await notifee.displayNotification({
  //   title,
  //   body,
  //   data,
  //   android: {
  //     channelId: 'default',
  //     // pressAction is needed if you want the notification to open the app when pressed
  //     pressAction: {
  //       id: 'default',
  //     },
  //   },
  // });
};
