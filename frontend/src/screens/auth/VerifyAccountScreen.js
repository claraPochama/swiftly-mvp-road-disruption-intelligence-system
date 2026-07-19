import { useState, useEffect, useRef } from 'react';
import { View, Text, TextInput, Pressable, StyleSheet } from 'react-native';
import { theme } from '../../theme';
import SimpleHeader from '../../components/SimpleHeader';
import Button from '../../components/Button';

const OTP_LENGTH = 6;
const RESEND_SECONDS = 57;

export default function VerifyAccountScreen({ navigation }) {
  const [digits, setDigits] = useState(Array(OTP_LENGTH).fill(''));
  const [secondsLeft, setSecondsLeft] = useState(RESEND_SECONDS);
  const inputRefs = useRef([]);

  useEffect(() => {
    if (secondsLeft <= 0) return;
    const timer = setInterval(() => {
      setSecondsLeft((s) => s - 1);
    }, 1000);
    return () => clearInterval(timer);
  }, [secondsLeft]);

  const handleChangeDigit = (text, index) => {
    const value = text.replace(/[^0-9]/g, '').slice(-1); // one digit only
    const next = [...digits];
    next[index] = value;
    setDigits(next);

    if (value && index < OTP_LENGTH - 1) {
      inputRefs.current[index + 1]?.focus();
    }
  };

  const handleKeyPress = (e, index) => {
    if (e.nativeEvent.key === 'Backspace' && !digits[index] && index > 0) {
      inputRefs.current[index - 1]?.focus();
    }
  };

  const handleResend = () => {
    if (secondsLeft > 0) return;
    // No backend wired up yet — just resets the local countdown.
    setSecondsLeft(RESEND_SECONDS);
  };

  const handleConfirm = () => {
    // No backend wired up yet — this just moves forward in the flow.
    navigation.replace('MainApp');
  };

  const formattedTime = `00:${String(secondsLeft).padStart(2, '0')}`;

  return (
    <View style={styles.container}>
      <SimpleHeader
        title="Verify Account"
        onBack={() => navigation.goBack()}
        backgroundColor="#DFECE0"
        titleColor="#498058"
        arrowColor="#498058"
      />

      <View style={styles.body}>
        <Text style={styles.description}>
          Enter your OTP which has been sent to your email and completely
          verify your account.
        </Text>

        <View style={styles.otpRow}>
          {digits.map((digit, index) => (
            <TextInput
              key={index}
              ref={(ref) => (inputRefs.current[index] = ref)}
              style={styles.otpBox}
              value={digit}
              onChangeText={(text) => handleChangeDigit(text, index)}
              onKeyPress={(e) => handleKeyPress(e, index)}
              keyboardType="number-pad"
              maxLength={1}
              textAlign="center"
            />
          ))}
        </View>

        <Text style={styles.helperText}>A code has been sent to your phone</Text>

        <Pressable onPress={handleResend} disabled={secondsLeft > 0}>
          <Text style={styles.resendText}>
            {secondsLeft > 0 ? `Resend in ${formattedTime}` : 'Resend code'}
          </Text>
        </Pressable>

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
    marginBottom: theme.layout.spacing[7],
  },
  otpRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: theme.layout.spacing[5],
  },
  otpBox: {
    width: 42,
    height: 50,
    borderBottomWidth: theme.layout.stroke[0],
    borderBottomColor: theme.colors.neutral[300],
    fontSize: 20,
    fontFamily: theme.typography.fontFamily.headingBold,
    color: theme.colors.neutral[900],
  },
  helperText: {
    ...theme.typography.body.b3,
    color: theme.colors.neutral[500],
    textAlign: 'center',
    marginBottom: theme.layout.spacing[2],
  },
  resendText: {
    ...theme.typography.body.b1,
    fontFamily: theme.typography.fontFamily.headingBold,
    color: theme.colors.neutral[900],
    textAlign: 'center',
    marginBottom: theme.layout.spacing[7],
  },
});