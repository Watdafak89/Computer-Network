/**
 * NetQuest 16-Bit: Firebase Project Configuration
 *
 * วิธีตั้งค่าเชื่อมต่อฐานข้อมูล Firebase จริง:
 * 1. สร้างโปรเจกต์ที่ https://console.firebase.google.com/
 * 2. เปิดใช้งาน Authentication -> Sign-in method -> Email/Password
 * 3. เปิดใช้งาน Cloud Firestore Database
 * 4. คัดลอกค่า firebaseConfig จาก Project Settings -> Web App มาวางแทนค่าว่างด้านล่าง
 *    (หรือครูผู้สอนสามารถวางโค้ด firebaseConfig ผ่านปุ่ม "👨‍🏫 ครู -> ตั้งค่า Firebase" บนหน้าเว็บได้ทันที)
 *
 * หมายเหตุ: หากเว้นค่าว่างไว้ ระบบจะทำงานใน "โหมดทดลองภายในเครื่อง (Local Auth Mode)"
 * โดยยังรองรับการลงทะเบียน/ล็อกอินด้วยรหัสนักศึกษา + รหัสผ่านได้ตามปกติ
 */
window.NETQUEST_FIREBASE_CONFIG = {
  apiKey: "",
  authDomain: "",
  projectId: "",
  storageBucket: "",
  messagingSenderId: "",
  appId: ""
};
