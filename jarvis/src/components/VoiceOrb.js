import React, { useEffect, useRef } from 'react';
import { View, TouchableOpacity, StyleSheet, Animated, Easing } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { Colors, Shadows } from '../theme';

const ORB_SIZE = 140;
const RING_SIZE = ORB_SIZE + 30;

const VoiceOrb = ({ isListening, isProcessing, isSpeaking, onPress, disabled }) => {
  const pulseAnim = useRef(new Animated.Value(1)).current;
  const glowAnim = useRef(new Animated.Value(0.4)).current;
  const rotateAnim = useRef(new Animated.Value(0)).current;
  const ringScale1 = useRef(new Animated.Value(1)).current;
  const ringScale2 = useRef(new Animated.Value(1)).current;
  const ringOpacity1 = useRef(new Animated.Value(0)).current;
  const ringOpacity2 = useRef(new Animated.Value(0)).current;

  // Pulse animation when listening
  useEffect(() => {
    if (isListening) {
      const pulse = Animated.loop(
        Animated.sequence([
          Animated.timing(pulseAnim, {
            toValue: 1.15,
            duration: 800,
            easing: Easing.inOut(Easing.ease),
            useNativeDriver: true,
          }),
          Animated.timing(pulseAnim, {
            toValue: 1,
            duration: 800,
            easing: Easing.inOut(Easing.ease),
            useNativeDriver: true,
          }),
        ])
      );
      pulse.start();
      return () => pulse.stop();
    } else {
      Animated.timing(pulseAnim, {
        toValue: 1,
        duration: 300,
        useNativeDriver: true,
      }).start();
    }
  }, [isListening]);

  // Glow animation
  useEffect(() => {
    if (isListening || isSpeaking) {
      const glow = Animated.loop(
        Animated.sequence([
          Animated.timing(glowAnim, {
            toValue: 1,
            duration: 1200,
            easing: Easing.inOut(Easing.ease),
            useNativeDriver: true,
          }),
          Animated.timing(glowAnim, {
            toValue: 0.4,
            duration: 1200,
            easing: Easing.inOut(Easing.ease),
            useNativeDriver: true,
          }),
        ])
      );
      glow.start();
      return () => glow.stop();
    }
  }, [isListening, isSpeaking]);

  // Rotate gradient when processing
  useEffect(() => {
    if (isProcessing) {
      const rotate = Animated.loop(
        Animated.timing(rotateAnim, {
          toValue: 1,
          duration: 2000,
          easing: Easing.linear,
          useNativeDriver: true,
        })
      );
      rotate.start();
      return () => rotate.stop();
    } else {
      rotateAnim.setValue(0);
    }
  }, [isProcessing]);

  // Ripple rings when listening
  useEffect(() => {
    if (isListening) {
      const ripple1 = Animated.loop(
        Animated.parallel([
          Animated.timing(ringScale1, {
            toValue: 1.8,
            duration: 2000,
            easing: Easing.out(Easing.ease),
            useNativeDriver: true,
          }),
          Animated.sequence([
            Animated.timing(ringOpacity1, {
              toValue: 0.3,
              duration: 200,
              useNativeDriver: true,
            }),
            Animated.timing(ringOpacity1, {
              toValue: 0,
              duration: 1800,
              useNativeDriver: true,
            }),
          ]),
        ])
      );

      const ripple2 = Animated.loop(
        Animated.sequence([
          Animated.delay(700),
          Animated.parallel([
            Animated.timing(ringScale2, {
              toValue: 1.8,
              duration: 2000,
              easing: Easing.out(Easing.ease),
              useNativeDriver: true,
            }),
            Animated.sequence([
              Animated.timing(ringOpacity2, {
                toValue: 0.3,
                duration: 200,
                useNativeDriver: true,
              }),
              Animated.timing(ringOpacity2, {
                toValue: 0,
                duration: 1800,
                useNativeDriver: true,
              }),
            ]),
          ]),
        ])
      );

      ripple1.start();
      ripple2.start();
      return () => {
        ripple1.stop();
        ripple2.stop();
        ringScale1.setValue(1);
        ringScale2.setValue(1);
        ringOpacity1.setValue(0);
        ringOpacity2.setValue(0);
      };
    }
  }, [isListening]);

  const spin = rotateAnim.interpolate({
    inputRange: [0, 1],
    outputRange: ['0deg', '360deg'],
  });

  const gradientColors = isListening
    ? ['#FF2D55', '#FF6482', '#FF2D55']
    : isSpeaking
    ? ['#30D158', '#5AC8FA', '#30D158']
    : isProcessing
    ? ['#5856D6', '#AF52DE', '#5856D6']
    : Colors.orbGradient;

  return (
    <View style={styles.container}>
      {/* Ripple rings */}
      <Animated.View
        style={[
          styles.ring,
          {
            transform: [{ scale: ringScale1 }],
            opacity: ringOpacity1,
          },
        ]}
      />
      <Animated.View
        style={[
          styles.ring,
          {
            transform: [{ scale: ringScale2 }],
            opacity: ringOpacity2,
          },
        ]}
      />

      {/* Glow background */}
      <Animated.View
        style={[
          styles.glow,
          {
            opacity: glowAnim,
            backgroundColor: isListening
              ? 'rgba(255, 45, 85, 0.3)'
              : isSpeaking
              ? 'rgba(48, 209, 88, 0.3)'
              : Colors.orbGlow,
          },
        ]}
      />

      {/* Main orb */}
      <TouchableOpacity
        onPress={onPress}
        disabled={disabled}
        activeOpacity={0.8}
      >
        <Animated.View
          style={[
            styles.orbContainer,
            {
              transform: [{ scale: pulseAnim }, { rotate: isProcessing ? spin : '0deg' }],
            },
          ]}
        >
          <LinearGradient
            colors={gradientColors}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 1 }}
            style={styles.orb}
          >
            <View style={styles.orbInner}>
              {/* Mic icon representation */}
              <View style={styles.micContainer}>
                {isListening ? (
                  <View style={styles.waveContainer}>
                    {[...Array(5)].map((_, i) => (
                      <AnimatedBar key={i} index={i} isActive={isListening} />
                    ))}
                  </View>
                ) : isProcessing ? (
                  <View style={styles.dotsContainer}>
                    {[...Array(3)].map((_, i) => (
                      <AnimatedDot key={i} index={i} />
                    ))}
                  </View>
                ) : (
                  <View style={styles.micIcon}>
                    <View style={styles.micBody} />
                    <View style={styles.micBase} />
                    <View style={styles.micStand} />
                  </View>
                )}
              </View>
            </View>
          </LinearGradient>
        </Animated.View>
      </TouchableOpacity>
    </View>
  );
};

