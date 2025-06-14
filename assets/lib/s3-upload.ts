// src/lib/s3-upload.ts

import AsyncStorage from "@react-native-async-storage/async-storage";
import * as FileSystem from "expo-file-system";

// Type for file info used in React Native
interface RNFile {
  uri: string;
  name: string;
  type: string;
  size?: number;
}

export async function getPresignedUploadUrl(
  key: string,
  contentType: string
): Promise<string> {
  try {
    const token = await AsyncStorage.getItem("token");

    const response = await fetch(
      `${process.env.NEXT_PUBLIC_API_URL}/api/upload/s3`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ key, contentType }),
      }
    );

    if (!response.ok) {
      throw new Error("Failed to get presigned URL");
    }

    const { url } = await response.json();
    return url;
  } catch (error) {
    console.error("Error getting presigned URL:", error);
    throw error;
  }
}

export async function uploadToS3(file: RNFile, s3Key: string): Promise<string> {
  try {
    const presignedUrl = await getPresignedUploadUrl(s3Key, file.type);

    const fileData = await FileSystem.readAsStringAsync(file.uri, {
      encoding: FileSystem.EncodingType.Base64,
    });

    const uploadResponse = await fetch(presignedUrl, {
      method: "PUT",
      headers: {
        "Content-Type": file.type,
      },
      body: Buffer.from(fileData, "base64"),
    });

    if (!uploadResponse.ok) {
      throw new Error("Failed to upload file to S3");
    }

    return presignedUrl;
  } catch (error) {
    console.error("Upload error:", error);
    throw error;
  }
}

// Generate keys
export function generateS3Key(fileName: string) {
  const timestamp = Date.now();
  const randomString = Math.random().toString(36).substring(2, 8);
  return `profile-images/${timestamp}-${randomString}-${fileName}`;
}

export function generateDocumentS3Key(fileName: string) {
  const timestamp = Date.now();
  const randomString = Math.random().toString(36).substring(2, 8);
  return `documents/${timestamp}-${randomString}-${fileName}`;
}

// Validate image
export function validateImage(file: RNFile): boolean {
  const allowedTypes = [
    "image/jpeg",
    "image/jpg",
    "image/png",
    "image/webp",
    "image/gif",
  ];
  const maxSize = 5 * 1024 * 1024; // 5MB

  if (!allowedTypes.includes(file.type)) {
    throw new Error("Only JPEG, PNG, WebP and GIF images are allowed");
  }

  if (file.size && file.size > maxSize) {
    throw new Error("Image size must be less than 5MB");
  }

  return true;
}

// Validate documents
export function validateDocument(file: RNFile): boolean {
  const allowedTypes = [
    "application/pdf",
    "application/msword",
    "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
    "application/vnd.ms-excel",
    "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
    "text/plain",
    "text/csv",
  ];
  const maxSize = 10 * 1024 * 1024; // 10MB

  if (!allowedTypes.includes(file.type)) {
    throw new Error("Only PDF, Word, Excel, and text files are allowed");
  }

  if (file.size && file.size > maxSize) {
    throw new Error("Document size must be less than 10MB");
  }

  return true;
}
