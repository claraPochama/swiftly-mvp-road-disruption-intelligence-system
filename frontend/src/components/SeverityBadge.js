import { View, Text, StyleSheet } from 'react-native';
import { theme } from '../theme';

export const SEVERITY_CONFIG = {
  disrupted: {
    label: 'Disrupted',
    color: theme.colors.red[600],
    dot: theme.colors.red[600],
    background: theme.colors.red[50],
  },
  caution: {
    label: 'Caution',
    color: theme.colors.orange[600],
    dot: theme.colors.orange[500],
    background: theme.colors.orange[50],
  },
  clear: {
    label: 'Clear',
    color: theme.colors.green[700],
    dot: theme.colors.green[600],
    background: theme.colors.green[50],
  },
};

// Usage: <SeverityBadge severity="disrupted" />
export default function SeverityBadge({ severity }) {
  const config = SEVERITY_CONFIG[severity] ?? SEVERITY_CONFIG.caution;

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