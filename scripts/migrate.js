/**
 * One-time migration script: imports users from data/users.json into Firebase Auth + Firestore.
 *
 * Usage:
 *   1. Add old user objects to data/users.json (see format below)
 *   2. Run: npm run migrate
 *
 * User object format in data/users.json:
 *   {
 *     "id": "1234567890",
 *     "name": "John",
 *     "email": "john@example.com",
 *     "password": "<bcrypt hash - will be replaced>",
 *     "createdAt": "2024-01-01T00:00:00.000Z"
 *   }
 *
 * Note: bcrypt-hashed passwords cannot be migrated to Firebase Auth.
 * Migrated users will have a temporary password set.
 * They should use "Forgot Password" to set a new one.
 */

const path = require("path");
const fs = require("fs");
const crypto = require("crypto");

const serviceAccountPath = path.join(
  __dirname,
  "..",
  "ai-cluster-6f1cc-firebase-adminsdk-fbsvc-ef8969365b.json"
);
const usersPath = path.join(__dirname, "..", "data", "users.json");

const serviceAccount = JSON.parse(fs.readFileSync(serviceAccountPath, "utf8"));

const admin = require("firebase-admin");
const { getAuth } = require("firebase-admin/auth");
const { getFirestore } = require("firebase-admin/firestore");

const app = admin.initializeApp({
  credential: admin.cert(serviceAccount),
});

const auth = getAuth(app);
const db = getFirestore(app);

function generateTempPassword() {
  return crypto.randomBytes(16).toString("hex");
}

async function migrate() {
  const raw = fs.readFileSync(usersPath, "utf8");
  let oldUsers;

  try {
    oldUsers = JSON.parse(raw);
  } catch {
    console.error("Failed to parse data/users.json. Make sure it contains a valid JSON array.");
    process.exit(1);
  }

  if (!Array.isArray(oldUsers) || oldUsers.length === 0) {
    console.log("No users found in data/users.json to migrate.");
    console.log('Add user objects to data/users.json and run "npm run migrate" again.');
    process.exit(0);
  }

  console.log(`Found ${oldUsers.length} user(s) to migrate...\n`);

  let succeeded = 0;
  let failed = 0;

  for (const oldUser of oldUsers) {
    const { name, email, createdAt } = oldUser;
    const tempPassword = generateTempPassword();

    try {
      const userRecord = await auth.createUser({
        email,
        password: tempPassword,
        displayName: name,
        emailVerified: false,
      });

      await db.collection("users").doc(userRecord.uid).set({
        name,
        email,
        createdAt: createdAt || new Date().toISOString(),
      });

      console.log(`  ✓ ${email} → Firebase UID: ${userRecord.uid}`);
      console.log(`    Temporary password: ${tempPassword}`);
      console.log(`    (User should use "Forgot Password" to set a new password)\n`);
      succeeded++;
    } catch (err) {
      if (err.code === "auth/email-already-exists") {
        console.log(`  ~ ${email} → already exists in Firebase Auth (skipped)\n`);
        succeeded++;
      } else {
        console.error(`  ✗ ${email} → ${err.message}\n`);
        failed++;
      }
    }
  }

  console.log("─".repeat(50));
  console.log(`Migration complete: ${succeeded} succeeded, ${failed} failed`);
  console.log("─".repeat(50));

  if (succeeded > 0) {
    console.log(
      '\nUsers created with temporary passwords. Tell them to visit /signin and use "Forgot Password?" to set a new password.'
    );
  }

  process.exit(failed > 0 ? 1 : 0);
}

migrate();
