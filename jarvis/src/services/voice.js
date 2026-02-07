import * as Speech from 'expo-speech';
import { Audio } from 'expo-av';
import { Platform } from 'react-native';

// Voice recognition state
let isListening = false;
let recognitionCallbacks = {};

// Request microphone permissions
export const requestPermissions = async () => {
  const { status } = await Audio.requestPermissionsAsync();
  return status === 'granted';
};

// Configure audio session for voice
export const configureAudio = async () => {
  await Audio.setAudioModeAsync({
    allowsRecordingIOS: true,
    playsInSilentModeIOS: true,
    staysActiveInBackground: false,
    shouldDuckAndroid: true,
  });
};

// Speech-to-Text using device recording + a simple approach
// For production, integrate Whisper API or @react-native-voice/voice
let recording = null;

export const startListening = async (onResult, onPartial, onError) => {
  try {
    const hasPermission = await requestPermissions();
    if (!hasPermission) {
      onError?.('Microphone permission denied');
      return false;
    }

    await configureAudio();

    // Use native voice recognition if available (via @react-native-voice/voice)
    // Falls back to recording for Whisper API processing
    try {
      const Voice = require('@react-native-voice/voice').default;
      Voice.onSpeechResults = (e) => {
        if (e.value && e.value[0]) {
          onResult(e.value[0]);
        }
      };
      Voice.onSpeechPartialResults = (e) => {
        if (e.value && e.value[0]) {
          onPartial?.(e.value[0]);
        }
      };
      Voice.onSpeechError = (e) => {
        onError?.(e.error?.message || 'Speech recognition error');
      };
      await Voice.start('en-US');
      isListening = true;
      return true;
    } catch {
      // @react-native-voice/voice not available, use recording fallback
      console.log('Native voice not available, using recording mode');
    }

    // Fallback: Record audio for manual processing
    recording = new Audio.Recording();
    await recording.prepareToRecordAsync(
      Audio.RecordingOptionsPresets.HIGH_QUALITY
    );
    await recording.startAsync();
    isListening = true;
    return true;
  } catch (error) {
    onError?.(error.message);
    return false;
  }
};

export const stopListening = async () => {
  isListening = false;

  try {
    const Voice = require('@react-native-voice/voice').default;
    await Voice.stop();
    return null;
  } catch {
    // Using recording fallback
  }

  if (recording) {
    try {
      await recording.stopAndUnloadAsync();
      const uri = recording.getURI();
      recording = null;
      return uri; // Return audio file URI for Whisper processing
    } catch (error) {
      recording = null;
      return null;
    }
  }
  return null;
};

export const getIsListening = () => isListening;

// Text-to-Speech - uses the fastest native TTS engine
export const speak = (text, options = {}) => {
  return new Promise((resolve, reject) => {
    Speech.speak(text, {
      language: 'en-US',
      pitch: 1.0,
      rate: Platform.OS === 'ios' ? 0.52 : 0.95,
      voice: Platform.OS === 'ios' ? 'com.apple.voice.compact.en-US.Samantha' : undefined,
      onDone: resolve,
      onError: reject,
      onStopped: resolve,
      ...options,
    });
  });
};

export const stopSpeaking = () => {
  Speech.stop();
};

export const isSpeaking = async () => {
  return Speech.isSpeakingAsync();
};

// Speak with sentence chunking for faster perceived response
export const speakStreaming = async (text) => {
  const sentences = text.match(/[^.!?]+[.!?]+/g) || [text];
  for (const sentence of sentences) {
    const trimmed = sentence.trim();
    if (trimmed) {
      await speak(trimmed);
    }
  }
};
