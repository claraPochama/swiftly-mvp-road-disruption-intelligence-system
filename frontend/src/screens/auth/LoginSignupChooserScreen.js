import { useState } from 'react';
import { View, Text, Pressable, Switch, StyleSheet } from 'react-native';
import { theme } from '../../theme';
import WaveHeaderGraphic, { WAVE_HEADER_HEIGHT } from '../../components/WaveHeaderGraphic';
import Button from '../../components/Button';

export default function LoginSignupChooserScreen({ navigation }) {
  const [isDarkMode, setIsDarkMode] = useState(false);

  // NOTE: this toggle currently only tracks its own on/off state locally.
  // To actually re-theme the app, this value needs to live in a shared
  // ThemeContext (or similar) that colors.js / screens read from — a good
  // next step once you're ready to implement real dark mode support.
  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <WaveHeaderGraphic
          waveColor={theme.colors.primary[700]}
          circleColor={theme.colors.primary[500]}
          logoColor={theme.colors.primary[100]}
        />
      </View>

      <Text style={styles.wordmark}>SWIFTLY</Text>

      <View style={styles.form}>
        <Button label="Log In" onPress={() => navigation.navigate('Login')} />

        <View style={{ height: theme.layout.spacing[3] }} />

        <Button
          label="Sign Up"
          variant="outline"
          onPress={() => navigation.navigate('Signup')}
        />

        <View style={styles.dividerRow}>
          <View style={styles.dividerLine} />
          <Text style={styles.dividerText}>OR</Text>
          <View style={styles.dividerLine} />
        </View>

        <Pressable style={styles.googleButton}>
          <Text style={styles.googleG}>G</Text>
          <Text style={styles.googleButtonText}>Continue with Google</Text>
        </Pressable>

        <View style={styles.toggleRow}>
          <Text style={styles.toggleLabel}>
            {isDarkMode ? 'Dark mode' : 'Light mode'}
          </Text>
          <Switch
            value={isDarkMode}
            onValueChange={setIsDarkMode}
            trackColor={{ false: theme.colors.neutral[200], true: theme.colors.primary[400] }}
            thumbColor={theme.colors.primary[500]}
          />
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FFFFFF',
  },
  header: {
    height: WAVE_HEADER_HEIGHT,
  },
  wordmark: {
    marginTop: theme.layout.spacing[3],
    fontSize: 30,
    textAlign: 'center',
    color: theme.colors.primary[900],
    fontFamily: 'Aboreto-Regular',
  },
  form: {
    paddingHorizontal: theme.layout.spacing[6],
    marginTop: theme.layout.spacing[7],
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
  toggleRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: theme.layout.spacing[8],
  },
  toggleLabel: {
    ...theme.typography.body.b3,
    color: theme.colors.neutral[600],
    marginRight: theme.layout.spacing[3],
  },
});