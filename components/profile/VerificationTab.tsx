// components/profile/VerificationTab.tsx
import { SUBMIT_VERIFICATION_DOCUMENT } from "@/assets/graphql/mutations/verification";
import { MY_VERIFICATION_DOCUMENTS } from "@/assets/graphql/queries/verification";
import {
  generateDocumentS3Key,
  uploadToS3,
  validateDocument,
} from "@/assets/lib/s3-upload";
import { useAuthStore } from "@/assets/store/authStore";
import {
  DocumentType,
  VerificationDocument,
  VerificationStatus,
} from "@/assets/types/verification";
import { useMutation, useQuery } from "@apollo/client";
import * as DocumentPicker from "expo-document-picker";
import { AlertCircle, FileText, Upload } from "lucide-react-native";
import React, { useEffect, useState } from "react";
import {
  ActivityIndicator,
  Alert,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { Badge, Card } from "../common";
import DocumentUploadModal from "./DocumentUploadModal";

export function VerificationTab() {
  const { user, setUser } = useAuthStore();
  const [uploadLoading, setUploadLoading] = useState<DocumentType | null>(null);
  const [modalVisible, setModalVisible] = useState(false);
  const [selectedDocumentType, setSelectedDocumentType] =
    useState<DocumentType | null>(null);

  const { loading, error, data, refetch } = useQuery(
    MY_VERIFICATION_DOCUMENTS,
    {
      fetchPolicy: "cache-and-network",
    }
  );

  useEffect(() => {
    if (data?.myVerificationDocuments) {
      setUser({
        ...user,
        verificationDocuments: data.myVerificationDocuments,
      });
    }
  }, [data, setUser]);

  const [submitDocument] = useMutation(SUBMIT_VERIFICATION_DOCUMENT, {
    onCompleted: (data) => {
      refetch();
      Alert.alert("Success", "Document submitted successfully!");
    },
    onError: (error) => {
      Alert.alert("Error", error.message || "Failed to submit document");
    },
  });

  const handleDocumentUpload = async (
    documentType: DocumentType,
    documentNumber: string
  ) => {
    try {
      if (!documentNumber.trim()) {
        Alert.alert("Error", "Please enter a document number");
        return;
      }

      setUploadLoading(documentType);

      const result = await DocumentPicker.getDocumentAsync({
        type: ["image/*", "application/pdf"],
        copyToCacheDirectory: true,
      });

      if (result.canceled) {
        setUploadLoading(null);
        return;
      }

      if (result.assets && result.assets[0]) {
        const asset = result.assets[0];

        const file = {
          uri: asset.uri,
          name: asset.name,
          type: asset.mimeType || "application/octet-stream",
          size: asset.size,
        };

        validateDocument(file); // Will throw if invalid

        const s3Key = generateDocumentS3Key(file.name);
        const s3Url = await uploadToS3(file, s3Key);

        await submitDocument({
          variables: {
            input: {
              documentType,
              documentNumber,
              documentUrl: s3Url,
            },
          },
        });

        setModalVisible(false);
      }
    } catch (error) {
      console.error("Upload error:", error);
      Alert.alert(
        "Error",
        error instanceof Error ? error.message : "Failed to upload document"
      );
    } finally {
      setUploadLoading(null);
    }
  };

  const verificationDocuments = data?.myVerificationDocuments || [];

  const hasDocumentType = (type: DocumentType) => {
    return verificationDocuments.some(
      (doc: VerificationDocument) => doc.documentType === type
    );
  };

  const formatDate = (dateString: string | Date) => {
    try {
      return new Date(dateString).toLocaleDateString();
    } catch (error) {
      console.log("Invalid date", error);

      return "Invalid date";
    }
  };

  const openUploadModal = (documentType: DocumentType) => {
    setSelectedDocumentType(documentType);
    setModalVisible(true);
  };

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#3b82f6" />
        <Text style={styles.loadingText}>Loading verification data...</Text>
      </View>
    );
  }

  if (error) {
    return (
      <Card>
        <View style={styles.errorContainer}>
          <AlertCircle size={24} color="#ef4444" />
          <Text style={styles.errorText}>
            Failed to load verification documents. Please try again later.
          </Text>
        </View>
      </Card>
    );
  }

  return (
    <ScrollView showsVerticalScrollIndicator={false}>
      <Card>
        <Text style={styles.cardTitle}>Identity Verification</Text>
        <Text style={styles.cardDescription}>
          Verify your identity to unlock all features of the platform
        </Text>

        <View style={styles.verificationItems}>
          <VerificationItem
            title="ID Verification"
            description="Upload a government-issued ID card"
            isVerified={hasDocumentType(DocumentType.NATIONAL_ID)}
            isLoading={uploadLoading === DocumentType.NATIONAL_ID}
            onUpload={() => openUploadModal(DocumentType.NATIONAL_ID)}
          />

          <VerificationItem
            title="Address Verification"
            description="Upload a utility bill or bank statement"
            isVerified={hasDocumentType(DocumentType.UTILITY_BILL)}
            isLoading={uploadLoading === DocumentType.UTILITY_BILL}
            onUpload={() => openUploadModal(DocumentType.UTILITY_BILL)}
          />
        </View>

        {verificationDocuments.length > 0 && (
          <SubmittedDocuments
            documents={verificationDocuments}
            formatDate={formatDate}
          />
        )}
      </Card>

      <DocumentUploadModal
        visible={modalVisible}
        onClose={() => setModalVisible(false)}
        onSubmit={handleDocumentUpload}
        documentType={selectedDocumentType}
        isLoading={uploadLoading !== null}
      />
    </ScrollView>
  );
}

