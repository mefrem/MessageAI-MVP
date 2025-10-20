# Unified Project Structure

```
messageai/
├── mobile/                          # React Native mobile app
│   ├── src/
│   │   ├── components/              # UI components
│   │   ├── screens/                 # Screen components
│   │   ├── contexts/                # React Context providers
│   │   ├── services/                # Business logic
│   │   ├── hooks/                   # Custom hooks
│   │   ├── navigation/              # React Navigation
│   │   ├── utils/                   # Utilities
│   │   └── config/                  # Configuration
│   ├── assets/                      # Images, fonts
│   ├── App.tsx                      # Root component
│   ├── app.json                     # Expo configuration
│   ├── package.json
│   └── tsconfig.json
├── functions/                       # Firebase Cloud Functions
│   ├── src/
│   │   ├── index.ts                 # Function exports
│   │   ├── triggers/                # Firestore triggers
│   │   ├── services/                # Business logic
│   │   └── utils/                   # Utilities
│   ├── package.json
│   └── tsconfig.json
├── shared/                          # Shared TypeScript types
│   ├── src/
│   │   ├── types/
│   │   │   ├── User.ts
│   │   │   ├── Conversation.ts
│   │   │   ├── Message.ts
│   │   │   ├── Presence.ts
│   │   │   └── index.ts
│   │   └── constants/
│   │       └── index.ts
│   ├── package.json
│   └── tsconfig.json
├── docs/                            # Documentation
│   ├── prd.md
│   └── architecture.md
├── .firebaserc                      # Firebase project config
├── firebase.json                    # Firebase services config
├── firestore.rules                  # Firestore security rules
├── storage.rules                    # Storage security rules
├── package.json                     # Root package.json (workspaces)
└── README.md
```
