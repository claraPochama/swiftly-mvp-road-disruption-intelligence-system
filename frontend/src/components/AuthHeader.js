import { View, Text, StyleSheet } from 'react-native';
import { theme } from '../theme';
import WaveHeaderGraphic, { WAVE_HEADER_HEIGHT } from './WaveHeaderGraphic';

// Shared header for Login and Signup — wavy background with a large logo
// circle clipped by the wave's exact contour, and heading text overlapping
// the top of the circle.
export default function AuthHeader({ title }) {
  return (
    <View style={styles.wrap}>
      <WaveHeaderGraphic
        waveColor={theme.colors.primary[500]}
        circleColor="#5A8F67"
        logoColor="#6A9A76"
      />

      <Text style={styles.title}>{title}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  wrap: {
    height: WAVE_HEADER_HEIGHT,
  },
  title: {
    position: 'absolute',
    top: theme.layout.spacing[9],
    left: theme.layout.spacing[6],
    ...theme.typography.heading.h2,
    color: '#FFFFFF',
    maxWidth: '55%',
  },
});