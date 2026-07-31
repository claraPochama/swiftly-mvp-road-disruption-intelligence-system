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
import MapTabIcon from '../components/icons/MapTabIcon';
import AlertsTabIcon from '../components/icons/AlertsTabIcon';
import WeekAheadTabIcon from '../components/icons/WeekAheadTabIcon';
import ProfileTabIcon from '../components/icons/ProfileTabIcon';
import ChatsCommsTabIcon from '../components/icons/ChatsCommsTabIcon.js';

const Tab = createBottomTabNavigator();

// Tabs differ by role, per your prototype:
//   - Driver: 4 tabs — no Chat/Report Incident (kept hands-free)
//   - Passenger: 5 tabs — adds "Chats"
//   - Emergency Personnel: 5 tabs — adds "Comms" instead of "Chats"
const TAB_ICONS = {};

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
        tabBarIcon: ({ color }) => {
          if (route.name === 'Map') return <MapTabIcon size={26} />;
          if (route.name === 'Alerts') return <AlertsTabIcon size={20} color={color} />;
          if (route.name === 'Week Ahead') return <WeekAheadTabIcon size={20} color={color} />;
          if (route.name === 'Profile') return <ProfileTabIcon size={20} color={color} />;
          if (route.name === 'Chats' || route.name === 'Comms') return <ChatsCommsTabIcon size={20} color={color} />;
          return null;
        },
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