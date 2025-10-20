# API Specification

**N/A - Direct Firebase SDK Integration**

MessageAI uses Firebase SDK directly from the mobile app, eliminating the need for a custom REST or GraphQL API layer. All data operations use Firestore queries, Firebase Auth methods, and Firebase Storage uploads via the official Firebase JavaScript SDK.

**Firebase SDK "API" Patterns:**
- Authentication: `createUserWithEmailAndPassword()`, `signInWithEmailAndPassword()`
- Firestore Queries: `collection().where().onSnapshot()` for real-time data
- Storage Uploads: `ref().put()` for image uploads
- Cloud Functions: Called automatically via Firestore triggers (no client API)
