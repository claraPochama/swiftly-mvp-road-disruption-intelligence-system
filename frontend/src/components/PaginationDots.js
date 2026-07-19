import { View, StyleSheet } from 'react-native';
import { theme } from '../theme';

// Usage: <PaginationDots total={2} activeIndex={0} />
export default function PaginationDots({ total, activeIndex }) {
  return (
    <View style={styles.row}>
      {Array.from({ length: total }).map((_, i) => (
        <View
          key={i}
          style={[styles.dot, i === activeIndex ? styles.active : styles.inactive]}
        />
      ))}
    </View>
  );
}

const styles = StyleSheet.create({
  row: {
    flexDirection: 'row',
    justifyContent: 'center',
    marginTop: theme.layout.spacing[4],
  },
  dot: {
    width: 8,
    height: 8,
    borderRadius: theme.layout.radius.full,
    marginHorizontal: 4,
  },
  active: {
    backgroundColor: theme.colors.primary[500],
  },
  inactive: {
    backgroundColor: theme.colors.neutral[200],
  },
});