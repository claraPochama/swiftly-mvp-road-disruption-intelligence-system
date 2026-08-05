import { createNativeStackNavigator } from '@react-navigation/native-stack';
import AlertsScreen from '../screens/shared/AlertsScreen';
import IncidentDetailScreen from '../screens/shared/IncidentDetailScreen';
import VerifyIncidentScreen from '../screens/emergency/VerifyIncidentScreen';
import UpdateIncidentScreen from '../screens/emergency/UpdateIncidentScreen';
import PendingQueueScreen from '../screens/emergency/PendingQueueScreen';

const Stack = createNativeStackNavigator();

export default function AlertsStackNavigator() {
  return (
    <Stack.Navigator screenOptions={{ headerShown: false }}>
      <Stack.Screen name="AlertsList" component={AlertsScreen} />

      <Stack.Screen name="IncidentDetail" component={IncidentDetailScreen} />

      <Stack.Screen name="VerifyIncident" component={VerifyIncidentScreen} />

      <Stack.Screen name="UpdateIncident" component={UpdateIncidentScreen} />

      <Stack.Screen name="PendingQueue" component={PendingQueueScreen} />
    </Stack.Navigator>
  );
}