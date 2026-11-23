/**
 * NetQuest 16-Bit: Admin Script for Managing Firebase Auth Custom Claim (teacher: true)
 *
 * Usage:
 *   node set-teacher-claim.mjs create-teacher <teacherId-or-email> <password>
 *   node set-teacher-claim.mjs grant <email-or-studentId-or-uid>
 *   node set-teacher-claim.mjs revoke <email-or-studentId-or-uid>
 *   node set-teacher-claim.mjs check <email-or-studentId-or-uid>
 */
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import admin from 'firebase-admin';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const defaultKeyPath = path.join(__dirname, 'serviceAccountKey.json');
const rootKeyPath = path.resolve(__dirname, '..', 'serviceAccountKey.json');

function resolveServiceAccountPath() {
  if (process.env.GOOGLE_APPLICATION_CREDENTIALS && fs.existsSync(process.env.GOOGLE_APPLICATION_CREDENTIALS)) {
    return process.env.GOOGLE_APPLICATION_CREDENTIALS;
  }
  if (fs.existsSync(defaultKeyPath)) return defaultKeyPath;
  if (fs.existsSync(rootKeyPath)) return rootKeyPath;
  return null;
}

function toAccountEmail(identifier) {
  const raw = String(identifier || '').trim();
  if (raw.includes('@')) return raw.toLowerCase();
  const clean = raw.replace(/\s+/g, '').replace(/[^a-zA-Z0-9_-]/g, '');
  return `${clean.toLowerCase()}@student.netquest.local`;
}

async function resolveUser(auth, identifier) {
  const raw = String(identifier || '').trim();
  if (!raw) throw new Error('กรุณาระบุอีเมล, รหัสประจำตัว หรือ UID');

  if (raw.includes('@')) {
    return auth.getUserByEmail(raw.toLowerCase());
  }

  // Try mapped student/teacher ID email first, then fallback to raw UID
  const mappedEmail = toAccountEmail(raw);
  try {
    return await auth.getUserByEmail(mappedEmail);
  } catch (err) {
    if (err && err.code === 'auth/user-not-found') {
      return auth.getUser(raw);
    }
    throw err;
  }
}

function printUsage() {
  console.log(`
วิธีใช้งานสคริปต์กำหนดสิทธิ์ครูผู้สอน (Custom Claim: { teacher: true }):
  node set-teacher-claim.mjs create-teacher <teacherId-or-email> <password>
  node set-teacher-claim.mjs grant <email-or-studentId-or-uid>
  node set-teacher-claim.mjs revoke <email-or-studentId-or-uid>
  node set-teacher-claim.mjs check <email-or-studentId-or-uid>

ตัวอย่าง:
  node set-teacher-claim.mjs create-teacher teacher01 MyPass1234
  node set-teacher-claim.mjs grant wat.overclock@gmail.com
  node set-teacher-claim.mjs check teacher01
`);
}

async function main() {
  const [cmd, target, extra] = process.argv.slice(2);
  if (!cmd || !target || !['create-teacher', 'grant', 'revoke', 'check'].includes(cmd)) {
    printUsage();
    process.exit(1);
  }

  const keyPath = resolveServiceAccountPath();
  if (!keyPath) {
    console.error('❌ ไม่พบไฟล์ Service Account Key!');
    console.error(`กรุณาดาวน์โหลดไฟล์ JSON จาก Firebase Console -> Project settings -> Service accounts -> Generate new private key`);
    console.error(`แล้วบันทึกชื่อไฟล์ว่า: ${defaultKeyPath}`);
    process.exit(1);
  }

  const serviceAccount = JSON.parse(fs.readFileSync(keyPath, 'utf8'));
  admin.initializeApp({
    credential: admin.credential.cert(serviceAccount)
  });

  const auth = admin.auth();

  if (cmd === 'create-teacher') {
    if (!extra || extra.length < 6) {
      console.error('❌ รหัสผ่านต้องมีอย่างน้อย 6 ตัวอักษร');
      process.exit(1);
    }
    const email = toAccountEmail(target);
    let user;
    try {
      user = await auth.getUserByEmail(email);
      console.log(`ℹ️ พบบัญชี ${email} อยู่แล้ว (UID: ${user.uid}) — กำลังอัปเดตรหัสผ่านและสิทธิ์ครู...`);
      user = await auth.updateUser(user.uid, { password: extra });
    } catch (err) {
      if (err && err.code === 'auth/user-not-found') {
        user = await auth.createUser({ email, password: extra, displayName: `Teacher (${target})` });
        console.log(`✅ สร้างบัญชีครูใหม่สำเร็จ: ${email} (UID: ${user.uid})`);
      } else {
        throw err;
      }
    }
    const mergedClaims = { ...(user.customClaims || {}), teacher: true };
    await auth.setCustomUserClaims(user.uid, mergedClaims);
    console.log(`👑 ตั้งสิทธิ์ Custom Claim { teacher: true } ให้ ${email} เรียบร้อยแล้ว!`);
    console.log('ℹ️ หากล็อกอินค้างไว้ในเบราว์เซอร์ ให้กดปุ่ม "🔄 รีเฟรชสิทธิ์ครู" หรือออกจากระบบแล้วเข้าใหม่');
    return;
  }

  const user = await resolveUser(auth, target);

  if (cmd === 'check') {
    console.log(`UID: ${user.uid}`);
    console.log(`Email: ${user.email || '-'}`);
    console.log('Custom Claims:', JSON.stringify(user.customClaims || {}));
    return;
  }

  if (cmd === 'grant') {
    const merged = { ...(user.customClaims || {}), teacher: true };
    await auth.setCustomUserClaims(user.uid, merged);
    console.log(`👑 ให้สิทธิ์ { teacher: true } แก่ ${user.email || user.uid} เรียบร้อยแล้ว!`);
    return;
  }

  if (cmd === 'revoke') {
    const nextClaims = { ...(user.customClaims || {}) };
    delete nextClaims.teacher;
    await auth.setCustomUserClaims(user.uid, nextClaims);
    console.log(`🔒 ถอดสิทธิ์ teacher ออกจาก ${user.email || user.uid} เรียบร้อยแล้ว!`);
  }
}

main().catch((err) => {
  console.error('❌ Error:', err.message || err);
  process.exit(1);
});
