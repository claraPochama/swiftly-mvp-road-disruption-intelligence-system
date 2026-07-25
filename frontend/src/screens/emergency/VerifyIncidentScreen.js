import { useState } from 'react';
import { View, Text, Pressable, ScrollView, StyleSheet } from 'react-native';
import { theme } from '../../theme';
import SimpleHeader from '../../components/SimpleHeader';
import SeverityBadge, { SEVERITY_CONFIG } from '../../components/SeverityBadge';
import Button from '../../components/Button';
import { useAlerts } from '../../context/AlertsContext';

const VERIFICATION_METHODS = [
  'Visually confirmed the scene',
  'Confirmed via CCTV',
  'Cross-checked with TII data',
  'Duplicate report',
  'Confirmed via council road team',
  'Partially confirmed',
  'Others',
];

// Static demo AI copy — the backend has no AI-assessment field (plan.md G is
// deferred pending design), so this text is illustrative only.
const AI_CONFIDENCE_PERCENT = 80;
const AI_CONFIDENCE_EXPLANATION =
  'Report timing and description align with the expected pattern. No contradicting reports found.';

export default function VerifyIncidentScreen({ route, navigation }) {
  const { alertId } = route.params ?? {};
  const { alerts, verifyAlert } = useAlerts();
  const alert = alerts.find((a) => a.id === alertId) ?? alerts[0];
  const config = SEVERITY_CONFIG[alert?.severity] ?? SEVERITY_CONFIG.medium;

  const [selectedMethod, setSelectedMethod] = useState('Visually confirmed the scene');
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState(null);

  if (!alert) {
    return (
      <View style={styles.container}>
        <SimpleHeader title="Verify Incident" onBack={() => navigation.goBack()} />
      </View>
    );
  }

  const act = async (verified) => {
    if (busy) return;
    setBusy(true);
    setError(null);
    try {
      await verifyAlert(alert.id, { verified, method: selectedMethod });
      navigation.goBack();
    } catch (e) {
      setError(e.message);
      setBusy(false);
    }
  };

  const handleReject = () => act(false);
  const handleConfirm = () => act(true);

  return (
    <View style={styles.container}>
      <SimpleHeader title="Verify Incident" onBack={() => navigation.goBack()} />

      <ScrollView contentContainerStyle={styles.body}>
        <View style={[styles.titleCard, { backgroundColor: config.background }]}>
          <View style={styles.titleRow}>
            <Text style={styles.title}>{alert.title}</Text>
            <SeverityBadge severity={alert.severity} />
          </View>
          <Text style={styles.location}>{alert.location}</Text>
        </View>

        <Text style={styles.sectionLabel}>WHAT WAS REPORTED</Text>
        <View style={styles.grayCard}>
          <Text style={styles.grayCardText}>{alert.description}</Text>
        </View>

        <Text style={styles.sectionLabel}>SOURCE</Text>
        <View style={styles.grayCard}>
          <Text style={styles.grayCardText}>
            Submitted via Swiftly • {alert.sourceCategory === 'community_report'
              ? 'Passenger mode'
              : 'Official source'}
          </Text>
          <Text style={styles.reportCount}>Status: {alert.statusLabel}</Text>
        </View>

        <View style={styles.aiCard}>
          <Text style={styles.aiLabel}>AI CONFIDENCE ASSESSMENT</Text>
          <View style={styles.confidenceRow}>
            <Text style={styles.confidenceMatchLabel}>Report matches TII road data</Text>
            <Text style={styles.confidencePercent}>{AI_CONFIDENCE_PERCENT}%</Text>
          </View>
          <View style={styles.confidenceBarTrack}>
            <View
              style={[styles.confidenceBarFill, { width: `${AI_CONFIDENCE_PERCENT}%` }]}
            />
          </View>
          <Text style={styles.aiText}>{AI_CONFIDENCE_EXPLANATION}</Text>
        </View>

        <Text style={styles.sectionLabel}>HOW DID YOU VERIFY THIS?</Text>
        <View style={styles.chipRow}>
          {VERIFICATION_METHODS.map((method) => {
            const isSelected = selectedMethod === method;
            return (
              <Pressable
                key={method}
                style={[styles.chip, isSelected && styles.chipSelected]}
                onPress={() => setSelectedMethod(method)}
              >
                <Text style={[styles.chipText, isSelected && styles.chipTextSelected]}>
                  {method}
                </Text>
              </Pressable>
            );
          })}
        </View>

        {error ? <Text style={styles.errorText}>{error}</Text> : null}

        <View style={styles.actionRow}>
          <View style={styles.actionButtonWrap}>
            <Button
              label="✕ Reject"
              variant="outline"
              color={theme.colors.red[600]}
              onPress={handleReject}
              disabled={busy}
            />
          </View>
          <View style={styles.actionButtonWrap}>
            <Button label={busy ? 'Saving…' : 'Confirm'} onPress={handleConfirm} disabled={busy} />
          </View>
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
  sectionLabel: {
    ...theme.typography.body.b4,
    color: theme.colors.neutral[500],
    letterSpacing: 1,
    marginBottom: theme.layout.spacing[2],
  },
  grayCard: {
    backgroundColor: theme.colors.neutral[100],
    borderRadius: theme.layout.radius[4],
    padding: theme.layout.spacing[4],
    marginBottom: theme.layout.spacing[5],
  },
  grayCardText: {
    ...theme.typography.body.b3,
    color: theme.colors.neutral[700],
    lineHeight: 20,
  },
  reportCount: {
    ...theme.typography.body.b2,
    fontFamily: theme.typography.fontFamily.headingBold,
    color: theme.colors.neutral[900],
    marginTop: theme.layout.spacing[1],
  },
  aiCard: {
    backgroundColor: theme.colors.secondaryWarm[50],
    borderWidth: theme.layout.stroke[0],
    borderColor: theme.colors.secondaryWarm[300],
    borderRadius: theme.layout.radius[4],
    padding: theme.layout.spacing[4],
    marginBottom: theme.layout.spacing[5],
  },
  aiLabel: {
    ...theme.typography.body.b4,
    fontFamily: theme.typography.fontFamily.headingBold,
    color: theme.colors.secondaryWarm[700],
    marginBottom: theme.layout.spacing[2],
  },
  confidenceRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: theme.layout.spacing[1],
  },
  confidenceMatchLabel: {
    ...theme.typography.body.b3,
    fontFamily: theme.typography.fontFamily.bodyMedium,
    color: theme.colors.secondaryWarm[700],
  },
  confidencePercent: {
    ...theme.typography.body.b3,
    fontFamily: theme.typography.fontFamily.headingBold,
    color: theme.colors.secondaryWarm[700],
  },
  confidenceBarTrack: {
    height: 4,
    borderRadius: 2,
    backgroundColor: theme.colors.secondaryWarm[200],
    marginBottom: theme.layout.spacing[3],
  },
  confidenceBarFill: {
    height: 4,
    borderRadius: 2,
    backgroundColor: theme.colors.secondaryWarm[600],
  },
  aiText: {
    ...theme.typography.body.b3,
    color: theme.colors.secondaryWarm[700],
    lineHeight: 20,
  },
  chipRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    marginBottom: theme.layout.spacing[5],
  },
  chip: {
    borderWidth: theme.layout.stroke[0],
    borderColor: theme.colors.neutral[300],
    borderRadius: theme.layout.radius.full,
    paddingHorizontal: theme.layout.spacing[4],
    paddingVertical: theme.layout.spacing[2],
    marginRight: theme.layout.spacing[2],
    marginBottom: theme.layout.spacing[2],
  },
  chipSelected: {
    backgroundColor: theme.colors.green[600],
    borderColor: theme.colors.green[600],
  },
  chipText: {
    ...theme.typography.body.b3,
    color: theme.colors.neutral[700],
  },
  chipTextSelected: {
    color: '#FFFFFF',
  },
  actionRow: {
    flexDirection: 'row',
    marginTop: theme.layout.spacing[2],
  },
  actionButtonWrap: {
    flex: 1,
    marginHorizontal: theme.layout.spacing[1],
  },
  errorText: {
    ...theme.typography.body.b3,
    color: theme.colors.red[600],
    marginBottom: theme.layout.spacing[3],
  },
});