// Animated wave bar for listening state
const AnimatedBar = ({ index, isActive }) => {
  const height = useRef(new Animated.Value(8)).current;

  useEffect(() => {
    if (isActive) {
      const anim = Animated.loop(
        Animated.sequence([
          Animated.timing(height, {
            toValue: 16 + Math.random() * 24,
            duration: 200 + Math.random() * 300,
            easing: Easing.inOut(Easing.ease),
            useNativeDriver: false,
          }),
          Animated.timing(height, {
            toValue: 8,
            duration: 200 + Math.random() * 300,
            easing: Easing.inOut(Easing.ease),
            useNativeDriver: false,
          }),
        ])
      );
      anim.start();
      return () => anim.stop();
    }
  }, [isActive]);

  return (
    <Animated.View
      style={[
        styles.waveBar,
        {
          height,
          marginHorizontal: 2,
        },
      ]}
    />
  );
};

// Animated dot for processing state
const AnimatedDot = ({ index }) => {
  const opacity = useRef(new Animated.Value(0.3)).current;

  useEffect(() => {
    const anim = Animated.loop(
      Animated.sequence([
        Animated.delay(index * 200),
        Animated.timing(opacity, {
          toValue: 1,
          duration: 400,
          useNativeDriver: true,
        }),
        Animated.timing(opacity, {
          toValue: 0.3,
          duration: 400,
          useNativeDriver: true,
        }),
      ])
    );
    anim.start();
    return () => anim.stop();
  }, []);

  return (
    <Animated.View
      style={[styles.dot, { opacity }]}
    />
  );
};

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
    justifyContent: 'center',
    width: RING_SIZE * 2,
    height: RING_SIZE * 2,
  },
  ring: {
    position: 'absolute',
    width: ORB_SIZE,
    height: ORB_SIZE,
    borderRadius: ORB_SIZE / 2,
    borderWidth: 1.5,
    borderColor: Colors.primary,
  },
  glow: {
    position: 'absolute',
    width: ORB_SIZE + 60,
    height: ORB_SIZE + 60,
    borderRadius: (ORB_SIZE + 60) / 2,
  },
  orbContainer: {
    width: ORB_SIZE,
    height: ORB_SIZE,
    borderRadius: ORB_SIZE / 2,
    ...Shadows.large,
  },
  orb: {
    width: ORB_SIZE,
    height: ORB_SIZE,
    borderRadius: ORB_SIZE / 2,
    alignItems: 'center',
    justifyContent: 'center',
  },
  orbInner: {
    width: ORB_SIZE - 4,
    height: ORB_SIZE - 4,
    borderRadius: (ORB_SIZE - 4) / 2,
    backgroundColor: 'rgba(0, 0, 0, 0.15)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  micContainer: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  micIcon: {
    alignItems: 'center',
  },
  micBody: {
    width: 20,
    height: 32,
    borderRadius: 10,
    backgroundColor: 'rgba(255, 255, 255, 0.95)',
  },
  micBase: {
    width: 32,
    height: 16,
    borderBottomLeftRadius: 16,
    borderBottomRightRadius: 16,
    borderWidth: 2.5,
    borderTopWidth: 0,
    borderColor: 'rgba(255, 255, 255, 0.95)',
    backgroundColor: 'transparent',
    marginTop: -2,
  },
  micStand: {
    width: 2.5,
    height: 8,
    backgroundColor: 'rgba(255, 255, 255, 0.95)',
  },
  waveContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    height: 40,
  },
  waveBar: {
    width: 4,
    borderRadius: 2,
    backgroundColor: 'rgba(255, 255, 255, 0.95)',
  },
  dotsContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  dot: {
    width: 10,
    height: 10,
    borderRadius: 5,
    backgroundColor: 'rgba(255, 255, 255, 0.95)',
  },
});

export default VoiceOrb;
