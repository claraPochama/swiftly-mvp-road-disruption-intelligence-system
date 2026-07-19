import { useState } from 'react';
import { View, Text, Pressable, StyleSheet } from 'react-native';
import { theme } from '../../theme';
import Button from '../../components/Button';
import { useUserType } from '../../context/UserTypeContext';

const userTypes = [
  {
    key: 'driver',
    title: 'Driver',
    description: 'Audio alerts, hands-free, route-specific.',
    expandedDescription:
      "Stay informed without touching your screen — Swiftly's audio radio reads your route conditions aloud so you can keep your eyes on the road.",
    icon: '🚗',
  },
  {
    key: 'passenger',
    title: 'Passenger',
    description: 'View, report and track road disruptions.',
    expandedDescription:
      'As a passenger you have time to dig deeper — browse route details, flag road conditions, and check what\'s coming up on the road ahead.',
    icon: '♿',
  },
  {
    key: 'emergency',
    title: 'Emergency Personnel',
    description: 'Verified disruption data and team coordination.',
    expandedDescription:
      'Access priority incident dashboards, verify road reports, and coordinate with responding units — all from one secure operational interface.',
    icon: '🚨',
  },
];

export default function UserTypeScreen({ navigation }) {
  const [expandedKey, setExpandedKey] = useState(null);
  const { setUserType } = useUserType();

  const handleCardPress = (key) => {
    // Tapping an already-expanded card collapses it again; tapping a
    // different card expands that one instead.
    setExpandedKey(expandedKey === key ? null : key);
  };

  const handleContinue = (typeKey) => {
    // Store the selected role globally so MainTabNavigator (and any other
    // screen) can read it directly, instead of threading it through every
    // navigation call between here and the main app.
    setUserType(typeKey);
    navigation.navigate('LoginSignupChooser');
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

        {userTypes.map((type) => {
          const isExpanded = expandedKey === type.key;

          return (
            <Pressable
              key={type.key}
              style={({ pressed }) => [
                styles.card,
                isExpanded && styles.cardExpanded,
                pressed && styles.cardPressed,
              ]}
              onPress={() => handleCardPress(type.key)}
            >
              <View style={styles.cardTopRow}>
                <View style={styles.iconWrap}>
                  <View style={styles.iconDecoration} />
                  <Text style={styles.icon}>{type.icon}</Text>
                </View>
                <View style={styles.cardTextCompact}>
                  <Text style={styles.cardTitle}>{type.title}</Text>
                  {!isExpanded && (
                    <Text style={styles.cardDescription}>{type.description}</Text>
                  )}
                </View>
              </View>

              {isExpanded && (
                <View style={styles.expandedContent}>
                  <Text style={styles.expandedDescription}>
                    {type.expandedDescription}
                  </Text>
                  <Button
                    label="Continue"
                    onPress={() => handleContinue(type.key)}
                  />
                </View>
              )}
            </Pressable>
          );
        })}
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
    backgroundColor: theme.colors.primary[50],
    borderRadius: theme.layout.radius[4],
    padding: theme.layout.spacing[4],
    marginBottom: theme.layout.spacing[3],
    overflow: 'hidden',
  },
  cardExpanded: {
    paddingBottom: theme.layout.spacing[5],
  },
  cardPressed: {
    backgroundColor: theme.colors.primary[100],
  },
  cardTopRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  iconWrap: {
    width: 56,
    height: 56,
    borderRadius: theme.layout.radius[4],
    backgroundColor: '#FFFFFF',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: theme.layout.spacing[4],
    overflow: 'hidden',
  },
  iconDecoration: {
    position: 'absolute',
    bottom: -10,
    left: -10,
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: theme.colors.primary[100],
  },
  icon: {
    fontSize: 22,
  },
  cardTextCompact: {
    flex: 1,
  },
  cardTitle: {
    ...theme.typography.heading.h6,
    color: theme.colors.neutral[900],
  },
  cardDescription: {
    ...theme.typography.body.b4,
    color: theme.colors.neutral[500],
    marginTop: 2,
  },
  expandedContent: {
    marginTop: theme.layout.spacing[3],
  },
  expandedDescription: {
    ...theme.typography.body.b3,
    color: theme.colors.neutral[600],
    marginBottom: theme.layout.spacing[4],
  },
});