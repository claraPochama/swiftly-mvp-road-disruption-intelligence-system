import { View, Text, StyleSheet } from 'react-native';
import Svg, { Circle, Path } from 'react-native-svg';
import { theme } from '../../theme';
import Button from '../../components/Button';
import PaginationDots from '../../components/PaginationDots';

export default function OnboardingScreen2({ navigation }) {
  return (
    <View style={styles.container}>
      <View style={styles.illustrationWrap}>
        {/* Placeholder illustration — same stand-in shape as Onboarding 1,
            swap for the real exported artwork once available. */}
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

      <Text style={styles.heading}>Your route, your update</Text>

      <Text style={styles.subtext}>
        Swiftly understands your journeys and alerts you to disruptions
        before you leave home, so you're never caught off guard.
      </Text>

      <Button
        label="Get Started"
        onPress={() => navigation.replace('UserType')}
      />

      <PaginationDots total={2} activeIndex={1} />
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