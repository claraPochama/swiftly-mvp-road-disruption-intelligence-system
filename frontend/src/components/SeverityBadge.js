import { View, Text, StyleSheet } from 'react-native';
import { theme } from '../theme';

// Keyed by the backend severity vocabulary (`low | medium | high`) so live data
// maps straight through (plan.md A). Traffic-light colours: high=red,
// medium=orange, low=green.
export const SEVERITY_CONFIG = {
  high: {
    label: 'High',
    color: theme.colors.red[600],
    dot: theme.colors.red[600],
    background: theme.colors.red[50],
  },
  medium: {
    label: 'Medium',
    color: theme.colors.orange[600],
    dot: theme.colors.orange[500],
    background: theme.colors.orange[50],
  },
  low: {
    label: 'Low',
    color: theme.colors.green[700],
    dot: theme.colors.green[600],
    background: theme.colors.green[50],
  },
};

// Usage: <SeverityBadge severity="high" />
export default function SeverityBadge({ severity }) {
  const config = SEVERITY_CONFIG[severity] ?? SEVERITY_CONFIG.medium;

  return (
    <View style={styles.wrap}>
      <View style={[styles.dot, { backgroundColor: config.dot }]} />
      <Text style={[styles.label, { color: config.color }]}>{config.label}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  wrap: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  dot: {
    width: 6,
    height: 6,
    borderRadius: 3,
    marginRight: theme.layout.spacing[1],
  },
  label: {
    ...theme.typography.body.b4,
    fontFamily: theme.typography.fontFamily.bodyMedium,
  },
});