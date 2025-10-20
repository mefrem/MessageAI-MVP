# Testing Strategy

## Testing Pyramid

```
        E2E Tests (Detox - post-MVP)
       /                              \
      Integration Tests (Firebase Emulator)
     /                                      \
Frontend Unit Tests         Backend Unit Tests
(Jest + RNTL)                (Jest + Emulator)
```

## Test Organization

**Frontend Tests:**
```
/mobile/__tests__/
├── components/
│   ├── MessageBubble.test.tsx
│   └── ConversationItem.test.tsx
├── services/
│   ├── messageService.test.ts
│   └── offlineQueueService.test.ts
└── hooks/
    └── useMessages.test.ts
```

**Backend Tests:**
```
/functions/__tests__/
├── triggers/
│   └── onMessageCreated.test.ts
└── services/
    └── notificationService.test.ts
```

## Test Example

```typescript
// mobile/__tests__/services/messageService.test.ts
import { messageService } from '../../src/services/messageService';
import { offlineQueueService } from '../../src/services/offlineQueueService';

jest.mock('../../src/services/offlineQueueService');

describe('MessageService', () => {
  describe('sendTextMessage', () => {
    it('should send message when online', async () => {
      // Arrange
      const conversationId = 'conv123';
      const text = 'Hello world';

      // Act
      await messageService.sendTextMessage(conversationId, text);

      // Assert
      expect(offlineQueueService.enqueueMessage).not.toHaveBeenCalled();
    });

    it('should queue message when offline', async () => {
      // Arrange
      jest.spyOn(navigator, 'onLine', 'get').mockReturnValue(false);
      const conversationId = 'conv123';
      const text = 'Hello world';

      // Act
      await messageService.sendTextMessage(conversationId, text);

      // Assert
      expect(offlineQueueService.enqueueMessage).toHaveBeenCalled();
    });
  });
});
```
