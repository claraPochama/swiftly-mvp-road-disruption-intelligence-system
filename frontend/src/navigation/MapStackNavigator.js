import { createNativeStackNavigator } from '@react-navigation/native-stack';
import MapScreen from '../screens/shared/MapScreen';
import RouteRadioScreen from '../screens/driver/RouteRadioScreen';
import ReportIncidentScreen from '../screens/passenger/ReportIncidentScreen';

const Stack = createNativeStackNavigator();

export default function MapStackNavigator() {
  return (
    <Stack.Navigator screenOptions={{ headerShown: false }}>
      <Stack.Screen name="MapMain" component={MapScreen} />
      <Stack.Screen name="RouteRadio" component={RouteRadioScreen} />
      <Stack.Screen name="ReportIncident" component={ReportIncidentScreen} />
    </Stack.Navigator>
  );
}