import { useState, useRef, useEffect, useCallback } from 'react';
import { View, Text, Pressable, FlatList, StyleSheet } from 'react-native';
import { WebView } from 'react-native-webview';
import { theme } from '../../theme';
import WarningBanner from '../../components/WarningBanner';
import RouteRadioIcon from '../../components/icons/RouteRadioIcon';
import ReportIncidentIcon from '../../components/icons/ReportIncidentIcon';
import { useUserType } from '../../context/UserTypeContext';
import { useRoute } from '../../context/RouteContext';
import { api } from '../../api/client';

// Cork, Ireland — matches the region used throughout the prototype screenshots.
const CORK_LAT = 51.8985;
const CORK_LNG = -8.4756;

// Free map using Leaflet + OpenStreetMap tiles inside a WebView — no API key,
// no billing, Expo Go compatible. `window.drawOverlay(featureCollection)` draws
// the selected route's segments coloured by worst_severity; we push the backend
// overlay GeoJSON in via injectJavaScript once both the map and the data are ready.
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
      var map = L.map('map', { zoomControl: false }).setView([${CORK_LAT}, ${CORK_LNG}], 11);
      L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
        maxZoom: 19,
        attribution: '&copy; OpenStreetMap contributors'
      }).addTo(map);

      function colorFor(sev) {
        if (sev === 'high') return '#D72741';
        if (sev === 'medium') return '#E16F15';
        return '#2E7A6C'; // low or none -> clear green
      }

      var routeLayer = null;
      window.drawOverlay = function (fc) {
        if (routeLayer) { map.removeLayer(routeLayer); }
        routeLayer = L.geoJSON(fc, {
          style: function (feature) {
            return {
              color: colorFor(feature.properties && feature.properties.worst_severity),
              weight: 6,
              opacity: 0.85,
            };
          },
        }).addTo(map);
        try { map.fitBounds(routeLayer.getBounds(), { padding: [40, 40] }); } catch (e) {}
      };
      window.ReactNativeWebView && window.ReactNativeWebView.postMessage('map-ready');
    </script>
  </body>
