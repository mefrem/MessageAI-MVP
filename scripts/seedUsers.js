/**
 * Seed script to create mock users for testing
 * Run with: node scripts/seedUsers.js
 */

const admin = require("firebase-admin");
const serviceAccount = require("../serviceAccountKey.json"); // You'll need to download this

// Initialize Firebase Admin
admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
  storageBucket: "messageai-mvp.appspot.com", // Replace with your bucket
});

const auth = admin.auth();
const firestore = admin.firestore();

const mockUsers = [
  {
    email: "alice@test.com",
    password: "password123",
    displayName: "Alice Johnson",
  },
  {
    email: "bob@test.com",
    password: "password123",
    displayName: "Bob Smith",
  },
  {
    email: "charlie@test.com",
    password: "password123",
    displayName: "Charlie Davis",
  },
];

async function seedUsers() {
  console.log("🌱 Seeding mock users...\n");

  for (const mockUser of mockUsers) {
    try {
      // Create auth user
      const userRecord = await auth.createUser({
        email: mockUser.email,
        password: mockUser.password,
        displayName: mockUser.displayName,
      });

      console.log(
        `✅ Created auth user: ${mockUser.email} (${userRecord.uid})`
      );

      // Create Firestore profile
      await firestore.collection("users").doc(userRecord.uid).set({
        id: userRecord.uid,
        email: mockUser.email,
        displayName: mockUser.displayName,
        photoURL: null,
        createdAt: admin.firestore.FieldValue.serverTimestamp(),
        updatedAt: admin.firestore.FieldValue.serverTimestamp(),
      });

      console.log(`✅ Created Firestore profile for ${mockUser.displayName}\n`);
    } catch (error) {
      if (error.code === "auth/email-already-exists") {
        console.log(`⚠️  User ${mockUser.email} already exists, skipping...\n`);
      } else {
        console.error(
          `❌ Error creating user ${mockUser.email}:`,
          error.message
        );
      }
    }
  }

  console.log("✨ Seeding complete!\n");
  console.log("Mock user credentials:");
  mockUsers.forEach((user) => {
    console.log(`  Email: ${user.email}`);
    console.log(`  Password: ${user.password}`);
    console.log(`  Name: ${user.displayName}\n`);
  });

  process.exit(0);
}

seedUsers().catch((error) => {
  console.error("❌ Seeding failed:", error);
  process.exit(1);
});
