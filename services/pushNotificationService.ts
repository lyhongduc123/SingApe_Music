// import PushNotification from 'react-native-push-notification';
// import { Platform } from 'react-native';

// // Cấu hình thông báo
// PushNotification.configure({
//   onNotification: function (notification) {
//     console.log('📩 THÔNG BÁO NHẬN ĐƯỢC:', notification);
//   },
// });

// // Tạo kênh thông báo
// PushNotification.createChannel(
//   {
//     channelId: 'default-channel-id',
//     channelName: 'Default Channel',
//     channelDescription: 'A default channel',
//     playSound: true,
//     soundName: 'default',
//     importance: 4,
//     vibrate: true,
//   },
//   (created) => console.log(`✅ Tạo kênh thông báo: ${created}`)
// );

// // Dữ liệu thông báo
// const notifications = require('../assets/data/notifications.json');
// let currentNotificationIndex = 0;

// // Hàm gửi một thông báo duy nhất mỗi lần
// function sendTestNotification() {
//   if (!notifications || notifications.length === 0) return;

//   const item = notifications[currentNotificationIndex];
//   PushNotification.localNotification({
//     channelId: 'default-channel-id',
//     title: item.title,
//     message: item.message,
//   });

//   console.log(`🔔 Đã gửi thông báo: ${item.title}`);
//   currentNotificationIndex = (currentNotificationIndex + 1) % notifications.length;
// }

// // Gửi mỗi 5 phút
// setTimeout(() => {
//   sendTestNotification();
//   setInterval(() => {
//     sendTestNotification();
//   }, 1500000); // 5 phút
// }, 60000);

// export { sendTestNotification };

import Constants from 'expo-constants';
import * as Notifications from 'expo-notifications';
import { useEffect } from 'react';
import { Platform } from 'react-native';

export interface PushNotificationService {
  notification?: Notifications.Notification;
}

export const usePushNotifications = () => {
  Notifications.setNotificationHandler({
    handleNotification: async () => ({
      shouldShowAlert: true,
      shouldPlaySound: true,
      shouldSetBadge: false,
    }),
})

  async function registerForPushNotificationsAsync() {
    if (!Constants.isDevice) {
      alert('Push notifications only work on physical devices.');
      return;
    }
  
    const { status: existingStatus } = await Notifications.getPermissionsAsync();
    let finalStatus = existingStatus;
  
    if (existingStatus !== 'granted') {
      const { status } = await Notifications.requestPermissionsAsync();
      finalStatus = status;
    }
  
    if (finalStatus !== 'granted') {
      alert('Failed to get push token for push notification!');
      return;
    }
  
    // iOS only: set notification categories, etc. if needed
  
    // Android only: create channel
    if (Platform.OS === 'android') {
      await Notifications.setNotificationChannelAsync('default-channel-id', {
        name: 'Default Channel',
        importance: Notifications.AndroidImportance.HIGH,
        sound: 'default',
        vibrationPattern: [0, 250, 250, 250],
        lightColor: '#FF231F7C',
      });
    }
  }

  useEffect(() => {
    registerForPushNotificationsAsync().catch(console.error);
  }, []);
};