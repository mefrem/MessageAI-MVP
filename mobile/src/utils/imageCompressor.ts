import * as ImagePicker from "expo-image-picker";
import { IMAGE_MAX_WIDTH, IMAGE_COMPRESSION_QUALITY } from "@messageai/shared";

export interface CompressedImage {
  uri: string;
  width: number;
  height: number;
}

export const pickImage = async (
  source: "camera" | "gallery"
): Promise<CompressedImage | null> => {
  // Request permissions
  const permissionResult =
    source === "camera"
      ? await ImagePicker.requestCameraPermissionsAsync()
      : await ImagePicker.requestMediaLibraryPermissionsAsync();

  if (!permissionResult.granted) {
    throw new Error("Permission to access camera/gallery is required");
  }

  // Launch picker with compression settings
  const result =
    source === "camera"
      ? await ImagePicker.launchCameraAsync({
          mediaTypes: ImagePicker.MediaTypeOptions.Images,
          allowsEditing: true,
          aspect: [4, 3],
          quality: IMAGE_COMPRESSION_QUALITY,
        })
      : await ImagePicker.launchImageLibraryAsync({
          mediaTypes: ImagePicker.MediaTypeOptions.Images,
          allowsEditing: true,
          aspect: [4, 3],
          quality: IMAGE_COMPRESSION_QUALITY,
        });

  if (result.canceled) {
    return null;
  }

  const asset = result.assets[0];

  return {
    uri: asset.uri,
    width: asset.width || IMAGE_MAX_WIDTH,
    height: asset.height || IMAGE_MAX_WIDTH,
  };
};

export const getImageDimensions = (
  width: number,
  height: number
): { width: number; height: number } => {
  if (width <= IMAGE_MAX_WIDTH) {
    return { width, height };
  }

  const aspectRatio = height / width;
  return {
    width: IMAGE_MAX_WIDTH,
    height: Math.round(IMAGE_MAX_WIDTH * aspectRatio),
  };
};
