import { createNativeStackNavigator } from '@react-navigation/native-stack';
import AlertsScreen from '../screens/shared/AlertsScreen';
import IncidentDetailScreen from '../screens/shared/IncidentDetailScreen';
import VerifyIncidentScreen from '../screens/emergency/VerifyIncidentScreen';
import UpdateIncidentScreen from '../screens/emergency/UpdateIncidentScreen';

const Stack = createNativeStackNavigator();

// A tab needs its own stack navigator (rather than just one screen) whenever
// tapping something inside it should push to a new screen while the bottom
// tab bar stays visible — e.g. Alerts -> Incident Detail.
export default function AlertsStackNavigator() {
  return (
    <Stack.Navigator screenOptions={{ headerShown: false }}>
      <Stack.Screen name="AlertsList" component={AlertsScreen} />

      <Stack.Screen name="IncidentDetail" component={IncidentDetailScreen} />

      <Stack.Screen name="VerifyIncident" component={VerifyIncidentScreen} />

      <Stack.Screen name="UpdateIncident" component={UpdateIncidentScreen} />
    </Stack.Navigator>
  );
}