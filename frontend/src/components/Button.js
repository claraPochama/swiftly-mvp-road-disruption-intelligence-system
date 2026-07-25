import { Pressable, Text, StyleSheet } from 'react-native';
import { theme } from '../theme';

// Usage: <Button label="Get Started" onPress={() => ...} />
// Pass variant="outline" for the white/bordered version (used on Login screen).
// Pass color to override the background, and labelColor to override the text color.
export default function Button({ label, onPress, variant = 'filled', color, labelColor, disabled = false }) {
  const isOutline = variant === 'outline';

  return (
    <Pressable
      onPress={onPress}
      disabled={disabled}
      style={({ pressed }) => [
        styles.base,
        isOutline
          ? [styles.outline, color && { borderColor: color }]
          : [styles.filled, color && { backgroundColor: color }],
        pressed && styles.pressed,
        disabled && styles.disabled,
      ]}
    >
      <Text
        style={[
          styles.label,
          isOutline && [styles.labelOutline, color && { color }],
          labelColor && { color: labelColor },
        ]}
      >
        {label}
      </Text>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  base: {
    width: '100%',
    paddingVertical: theme.layout.spacing[4],
    borderRadius: theme.layout.radius[7],
    alignItems: 'center',
    justifyContent: 'center',
  },
  filled: {
    backgroundColor: theme.colors.primary[500],
  },
  outline: {
    backgroundColor: '#FFFFFF',
    borderWidth: theme.layout.stroke[1],
    borderColor: theme.colors.primary[500],
  },
  pressed: {
    opacity: 0.85,
  },
  disabled: {
    opacity: 0.4,
  },
  label: {
    color: '#FFFFFF',
    fontFamily: theme.typography.fontFamily.headingBold,
    fontSize: 16,
  },
  labelOutline: {
    color: theme.colors.primary[500],
  },
});