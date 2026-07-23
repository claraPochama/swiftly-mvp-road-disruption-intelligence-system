import { View, Text, ScrollView, StyleSheet } from 'react-native';
import { theme } from '../../theme';
import SimpleHeader from '../../components/SimpleHeader';
import SeverityBadge, { SEVERITY_CONFIG } from '../../components/SeverityBadge';
import Button from '../../components/Button';
import { useUserType } from '../../context/UserTypeContext';
import { useAlerts } from '../../context/AlertsContext';

export default function IncidentDetailScreen({ route, navigation }) {
  const { alertId } = route.params ?? {};
  const { alerts } = useAlerts();
  const alert = alerts.find((a) => a.id === alertId) ?? alerts[0];
  const config = SEVERITY_CONFIG[alert.severity];
  const { userType } = useUserType();

  return (
    <View style={styles.container}>
      <SimpleHeader title="Incident Detail" onBack={() => navigation.goBack()} />

      <ScrollView contentContainerStyle={styles.body}>
        <View style={[styles.titleCard, { backgroundColor: config.background }]}>
          <View style={styles.titleRow}>
            <Text style={styles.title}>{alert.title}</Text>
            <SeverityBadge severity={alert.severity} />
          </View>
          <Text style={styles.location}>{alert.location}</Text>
        </View>

        <View style={styles.infoCard}>
          <InfoRow icon="📍" label="LOCATION" value={alert.location} />
          <InfoRow icon="🕐" label="REPORTED" value={alert.detail.reported} />
          <InfoRow icon="⏳" label="DURATION" value={alert.detail.duration} />
          <Text style={styles.statusLabel}>
            STATUS: <Text style={styles.statusValue}>{alert.detail.status}</Text>
          </Text>
        </View>

        <Text style={styles.sectionLabel}>DESCRIPTION</Text>
        <View style={styles.descriptionCard}>
          <Text style={styles.descriptionText}>{alert.detail.fullDescription}</Text>
        </View>

        <View style={styles.aiCard}>
          <Text style={styles.aiLabel}>AI VERIFICATION</Text>
          <Text style={styles.aiText}>{alert.detail.aiVerification}</Text>
        </View>

        {userType === 'emergency' && (
          <View style={styles.actionRow}>
            <View style={styles.actionButtonWrap}>
              <Button
                label="Verify Status"
                variant="outline"
                onPress={() => navigation.navigate('VerifyIncident', { alertId: alert.id })}
              />
            </View>
            <View style={styles.actionButtonWrap}>
              <Button
                label="Update Status"
                onPress={() => navigation.navigate('UpdateIncident', { alertId: alert.id })}
              />
            </View>
          </View>
        )}
      </ScrollView>
    </View>
  );
}

function InfoRow({ icon, label, value }) {
  return (
    <View style={styles.infoRow}>
      <Text style={styles.infoIcon}>{icon}</Text>
      <View>
        <Text style={styles.infoLabel}>{label}</Text>
        <Text style={styles.infoValue}>{value}</Text>
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
    paddingHorizontal: theme.layout.spacing[5],
    paddingTop: theme.layout.spacing[5],
    paddingBottom: theme.layout.spacing[8],
  },
  titleCard: {
    borderRadius: theme.layout.radius[4],
    padding: theme.layout.spacing[5],
    marginBottom: theme.layout.spacing[4],
  },
  titleRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: theme.layout.spacing[2],
  },
  title: {
    ...theme.typography.heading.h4,
    color: theme.colors.neutral[900],
    flex: 1,
    marginRight: theme.layout.spacing[2],
  },
  location: {
    ...theme.typography.body.b3,
    color: theme.colors.neutral[600],
  },
  infoCard: {
    backgroundColor: theme.colors.neutral[100],
    borderRadius: theme.layout.radius[4],
    padding: theme.layout.spacing[4],
    marginBottom: theme.layout.spacing[5],
  },
  infoRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: theme.layout.spacing[3],
  },
  infoIcon: {
    marginRight: theme.layout.spacing[3],
    fontSize: 16,
  },
  infoLabel: {
    ...theme.typography.body.b4,
    color: theme.colors.primary[600],
    letterSpacing: 0.5,
  },
  infoValue: {
    ...theme.typography.body.b2,
    color: theme.colors.neutral[900],
  },
  statusLabel: {
    ...theme.typography.body.b3,
    fontFamily: theme.typography.fontFamily.headingBold,
    color: theme.colors.secondaryWarm[600],
    marginTop: theme.layout.spacing[1],
  },
  statusValue: {
    color: theme.colors.secondaryWarm[600],
  },
  sectionLabel: {
    ...theme.typography.body.b4,
    color: theme.colors.neutral[500],
    letterSpacing: 1,
    marginBottom: theme.layout.spacing[2],
  },
  descriptionCard: {
    backgroundColor: theme.colors.neutral[100],
    borderRadius: theme.layout.radius[4],
    padding: theme.layout.spacing[4],
    marginBottom: theme.layout.spacing[5],
  },
  descriptionText: {
    ...theme.typography.body.b3,
    color: theme.colors.neutral[700],
    lineHeight: 20,
  },
  aiCard: {
    backgroundColor: theme.colors.secondaryWarm[50],
    borderWidth: theme.layout.stroke[0],
    borderColor: theme.colors.secondaryWarm[300],
    borderRadius: theme.layout.radius[4],
    padding: theme.layout.spacing[4],
  },
  aiLabel: {
    ...theme.typography.body.b4,
    fontFamily: theme.typography.fontFamily.headingBold,
    color: theme.colors.secondaryWarm[700],
    marginBottom: theme.layout.spacing[1],
  },
  aiText: {
    ...theme.typography.body.b3,
    color: theme.colors.secondaryWarm[700],
    lineHeight: 20,
  },
  actionRow: {
    flexDirection: 'row',
    marginTop: theme.layout.spacing[5],
  },
  actionButtonWrap: {
    flex: 1,
    marginHorizontal: theme.layout.spacing[1],
  },
});