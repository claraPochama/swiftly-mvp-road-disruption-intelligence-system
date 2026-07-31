import { useState, useRef, useEffect } from 'react';
import { View, Text, Pressable, ScrollView, StyleSheet } from 'react-native';
import * as Speech from 'expo-speech';
import { theme } from '../../theme';
import SimpleHeader from '../../components/SimpleHeader';
import { api } from '../../api/client';
import { useRoute } from '../../context/RouteContext';

// expo-speech doesn't reliably report real-time playback position on Android
// (onBoundary is mostly iOS-only), so instead of guessing a duration upfront,
// we measure the ACTUAL wall-clock time the first time it plays, then use
// that measured value for the timer/progress bar on every play after that.
// Until the first playthrough finishes, we show a rough word-count estimate
// so the UI isn't blank.
const WORDS_PER_MINUTE = 155;

function estimateSeconds(text) {
  return Math.max(8, Math.round(((text?.split(' ').length ?? 0) / WORDS_PER_MINUTE) * 60));
}

function formatTime(seconds) {
  const m = Math.floor(seconds / 60);
  const s = Math.floor(seconds % 60);
  return `${m}:${String(s).padStart(2, '0')}`;
}

export default function RouteRadioScreen({ navigation }) {
  const { selectedRouteId } = useRoute();
  const [scriptText, setScriptText] = useState('');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [elapsed, setElapsed] = useState(0);
  const [knownDuration, setKnownDuration] = useState(null); // set after first real playthrough
  const intervalRef = useRef(null);
  const startTimeRef = useRef(null);

  const displayedTotal = knownDuration ?? estimateSeconds(scriptText);

  // Fetch the spoken bulletin for the current route from the backend.
  useEffect(() => {
    let cancelled = false;
    setLoading(true);
    setError(null);
    api
      .generateBroadcast(selectedRouteId)
      .then((res) => {
        if (!cancelled) setScriptText(res.script_text ?? '');
      })
      .catch((e) => {
        if (!cancelled) setError(e.message);
      })
      .finally(() => {
        if (!cancelled) setLoading(false);
      });
    return () => {
      cancelled = true;
    };
  }, [selectedRouteId]);

  useEffect(() => {
    return () => {
      Speech.stop();
      if (intervalRef.current) clearInterval(intervalRef.current);
    };
  }, []);

  const startTimer = () => {
    if (intervalRef.current) clearInterval(intervalRef.current);
    startTimeRef.current = Date.now();
    intervalRef.current = setInterval(() => {
      const realElapsed = (Date.now() - startTimeRef.current) / 1000;
      setElapsed(Math.min(realElapsed, displayedTotal));
    }, 200); // smoother bar movement than a 1-second tick
  };

  const stopTimer = () => {
    if (intervalRef.current) clearInterval(intervalRef.current);
  };

  const handlePlayPause = () => {
    if (isPlaying) {
      Speech.stop();
      stopTimer();
      setIsPlaying(false);
      return;
    }

    if (!scriptText) return;

    setIsPlaying(true);
    setElapsed(0);
    startTimer();

    Speech.speak(scriptText, {
      rate: 0.95,
      onDone: () => {
        // Now we know the real duration — lock it in for next time.
        const realDuration = (Date.now() - startTimeRef.current) / 1000;
        setKnownDuration(realDuration);
        setElapsed(realDuration);
        stopTimer();
        setIsPlaying(false);
      },
      onStopped: () => {
        stopTimer();
        setIsPlaying(false);
      },
      onError: () => {
        stopTimer();
        setIsPlaying(false);
      },
    });
  };

  const progressPercent = Math.min(100, (elapsed / displayedTotal) * 100);

  return (
    <View style={styles.container}>
      <SimpleHeader title="Route Radio" onBack={() => navigation.goBack()} backgroundColor="#DFECE0" titleColor="#498058" arrowColor="#498058" />

      <ScrollView contentContainerStyle={styles.body}>
        <View style={styles.pill}>
          <Text style={styles.pillText}>Route Radio</Text>
        </View>

        <Pressable
          style={[styles.playButton, (loading || !scriptText) && styles.playButtonDisabled]}
          onPress={handlePlayPause}
          disabled={loading || !scriptText}
        >
          <Text style={styles.playIcon}>{isPlaying ? '⏸' : '▶'}</Text>
        </Pressable>

        <View style={styles.progressRow}>
          <View style={styles.progressBarTrack}>
            <View style={[styles.progressBarFill, { width: `${progressPercent}%` }]} />
          </View>
        </View>
        <View style={styles.timeRow}>
          <Text style={styles.timeText}>{formatTime(elapsed)}</Text>
          <Text style={styles.timeText}>{formatTime(displayedTotal)}</Text>
        </View>

        <View style={styles.alertCard}>
          <View style={styles.alertLabelRow}>
            <View style={styles.alertDot} />
            <Text style={styles.alertLabel}>CURRENT BROADCAST</Text>
          </View>
          <Text style={styles.alertText}>
            {loading
              ? 'Generating your route broadcast…'
              : error
                ? `Couldn't load the broadcast. ${error}`
                : scriptText}
          </Text>
        </View>

        <View style={styles.controlsRow}>
          <View style={styles.controlButton}>
            <Text style={styles.controlIcon}>🔉</Text>
            <Text style={styles.controlLabel}>Volume</Text>
          </View>
          <View style={styles.controlButton}>
            <Text style={styles.controlIcon}>⏭</Text>
            <Text style={styles.controlLabel}>Next</Text>
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
    alignItems: 'center',
    paddingHorizontal: theme.layout.spacing[6],
    paddingTop: theme.layout.spacing[6],
    paddingBottom: theme.layout.spacing[8],
  },
  pill: {
    borderWidth: theme.layout.stroke[0],
    borderColor: theme.colors.primary[300],
    borderRadius: theme.layout.radius.full,
    paddingHorizontal: theme.layout.spacing[4],
    paddingVertical: theme.layout.spacing[1],
    marginBottom: theme.layout.spacing[6],
  },
  pillText: {
    ...theme.typography.body.b3,
    color: theme.colors.primary[600],
  },
  playButton: {
    width: 110,
    height: 110,
    borderRadius: 55,
    borderWidth: theme.layout.stroke[0],
    borderColor: theme.colors.primary[300],
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: theme.layout.spacing[6],
  },
  playButtonDisabled: {
    opacity: 0.4,
  },
  playIcon: {
    fontSize: 32,
    color: theme.colors.primary[600],
  },
  progressRow: {
    width: '100%',
    marginBottom: theme.layout.spacing[1],
  },
  progressBarTrack: {
    height: 4,
    borderRadius: 2,
    backgroundColor: theme.colors.neutral[200],
  },
  progressBarFill: {
    height: 4,
    borderRadius: 2,
    backgroundColor: theme.colors.primary[600],
  },
  timeRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    width: '100%',
    marginBottom: theme.layout.spacing[6],
  },
  timeText: {
    ...theme.typography.body.b4,
    color: theme.colors.primary[600],
  },
  alertCard: {
    width: '100%',
    backgroundColor: theme.colors.primary[50],
    borderRadius: theme.layout.radius[4],
    padding: theme.layout.spacing[4],
    marginBottom: theme.layout.spacing[6],
  },
  alertLabelRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: theme.layout.spacing[2],
  },
  alertDot: {
    width: 6,
    height: 6,
    borderRadius: 3,
    backgroundColor: theme.colors.red[600],
    marginRight: theme.layout.spacing[2],
  },
  alertLabel: {
    ...theme.typography.body.b4,
    fontFamily: theme.typography.fontFamily.headingBold,
    color: theme.colors.red[600],
    letterSpacing: 0.5,
  },
  alertText: {
    ...theme.typography.body.b2,
    color: theme.colors.primary[700],
    lineHeight: 20,
  },
  controlsRow: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    width: '60%',
  },
  controlButton: {
    alignItems: 'center',
    opacity: 0.4,
  },
  controlIcon: {
    fontSize: 20,
    marginBottom: 2,
  },
  controlLabel: {
    ...theme.typography.body.b4,
    color: theme.colors.neutral[500],
  },
});