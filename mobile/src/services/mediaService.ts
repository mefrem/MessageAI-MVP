import { ref, uploadBytes, getDownloadURL } from "firebase/storage";
import { storage } from "../config/firebase";
import { pickImage, CompressedImage } from "../utils/imageCompressor";
import { handleFirebaseError } from "../utils/errorHandler";

export const mediaService = {
  async pickAndUploadProfileImage(userId: string): Promise<string | null> {
    try {
      const image = await pickImage("gallery");
      if (!image) return null;

      const imageUrl = await this.uploadProfileImage(userId, image.uri);
      return imageUrl;
    } catch (error) {
      throw handleFirebaseError(error);
    }
  },

  async pickAndUploadMessageImage(
    conversationId: string,
    messageId: string
  ): Promise<CompressedImage | null> {
    try {
      const image = await pickImage("gallery");
      if (!image) return null;

      const imageUrl = await this.uploadMessageImage(
        conversationId,
        messageId,
        image.uri
      );

      return {
        uri: imageUrl,
        width: image.width,
        height: image.height,
      };
    } catch (error) {
      throw handleFirebaseError(error);
    }
  },

  async uploadProfileImage(userId: string, imageUri: string): Promise<string> {
    try {
      const response = await fetch(imageUri);
      const blob = await response.blob();

      const storageRef = ref(storage, `profiles/${userId}/avatar.jpg`);
      await uploadBytes(storageRef, blob);

      const downloadURL = await getDownloadURL(storageRef);
      return downloadURL;
    } catch (error) {
      throw handleFirebaseError(error);
    }
  },

  async uploadMessageImage(
    conversationId: string,
    messageId: string,
    imageUri: string
  ): Promise<string> {
    try {
      const response = await fetch(imageUri);
      const blob = await response.blob();

      const storageRef = ref(
        storage,
        `messages/${conversationId}/${messageId}.jpg`
      );
      await uploadBytes(storageRef, blob);

      const downloadURL = await getDownloadURL(storageRef);
      return downloadURL;
    } catch (error) {
      throw handleFirebaseError(error);
    }
  },

  async uploadGroupImage(
    conversationId: string,
    imageUri: string
  ): Promise<string> {
    try {
      const response = await fetch(imageUri);
      const blob = await response.blob();

      const storageRef = ref(storage, `groups/${conversationId}/photo.jpg`);
      await uploadBytes(storageRef, blob);

      const downloadURL = await getDownloadURL(storageRef);
      return downloadURL;
    } catch (error) {
      throw handleFirebaseError(error);
    }
  },

  async selectImage(
    source: "camera" | "gallery" = "gallery"
  ): Promise<CompressedImage | null> {
    try {
      return await pickImage(source);
    } catch (error) {
      throw handleFirebaseError(error);
    }
  },
};
