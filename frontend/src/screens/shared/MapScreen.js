import { useState } from 'react';
import { View, Text, TextInput, Pressable, FlatList, StyleSheet } from 'react-native';
import { WebView } from 'react-native-webview';
import { theme } from '../../theme';
import WarningBanner from '../../components/WarningBanner';

// Cork, Ireland — matches the region used throughout your prototype screenshots.
const CORK_LAT = 51.8985;
const CORK_LNG = -8.4756;

// Free map using Leaflet + OpenStreetMap tiles inside a WebView — no API key,
// no billing, and stays fully compatible with Expo Go (no native map module).
// To draw GeoJSON from the backend later: pass it in as a prop, JSON.stringify
// it into this HTML string, and call L.geoJSON(data).addTo(map) in the script
// below — or use webViewRef.current.injectJavaScript(...) to push data in
// after the map has already loaded.
const leafletHtml = `
<!DOCTYPE html>
<html>
  <head>
    <meta name="viewport" content="width=device-width, initial-scale=1.0, maximum-scale=1.0, user-scalable=no" />
    <link rel="stylesheet" href="https://unpkg.com/leaflet@1.9.4/dist/leaflet.css" />
    <style>
      html, body, #map { height: 100%; margin: 0; padding: 0; }
    </style>
  </head>
  <body>
    <div id="map"></div>
    <script src="https://unpkg.com/leaflet@1.9.4/dist/leaflet.js"></script>
    <script>
      var map = L.map('map', { zoomControl: false }).setView([${CORK_LAT}, ${CORK_LNG}], 13);
      L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
        maxZoom: 19,
        attribution: '&copy; OpenStreetMap contributors'
      }).addTo(map);
    </script>
  </body>
</html>
`;

const RECENT_SEARCHES = [
  { id: '1', title: 'Dublin Airport, Terminal 2', subtitle: 'Dublin' },
  { id: '2', title: 'Limerick City', subtitle: 'Limerick' },
  { id: '3', title: 'Blarney Castle & Gardens', subtitle: 'Blarney, Cork' },
  { id: '4', title: 'Cork Airport', subtitle: 'Cork' },
];

