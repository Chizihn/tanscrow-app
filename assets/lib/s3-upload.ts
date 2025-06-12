// src/lib/s3-upload.ts

import AsyncStorage from "@react-native-async-storage/async-storage";

export async function getPresignedUploadUrl(
  key: string,
  contentType: string,
  file: File
) {
  try {
    const token = await AsyncStorage.getItem("token");
    // First, get the presigned URL from our backend API
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

    // Now use the presigned URL to upload the file
    const uploadResponse = await fetch(url, {
      method: "PUT",
      headers: {
        "Content-Type": contentType,
      },
      body: await file.arrayBuffer(),
    });

    if (!uploadResponse.ok) {
      throw new Error("Failed to upload file");
    }

    return url;
  } catch (error) {
    console.error("Error uploading file:", error);
    throw error;
  }
}

// For profile images
export function generateS3Key(fileName: string) {
  const timestamp = Date.now();
  const randomString = Math.random().toString(36).substring(2, 8);
  return `profile-images/${timestamp}-${randomString}-${fileName}`;
}

// For documents
export function generateDocumentS3Key(fileName: string) {
  const timestamp = Date.now();
  const randomString = Math.random().toString(36).substring(2, 8);
  return `documents/${timestamp}-${randomString}-${fileName}`;
}

// Validate image files
export function validateImage(file: File): boolean {
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

  if (file.size > maxSize) {
    throw new Error("Image size must be less than 5MB");
  }

  return true;
}

// Validate document files
export function validateDocument(file: File): boolean {
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

  if (file.size > maxSize) {
    throw new Error("Document size must be less than 10MB");
  }

  return true;
}

// Upload any file to S3
export async function uploadToS3(file: File, s3Key: string): Promise<string> {
  try {
    // Get the presigned URL and upload the file in one go
    const url = await getPresignedUploadUrl(s3Key, file.type, file);

    // The URL returned from getPresignedUploadUrl is the S3 URL
    return url;
  } catch (error) {
    console.error("Upload error:", error);
    throw error;
  }
}
