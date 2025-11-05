import PushNotification from 'react-native-push-notification';
import { Platform } from 'react-native';

// Cấu hình thông báo
PushNotification.configure({
  onNotification: function (notification) {
    console.log('📩 THÔNG BÁO NHẬN ĐƯỢC:', notification);
  },
  requestPermissions: Platform.OS === 'ios',
});

// Tạo kênh thông báo
PushNotification.createChannel(
  {
    channelId: 'default-channel-id',
    channelName: 'Default Channel',
    channelDescription: 'A default channel',
    playSound: true,
    soundName: 'default',
    importance: 4,
    vibrate: true,
  },
  (created) => console.log(`✅ Tạo kênh thông báo: ${created}`)
);

// Dữ liệu thông báo
const notifications = require('../assets/data/notifications.json');
let currentNotificationIndex = 0;

// Hàm gửi một thông báo duy nhất mỗi lần
function sendTestNotification() {
  if (!notifications || notifications.length === 0) return;

  const item = notifications[currentNotificationIndex];
  PushNotification.localNotification({
    channelId: 'default-channel-id',
    title: item.title,
    message: item.message,
  });

  console.log(`🔔 Đã gửi thông báo: ${item.title}`);
  currentNotificationIndex = (currentNotificationIndex + 1) % notifications.length;
}

// Gửi mỗi 5 phút
setTimeout(() => {
  sendTestNotification();
  setInterval(() => {
    sendTestNotification();
  }, 120000); // 5 phút
}, 600000);

export { sendTestNotification };
