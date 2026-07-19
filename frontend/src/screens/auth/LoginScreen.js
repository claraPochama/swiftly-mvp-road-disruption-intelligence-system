import { useState } from 'react';
import { View, Text, Pressable, ScrollView, StyleSheet } from 'react-native';
import { theme } from '../../theme';
import AuthHeader from '../../components/AuthHeader';
import Input from '../../components/Input';
import Button from '../../components/Button';
import WarningBanner from '../../components/WarningBanner';

export default function LoginScreen({ navigation }) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [rememberMe, setRememberMe] = useState(true);

  const handleLogin = () => {
    // No backend wired up yet — this just moves forward in the flow.
    navigation.replace('MainApp');
  };

  return (
    <View style={styles.container}>
      <AuthHeader title="Welcome Back" />

      <ScrollView contentContainerStyle={styles.form}>
        <Input
          label="Email"
          placeholder="Enter your email"
          value={email}
          onChangeText={setEmail}
          autoCapitalize="none"
          keyboardType="email-address"
        />

        <Input
          label="Password"
          placeholder="Enter your password"
          value={password}
          onChangeText={setPassword}
          secureTextEntry
        />

        <View style={styles.row}>
          <Pressable
            style={styles.rememberMeRow}
            onPress={() => setRememberMe(!rememberMe)}
          >
            <View style={[styles.checkbox, rememberMe && styles.checkboxChecked]}>
              {rememberMe && <Text style={styles.checkmark}>✓</Text>}
            </View>
            <Text style={styles.rememberMeText}>Remember me</Text>
          </Pressable>

          <Pressable onPress={() => navigation.navigate('ForgotPassword')}>
            <Text style={styles.link}>Forgot password?</Text>
          </Pressable>
        </View>

        <Button label="Log In" onPress={handleLogin} />

        <View style={styles.dividerRow}>
          <View style={styles.dividerLine} />
          <Text style={styles.dividerText}>OR</Text>
          <View style={styles.dividerLine} />
        </View>

        <Pressable style={styles.googleButton}>
          <Text style={styles.googleG}>G</Text>
          <Text style={styles.googleButtonText}>Continue with Google</Text>
        </Pressable>

        <Pressable
          style={styles.registerRow}
          onPress={() => navigation.navigate('Signup')}
        >
          <Text style={styles.registerText}>
            Don't have an account?{' '}
            <Text style={styles.registerLink}>Register</Text>
          </Text>
        </Pressable>

        <WarningBanner text="Emergency Personnel must enter their work email address to access additional features." />
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FFFFFF',
  },
  form: {
    paddingHorizontal: theme.layout.spacing[6],
    paddingTop: theme.layout.spacing[6],
    paddingBottom: theme.layout.spacing[8],
  },
  row: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: theme.layout.spacing[5],
  },
  rememberMeRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  checkbox: {
    width: 18,
    height: 18,
    borderRadius: theme.layout.radius[1],
    borderWidth: theme.layout.stroke[0],
    borderColor: theme.colors.neutral[300],
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: theme.layout.spacing[2],
  },
  checkboxChecked: {
    backgroundColor: theme.colors.primary[500],
    borderColor: theme.colors.primary[500],
  },
  checkmark: {
    color: '#FFFFFF',
    fontSize: 12,
  },
  rememberMeText: {
    ...theme.typography.body.b3,
    color: theme.colors.neutral[700],
  },
  link: {
    ...theme.typography.body.b3,
    color: theme.colors.neutral[500],
  },
  dividerRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginVertical: theme.layout.spacing[5],
  },
  dividerLine: {
    flex: 1,
    height: 1,
    backgroundColor: theme.colors.neutral[200],
  },
  dividerText: {
    ...theme.typography.body.b4,
    color: theme.colors.neutral[400],
    marginHorizontal: theme.layout.spacing[3],
  },
  googleButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: theme.layout.stroke[0],
    borderColor: theme.colors.neutral[200],
    borderRadius: theme.layout.radius[7],
    paddingVertical: theme.layout.spacing[4],
  },
  googleG: {
    fontFamily: theme.typography.fontFamily.headingBold,
    fontSize: 16,
    color: theme.colors.neutral[700],
    marginRight: theme.layout.spacing[2],
  },
  googleButtonText: {
    ...theme.typography.body.b2,
    color: theme.colors.neutral[900],
  },
  registerRow: {
    marginTop: theme.layout.spacing[6],
    alignItems: 'center',
  },
  registerText: {
    ...theme.typography.body.b3,
    color: theme.colors.neutral[500],
  },
  registerLink: {
    color: theme.colors.primary[500],
    fontFamily: theme.typography.fontFamily.bodyMedium,
  },
});