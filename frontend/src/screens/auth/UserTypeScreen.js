import { View, Text, Pressable, StyleSheet } from 'react-native';
import { theme } from '../../theme';

const userTypes = [
  {
    key: 'driver',
    title: 'Driver',
    description: 'Audio alerts, hands-free, route-specific.',
    icon: '🚗',
  },
  {
    key: 'passenger',
    title: 'Passenger',
    description: 'View, report and track road disruptions.',
    icon: '♿',
  },
  {
    key: 'emergency',
    title: 'Emergency Personnel',
    description: 'Verified disruption data and team coordination.',
    icon: '🚨',
  },
];

export default function UserTypeScreen({ navigation }) {
  const handleSelect = (typeKey) => {
    // Route selection determines which mode the app opens in —
    // for now all types head to the Login/SignUp chooser; branch this
    // once role-specific flows or nav structures are built.
    navigation.navigate('LoginSignupChooser', { userType: typeKey });
  };

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Who are you today?</Text>
        <Text style={styles.headerSubtitle}>
          Your experience is tailored to your role.
        </Text>
      </View>

      <View style={styles.body}>
        <Text style={styles.sectionLabel}>SELECT YOUR USER TYPE</Text>

        {userTypes.map((type) => (
          <Pressable
            key={type.key}
            style={({ pressed }) => [styles.card, pressed && styles.cardPressed]}
            onPress={() => handleSelect(type.key)}
          >
            <View style={styles.iconWrap}>
              <Text style={styles.icon}>{type.icon}</Text>
            </View>
            <View style={styles.cardText}>
              <Text style={styles.cardTitle}>{type.title}</Text>
              <Text style={styles.cardDescription}>{type.description}</Text>
            </View>
          </Pressable>
        ))}
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
    backgroundColor: theme.colors.primary[500],
    paddingTop: theme.layout.spacing[9],
    paddingBottom: theme.layout.spacing[8],
    paddingHorizontal: theme.layout.spacing[6],
    borderBottomLeftRadius: 40,
    borderBottomRightRadius: 40,
  },
  headerTitle: {
    ...theme.typography.heading.h2,
    color: '#FFFFFF',
  },
  headerSubtitle: {
    ...theme.typography.body.b3,
    color: theme.colors.primary[100],
    marginTop: theme.layout.spacing[1],
  },
  body: {
    paddingHorizontal: theme.layout.spacing[6],
    marginTop: theme.layout.spacing[7],
  },
  sectionLabel: {
    ...theme.typography.body.b4,
    color: theme.colors.neutral[500],
    letterSpacing: 1,
    marginBottom: theme.layout.spacing[3],
  },
  card: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: theme.colors.primary[50],
    borderRadius: theme.layout.radius[4],
    padding: theme.layout.spacing[4],
    marginBottom: theme.layout.spacing[3],
  },
  cardPressed: {
    backgroundColor: theme.colors.primary[100],
  },
  iconWrap: {
    width: 44,
    height: 44,
    borderRadius: theme.layout.radius[3],
    backgroundColor: theme.colors.primary[500],
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: theme.layout.spacing[4],
  },
  icon: {
    fontSize: 20,
  },
  cardText: {
    flex: 1,
  },
  cardTitle: {
    ...theme.typography.heading.h6,
    color: theme.colors.primary[900],
  },
  cardDescription: {
    ...theme.typography.body.b4,
    color: theme.colors.neutral[500],
    marginTop: 2,
  },
});