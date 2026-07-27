import { useState } from 'react';
import { View, Text, Pressable, Switch, ScrollView, StyleSheet } from 'react-native';
import { theme } from '../../theme';
import SimpleHeader from '../../components/SimpleHeader';
import { useUserType } from '../../context/UserTypeContext';
import CriticalAlertIcon from '../../components/icons/CriticalAlertIcon';
import CautionAlertIcon from '../../components/icons/CautionAlertIcon';
import ClearNotificationsIcon from '../../components/icons/ClearNotificationsIcon';
import WeatherImpactsIcon from '../../components/icons/WeatherImpactsIcon';

const NOTIFICATION_DEFAULTS = [
  { key: 'critical', title: 'Critical alerts', subtitle: 'Collisions, closures', value: true },
  { key: 'caution', title: 'Caution alerts', subtitle: 'Road works, flooding', value: true },
  { key: 'clear', title: 'Clear notifications', subtitle: 'Resolved incidents', value: false },
  { key: 'weather', title: 'Weather impacts', subtitle: 'Forecasted disruptions', value: true },
];

const PREFERENCES = [
  { key: 'language', label: 'Language', value: 'English (Ireland)' },
  { key: 'units', label: 'Distance units', value: 'Kilometres' },
  { key: 'audio', label: 'Audio updates', value: 'On' },
];

const ABOUT = [
  { key: 'version', label: 'App version', value: '2.4.1' },
  { key: 'source', label: 'Data source', value: 'TII Live Feed' },
  { key: 'sync', label: 'Last sync', value: '12:46 today' },
];

