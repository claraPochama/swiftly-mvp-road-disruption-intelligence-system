import { useState } from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { theme } from '../../theme';
import SimpleHeader from '../../components/SimpleHeader';
import Input from '../../components/Input';
import Button from '../../components/Button';

export default function ForgotPasswordScreen({ navigation }) {
  const [email, setEmail] = useState('');

  const handleConfirm = () => {
    // No backend wired up yet — this just moves forward in the flow.
    navigation.navigate('VerifyAccount');
  };

  return (
    <View style={styles.container}>
      <SimpleHeader
        title="Forgot Password"
        onBack={() => navigation.goBack()}
        backgroundColor="#DFECE0"
        titleColor="#498058"
        arrowColor="#498058"
      />

      <View style={styles.body}>
        <Text style={styles.description}>
          Enter the email associated with your account and we'll send an
          email with code to reset your password
        </Text>

        <Input
          label="Email"
          placeholder="Enter your email"
          value={email}
          onChangeText={setEmail}
          autoCapitalize="none"
          keyboardType="email-address"
        />

        <Button
          label="Confirm"
          onPress={handleConfirm}
          color="#DFECE0"
          labelColor="#498058"
        />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FFFFFF',
  },
  body: {
    paddingHorizontal: theme.layout.spacing[6],
    marginTop: theme.layout.spacing[6],
  },
  description: {
    ...theme.typography.body.b3,
    color: theme.colors.neutral[500],
    marginBottom: theme.layout.spacing[6],
  },
});