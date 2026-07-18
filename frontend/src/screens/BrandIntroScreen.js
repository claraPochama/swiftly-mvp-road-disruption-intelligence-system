import { useEffect } from 'react';
import { View, StyleSheet, Dimensions } from 'react-native';
import Svg, { Polygon } from 'react-native-svg';
import { theme } from '../theme';

const { width, height } = Dimensions.get('window');

// Very first frame shown on app launch — a brief diagonal green wipe,
// before the logo Splash screen appears. Shown for ~1 second.
export default function BrandIntroScreen({ navigation }) {
  useEffect(() => {
    const timer = setTimeout(() => {
      navigation.replace('Splash');
    }, 1000);

    return () => clearTimeout(timer);
  }, [navigation]);

  return (
    <View style={styles.container}>
      <Svg width={width} height={height} viewBox={`0 0 ${width} ${height}`}>
        <Polygon
          points={`0,${height * 0.85} ${width},${height * 0.24} ${width},${height} 0,${height}`}
          fill={theme.colors.primary[800]}
        />
      </Svg>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FFFFFF',
  },
});