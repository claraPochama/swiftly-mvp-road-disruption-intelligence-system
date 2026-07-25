import { useEffect, useState, useCallback } from 'react';
import {
  View,
  Text,
  FlatList,
  ActivityIndicator,
  RefreshControl,
  StyleSheet,
} from 'react-native';
import { theme } from '../../theme';
import SimpleHeader from '../../components/SimpleHeader';
import SeverityBadge, { SEVERITY_CONFIG } from '../../components/SeverityBadge';
import SourceBadge from '../../components/SourceBadge';
import Button from '../../components/Button';
import { api } from '../../api/client';
import { toAlert } from '../../api/mapping';
import { useAlerts } from '../../context/AlertsContext';

// The emergency-personnel review queue backed by GET /disruptions/pending
// (plan.md I). Community reports awaiting confirmation; confirming one here
// posts a "confirmed" update so it becomes visible in the driver broadcast.
export default function PendingQueueScreen({ navigation }) {
  const { reload: reloadAlerts } = useAlerts();
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [busyId, setBusyId] = useState(null);

  const load = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const data = await api.getPending();
      setItems(data.map(toAlert));
    } catch (e) {
      setError(e.message);
      setItems([]);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    load();
  }, [load]);

  const confirm = async (id) => {
    setBusyId(id);
    try {
      await api.addUpdate(id, {
        status: 'confirmed',
        note: 'Verified by emergency personnel from the review queue.',
      });
      await load();
      reloadAlerts(); // keep the driver-facing list in sync too
    } catch (e) {
      setError(e.message);
    } finally {
      setBusyId(null);
    }
  };

  return (
    <View style={styles.container}>
      <SimpleHeader title="Pending Reports" onBack={() => navigation.goBack()} />

      <FlatList
        data={items}
        keyExtractor={(item) => item.id}
        contentContainerStyle={styles.list}
        refreshControl={<RefreshControl refreshing={loading} onRefresh={load} />}
        ListEmptyComponent={
          <View style={styles.emptyWrap}>
            {loading ? <ActivityIndicator color={theme.colors.primary[500]} /> : null}
            <Text style={styles.emptyText}>
              {error ? `Couldn't load the queue.\n${error}` : 'No reports awaiting review.'}
            </Text>
          </View>
        }
        renderItem={({ item }) => {
          const config = SEVERITY_CONFIG[item.severity] ?? SEVERITY_CONFIG.medium;
          return (
            <View style={[styles.card, { backgroundColor: config.background }]}>
              <View style={styles.cardTopRow}>
                <SeverityBadge severity={item.severity} />
                <Text style={styles.timeAgo}>{item.timeAgo}</Text>
              </View>
              <Text style={styles.cardTitle}>{item.title}</Text>
              <Text style={styles.cardDescription} numberOfLines={3}>
                {item.description}
              </Text>
              <View style={styles.sourceRow}>
                <SourceBadge
                  sourceCategory={item.sourceCategory}
                  statedOrInferred={item.statedOrInferred}
                />
              </View>
              <Button
                label={busyId === item.id ? 'Confirming…' : 'Confirm report'}
                onPress={() => confirm(item.id)}
                disabled={busyId === item.id}
              />
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
  list: {
    paddingHorizontal: theme.layout.spacing[5],
    paddingTop: theme.layout.spacing[4],
    paddingBottom: theme.layout.spacing[6],
  },
  card: {
    borderRadius: theme.layout.radius[4],
    padding: theme.layout.spacing[4],
    marginBottom: theme.layout.spacing[3],
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
  sourceRow: {
    marginBottom: theme.layout.spacing[4],
  },
  emptyWrap: {
    alignItems: 'center',
    paddingTop: theme.layout.spacing[8],
  },
  emptyText: {
    ...theme.typography.body.b3,
    color: theme.colors.neutral[500],
    textAlign: 'center',
    marginTop: theme.layout.spacing[3],
  },
});
