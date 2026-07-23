import { useState } from 'react';
import { View, Text, TextInput, Pressable, FlatList, StyleSheet } from 'react-native';
import { theme } from '../../theme';
import SimpleHeader from '../../components/SimpleHeader';
import SeverityBadge, { SEVERITY_CONFIG } from '../../components/SeverityBadge';
import { useAlerts } from '../../context/AlertsContext';

export default function AlertsScreen({ navigation }) {
  const { alerts } = useAlerts();
  const [searchText, setSearchText] = useState('');

  const filteredAlerts = searchText
    ? alerts.filter(
        (alert) =>
          alert.area.toLowerCase().includes(searchText.toLowerCase()) ||
          alert.location.toLowerCase().includes(searchText.toLowerCase())
      )
    : alerts;

  return (
    <View style={styles.container}>
      <SimpleHeader title="Alerts" />

      <View style={styles.searchWrap}>
        <TextInput
          style={styles.searchInput}
          placeholder="Search Area"
          placeholderTextColor={theme.colors.neutral[400]}
          value={searchText}
          onChangeText={setSearchText}
        />
      </View>

      <FlatList
        data={filteredAlerts}
        keyExtractor={(item) => item.id}
        contentContainerStyle={styles.list}
        renderItem={({ item }) => {
          const config = SEVERITY_CONFIG[item.severity];
          return (
            <View style={[styles.card, { backgroundColor: config.background }]}>
              <View style={styles.cardTopRow}>
                <SeverityBadge severity={item.severity} />
                <Text style={styles.timeAgo}>{item.timeAgo}</Text>
              </View>

              <Text style={styles.cardTitle}>{item.title}</Text>
              <Text style={styles.cardDescription}>{item.description}</Text>

              <View style={styles.cardBottomRow}>
                <Text style={styles.location}>📍 {item.location}</Text>
                <Pressable
                  onPress={() =>
                    navigation.navigate('IncidentDetail', { alertId: item.id })
                  }
                >
                  <Text style={styles.detailsLink}>Details →</Text>
                </Pressable>
              </View>
            </View>
          );
        }}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FFFFFF',
  },
  searchWrap: {
    paddingHorizontal: theme.layout.spacing[5],
    marginTop: theme.layout.spacing[4],
    marginBottom: theme.layout.spacing[2],
  },
  searchInput: {
    backgroundColor: theme.colors.neutral[100],
    borderRadius: theme.layout.radius.full,
    paddingHorizontal: theme.layout.spacing[4],
    paddingVertical: theme.layout.spacing[3],
    ...theme.typography.body.b3,
    color: theme.colors.neutral[900],
  },
  list: {
    paddingHorizontal: theme.layout.spacing[5],
    paddingBottom: theme.layout.spacing[6],
  },
  card: {
    borderRadius: theme.layout.radius[4],
    padding: theme.layout.spacing[4],
    marginTop: theme.layout.spacing[3],
  },
  cardTopRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: theme.layout.spacing[2],
  },
  timeAgo: {
    ...theme.typography.body.b4,
    color: theme.colors.neutral[500],
  },
  cardTitle: {
    ...theme.typography.heading.h6,
    color: theme.colors.neutral[900],
    marginBottom: theme.layout.spacing[1],
  },
  cardDescription: {
    ...theme.typography.body.b3,
    color: theme.colors.neutral[600],
    marginBottom: theme.layout.spacing[3],
  },
  cardBottomRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  location: {
    ...theme.typography.body.b4,
    color: theme.colors.neutral[500],
    flex: 1,
  },
  detailsLink: {
    ...theme.typography.body.b3,
    fontFamily: theme.typography.fontFamily.headingBold,
    color: theme.colors.neutral[900],
  },
});