import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  Modal,
  KeyboardAvoidingView,
  Platform,
} from 'react-native';
import { BlurView } from 'expo-blur';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Colors, Typography, BorderRadius, Spacing, Shadows } from '../theme';
import { setApiKey, getApiKey } from '../services/claude';

const API_KEY_STORAGE = '@jarvis_api_key';

const SettingsModal = ({ visible, onClose }) => {
  const [key, setKey] = useState('');
  const [saved, setSaved] = useState(false);

  useEffect(() => {
    if (visible) {
      loadKey();
      setSaved(false);
    }
  }, [visible]);

  const loadKey = async () => {
    try {
      const storedKey = await AsyncStorage.getItem(API_KEY_STORAGE);
      if (storedKey) {
        setKey(storedKey);
      }
    } catch {}
  };

  const saveKey = async () => {
    try {
      await AsyncStorage.setItem(API_KEY_STORAGE, key);
      setApiKey(key);
      setSaved(true);
      setTimeout(() => onClose(), 800);
    } catch {}
  };

  const maskKey = (k) => {
    if (k.length <= 12) return k;
    return k.slice(0, 8) + '...' + k.slice(-4);
  };

  return (
    <Modal visible={visible} transparent animationType="fade">
      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        style={styles.overlay}
      >
        <TouchableOpacity
          style={styles.backdrop}
          activeOpacity={1}
          onPress={onClose}
        />
        <View style={styles.modal}>
          <View style={styles.handle} />
          <Text style={styles.title}>Settings</Text>

          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Claude API Key</Text>
            <Text style={styles.sectionDesc}>
              Get your key from console.anthropic.com
            </Text>
            <View style={styles.inputContainer}>
              <TextInput
                style={styles.input}
                value={key}
                onChangeText={setKey}
                placeholder="sk-ant-..."
                placeholderTextColor={Colors.textTertiary}
                secureTextEntry
                autoCapitalize="none"
                autoCorrect={false}
              />
            </View>
          </View>

          <TouchableOpacity
            style={[styles.saveButton, saved && styles.savedButton]}
            onPress={saveKey}
            disabled={!key.trim()}
          >
            <Text style={styles.saveButtonText}>
              {saved ? 'Saved' : 'Save API Key'}
            </Text>
          </TouchableOpacity>

          <TouchableOpacity style={styles.cancelButton} onPress={onClose}>
            <Text style={styles.cancelButtonText}>Cancel</Text>
          </TouchableOpacity>
        </View>
      </KeyboardAvoidingView>
    </Modal>
  );
};

// Load API key on app start
export const loadStoredApiKey = async () => {
  try {
    const storedKey = await AsyncStorage.getItem(API_KEY_STORAGE);
    if (storedKey) {
      setApiKey(storedKey);
      return true;
    }
    return false;
  } catch {
    return false;
  }
};

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    justifyContent: 'flex-end',
  },
  backdrop: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'rgba(0, 0, 0, 0.6)',
  },
  modal: {
    backgroundColor: Colors.backgroundElevated,
    borderTopLeftRadius: BorderRadius.xl,
    borderTopRightRadius: BorderRadius.xl,
    paddingHorizontal: Spacing.lg,
    paddingBottom: Spacing.xxl,
    paddingTop: Spacing.md,
    ...Shadows.large,
  },
  handle: {
    width: 36,
    height: 5,
    borderRadius: 2.5,
    backgroundColor: Colors.backgroundTertiary,
    alignSelf: 'center',
    marginBottom: Spacing.lg,
  },
  title: {
    ...Typography.title2,
    marginBottom: Spacing.lg,
  },
  section: {
    marginBottom: Spacing.lg,
  },
  sectionTitle: {
    ...Typography.headline,
    marginBottom: Spacing.xs,
  },
  sectionDesc: {
    ...Typography.subhead,
    marginBottom: Spacing.md,
  },
  inputContainer: {
    backgroundColor: Colors.backgroundSecondary,
    borderRadius: BorderRadius.md,
    borderWidth: 0.5,
    borderColor: Colors.glassBorder,
  },
  input: {
    ...Typography.body,
    padding: Spacing.md,
    color: Colors.textPrimary,
  },
  saveButton: {
    backgroundColor: Colors.primary,
    borderRadius: BorderRadius.md,
    paddingVertical: Spacing.md,
    alignItems: 'center',
    marginBottom: Spacing.sm,
  },
  savedButton: {
    backgroundColor: Colors.success,
  },
  saveButtonText: {
    ...Typography.headline,
    color: '#FFFFFF',
  },
  cancelButton: {
    paddingVertical: Spacing.md,
    alignItems: 'center',
  },
  cancelButtonText: {
    ...Typography.headline,
    color: Colors.primary,
  },
});

export default SettingsModal;
