# SingApe - Ứng dụng nghe nhạc thế hệ mới 

SingApe là một ứng dụng nghe nhạc hiện đại được thiết kế dành cho người dùng yêu âm nhạc, hỗ trợ đầy đủ tính năng như phát nhạc, tìm kiếm, hiển thị lời karaoke, tạo playlist cá nhân và chia sẻ bài hát. Trải nghiệm giống như Zing MP3 nhưng với giao diện hiện đại hơn và hỗ trợ nhiều tính năng cá nhân hóa.

---

## Tính năng chính

- Phát nhạc: play / pause / next / previous / shuffle / repeat / phát nền
- Tìm kiếm bài hát theo tên, ca sĩ, album, thể loại
- Hiển thị lời bài hát đồng bộ theo thời gian (Karaoke mode)
- Tùy chỉnh giao diện: Dark / Light mode + màu chủ đạo theo ảnh bài hát
- Bảng xếp hạng âm nhạc từ nhiều nguồn ( ZingChart)
- Playlist cá nhân, bài hát yêu thích, tải về nhạc
- Chia sẻ bài hát lên Facebook, Zalo kèm ảnh preview 

---

## Công nghệ sử dụng

| Phần mềm        | Mô tả                             |
|-----------------|-----------------------------------|
| React Native    | Giao diện mobile (Android/iOS)    |
| Expo Router     | Điều hướng                        |
| Gluestack UI    | UI Component Library              |
| Tailwind CSS    | Styling                           |
| Zustand         | Quản lý state nhẹ nhàng           |
| React Native Track Player | Phát nhạc nền, điều khiển media |
| FastAPI         | Backend API                       |
| MySQL           | Cơ sở dữ liệu                     |
| Supabase        | Lưu trữ metadata bài hát, playlist |
| React Native Image Colors | Trích xuất màu từ ảnh bài hát |


---

##  Cài đặt & chạy ứng dụng

### 1. Clone source
```bash
git clone https://github.com/Thucdzio/SingApe_Music.git
cd singape-app 
```
### 2.Cài dependencies
```bash
npm install
```
### 3. Chạy ứng dụng trên Android
```bash
npx expo run android
```
( Đảm bảo bạn đã cài đặt máy ảo hoặc kết nối thiết bị điện thoại thật để chạy )

### 4.Authors
- Lý Hồng Đức - 22021217@vnu.edu.vn
- Nguyễn Việt An - 22021168@vnu.edu.vn
- Lê Tiến Thực - 22021197@vnu.edu.vn

### 5.Demo
Truy cập đường dẫn https://drive.google.com/file/d/1I1XG6FSnjPnaHV5Ps4QBkOW133LmICql/view?usp=drive_link
