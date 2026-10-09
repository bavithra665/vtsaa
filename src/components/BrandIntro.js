import { useEffect, useState } from 'react';
import { Animated, Easing, StyleSheet, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { colors } from '../theme';

export default function BrandIntro({ onComplete }) {
  const [topY] = useState(() => new Animated.Value(-120));
  const [bottomY] = useState(() => new Animated.Value(120));
  const [opacity] = useState(() => new Animated.Value(1));

  useEffect(() => {
    const animation = Animated.sequence([
      Animated.parallel([
        Animated.timing(topY, {
          toValue: 0,
          duration: 800,
          easing: Easing.out(Easing.cubic),
          useNativeDriver: true,
        }),
        Animated.timing(bottomY, {
          toValue: 0,
          duration: 800,
          easing: Easing.out(Easing.cubic),
          useNativeDriver: true,
        }),
      ]),
      Animated.delay(2000),
      Animated.parallel([
        Animated.timing(topY, {
          toValue: -120,
          duration: 650,
          easing: Easing.in(Easing.cubic),
          useNativeDriver: true,
        }),
        Animated.timing(bottomY, {
          toValue: 120,
          duration: 650,
          easing: Easing.in(Easing.cubic),
          useNativeDriver: true,
        }),
        Animated.timing(opacity, {
          toValue: 0,
          duration: 650,
          easing: Easing.in(Easing.cubic),
          useNativeDriver: true,
        }),
      ]),
    ]);

    animation.start(({ finished }) => {
      if (finished) {
        onComplete();
      }
    });

    return () => animation.stop();
  }, [bottomY, onComplete, opacity, topY]);

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.wordmark} accessibilityLabel="VTSAA Enterprises">
        <Animated.Text style={[styles.topWord, { opacity, transform: [{ translateY: topY }] }]}>
          VTSAA
        </Animated.Text>
        <Animated.Text
          style={[styles.bottomWord, { opacity, transform: [{ translateY: bottomY }] }]}
        >
          ENTERPRISES
        </Animated.Text>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: colors.white,
  },
  wordmark: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  topWord: {
    color: colors.navy,
    fontSize: 48,
    fontWeight: '800',
    letterSpacing: 5,
  },
  bottomWord: {
    color: colors.blue,
    fontSize: 17,
    fontWeight: '700',
    letterSpacing: 5,
    marginTop: 3,
  },
});
