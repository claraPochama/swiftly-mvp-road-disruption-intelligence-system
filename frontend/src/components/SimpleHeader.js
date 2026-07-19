import { View, Text, Pressable, StyleSheet } from 'react-native';
import { theme } from '../theme';

// Usage: <SimpleHeader title="Forgot Password" onBack={() => navigation.goBack()} />
// Pass backgroundColor to override the header's green, and titleColor/arrowColor
// to override the text/arrow color on a specific screen.
export default function SimpleHeader({ title, onBack, backgroundColor, titleColor, arrowColor }) {
  return (
    <View style={[styles.header, backgroundColor && { backgroundColor }]}>
      <Pressable onPress={onBack} style={styles.backButton} hitSlop={12}>
        <Text style={[styles.backArrow, arrowColor && { color: arrowColor }]}>‹</Text>
      </Pressable>
      <Text style={[styles.title, titleColor && { color: titleColor }]}>{title}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  header: {
    backgroundColor: theme.colors.primary[500],
    paddingTop: theme.layout.spacing[9],
    paddingBottom: theme.layout.spacing[7],
    paddingHorizontal: theme.layout.spacing[6],
    borderBottomLeftRadius: 40,
    borderBottomRightRadius: 40,
    flexDirection: 'row',
    alignItems: 'center',
  },
  backButton: {
    marginRight: theme.layout.spacing[4],
  },
  backArrow: {
    color: '#FFFFFF',
    fontSize: 32,
    lineHeight: 32,
  },
  title: {
    ...theme.typography.heading.h4,
    color: '#FFFFFF',
  },
});