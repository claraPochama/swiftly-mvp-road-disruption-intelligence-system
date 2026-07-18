import { View, Text, StyleSheet } from 'react-native';
import { theme } from '../theme';

// Temporary stand-in for screens we haven't built yet — lets us wire up and
// test the full navigation flow before every screen exists.
// Usage: <Stack.Screen name="Onboarding1">
//          {() => <PlaceholderScreen label="Onboarding 1" />}
//        </Stack.Screen>
export default function PlaceholderScreen({ label }) {
  return (
    <View style={styles.container}>
      <Text style={styles.text}>{label}</Text>
      <Text style={styles.subtext}>Screen coming soon</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: theme.colors.primary[50],
    alignItems: 'center',
    justifyContent: 'center',
  },
  text: {
    fontFamily: theme.typography.fontFamily.headingBold,
    fontSize: 24,
    color: theme.colors.primary[900],
  },
  subtext: {
    marginTop: theme.layout.spacing[2],
    fontFamily: theme.typography.fontFamily.bodyRegular,
    fontSize: 14,
    color: theme.colors.neutral[500],
  },
});