import { useEffect } from 'react';
import { View, Text, StyleSheet } from 'react-native';
import Svg, { Path } from 'react-native-svg';
import { theme } from '../theme';

export default function SplashScreen({ navigation }) {
  useEffect(() => {
    const timer = setTimeout(() => {
      navigation.replace('Onboarding1');
    }, 2000); // adjust delay as needed, or replace with a "Get Started" button instead

    return () => clearTimeout(timer);
  }, [navigation]);

  return (
    <View style={styles.container}>
      <Svg width={180} height={200} viewBox="0 0 116 130">
        <Path
          d="
            M108 6
            C 65 14, 38 40, 48 62
            C 56 80, 78 82, 80 98
            C 82 114, 55 122, 8 124
            C 45 108, 62 96, 56 84
            C 50 70, 30 66, 30 50
            C 30 30, 60 16, 108 6
            Z
          "
          fill={theme.colors.primary[800]}
        />
        <Path
          d="
            M100 12
            C 62 22, 42 44, 52 60
            C 60 74, 70 80, 68 96
            C 66 110, 45 116, 20 120
          "
          stroke="#FFFFFF"
          strokeWidth={1.5}
          strokeLinecap="round"
          fill="none"
        />
      </Svg>
      <Text style={styles.wordmark}>SWIFTLY</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FFFFFF',
    alignItems: 'center',
    justifyContent: 'center',
  },
  wordmark: {
    marginTop: theme.layout.spacing[7],
    fontSize: 48,
    lineHeight: 48,
    letterSpacing: 0,
    textAlign: 'center',
    color: theme.colors.primary[900],
    fontFamily: 'Aboreto-Regular',
  },
});