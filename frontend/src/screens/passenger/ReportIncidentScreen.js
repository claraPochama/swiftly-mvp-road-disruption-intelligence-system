import { useState } from 'react';
import { View, Text, TextInput, Pressable, ScrollView, StyleSheet } from 'react-native';
import { theme } from '../../theme';
import SimpleHeader from '../../components/SimpleHeader';
import Button from '../../components/Button';
import { SEVERITY_CONFIG } from '../../components/SeverityBadge';

const DISRUPTION_TYPES = [
  'Traffic Collision',
  'Road Works',
  'Flooding',
  'Debris on Road',
  'Animal on Road',
  'Other',
];

const SEVERITIES = ['caution', 'disrupted', 'clear'];

// In a real build this would come from the device's GPS — hardcoded here
// to match your prototype screenshot, same placeholder pattern as the Map screen.
const CURRENT_LOCATION = 'M50 Northbound, near J6';

export default function ReportIncidentScreen({ navigation }) {
  const [selectedType, setSelectedType] = useState(null);
  const [selectedSeverity, setSelectedSeverity] = useState(null);
  const [description, setDescription] = useState('');
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = () => {
    // No backend wired up yet — just shows the confirmation state locally.
    setSubmitted(true);
  };

  if (submitted) {
    return (
      <View style={styles.container}>
        <SimpleHeader title="Report Incident" onBack={() => navigation.goBack()} backgroundColor="#DFECE0" titleColor="#498058" arrowColor="#498058" />
        <View style={styles.confirmationWrap}>
          <Text style={styles.confirmationCheck}>✓</Text>
          <Text style={styles.confirmationText}>Report Submitted!</Text>
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
          <Text style={styles.locationLabel}>LOCATION</Text>
          <Text style={styles.locationValue}>📍 {CURRENT_LOCATION}</Text>
        </View>

        <Text style={styles.sectionLabel}>DISRUPTION TYPE</Text>
        <View style={styles.chipRow}>
          {DISRUPTION_TYPES.map((type) => {
            const isSelected = selectedType === type;
            return (
              <Pressable
                key={type}
                style={[styles.chip, isSelected && styles.chipSelected]}
                onPress={() => setSelectedType(type)}
              >
                <Text style={[styles.chipText, isSelected && styles.chipTextSelected]}>
                  {type}
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

        <Button label="Submit Report" onPress={handleSubmit} />
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
});