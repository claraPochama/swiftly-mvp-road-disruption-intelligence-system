import { View, Text, StyleSheet } from 'react-native';
import { theme } from '../theme';

// Surfaces the project's core thesis in the UI (plan.md F): where a disruption
// came from (institutional vs community) and how sure we are of its location
// (stated vs inferred).
export const SOURCE_CONFIG = {
  met_eireann_warning: {
    label: 'Met Éireann',
    kind: 'Official',
    color: theme.colors.primary[700],
    background: theme.colors.primary[100],
  },
  council_notice: {
    label: 'Council',
    kind: 'Official',
    color: theme.colors.primary[700],
    background: theme.colors.primary[100],
  },
  community_report: {
    label: 'Community',
    kind: 'Public report',
    color: theme.colors.secondaryWarm[800],
    background: theme.colors.secondaryWarm[100],
  },
};

export function sourceConfig(sourceCategory) {
  return SOURCE_CONFIG[sourceCategory] ?? SOURCE_CONFIG.community_report;
}

// Usage: <SourceBadge sourceCategory="community_report" statedOrInferred="stated" />
export default function SourceBadge({ sourceCategory, statedOrInferred }) {
  const config = sourceConfig(sourceCategory);
  const locationNote = statedOrInferred === 'inferred' ? 'Inferred location' : 'Confirmed location';

  return (
    <View style={styles.wrap}>
      <View style={[styles.pill, { backgroundColor: config.background }]}>
        <Text style={[styles.pillText, { color: config.color }]}>{config.label}</Text>
      </View>
      <Text style={styles.note}>{locationNote}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  wrap: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  pill: {
    borderRadius: theme.layout.radius.full,
    paddingHorizontal: theme.layout.spacing[2],
    paddingVertical: 2,
    marginRight: theme.layout.spacing[2],
  },
  pillText: {
    ...theme.typography.body.b4,
    fontFamily: theme.typography.fontFamily.bodyMedium,
  },
  note: {
    ...theme.typography.body.b4,
    color: theme.colors.neutral[500],
  },
});
