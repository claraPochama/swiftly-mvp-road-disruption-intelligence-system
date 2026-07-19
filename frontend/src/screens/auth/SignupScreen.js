import { useState } from 'react';
import { View, Text, Pressable, ScrollView, StyleSheet } from 'react-native';
import { theme } from '../../theme';
import AuthHeader from '../../components/AuthHeader';
import Input from '../../components/Input';
import Button from '../../components/Button';
import WarningBanner from '../../components/WarningBanner';

export default function SignupScreen({ navigation }) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');

  const handleSignup = () => {
    // No backend wired up yet — this just moves forward in the flow.
    navigation.navigate('VerifyAccount');
  };

  return (
    <View style={styles.container}>
      <AuthHeader title="Create Account" />

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

        <Input
          label="Confirm password"
          placeholder="Enter your password"
          value={confirmPassword}
          onChangeText={setConfirmPassword}
          secureTextEntry
        />

        <Button label="Sign Up" onPress={handleSignup} />

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
          style={styles.loginRow}
          onPress={() => navigation.navigate('Login')}
        >
          <Text style={styles.loginText}>
            Already have an account?{' '}
            <Text style={styles.loginLink}>Log In</Text>
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
  loginRow: {
    marginTop: theme.layout.spacing[6],
    alignItems: 'center',
  },
  loginText: {
    ...theme.typography.body.b3,
    color: theme.colors.neutral[500],
  },
  loginLink: {
    color: theme.colors.primary[500],
    fontFamily: theme.typography.fontFamily.bodyMedium,
  },
});