export default function ProfileScreen() {
  const { userType } = useUserType();
  const activeMode = userType.charAt(0).toUpperCase() + userType.slice(1);

  const [notifications, setNotifications] = useState(
    Object.fromEntries(NOTIFICATION_DEFAULTS.map((n) => [n.key, n.value]))
  );

  const toggleNotification = (key) => {
    setNotifications((prev) => ({ ...prev, [key]: !prev[key] }));
  };

  return (
    <View style={styles.container}>
      <SimpleHeader title="Profile" />

      <ScrollView contentContainerStyle={styles.body}>
        <View style={styles.userCard}>
          <View style={styles.userRow}>
            <View style={styles.avatar}>
              <Text style={styles.avatarIcon}>👤</Text>
            </View>
            <View>
              <Text style={styles.userName}>Marshall</Text>
              <Text style={styles.userSubtitle}>Passenger · Ireland Region</Text>
            </View>
          </View>

          <View style={styles.activeModeRow}>
            <Text style={styles.activeModeLabel}>Active Mode</Text>
            <View style={styles.activeModePill}>
              <Text style={styles.activeModeValue}>{activeMode}</Text>
            </View>
          </View>
        </View>

        <Text style={styles.sectionLabel}>NOTIFICATIONS</Text>
        <View style={styles.sectionCard}>
          {NOTIFICATION_DEFAULTS.map((item, index) => (
            <View
              key={item.key}
              style={[styles.row, index < NOTIFICATION_DEFAULTS.length - 1 && styles.rowDivider]}
            >
              <View style={styles.rowIcon}>
                {item.key === 'critical' && <CriticalAlertIcon size={28} />}
                {item.key === 'caution' && <CautionAlertIcon size={28} />}
                {item.key === 'clear' && <ClearNotificationsIcon size={28} />}
                {item.key === 'weather' && <WeatherImpactsIcon size={28} />}
              </View>
              <View style={styles.rowText}>
                <Text style={styles.rowTitle}>{item.title}</Text>
                <Text style={styles.rowSubtitle}>{item.subtitle}</Text>
              </View>
              <Switch
                value={notifications[item.key]}
                onValueChange={() => toggleNotification(item.key)}
                trackColor={{ false: theme.colors.neutral[200], true: theme.colors.primary[400] }}
                thumbColor={theme.colors.primary[600]}
              />
            </View>
          ))}
        </View>

        <Text style={styles.sectionLabel}>PREFERENCES</Text>
        <View style={styles.sectionCard}>
          {PREFERENCES.map((item, index) => (
            <Pressable
              key={item.key}
              style={[styles.row, index < PREFERENCES.length - 1 && styles.rowDivider]}
              onPress={() => {
                /* TODO: wire up real preference editing once needed */
              }}
            >
              <Text style={styles.prefLabel}>{item.label}</Text>
              <View style={styles.prefValueRow}>
                <Text style={styles.prefValue}>{item.value}</Text>
                <Text style={styles.chevron}>›</Text>
              </View>
            </Pressable>
          ))}
        </View>

        <Text style={styles.sectionLabel}>ABOUT</Text>
        <View style={styles.sectionCard}>
          {ABOUT.map((item, index) => (
            <View
              key={item.key}
              style={[styles.row, index < ABOUT.length - 1 && styles.rowDivider]}
            >
              <Text style={styles.prefLabel}>{item.label}</Text>
              <Text style={styles.prefValue}>{item.value}</Text>
            </View>
          ))}
        </View>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FFFFFF',
  },
  body: {
    paddingHorizontal: theme.layout.spacing[5],
    paddingTop: theme.layout.spacing[4],
    paddingBottom: theme.layout.spacing[8],
  },
  userCard: {
    borderWidth: theme.layout.stroke[0],
    borderColor: theme.colors.neutral[200],
    borderRadius: theme.layout.radius[4],
    padding: theme.layout.spacing[4],
    marginBottom: theme.layout.spacing[5],
  },
  userRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: theme.layout.spacing[3],
  },
  avatar: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: theme.colors.primary[900],
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: theme.layout.spacing[3],
  },
  avatarIcon: {
    fontSize: 20,
  },
  userName: {
    ...theme.typography.heading.h6,
    color: theme.colors.neutral[900],
  },
  userSubtitle: {
    ...theme.typography.body.b4,
    color: theme.colors.neutral[500],
  },
  activeModeRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    borderTopWidth: theme.layout.stroke[0],
    borderTopColor: theme.colors.neutral[200],
    paddingTop: theme.layout.spacing[3],
  },
  activeModeLabel: {
    ...theme.typography.body.b3,
    color: theme.colors.neutral[900],
  },
  activeModePill: {
    backgroundColor: theme.colors.primary[900],
    borderRadius: theme.layout.radius.full,
    paddingHorizontal: theme.layout.spacing[3],
    paddingVertical: theme.layout.spacing[1],
  },
  activeModeValue: {
    ...theme.typography.body.b4,
    fontFamily: theme.typography.fontFamily.bodyMedium,
    color: '#FFFFFF',
  },
  sectionLabel: {
    ...theme.typography.body.b4,
    color: theme.colors.neutral[500],
    letterSpacing: 1,
    marginBottom: theme.layout.spacing[2],
  },
  sectionCard: {
    borderWidth: theme.layout.stroke[0],
    borderColor: theme.colors.neutral[200],
    borderRadius: theme.layout.radius[4],
    marginBottom: theme.layout.spacing[5],
    overflow: 'hidden',
  },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: theme.layout.spacing[3],
    paddingHorizontal: theme.layout.spacing[3],
    justifyContent: 'space-between',
  },
  rowDivider: {
    borderBottomWidth: theme.layout.stroke[0],
    borderBottomColor: theme.colors.neutral[200],
  },
  rowIcon: {
  width: 20,
  marginRight: theme.layout.spacing[3],
  alignItems: 'center',
  },
  rowText: {
    flex: 1,
  },
  rowTitle: {
    ...theme.typography.body.b2,
    color: theme.colors.neutral[900],
  },
  rowSubtitle: {
    ...theme.typography.body.b4,
    color: theme.colors.neutral[500],
  },
  prefLabel: {
    ...theme.typography.body.b2,
    color: theme.colors.neutral[900],
  },
  prefValueRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  prefValue: {
    ...theme.typography.body.b3,
    color: theme.colors.neutral[500],
    marginRight: theme.layout.spacing[1],
  },
  chevron: {
    fontSize: 18,
    color: theme.colors.neutral[400],
  },
});