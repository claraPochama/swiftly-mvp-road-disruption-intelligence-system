import { View, Text, TextInput, StyleSheet } from 'react-native';
import { theme } from '../theme';

// Usage: <Input label="Email" placeholder="Enter your email" value={email} onChangeText={setEmail} />
// Pass secureTextEntry for password fields.
export default function Input({ label, ...textInputProps }) {
  return (
    <View style={styles.wrap}>
      <Text style={styles.label}>{label}</Text>
      <TextInput
        style={styles.input}
        placeholderTextColor={theme.colors.neutral[400]}
        {...textInputProps}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  wrap: {
    marginBottom: theme.layout.spacing[4],
  },
  label: {
    ...theme.typography.body.b3,
    color: theme.colors.neutral[900],
    marginBottom: theme.layout.spacing[1],
  },
  input: {
    borderWidth: theme.layout.stroke[0],
    borderColor: theme.colors.neutral[200],
    borderRadius: theme.layout.radius[6],
    paddingHorizontal: theme.layout.spacing[4],
    paddingVertical: theme.layout.spacing[3],
    fontFamily: theme.typography.fontFamily.bodyRegular,
    fontSize: 15,
    color: theme.colors.neutral[900],
  },
});