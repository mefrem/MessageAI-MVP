# Coding Standards

## Critical React Native Rules

- **Shared Types:** Always import types from `@messageai/shared`, never duplicate type definitions
- **Firebase Queries:** Use services layer for all Firestore operations, never call Firebase directly from components
- **State Updates:** Use Context dispatch/setState, never mutate state directly
- **Async Operations:** Always handle loading states and errors in UI components
- **Image Compression:** Compress images before upload using MediaManager, never upload raw camera images

## Naming Conventions

| Element | Convention | Example |
|---------|-----------|---------|
| Components | PascalCase | `MessageBubble.tsx` |
| Hooks | camelCase with 'use' prefix | `useMessages.ts` |
| Services | camelCase with 'Service' suffix | `messageService.ts` |
| Contexts | PascalCase with 'Context' suffix | `AuthContext.tsx` |
| Firestore Collections | lowercase | `users`, `conversations` |
| Storage Paths | lowercase with hyphens | `/profile-pictures/{userId}` |
