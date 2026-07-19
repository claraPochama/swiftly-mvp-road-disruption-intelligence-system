import { useEffect } from 'react';
import { View, Text, StyleSheet } from 'react-native';
import Svg, { Path } from 'react-native-svg';
import { theme } from '../../theme';

export default function SplashScreen({ navigation }) {
  useEffect(() => {
    const timer = setTimeout(() => {
      navigation.replace('Onboarding1');
    }, 2000); // adjust delay as needed, or replace with a "Get Started" button instead

    return () => clearTimeout(timer);
  }, [navigation]);

  return (
    <View style={styles.container}>
      <Svg width={180} height={180} viewBox="0 0 201 201" fill="none">
        <Path
          fillRule="evenodd"
          clipRule="evenodd"
          d="M178.108 19.7543C159.447 27.2931 93.8015 56.2716 102.613 71.5912C109.558 83.6668 169.845 81.5683 160.032 116.284C149.725 152.746 50.3402 174.598 38.9606 177.515C33.5572 178.901 33.5917 178.837 28.1563 179.92C29.0988 178.513 29.3189 178.825 30.782 178.054C31.1489 178.016 30.7825 178.561 31.1973 178.517C31.4256 178.493 31.417 178.477 33.9567 177.721C61.3083 169.572 87.4978 156.848 91.9914 154.665C95.7852 152.822 126.237 138.026 134.394 123.333C148.545 97.8421 109.132 90.5408 98.35 86.8495C53.1168 71.3643 103.978 42.2118 158.61 24.9973C176.564 19.3399 176.691 18.978 178.108 19.7543Z"
          fill={theme.colors.primary[800]}
        />
        <Path
          fillRule="evenodd"
          clipRule="evenodd"
          d="M179.61 17.5623C178.117 20.278 176.468 17.21 134 32.223C116.158 38.5307 83.4901 52.9886 78.0335 66.5831C65.8443 96.9501 142.159 87.603 131.153 119.385C129.01 125.576 119.272 137.309 93.0571 151.543C64.0437 167.296 40.9181 174.328 30.7823 178.054C29.3192 178.825 29.0991 178.513 28.1566 179.919C25.1281 180.577 25.2134 180.624 22.2324 181.366C18.2268 182.363 25.5614 179.276 25.8762 179.144C38.7378 173.73 71.1693 156.367 90.2065 141.344C115.786 121.159 113.299 111.014 95.5927 104.107C92.5566 102.923 35.0219 87.5537 68.1326 56.5594C97.0915 29.4517 164.21 20.2235 179.61 17.5623Z"
          fill={theme.colors.primary[800]}
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