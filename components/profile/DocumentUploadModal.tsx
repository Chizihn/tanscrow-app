import React from 'react';
import {
  Modal,
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  ActivityIndicator,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';

import { DocumentType } from "@/assets/types/verification";

interface DocumentUploadModalProps {
  visible: boolean;
  onClose: () => void;
  onSubmit: (documentType: DocumentType, documentNumber: string) => void;
  documentType: DocumentType | null;
  isLoading: boolean;
}

export default function DocumentUploadModal({
  visible,
  onClose,
  onSubmit,
  documentType,
  isLoading,
}: DocumentUploadModalProps) {
  const [documentNumber, setDocumentNumber] = React.useState('');

  const handleSubmit = () => {
    if (documentType) {
      onSubmit(documentType, documentNumber);
    }
  };

  if (!documentType) return null;

  return (
    <Modal
      visible={visible}
      transparent
      animationType="slide"
      onRequestClose={onClose}
    >
      <View style={styles.overlay}>
        <View style={styles.modalContent}>
          <View style={styles.header}>
            <TouchableOpacity onPress={onClose} style={styles.closeButton}>
              <Ionicons name="close" size={24} color="#64748b" />
            </TouchableOpacity>
            <Text style={styles.title}>Upload Document</Text>
          </View>

          <View style={styles.form}>
            <Text style={styles.label}>Document Number</Text>
            <TextInput
              style={styles.input}
              placeholder="Enter document number"
              value={documentNumber}
              onChangeText={setDocumentNumber}
              keyboardType="default"
            />

            <TouchableOpacity
              style={[
                styles.button,
                isLoading && styles.buttonDisabled,
              ]}
              onPress={handleSubmit}
              disabled={isLoading}
            >
              {isLoading ? (
                <ActivityIndicator color="white" />
              ) : (
                <Text style={styles.buttonText}>Upload Document</Text>
              )}
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalContent: {
    backgroundColor: 'white',
    borderRadius: 12,
    padding: 20,
    width: '90%',
    maxWidth: 400,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 20,
  },
  closeButton: {
    padding: 8,
  },
  title: {
    fontSize: 20,
    fontWeight: '600',
    color: '#1e293b',
  },
  form: {
    width: '100%',
  },
  label: {
    fontSize: 14,
    color: '#475569',
    marginBottom: 8,
  },
  input: {
    backgroundColor: '#f8fafc',
    borderRadius: 8,
    padding: 12,
    marginBottom: 20,
    fontSize: 16,
  },
  button: {
    backgroundColor: '#3b82f6',
    borderRadius: 8,
    padding: 12,
    alignItems: 'center',
  },
  buttonDisabled: {
    backgroundColor: '#cbd5e1',
  },
  buttonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: '600',
  },
});
