import { QueuedMessage } from "@messageai/shared";
import { storageService } from "./storageService";
import NetInfo from "@react-native-community/netinfo";
import { RETRY_MAX_ATTEMPTS, RETRY_BASE_DELAY } from "@messageai/shared";

export const offlineQueueService = {
  isProcessing: false,
  networkUnsubscribe: null as (() => void) | null,

  async enqueueMessage(message: QueuedMessage): Promise<void> {
    try {
      const queue = await storageService.getMessageQueue();
      queue.push(message);
      await storageService.saveMessageQueue(queue);
    } catch (error) {
      console.error("Error enqueueing message:", error);
    }
  },

  async dequeueMessage(messageId: string): Promise<void> {
    try {
      const queue = await storageService.getMessageQueue();
      const updatedQueue = queue.filter(
        (msg: QueuedMessage) => msg.id !== messageId
      );
      await storageService.saveMessageQueue(updatedQueue);
    } catch (error) {
      console.error("Error dequeuing message:", error);
    }
  },

  async getQueuedMessages(): Promise<QueuedMessage[]> {
    try {
      return await storageService.getMessageQueue();
    } catch (error) {
      console.error("Error getting queued messages:", error);
      return [];
    }
  },

  async processQueue(
    sendFunction: (message: QueuedMessage) => Promise<void>
  ): Promise<void> {
    if (this.isProcessing) {
      return;
    }

    this.isProcessing = true;

    try {
      const queue = await this.getQueuedMessages();

      for (const message of queue) {
        try {
          await sendFunction(message);
          await this.dequeueMessage(message.id);
        } catch (error) {
          console.error("Error sending queued message:", error);

          // Update retry count
          if (message.retryCount < RETRY_MAX_ATTEMPTS) {
            const updatedQueue = await this.getQueuedMessages();
            const messageIndex = updatedQueue.findIndex(
              (m: QueuedMessage) => m.id === message.id
            );

            if (messageIndex !== -1) {
              updatedQueue[messageIndex].retryCount += 1;
              await storageService.saveMessageQueue(updatedQueue);
            }

            // Wait with exponential backoff
            const delay = RETRY_BASE_DELAY * Math.pow(2, message.retryCount);
            await new Promise((resolve) => setTimeout(resolve, delay));
          } else {
            // Max retries reached, remove from queue
            console.error("Max retries reached for message:", message.id);
            await this.dequeueMessage(message.id);
          }
        }
      }
    } finally {
      this.isProcessing = false;
    }
  },

  startNetworkMonitoring(onOnline: () => void): void {
    this.networkUnsubscribe = NetInfo.addEventListener((state) => {
      if (state.isConnected && state.isInternetReachable) {
        onOnline();
      }
    });
  },

  stopNetworkMonitoring(): void {
    if (this.networkUnsubscribe) {
      this.networkUnsubscribe();
      this.networkUnsubscribe = null;
    }
  },

  async clearQueue(): Promise<void> {
    try {
      await storageService.saveMessageQueue([]);
    } catch (error) {
      console.error("Error clearing queue:", error);
    }
  },
};

