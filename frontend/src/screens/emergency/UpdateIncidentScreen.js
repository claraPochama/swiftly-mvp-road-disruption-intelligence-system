import { useState } from 'react';
import { View, Text, Pressable, TextInput, ScrollView, StyleSheet } from 'react-native';
import { theme } from '../../theme';
import SimpleHeader from '../../components/SimpleHeader';
import SeverityBadge, { SEVERITY_CONFIG } from '../../components/SeverityBadge';
import Button from '../../components/Button';
import { useAlerts } from '../../context/AlertsContext';

const ACTIONS = [
  { key: 'close', title: 'Close Incident', subtitle: 'Mark as resolved' },
  { key: 'escalate', title: 'Escalate', subtitle: 'Increase severity level' },
  { key: 'update', title: 'Update Status', subtitle: 'Amend details only' },
];

// Static demo copy — the backend has no AI-assessment field (plan.md G is
// deferred pending design), so this text is illustrative only.
const AI_WARNING_TEXT =
  "Closing this event will remove its alert from the driver feed once applied.";

export default function UpdateIncidentScreen({ route, navigation }) {
  const { alertId } = route.params ?? {};
  const { alerts, applyIncidentUpdate } = useAlerts();
  const alert = alerts.find((a) => a.id === alertId) ?? alerts[0];
  const config = SEVERITY_CONFIG[alert?.severity] ?? SEVERITY_CONFIG.medium;

  const [selectedAction, setSelectedAction] = useState('close');
  const [notes, setNotes] = useState('');
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState(null);

  if (!alert) {
    return (
      <View style={styles.container}>
        <SimpleHeader title="Incident Detail" onBack={() => navigation.goBack()} />
      </View>
    );
  }

  const handleApplyUpdates = async () => {
    if (busy) return;
    setBusy(true);
    setError(null);
    try {
      await applyIncidentUpdate(alert.id, { action: selectedAction, notes });
      navigation.goBack();
    } catch (e) {
      setError(e.message);
      setBusy(false);
    }
  };

  return (
    <View style={styles.container}>
      <SimpleHeader title="Incident Detail" onBack={() => navigation.goBack()} backgroundColor="#DFECE0" titleColor="#498058" arrowColor="#498058" />

      <ScrollView contentContainerStyle={styles.body}>
        <View style={[styles.titleCard, { backgroundColor: config.background }]}>
          <View style={styles.titleRow}>
            <Text style={styles.title}>{alert.title}</Text>
            <SeverityBadge severity={alert.severity} />
          </View>
          <Text style={styles.location}>{alert.location}</Text>
        </View>

        <Text style={styles.sectionLabel}>ACTION</Text>
        {ACTIONS.map((action) => {
          const isSelected = selectedAction === action.key;
          return (
            <Pressable
              key={action.key}
              style={[styles.actionOption, isSelected && styles.actionOptionSelected]}
              onPress={() => setSelectedAction(action.key)}
            >
              <View>
                <Text style={styles.actionOptionTitle}>{action.title}</Text>
                <Text style={styles.actionOptionSubtitle}>{action.subtitle}</Text>
              </View>
              <View style={[styles.radioOuter, isSelected && styles.radioOuterSelected]}>
                {isSelected && <View style={styles.radioInner} />}
              </View>
            </Pressable>
          );
        })}

        <Text style={styles.sectionLabel}>ASSIGNED UNIT</Text>
        <View style={styles.checkboxRow}>
          <View style={styles.checkboxBox} />
          <Text style={styles.checkboxLabel}>Bob</Text>
        </View>

        <Text style={styles.sectionLabel}>OPERATIONAL UNITS</Text>
        <TextInput
          style={styles.notesInput}
          placeholder="Add notes for the record..."
          placeholderTextColor={theme.colors.neutral[400]}
          value={notes}
          onChangeText={setNotes}
          multiline
        />

        <View style={styles.aiCard}>
          <Text style={styles.aiLabel}>NOTE</Text>
          <Text style={styles.aiText}>{AI_WARNING_TEXT}</Text>
        </View>

        {error ? <Text style={styles.errorText}>{error}</Text> : null}

        <Button
          label={busy ? 'Applying…' : 'Apply Updates'}
          onPress={handleApplyUpdates}
          disabled={busy}
        />
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
    marginBottom: theme.layout.spacing[5],
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
  actionOption: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    borderWidth: theme.layout.stroke[0],
    borderColor: theme.colors.neutral[200],
    borderRadius: theme.layout.radius[4],
    padding: theme.layout.spacing[4],
    marginBottom: theme.layout.spacing[3],
  },
  actionOptionSelected: {
    borderColor: theme.colors.primary[600],
  },
  actionOptionTitle: {
    ...theme.typography.heading.h6,
    color: theme.colors.neutral[900],
  },
  actionOptionSubtitle: {
    ...theme.typography.body.b4,
    color: theme.colors.neutral[500],
  },
  radioOuter: {
    width: 20,
    height: 20,
    borderRadius: 10,
    borderWidth: theme.layout.stroke[1],
    borderColor: theme.colors.neutral[300],
    alignItems: 'center',
    justifyContent: 'center',
  },
  radioOuterSelected: {
    borderColor: theme.colors.primary[600],
  },
  radioInner: {
    width: 10,
    height: 10,
    borderRadius: 5,
    backgroundColor: theme.colors.primary[600],
  },
  checkboxRow: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: theme.colors.neutral[100],
    borderRadius: theme.layout.radius[4],
    padding: theme.layout.spacing[4],
    marginBottom: theme.layout.spacing[5],
  },
  checkboxBox: {
    width: 18,
    height: 18,
    borderWidth: theme.layout.stroke[0],
    borderColor: theme.colors.neutral[400],
    borderRadius: theme.layout.radius[1],
    marginRight: theme.layout.spacing[3],
  },
  checkboxLabel: {
    ...theme.typography.body.b2,
    color: theme.colors.neutral[900],
  },
  notesInput: {
    backgroundColor: theme.colors.neutral[100],
    borderRadius: theme.layout.radius[4],
    padding: theme.layout.spacing[4],
    minHeight: 90,
    textAlignVertical: 'top',
    ...theme.typography.body.b3,
    color: theme.colors.neutral[900],
    marginBottom: theme.layout.spacing[5],
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
    marginBottom: theme.layout.spacing[1],
  },
  aiText: {
    ...theme.typography.body.b3,
    color: theme.colors.secondaryWarm[700],
    lineHeight: 20,
  },
  errorText: {
    ...theme.typography.body.b3,
    color: theme.colors.red[600],
    marginBottom: theme.layout.spacing[3],
  },
});