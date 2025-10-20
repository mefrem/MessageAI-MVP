# Security and Performance

## Security Requirements

**Mobile App Security:**
- All Firebase operations require authentication (enforced by security rules)
- Sensitive data (auth tokens) stored in secure device storage
- No hardcoded credentials or API keys in code
- Input validation on all user-provided data

**Backend Security:**
- Firestore security rules enforce authentication and authorization
- Storage rules prevent unauthorized file access
- Rate limiting via Firebase App Check (post-MVP)
- Cloud Functions execute with least-privilege service accounts

**Authentication Security:**
- Email/password minimum requirements: 6 characters (Firebase default)
- Failed login attempts throttled by Firebase Auth
- Session tokens auto-refresh via Firebase SDK
- Logout clears all local auth state

## Performance Optimization

**Mobile Performance:**
- Bundle size target: < 50MB initial download
- FlatList virtualization for message lists (render only visible items)
- Image caching via AsyncStorage/react-native-fast-image
- Lazy loading of conversations and messages
- Debounced typing indicators (500ms)

**Backend Performance:**
- Firestore queries use composite indexes for fast lookups
- Denormalized lastMessage in Conversation for quick preview loads
- Cloud Functions use Gen 2 for better cold start performance
- Image uploads compressed client-side before Storage upload

**Caching Strategy:**
- AsyncStorage caches recent messages (last 30 days)
- User profiles cached after first fetch
- Presence status cached with 5-minute TTL
- Images cached in device storage after download
