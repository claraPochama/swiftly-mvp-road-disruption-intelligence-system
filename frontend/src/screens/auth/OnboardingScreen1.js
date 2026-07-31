import { View, Text, Image, StyleSheet } from 'react-native';
import { theme } from '../../theme';
import Button from '../../components/Button';
import PaginationDots from '../../components/PaginationDots';

export default function OnboardingScreen1({ navigation }) {
  return (
    <View style={styles.container}>
      <View style={styles.illustrationWrap}>
        <Image
          source={{
            uri: 'https://media1.giphy.com/media/v1.Y2lkPTc5MGI3NjExMnI2a3EyaWdyajFna2c2a2U2OXpzenpmeGh2MDh5dzEwNzU5NzU4YyZlcD12MV9pbnRlcm5hbF9naWZfYnlfaWQmY3Q9cw/EohabTjOHiKNzjkkrj/giphy.gif',
          }}
          style={styles.illustrationImage}
          resizeMode="contain"
        />
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
  illustrationImage: {
    width: 160,
    height: 160,
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