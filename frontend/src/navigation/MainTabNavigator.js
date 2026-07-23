import { Text } from 'react-native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { theme } from '../theme';
import { useUserType } from '../context/UserTypeContext';
import MapStackNavigator from './MapStackNavigator';
import AlertsStackNavigator from './AlertsStackNavigator';
import WeekAheadScreen from '../screens/shared/WeekAheadScreen';
import ChatsStackNavigator from './ChatsStackNavigator';
import CommsStackNavigator from './CommsStackNavigator';
import ProfileScreen from '../screens/shared/ProfileScreen';

const Tab = createBottomTabNavigator();

// Tabs differ by role, per your prototype:
//   - Driver: 4 tabs — no Chat/Report Incident (kept hands-free)
//   - Passenger: 5 tabs — adds "Chats"
//   - Emergency Personnel: 5 tabs — adds "Comms" instead of "Chats"
const TAB_ICONS = {
  Map: '📍',
  Alerts: '⚠️',
  'Week Ahead': '🗓️',
  Chats: '💬',
  Comms: '💬',
  Profile: '👤',
};

export default function MainTabNavigator() {
  const { userType } = useUserType();

  return (
    <Tab.Navigator
      screenOptions={({ route }) => ({
        headerShown: false,
        tabBarActiveTintColor: '#FFFFFF',
        tabBarInactiveTintColor: theme.colors.primary[200],
        tabBarStyle: {
          backgroundColor: theme.colors.primary[500],
          borderTopWidth: 0,
          height: 64,
          paddingBottom: theme.layout.spacing[2],
          paddingTop: theme.layout.spacing[2],
        },
        tabBarLabelStyle: {
          fontFamily: theme.typography.fontFamily.bodyMedium,
          fontSize: 11,
        },
        tabBarIcon: () => <Text style={{ fontSize: 18 }}>{TAB_ICONS[route.name]}</Text>,
      })}
    >
      <Tab.Screen name="Map" component={MapStackNavigator} />
      <Tab.Screen name="Alerts" component={AlertsStackNavigator} />
      <Tab.Screen name="Week Ahead" component={WeekAheadScreen} />

      {userType === 'passenger' && (
        <Tab.Screen name="Chats" component={ChatsStackNavigator} />
      )}

      {userType === 'emergency' && (
        <Tab.Screen name="Comms" component={CommsStackNavigator} />
      )}

      <Tab.Screen name="Profile" component={ProfileScreen} />
    </Tab.Navigator>
  );
}