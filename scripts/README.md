# Scripts

Utility scripts for MessageAI development.

## Seed Mock Users

Creates test users in your Firebase project for easy testing.

### Setup:

1. **Download your Firebase service account key:**

   - Go to: https://console.firebase.google.com/project/messageai-mvp/settings/serviceaccounts/adminsdk
   - Click "Generate new private key"
   - Save as `serviceAccountKey.json` in the **root directory** (it's gitignored)

2. **Install dependencies:**

   ```bash
   cd scripts
   npm install
   ```

3. **Run the seed script:**
   ```bash
   npm run seed
   ```

### Mock Users Created:

| Email            | Password    | Display Name  |
| ---------------- | ----------- | ------------- |
| alice@test.com   | password123 | Alice Johnson |
| bob@test.com     | password123 | Bob Smith     |
| charlie@test.com | password123 | Charlie Davis |

### Using Mock Users:

1. Sign up with your own account in the app
2. Go to "New Chat"
3. You'll see Alice, Bob, and Charlie in the user list
4. Start chatting with them!

**Note:** These are just empty accounts - they won't send messages back unless you log in as them on another device/simulator.

### Clean Up:

To delete mock users, use the Firebase Console:
https://console.firebase.google.com/project/messageai-mvp/authentication/users
