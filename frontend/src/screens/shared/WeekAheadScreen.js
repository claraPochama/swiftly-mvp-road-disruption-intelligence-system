import { useState } from 'react';
import { View, Text, Pressable, ScrollView, StyleSheet } from 'react-native';
import { theme } from '../../theme';
import SimpleHeader from '../../components/SimpleHeader';
import SeverityBadge, { SEVERITY_CONFIG } from '../../components/SeverityBadge';
import { WEEK_DAYS } from '../../data/weekAhead';

const DOT_COLOR = {
  high: theme.colors.red[600],
  medium: theme.colors.orange[500],
  low: theme.colors.green[400],
};

export default function WeekAheadScreen() {
  const [selectedIndex, setSelectedIndex] = useState(0);
  const selectedDay = WEEK_DAYS[selectedIndex];

  return (
    <View style={styles.container}>
      <SimpleHeader title="Week Ahead" backgroundColor="#DFECE0" titleColor="#498058" arrowColor="#498058" />

      <View style={styles.body}>
        <Text style={styles.monthLabel}>{selectedDay.monthLabel}</Text>

        <View style={styles.dayRow}>
          {WEEK_DAYS.map((day, index) => {
            const isSelected = index === selectedIndex;
            return (
              <Pressable
                key={day.id}
                style={[styles.dayPill, isSelected && styles.dayPillSelected]}
                onPress={() => setSelectedIndex(index)}
              >
                <Text style={[styles.dayLabel, isSelected && styles.dayLabelSelected]}>
                  {day.dayLabel}
                </Text>
                <Text style={[styles.dateNum, isSelected && styles.dateNumSelected]}>
                  {day.dateNum}
                </Text>
                <View style={[styles.dot, { backgroundColor: DOT_COLOR[day.dotSeverity] }]} />
              </Pressable>
            );
          })}
        </View>

        <View style={styles.divider} />

        <View style={styles.weatherRow}>
          <Text style={styles.weatherIcon}>{selectedDay.weatherIcon}</Text>
          <View>
            <Text style={styles.weatherText}>{selectedDay.weatherText}</Text>
            <Text style={styles.weatherDate}>{selectedDay.weatherDate}</Text>
          </View>
        </View>

        <Text style={styles.sectionLabel}>PLANNED EVENTS</Text>

        {selectedDay.event ? (
          <View
            style={[
              styles.eventCard,
              {
                borderColor: (
                  SEVERITY_CONFIG[selectedDay.event.severity] ?? SEVERITY_CONFIG.medium
                ).color,
              },
            ]}
          >
            <View style={styles.eventTopRow}>
              <SeverityBadge severity={selectedDay.event.severity} />
              <Text style={styles.eventDate}>
                {selectedDay.dayLabel} {selectedDay.dateNum} {selectedDay.monthLabel.slice(0, 3)}
              </Text>
            </View>
            <Text style={styles.eventTitle}>{selectedDay.event.title}</Text>
            <Text style={styles.eventDescription}>{selectedDay.event.description}</Text>
          </View>
        ) : (
          <View style={styles.noEventCard}>
            <Text style={styles.noEventCheck}>✓</Text>
            <Text style={styles.noEventTitle}>No planned disruptions</Text>
            <Text style={styles.noEventSubtitle}>Route expected clear</Text>
          </View>
        )}
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
    paddingTop: theme.layout.spacing[4],
  },
  monthLabel: {
    ...theme.typography.heading.h5,
    color: theme.colors.neutral[900],
    marginBottom: theme.layout.spacing[3],
  },
  dayRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  dayPill: {
    alignItems: 'center',
    paddingVertical: theme.layout.spacing[2],
    paddingHorizontal: theme.layout.spacing[1],
    borderRadius: theme.layout.radius[4],
    width: 42,
  },
  dayPillSelected: {
    backgroundColor: theme.colors.primary[900],
  },
  dayLabel: {
    ...theme.typography.body.b4,
    color: theme.colors.neutral[400],
  },
  dayLabelSelected: {
    color: theme.colors.primary[200],
  },
  dateNum: {
    ...theme.typography.heading.h6,
    color: theme.colors.neutral[900],
    marginVertical: 2,
  },
  dateNumSelected: {
    color: '#FFFFFF',
  },
  dot: {
    width: 6,
    height: 6,
    borderRadius: 3,
  },
  divider: {
    height: 1,
    backgroundColor: theme.colors.neutral[200],
    marginVertical: theme.layout.spacing[4],
  },
  weatherRow: {
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: theme.layout.stroke[0],
    borderColor: theme.colors.neutral[200],
    borderRadius: theme.layout.radius[4],
    padding: theme.layout.spacing[3],
    marginBottom: theme.layout.spacing[5],
  },
  weatherIcon: {
    fontSize: 22,
    marginRight: theme.layout.spacing[3],
  },
  weatherText: {
    ...theme.typography.body.b2,
    color: theme.colors.neutral[900],
  },
  weatherDate: {
    ...theme.typography.body.b4,
    color: theme.colors.neutral[500],
  },
  sectionLabel: {
    ...theme.typography.body.b4,
    color: theme.colors.neutral[500],
    letterSpacing: 1,
    marginBottom: theme.layout.spacing[2],
  },
  eventCard: {
    borderWidth: theme.layout.stroke[0],
    borderRadius: theme.layout.radius[4],
    padding: theme.layout.spacing[4],
  },
  eventTopRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: theme.layout.spacing[2],
  },
  eventDate: {
    ...theme.typography.body.b4,
    color: theme.colors.neutral[500],
  },
  eventTitle: {
    ...theme.typography.heading.h6,
    color: theme.colors.neutral[900],
    marginBottom: theme.layout.spacing[1],
  },
  eventDescription: {
    ...theme.typography.body.b3,
    color: theme.colors.neutral[600],
  },
  noEventCard: {
    backgroundColor: theme.colors.neutral[50],
    borderRadius: theme.layout.radius[4],
    paddingVertical: theme.layout.spacing[7],
    alignItems: 'center',
  },
  noEventCheck: {
    fontSize: 24,
    color: theme.colors.green[600],
    marginBottom: theme.layout.spacing[2],
  },
  noEventTitle: {
    ...theme.typography.body.b1,
    color: theme.colors.neutral[900],
  },
  noEventSubtitle: {
    ...theme.typography.body.b4,
    color: theme.colors.neutral[500],
    marginTop: 2,
  },
});