# คู่มือการเชื่อมต่อ Firebase สำหรับ NetQuest 16-Bit (ปวช.)

ระบบออกแบบให้ **นักเรียนล็อกอินด้วยรหัสนักศึกษา + รหัสผ่าน (อย่างน้อย 6 ตัวอักษร)** ผ่าน **Firebase Authentication** และบันทึกความคืบหน้า/ตารางผู้นำแบบ Real-time บน **Cloud Firestore**

---

## ขั้นตอนที่ 1: สร้างโปรเจกต์ Firebase
1. เข้าเว็บไซต์ https://console.firebase.google.com/ แล้วล็อกอินด้วยบัญชี Google
2. กด **"Create a project"** (หรือ "Add project") ตั้งชื่อ เช่น `netquest-network-course` แล้วกดสร้างจนเสร็จ

---

## ขั้นตอนที่ 2: เปิดใช้งานการล็อกอิน (Firebase Authentication)
1. ในเมนูซ้ายเลือก **Build → Authentication** แล้วกด **Get started**
2. ไปที่แท็บ **Sign-in method** → คลิก **Email/Password**
3. เปิดสวิตช์ **Enable** (เฉพาะตัวแรก ไม่ต้องเปิด Email link) แล้วกด **Save**
   > *หมายเหตุ: ระบบจะแปลงรหัสนักศึกษาเช่น `6720901005` เป็น `6720901005@student.netquest.local` อัตโนมัติ นักเรียนจึงกรอกแค่รหัสนักศึกษากับรหัสผ่าน 6+ ตัว ไม่ต้องใช้อีเมลจริง*

---

## ขั้นตอนที่ 3: เปิดใช้งานฐานข้อมูล (Cloud Firestore)
1. ในเมนูซ้ายเลือก **Build → Firestore Database** แล้วกด **Create database**
2. เลือก Location ใกล้ไทย เช่น `asia-southeast1 (Singapore)`
3. เลือกโหมดเริ่มต้นแล้วกด **Create**
4. ไปที่แท็บ **Rules** ของ Firestore แล้วคัดลอกกฎจากไฟล์ [firestore.rules](firestore.rules) ไปวางแทนที่ จากนั้นกด **Publish**

---

## ขั้นตอนที่ 4: คัดลอกค่า `firebaseConfig` มาใส่ในโปรเจกต์
1. กดรูปเฟือง ⚙️ มุมซ้ายบน → **Project settings**
2. เลื่อนลงมาที่หัวข้อ **Your apps** → กดไอคอนเว็บ **`</>`** เพื่อลงทะเบียน Web App ตั้งชื่อ เช่น `NetQuest Web`
3. คัดลอกอ็อบเจกต์ `firebaseConfig` (`apiKey`, `authDomain`, `projectId`, `storageBucket`, `messagingSenderId`, `appId`)
4. **เลือกใส่ค่าได้ 2 วิธี**:
   - **วิธีที่ 1 (ถาวรสำหรับทั้งห้อง/GitHub Pages)**: เปิดไฟล์ [js/firebase-config.js](js/firebase-config.js) แล้ววางค่าลงใน `window.NETQUEST_FIREBASE_CONFIG` จากนั้น Push ขึ้น GitHub
   - **วิธีที่ 2 (ทดสอบเร็วผ่านหน้าเว็บ)**: เปิดเว็บเกม → กดปุ่ม **👨‍🏫 ครู** → วางบล็อก `firebaseConfig` ลงในช่อง **"ตั้งค่า Firebase Config"** แล้วกดบันทึก
