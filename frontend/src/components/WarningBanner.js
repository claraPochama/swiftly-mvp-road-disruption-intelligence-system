import { View, Text, StyleSheet } from 'react-native';
import { theme } from '../theme';

// Usage: <WarningBanner text="Some notice text..." />
export default function WarningBanner({ text }) {
  return (
    <View style={styles.wrap}>
      <Text style={styles.text}>{text}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  wrap: {
    backgroundColor: theme.colors.secondaryWarm[50],
    borderWidth: theme.layout.stroke[0],
    borderColor: theme.colors.secondaryWarm[300],
    borderRadius: theme.layout.radius[4],
    padding: theme.layout.spacing[4],
    marginTop: theme.layout.spacing[4],
  },
  text: {
    ...theme.typography.body.b4,
    color: theme.colors.secondaryWarm[700],
    textAlign: 'center',
  },
});