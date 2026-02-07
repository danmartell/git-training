# Jarvis

Voice-powered Claude AI assistant with Apple-inspired design.

## Quick Start

```bash
cd jarvis
npm install
npx expo start
```

Scan the QR code with Expo Go (iOS/Android) to run on your device.

## Features

- **Voice Input** — Tap the orb and speak naturally
- **Claude AI** — Powered by Claude Sonnet for fast, intelligent responses
- **Voice Output** — Responses are spoken aloud using native TTS
- **Streaming** — Real-time response streaming for low latency
- **Apple Design** — Dark mode, glass morphism, smooth animations
- **Conversation History** — Full chat view with message bubbles

## Tech Stack

- React Native + Expo
- Claude API (Anthropic)
- expo-speech (TTS)
- @react-native-voice/voice (STT)
- expo-haptics (tactile feedback)
- Reanimated (animations)

## API Key

Add your Claude API key via the Settings gear icon in the app, or set it in `src/services/claude.js`.

Get your key at: https://console.anthropic.com/settings/keys

## Building for Production

```bash
# iOS
npx expo run:ios

# Android
npx expo run:android
```