export default function MapScreen() {
  const [searchExpanded, setSearchExpanded] = useState(false);
  const [startLocation, setStartLocation] = useState('');
  const [destination, setDestination] = useState('');

  return (
    <View style={styles.container}>
      <WebView
        style={StyleSheet.absoluteFill}
        originWhitelist={['*']}
        source={{ html: leafletHtml }}
        onShouldStartLoadWithRequest={(request) => {
          // Allow the initial inline HTML to load, but block any attempt to
          // navigate away from it — e.g. tapping the "Leaflet" attribution
          // link in the map's corner, which otherwise hijacks the whole
          // screen by loading leafletjs.com inside this WebView.
          return request.url === 'about:blank' || request.url.startsWith('data:');
        }}
      />

      <View style={styles.topBar}>
        {!searchExpanded ? (
          <Pressable
            style={styles.searchPill}
            onPress={() => setSearchExpanded(true)}
          >
            <Text style={styles.searchIcon}>🔍</Text>
            <Text style={styles.searchPlaceholder}>Search</Text>
          </Pressable>
        ) : (
          <View style={styles.routePanel}>
            <View style={styles.routeInputs}>
              <View style={styles.routeRow}>
                <View style={[styles.routeDot, { backgroundColor: theme.colors.neutral[400] }]} />
                <TextInput
                  style={styles.routeInput}
                  placeholder="Choose start location"
                  placeholderTextColor={theme.colors.neutral[400]}
                  value={startLocation}
                  onChangeText={setStartLocation}
                />
              </View>
              <View style={styles.routeDivider} />
              <View style={styles.routeRow}>
                <View style={[styles.routeSquare, { backgroundColor: theme.colors.neutral[400] }]} />
                <TextInput
                  style={styles.routeInput}
                  placeholder="Choose destination"
                  placeholderTextColor={theme.colors.neutral[400]}
                  value={destination}
                  onChangeText={setDestination}
                />
              </View>
            </View>

            <Pressable
              style={styles.linkRow}
              onPress={() => {
                /* TODO: wire up real device location once permissions are set up */
              }}
            >
              <Text style={styles.linkText}>◎ Use my current location</Text>
            </Pressable>

            <Pressable style={styles.linkRow}>
              <Text style={styles.linkText}>📍 Choose on Map</Text>
            </Pressable>
          </View>
        )}
      </View>

      {searchExpanded && (
        <View style={styles.expandedBody}>
          <WarningBanner text="Weather alert active – Cork region. Heavy rain forecast, check conditions before departure." />

          <Text style={styles.sectionLabel}>RECENT SEARCHES</Text>

          <FlatList
            data={RECENT_SEARCHES}
            keyExtractor={(item) => item.id}
            renderItem={({ item }) => (
              <Pressable style={styles.recentItem}>
                <Text style={styles.recentIcon}>🕐</Text>
                <View>
                  <Text style={styles.recentTitle}>{item.title}</Text>
                  <Text style={styles.recentSubtitle}>{item.subtitle}</Text>
                </View>
              </Pressable>
            )}
          />

          <Pressable
            style={styles.closeSearch}
            onPress={() => setSearchExpanded(false)}
          >
            <Text style={styles.closeSearchText}>Close</Text>
          </Pressable>
        </View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  topBar: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    backgroundColor: theme.colors.primary[500],
    paddingTop: theme.layout.spacing[9],
    paddingBottom: theme.layout.spacing[6],
    paddingHorizontal: theme.layout.spacing[5],
    borderBottomLeftRadius: 30,
    borderBottomRightRadius: 30,
  },
  searchPill: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
    borderRadius: theme.layout.radius.full,
    paddingVertical: theme.layout.spacing[3],
    paddingHorizontal: theme.layout.spacing[4],
  },
  searchIcon: {
    marginRight: theme.layout.spacing[2],
  },
  searchPlaceholder: {
    ...theme.typography.body.b2,
    color: theme.colors.neutral[400],
  },
  routePanel: {
    backgroundColor: '#FFFFFF',
    borderRadius: theme.layout.radius[5],
    padding: theme.layout.spacing[4],
  },
  routeInputs: {
    marginBottom: theme.layout.spacing[3],
  },
  routeRow: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: theme.layout.spacing[2],
  },
  routeDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    marginRight: theme.layout.spacing[3],
  },
  routeSquare: {
    width: 8,
    height: 8,
    marginRight: theme.layout.spacing[3],
  },
  routeInput: {
    flex: 1,
    ...theme.typography.body.b2,
    color: theme.colors.neutral[900],
  },
  routeDivider: {
    height: 1,
    backgroundColor: theme.colors.neutral[200],
    marginLeft: 20,
  },
  linkRow: {
    paddingVertical: theme.layout.spacing[2],
  },
  linkText: {
    ...theme.typography.body.b3,
    color: theme.colors.primary[600],
  },
  expandedBody: {
    position: 'absolute',
    top: '38%',
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: '#FFFFFF',
    paddingHorizontal: theme.layout.spacing[5],
    paddingTop: theme.layout.spacing[4],
  },
  sectionLabel: {
    ...theme.typography.body.b4,
    color: theme.colors.neutral[500],
    letterSpacing: 1,
    marginTop: theme.layout.spacing[5],
    marginBottom: theme.layout.spacing[2],
  },
  recentItem: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: theme.colors.primary[50],
    borderRadius: theme.layout.radius[3],
    padding: theme.layout.spacing[3],
    marginBottom: theme.layout.spacing[2],
  },
  recentIcon: {
    marginRight: theme.layout.spacing[3],
  },
  recentTitle: {
    ...theme.typography.body.b2,
    color: theme.colors.neutral[900],
  },
  recentSubtitle: {
    ...theme.typography.body.b4,
    color: theme.colors.neutral[500],
  },
  closeSearch: {
    alignItems: 'center',
    paddingVertical: theme.layout.spacing[3],
  },
  closeSearchText: {
    ...theme.typography.body.b3,
    color: theme.colors.neutral[500],
  },
});