interface VerificationItemProps {
  title: string;
  description: string;
  isVerified: boolean;
  isLoading: boolean;
  onUpload: () => void;
}

function VerificationItem({
  title,
  description,
  isVerified,
  isLoading,
  onUpload,
}: VerificationItemProps) {
  return (
    <View style={styles.verificationItem}>
      <View style={styles.verificationItemLeft}>
        <View style={styles.iconContainer}>
          <FileText size={20} color="#64748b" />
        </View>
        <View style={styles.verificationItemContent}>
          <Text style={styles.verificationItemTitle}>{title}</Text>
          <Text style={styles.verificationItemDescription}>{description}</Text>
        </View>
      </View>

      <View style={styles.verificationItemRight}>
        {isVerified ? (
          <Badge variant="success" text="Verified" />
        ) : (
          <TouchableOpacity
            style={styles.uploadButton}
            onPress={onUpload}
            disabled={isLoading}
            activeOpacity={0.7}
          >
            {isLoading ? (
              <ActivityIndicator size="small" color="#ffffff" />
            ) : (
              <>
                <Upload size={16} color="#ffffff" />
                <Text style={styles.uploadButtonText}>Upload</Text>
              </>
            )}
          </TouchableOpacity>
        )}
      </View>
    </View>
  );
}

interface SubmittedDocumentsProps {
  documents: VerificationDocument[];
  formatDate: (date: string | Date) => string;
}

function SubmittedDocuments({
  documents,
  formatDate,
}: SubmittedDocumentsProps) {
  return (
    <View style={styles.submittedDocuments}>
      <Text style={styles.submittedDocumentsTitle}>Submitted Documents</Text>
      {documents.map((doc) => (
        <View key={doc.id} style={styles.submittedDocumentItem}>
          <View>
            <Text style={styles.submittedDocumentType}>
              {doc.documentType.replace(/_/g, " ")}
            </Text>
            <Text style={styles.submittedDocumentDate}>
              Submitted on {formatDate(doc.submittedAt)}
            </Text>
          </View>
          <Badge
            variant={
              doc.verificationStatus === VerificationStatus.APPROVED
                ? "success"
                : doc.verificationStatus === VerificationStatus.REJECTED
                ? "destructive"
                : "outline"
            }
            text={doc.verificationStatus}
          />
        </View>
      ))}
    </View>
  );
}

const styles = StyleSheet.create({
  loadingContainer: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: 40,
  },
  loadingText: {
    marginTop: 12,
    fontSize: 16,
    color: "#64748b",
  },
  errorContainer: {
    flexDirection: "row",
    alignItems: "center",
    padding: 16,
    backgroundColor: "#fef2f2",
    borderRadius: 8,
    borderWidth: 1,
    borderColor: "#fecaca",
  },
  errorText: {
    flex: 1,
    marginLeft: 12,
    fontSize: 14,
    color: "#dc2626",
  },
  cardTitle: {
    fontSize: 20,
    fontWeight: "700",
    color: "#0f172a",
    marginBottom: 4,
  },
  cardDescription: {
    fontSize: 14,
    color: "#64748b",
    marginBottom: 24,
  },
  verificationItems: {
    marginBottom: 24,
  },
  verificationItem: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    padding: 16,
    borderWidth: 1,
    borderColor: "#e2e8f0",
    borderRadius: 12,
    marginBottom: 12,
    backgroundColor: "#fafafa",
  },
  verificationItemLeft: {
    flexDirection: "row",
    alignItems: "center",
    flex: 1,
  },
  iconContainer: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: "#f1f5f9",
    alignItems: "center",
    justifyContent: "center",
    marginRight: 12,
  },
  verificationItemContent: {
    flex: 1,
  },
  verificationItemTitle: {
    fontSize: 16,
    fontWeight: "600",
    color: "#0f172a",
    marginBottom: 2,
  },
  verificationItemDescription: {
    fontSize: 14,
    color: "#64748b",
  },
  verificationItemRight: {
    marginLeft: 12,
  },
  uploadButton: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 16,
    paddingVertical: 8,
    backgroundColor: "#3b82f6",
    borderRadius: 8,
  },
  uploadButtonText: {
    fontSize: 14,
    fontWeight: "600",
    color: "#ffffff",
    marginLeft: 4,
  },
  submittedDocuments: {
    marginTop: 24,
    paddingTop: 24,
    borderTopWidth: 1,
    borderTopColor: "#e2e8f0",
  },
  submittedDocumentsTitle: {
    fontSize: 16,
    fontWeight: "600",
    color: "#0f172a",
    marginBottom: 16,
  },
  submittedDocumentItem: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    padding: 12,
    borderWidth: 1,
    borderColor: "#e2e8f0",
    borderRadius: 8,
    marginBottom: 8,
    backgroundColor: "#ffffff",
  },
  submittedDocumentType: {
    fontSize: 14,
    fontWeight: "600",
    color: "#0f172a",
    textTransform: "capitalize",
  },
  submittedDocumentDate: {
    fontSize: 12,
    color: "#64748b",
    marginTop: 2,
  },
});
