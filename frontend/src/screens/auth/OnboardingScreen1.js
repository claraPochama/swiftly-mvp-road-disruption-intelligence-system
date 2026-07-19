import { View, Text, StyleSheet } from 'react-native';
import Svg, { Circle, Path } from 'react-native-svg';
import { theme } from '../../theme';
import Button from '../../components/Button';
import PaginationDots from '../../components/PaginationDots';

export default function OnboardingScreen1({ navigation }) {
  return (
    <View style={styles.container}>
      <View style={styles.illustrationWrap}>
        {/* Placeholder illustration — swap for the exact exported artwork
            once available, same as we did for the logo. */}
        <Svg width={160} height={160} viewBox="0 0 160 160">
          <Circle cx="80" cy="80" r="70" fill={theme.colors.primary[50]} />
          <Path
            d="M45 95 Q80 60 115 95"
            stroke={theme.colors.primary[400]}
            strokeWidth={6}
            strokeLinecap="round"
            fill="none"
          />
          <Circle cx="80" cy="70" r="14" fill={theme.colors.primary[500]} />
        </Svg>
      </View>

      <Text style={styles.heading}>Know before you go</Text>

      <Text style={styles.subtext}>
        Real-time verified road disruption information personalised to your
        route, delivered hands-free while you drive.
      </Text>

      <Button
        label="Get Started"
        onPress={() => navigation.replace('Onboarding2')}
      />

      <PaginationDots total={2} activeIndex={0} />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FFFFFF',
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: theme.layout.spacing[6],
  },
  illustrationWrap: {
    marginBottom: theme.layout.spacing[8],
  },
  heading: {
    ...theme.typography.heading.h3,
    color: theme.colors.primary[900],
    textAlign: 'center',
    marginBottom: theme.layout.spacing[3],
  },
  subtext: {
    ...theme.typography.body.b3,
    color: theme.colors.neutral[500],
    textAlign: 'center',
    marginBottom: theme.layout.spacing[7],
  },
});