</html>
`;

export default function MapScreen({ navigation }) {
  const { userType } = useUserType();
  const { routes, selectedRouteId, setSelectedRouteId, selectedRoute } = useRoute();
  const webViewRef = useRef(null);
  const mapReadyRef = useRef(false);
  const [overlay, setOverlay] = useState(null);
  const [searchExpanded, setSearchExpanded] = useState(false);

  // Fetch the selected route's map overlay (geometry + per-segment severity).
  useEffect(() => {
    let cancelled = false;
    api
      .getOverlay(selectedRouteId)
      .then((fc) => {
        if (!cancelled) setOverlay(fc);
      })
      .catch(() => {
        if (!cancelled) setOverlay(null);
      });
    return () => {
      cancelled = true;
    };
  }, [selectedRouteId]);

  // Push the overlay into the map once both the data and the map are ready.
  const drawOverlay = useCallback(() => {
    if (!overlay || !mapReadyRef.current || !webViewRef.current) return;
    webViewRef.current.injectJavaScript(
      `window.drawOverlay(${JSON.stringify(overlay)}); true;`
    );
  }, [overlay]);

  useEffect(() => {
    drawOverlay();
  }, [drawOverlay]);

  return (
    <View style={styles.container}>
      <WebView
        ref={webViewRef}
        style={StyleSheet.absoluteFill}
        originWhitelist={['*']}
        source={{ html: leafletHtml }}
        onMessage={(event) => {
          if (event.nativeEvent.data === 'map-ready') {
            mapReadyRef.current = true;
            drawOverlay();
          }
        }}
        onShouldStartLoadWithRequest={(request) => {
          // Block only top-level navigation to external sites (e.g. tapping the
          // Leaflet attribution link). CDN <script>/<link> and tiles are resource
          // loads, not navigation, so they still load.
          return !request.url.startsWith('http://') && !request.url.startsWith('https://');
        }}
      />

      <Pressable
        style={styles.routeRadioButton}
        onPress={() => navigation.navigate('RouteRadio')}
      >
        <RouteRadioIcon size={56} />
      </Pressable>

      {userType !== 'driver' && (
        <Pressable
          style={styles.reportButton}
          onPress={() => navigation.navigate('ReportIncident')}
        >
          <ReportIncidentIcon size={56} />
        </Pressable>
      )}

      <View style={styles.topBar}>
        {!searchExpanded ? (
          <Pressable style={styles.searchPill} onPress={() => setSearchExpanded(true)}>
            <Text style={styles.searchIcon}>🔍</Text>
            <Text style={styles.searchPlaceholder}>{selectedRoute.label}</Text>
          </Pressable>
        ) : (
          <View style={styles.routePanel}>
            <Text style={styles.routePanelLabel}>SELECT A ROUTE</Text>
            {routes.map((r) => {
              const isSelected = r.routeId === selectedRouteId;
              return (
                <Pressable
                  key={r.routeId}
                  style={[styles.routeChoice, isSelected && styles.routeChoiceSelected]}
                  onPress={() => {
                    setSelectedRouteId(r.routeId);
                    setSearchExpanded(false);
                  }}
                >
                  <View style={[styles.routeDot, isSelected && styles.routeDotSelected]} />
                  <Text
                    style={[styles.routeChoiceText, isSelected && styles.routeChoiceTextSelected]}
                  >
                    {r.label}
                  </Text>
                </Pressable>
              );
            })}
          </View>
        )}
      </View>

      {searchExpanded && (
        <View style={styles.expandedBody}>
          <WarningBanner text="Weather alert active – Cork region. Heavy rain forecast, check conditions before departure." />

          <Text style={styles.sectionLabel}>ROUTES</Text>

          <FlatList
            data={routes}
            keyExtractor={(item) => item.routeId}
            renderItem={({ item }) => (
              <Pressable
                style={styles.recentItem}
                onPress={() => {
                  setSelectedRouteId(item.routeId);
                  setSearchExpanded(false);
                }}
              >
                <Text style={styles.recentIcon}>🛣️</Text>
                <View>
                  <Text style={styles.recentTitle}>{item.label}</Text>
                  <Text style={styles.recentSubtitle}>
                    {item.origin} to {item.destination}
                  </Text>
                </View>
              </Pressable>
            )}
          />

          <Pressable style={styles.closeSearch} onPress={() => setSearchExpanded(false)}>
            <Text style={styles.closeSearchText}>Close</Text>
          </Pressable>
        </View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  routeRadioButton: {
    position: 'absolute',
    top: 220,
    right: theme.layout.spacing[5],
    zIndex: 10,
    elevation: 4,
  },
  reportButton: {
    position: 'absolute',
    top: 288,
    right: theme.layout.spacing[5],
    zIndex: 10,
    elevation: 4,
  },
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
  searchPlaceholder: {
    ...theme.typography.body.b2,
    color: theme.colors.neutral[900],
  },
  routePanel: {
    backgroundColor: '#FFFFFF',
    borderRadius: theme.layout.radius[5],
    padding: theme.layout.spacing[4],
  },
  routePanelLabel: {
    ...theme.typography.body.b4,
    color: theme.colors.neutral[500],
    letterSpacing: 1,
    marginBottom: theme.layout.spacing[3],
  },
  routeChoice: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: theme.layout.spacing[3],
  },
  routeChoiceSelected: {},
  routeDot: {
    width: 10,
    height: 10,
    borderRadius: 5,
    backgroundColor: theme.colors.neutral[300],
    marginRight: theme.layout.spacing[3],
  },
  routeDotSelected: {
    backgroundColor: theme.colors.primary[500],
  },
  routeChoiceText: {
    ...theme.typography.body.b2,
    color: theme.colors.neutral[700],
  },
  routeChoiceTextSelected: {
    color: theme.colors.neutral[900],
    fontFamily: theme.typography.fontFamily.bodyMedium,
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
