import React, { useState, useRef, useEffect, useCallback } from 'react';
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  TouchableOpacity,
  Animated,
  StatusBar,
  Platform,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import * as Haptics from 'expo-haptics';
import { Colors, Typography, Spacing, Shadows, BorderRadius } from '../theme';
import VoiceOrb from '../components/VoiceOrb';
import MessageBubble from '../components/MessageBubble';
import SettingsModal from '../components/SettingsModal';
import { sendMessage, getApiKey } from '../services/claude';
import { startListening, stopListening, speak, stopSpeaking } from '../services/voice';

const HomeScreen = () => {
  const [messages, setMessages] = useState([]);
  const [isListening, setIsListening] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);
  const [isSpeaking, setIsSpeaking] = useState(false);
  const [partialText, setPartialText] = useState('');
  const [showSettings, setShowSettings] = useState(false);
  const [showChat, setShowChat] = useState(false);
  const [statusText, setStatusText] = useState('Tap to speak');
  const flatListRef = useRef(null);
  const headerOpacity = useRef(new Animated.Value(1)).current;

  // Check for API key on mount
  useEffect(() => {
    if (!getApiKey()) {
      setStatusText('Set API key in Settings');
    }
  }, [showSettings]);

  const scrollToBottom = useCallback(() => {
    if (flatListRef.current && messages.length > 0) {
      setTimeout(() => {
        flatListRef.current?.scrollToEnd({ animated: true });
      }, 100);
    }
  }, [messages.length]);

  useEffect(() => {
    scrollToBottom();
  }, [messages, scrollToBottom]);

  const handleVoicePress = async () => {
    if (!getApiKey()) {
      setShowSettings(true);
      return;
    }

    if (isSpeaking) {
      stopSpeaking();
      setIsSpeaking(false);
      setStatusText('Tap to speak');
      return;
    }

    if (isListening) {
      // Stop listening and process
      setIsListening(false);
      setStatusText('Thinking...');
      Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);

      await stopListening();

      // Use the partial text captured during listening
      if (partialText.trim()) {
        await processUserInput(partialText.trim());
      } else {
        setStatusText('Tap to speak');
      }
      setPartialText('');
    } else {
      // Start listening
      Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Heavy);
      setIsListening(true);
      setStatusText('Listening...');
      setPartialText('');

      const started = await startListening(
        // onResult - final result
        (text) => {
          setPartialText(text);
          setIsListening(false);
          setStatusText('Thinking...');
          processUserInput(text);
        },
        // onPartial
        (text) => {
          setPartialText(text);
        },
        // onError
        (error) => {
          console.log('Voice error:', error);
          setIsListening(false);
          setStatusText('Tap to speak');
        }
      );

      if (!started) {
        setIsListening(false);
        setStatusText('Mic permission needed');
      }
    }
  };

  const processUserInput = async (text) => {
    const userMessage = {
      id: Date.now().toString(),
      role: 'user',
      content: text,
      timestamp: Date.now(),
    };

    const updatedMessages = [...messages, userMessage];
    setMessages(updatedMessages);
    setIsProcessing(true);
    setShowChat(true);

    try {
      // Build conversation history for Claude
      const conversationHistory = updatedMessages.map((m) => ({
        role: m.role,
        content: m.content,
      }));

      const response = await sendMessage(conversationHistory);

      const assistantMessage = {
        id: (Date.now() + 1).toString(),
        role: 'assistant',
        content: response,
        timestamp: Date.now(),
      };

      setMessages((prev) => [...prev, assistantMessage]);
      setIsProcessing(false);

      // Speak the response
      setIsSpeaking(true);
      setStatusText('Speaking...');
      Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);

      await speak(response);
      setIsSpeaking(false);
      setStatusText('Tap to speak');
    } catch (error) {
      setIsProcessing(false);
      setStatusText('Error - tap to retry');
      console.error('Claude API error:', error);

      const errorMessage = {
        id: (Date.now() + 1).toString(),
        role: 'assistant',
        content: `Sorry, I encountered an error: ${error.message}`,
        timestamp: Date.now(),
      };
      setMessages((prev) => [...prev, errorMessage]);
    }
  };

  const clearConversation = () => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    setMessages([]);
    setShowChat(false);
    setStatusText('Tap to speak');
    stopSpeaking();
  };

  const renderMessage = ({ item, index }) => (
    <MessageBubble
      message={item}
      isLast={index === messages.length - 1}
    />
  );

  return (
    <SafeAreaView style={styles.container} edges={['top']}>
      <StatusBar barStyle="light-content" />

      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity
          style={styles.headerButton}
          onPress={clearConversation}
        >
          <Ionicons
            name="refresh"
            size={22}
            color={messages.length > 0 ? Colors.textSecondary : 'transparent'}
          />
        </TouchableOpacity>

        <View style={styles.headerCenter}>
          <Text style={styles.headerTitle}>Jarvis</Text>
          <View style={styles.statusDot} />
        </View>

        <TouchableOpacity
          style={styles.headerButton}
          onPress={() => setShowSettings(true)}
        >
          <Ionicons name="settings-outline" size={22} color={Colors.textSecondary} />
        </TouchableOpacity>
      </View>

      {/* Chat area or empty state */}
      {showChat && messages.length > 0 ? (
        <FlatList
          ref={flatListRef}
          data={messages}
          renderItem={renderMessage}
          keyExtractor={(item) => item.id}
          style={styles.chatList}
          contentContainerStyle={styles.chatContent}
          showsVerticalScrollIndicator={false}
          onContentSizeChange={scrollToBottom}
        />
      ) : (
        <View style={styles.emptyState}>
          <Text style={styles.greeting}>Hello.</Text>
          <Text style={styles.subtitle}>How can I help you today?</Text>
        </View>
      )}

      {/* Partial transcription */}
      {partialText ? (
        <View style={styles.transcriptionBar}>
          <Text style={styles.transcriptionText} numberOfLines={2}>
            {partialText}
          </Text>
        </View>
      ) : null}

      {/* Voice orb area */}
      <View style={styles.orbArea}>
        <Text style={styles.statusText}>{statusText}</Text>
        <VoiceOrb
          isListening={isListening}
          isProcessing={isProcessing}
          isSpeaking={isSpeaking}
          onPress={handleVoicePress}
        />
        <Text style={styles.hintText}>
          {isListening ? 'Tap to send' : isSpeaking ? 'Tap to stop' : ''}
        </Text>
      </View>

      {/* Settings */}
      <SettingsModal
        visible={showSettings}
        onClose={() => setShowSettings(false)}
      />
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.backgroundDark,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: Spacing.md,
    paddingVertical: Spacing.sm,
  },
  headerButton: {
    width: 40,
    height: 40,
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: BorderRadius.full,
  },
  headerCenter: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  headerTitle: {
    ...Typography.headline,
    fontSize: 18,
  },
  statusDot: {
    width: 7,
    height: 7,
    borderRadius: 3.5,
    backgroundColor: Colors.success,
  },
  chatList: {
    flex: 1,
  },
  chatContent: {
    paddingVertical: Spacing.sm,
    paddingBottom: Spacing.lg,
  },
  emptyState: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingBottom: 60,
  },
  greeting: {
    ...Typography.largeTitle,
    fontSize: 42,
    marginBottom: Spacing.sm,
  },
  subtitle: {
    ...Typography.title3,
    color: Colors.textSecondary,
    fontWeight: '400',
  },
  transcriptionBar: {
    marginHorizontal: Spacing.lg,
    marginBottom: Spacing.sm,
    paddingHorizontal: Spacing.md,
    paddingVertical: Spacing.sm,
    backgroundColor: Colors.glass,
    borderRadius: BorderRadius.lg,
    borderWidth: 0.5,
    borderColor: Colors.glassBorder,
  },
  transcriptionText: {
    ...Typography.callout,
    color: Colors.textSecondary,
    textAlign: 'center',
  },
  orbArea: {
    alignItems: 'center',
    paddingBottom: Platform.OS === 'ios' ? Spacing.lg : Spacing.xl,
  },
  statusText: {
    ...Typography.subhead,
    marginBottom: -Spacing.xl,
  },
  hintText: {
    ...Typography.caption1,
    color: Colors.textTertiary,
    marginTop: -Spacing.xl,
    height: 16,
  },
});

export default HomeScreen;
