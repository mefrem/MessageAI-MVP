# Next Steps

## UX Expert Prompt

Review this PRD and create detailed UI/UX specifications including:
- User flow diagrams for core journeys (onboarding, messaging, group creation)
- Wireframes for critical screens (Conversation List, Chat View, Group Info)
- Design system basics (color palette, typography, component library guidance)
- Accessibility implementation guide for WCAG AA compliance

Focus on the MVP scope - one-on-one and group messaging with images. Ensure designs work within React Native Paper component constraints.

## Architect Prompt

Review this PRD and create the architecture document covering:

**Data Model:**
- Firestore collections schema (/users, /conversations, /messages)
- Document field specifications and data types
- Indexing strategy for real-time queries
- Firestore security rules for all collections

**Application Architecture:**
- React Native app structure and navigation flow
- React Context architecture (AuthContext, MessagesContext, NetworkContext)
- State management patterns for optimistic UI and offline queue
- Firebase SDK integration patterns

**Backend Architecture:**
- Cloud Functions structure for push notifications
- Firebase Storage organization and security rules
- Authentication flow implementation
- Real-time listener patterns for messages, presence, typing indicators

**Technical Specifications:**
- Message queueing and retry logic implementation approach
- Offline persistence strategy (AsyncStorage vs SQLite)
- Image upload/compression pipeline
- Error handling and network resilience patterns

Ensure all architectural decisions align with Technical Assumptions section and support the 25 user stories across 3 epics.
