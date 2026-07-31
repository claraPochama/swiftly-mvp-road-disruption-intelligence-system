import { useState } from 'react';
import { View, Text, TextInput, Pressable, ScrollView, StyleSheet } from 'react-native';
import { theme } from '../../theme';
import SimpleHeader from '../../components/SimpleHeader';
import Button from '../../components/Button';
import { SEVERITY_CONFIG } from '../../components/SeverityBadge';
import { useAlerts } from '../../context/AlertsContext';
import { useRoute } from '../../context/RouteContext';

// UI label -> backend disruption_type slug (free string on the backend).
const DISRUPTION_TYPES = [
  { label: 'Traffic Collision', value: 'collision' },
  { label: 'Road Works', value: 'roadworks' },
  { label: 'Flooding', value: 'flood' },
  { label: 'Debris on Road', value: 'debris' },
  { label: 'Animal on Road', value: 'animal' },
  { label: 'Other', value: 'other' },
];

// Backend severity vocabulary (plan.md A).
const SEVERITIES = ['high', 'medium', 'low'];

export default function ReportIncidentScreen({ navigation }) {
  const { submitReport } = useAlerts();
  const { selectedRoute } = useRoute();
  const [selectedType, setSelectedType] = useState(null);
  const [selectedSeverity, setSelectedSeverity] = useState(null);
  const [description, setDescription] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState(null);
  const [submitted, setSubmitted] = useState(false);

  // No GPS in the prototype (plan.md D): a fixed demo spot maps to a real,
  // valid segment on the selected route, so the report never 422s.
  const currentLocation = selectedRoute.reportLocationLabel;

  const canSubmit = selectedType && selectedSeverity && !submitting;

  const handleSubmit = async () => {
    if (!canSubmit) return;
    setSubmitting(true);
    setError(null);
    try {
      await submitReport({
        segmentId: selectedRoute.reportSegmentId,
        disruptionType: selectedType.value,
        severity: selectedSeverity,
        description: description.trim() || `${selectedType.label} reported by a passenger.`,
      });
      setSubmitted(true);
    } catch (e) {
      setError(e.message);
    } finally {
      setSubmitting(false);
    }
  };

  if (submitted) {
    return (
      <View style={styles.container}>
        <SimpleHeader title="Report Incident" onBack={() => navigation.goBack()} backgroundColor="#DFECE0" titleColor="#498058" arrowColor="#498058" />
        <View style={styles.confirmationWrap}>
          <Text style={styles.confirmationCheck}>✓</Text>
          <Text style={styles.confirmationText}>Report Submitted!</Text>
          <Text style={styles.confirmationNote}>
            Your report is now visible as unverified until emergency personnel confirm it.
          </Text>
        </View>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <SimpleHeader title="Report Incident" onBack={() => navigation.goBack()} backgroundColor="#DFECE0" titleColor="#498058" arrowColor="#498058" />

      <ScrollView contentContainerStyle={styles.body}>
        <Text style={styles.intro}>
          Help other road users by reporting a disruption on your route.
        </Text>

        <View style={styles.locationBox}>
          <Text style={styles.locationLabel}>LOCATION · {selectedRoute.label}</Text>
          <Text style={styles.locationValue}>📍 {currentLocation}</Text>
        </View>

        <Text style={styles.sectionLabel}>DISRUPTION TYPE</Text>
        <View style={styles.chipRow}>
          {DISRUPTION_TYPES.map((type) => {
            const isSelected = selectedType?.value === type.value;
            return (
              <Pressable
                key={type.value}
                style={[styles.chip, isSelected && styles.chipSelected]}
                onPress={() => setSelectedType(type)}
              >
                <Text style={[styles.chipText, isSelected && styles.chipTextSelected]}>
                  {type.label}
                </Text>
              </Pressable>
            );
          })}
        </View>

        <Text style={styles.sectionLabel}>SEVERITY</Text>
        <View style={styles.chipRow}>
          {SEVERITIES.map((severity) => {
            const isSelected = selectedSeverity === severity;
            const config = SEVERITY_CONFIG[severity];
            return (
              <Pressable
                key={severity}
                style={[
                  styles.severityChip,
                  { borderColor: config.color },
                  isSelected && { backgroundColor: config.color },
                ]}
                onPress={() => setSelectedSeverity(severity)}
              >
                <Text
                  style={[
                    styles.severityChipText,
                    { color: isSelected ? '#FFFFFF' : config.color },
                  ]}
                >
                  {config.label}
                </Text>
              </Pressable>
            );
          })}
        </View>

        <Text style={styles.sectionLabel}>DESCRIPTION</Text>
        <View style={styles.descriptionBox}>
          <TextInput
            style={styles.descriptionInput}
            placeholder="Describe what you see..."
            placeholderTextColor={theme.colors.neutral[400]}
            value={description}
            onChangeText={setDescription}
            multiline
          />
          <Pressable style={styles.addPhotoButton}>
            <Text style={styles.addPhotoText}>📷 Add photo</Text>
          </Pressable>
        </View>

        {error ? <Text style={styles.errorText}>{error}</Text> : null}

        <Button
          label={submitting ? 'Submitting…' : 'Submit Report'}
          onPress={handleSubmit}
          disabled={!canSubmit}
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
    paddingTop: theme.layout.spacing[4],
    paddingBottom: theme.layout.spacing[8],
  },
  intro: {
    ...theme.typography.body.b3,
    color: theme.colors.neutral[600],
    marginBottom: theme.layout.spacing[4],
  },
  locationBox: {
    borderWidth: theme.layout.stroke[0],
    borderColor: theme.colors.neutral[200],
    borderRadius: theme.layout.radius[4],
    padding: theme.layout.spacing[3],
    marginBottom: theme.layout.spacing[5],
  },
  locationLabel: {
    ...theme.typography.body.b4,
    color: theme.colors.neutral[500],
    letterSpacing: 0.5,
    marginBottom: 2,
  },
  locationValue: {
    ...theme.typography.body.b2,
    color: theme.colors.neutral[900],
  },
  sectionLabel: {
    ...theme.typography.body.b4,
    color: theme.colors.neutral[500],
    letterSpacing: 1,
    marginBottom: theme.layout.spacing[2],
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
    backgroundColor: theme.colors.primary[500],
    borderColor: theme.colors.primary[500],
  },
  chipText: {
    ...theme.typography.body.b3,
    color: theme.colors.neutral[700],
  },
  chipTextSelected: {
    color: '#FFFFFF',
  },
  severityChip: {
    borderWidth: theme.layout.stroke[0],
    borderRadius: theme.layout.radius.full,
    paddingHorizontal: theme.layout.spacing[5],
    paddingVertical: theme.layout.spacing[2],
    marginRight: theme.layout.spacing[2],
    marginBottom: theme.layout.spacing[2],
  },
  severityChipText: {
    ...theme.typography.body.b3,
    fontFamily: theme.typography.fontFamily.bodyMedium,
  },
  descriptionBox: {
    borderWidth: theme.layout.stroke[0],
    borderColor: theme.colors.neutral[200],
    borderRadius: theme.layout.radius[4],
    padding: theme.layout.spacing[3],
    marginBottom: theme.layout.spacing[6],
  },
  descriptionInput: {
    ...theme.typography.body.b3,
    color: theme.colors.neutral[900],
    minHeight: 80,
    textAlignVertical: 'top',
  },
  addPhotoButton: {
    borderTopWidth: theme.layout.stroke[0],
    borderTopColor: theme.colors.neutral[200],
    paddingTop: theme.layout.spacing[2],
    marginTop: theme.layout.spacing[2],
  },
  addPhotoText: {
    ...theme.typography.body.b3,
    color: theme.colors.primary[600],
  },
  confirmationWrap: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  confirmationCheck: {
    fontSize: 48,
    color: theme.colors.green[600],
    marginBottom: theme.layout.spacing[4],
  },
  confirmationText: {
    ...theme.typography.heading.h4,
    color: theme.colors.primary[600],
  },
  confirmationNote: {
    ...theme.typography.body.b3,
    color: theme.colors.neutral[500],
    textAlign: 'center',
    marginTop: theme.layout.spacing[3],
    paddingHorizontal: theme.layout.spacing[6],
  },
  errorText: {
    ...theme.typography.body.b3,
    color: theme.colors.red[600],
    marginBottom: theme.layout.spacing[3],
  },
});