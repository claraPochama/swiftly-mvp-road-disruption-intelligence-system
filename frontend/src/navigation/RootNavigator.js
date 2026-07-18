import { createNativeStackNavigator } from '@react-navigation/native-stack';
import SplashScreen from '../screens/SplashScreen';
import PlaceholderScreen from '../screens/PlaceholderScreen';

const Stack = createNativeStackNavigator();

// This covers the "before the user is logged in" flow:
// Splash -> Onboarding 1 -> Onboarding 2 -> User Type -> Login/Signup
// Screens not built yet use PlaceholderScreen as a stand-in so the whole
// flow can be clicked through and tested end-to-end. Swap each
// PlaceholderScreen line for the real component as you build it.
export default function RootNavigator() {
  return (
    <Stack.Navigator
      initialRouteName="Splash"
      screenOptions={{ headerShown: false }}
    >
      <Stack.Screen name="Splash" component={SplashScreen} />

      <Stack.Screen name="Onboarding1">
        {() => <PlaceholderScreen label="Onboarding 1" />}
      </Stack.Screen>

      <Stack.Screen name="Onboarding2">
        {() => <PlaceholderScreen label="Onboarding 2" />}
      </Stack.Screen>

      <Stack.Screen name="UserType">
        {() => <PlaceholderScreen label="User Type" />}
      </Stack.Screen>

      <Stack.Screen name="Login">
        {() => <PlaceholderScreen label="Login" />}
      </Stack.Screen>

      <Stack.Screen name="Signup">
        {() => <PlaceholderScreen label="Signup" />}
      </Stack.Screen>

      {/* Once you've built real Map/Alerts/Week Ahead/Profile screens,
          this becomes a nested bottom-tab navigator instead of a placeholder. */}
      <Stack.Screen name="MainApp">
        {() => <PlaceholderScreen label="Main App (bottom tabs)" />}
      </Stack.Screen>
    </Stack.Navigator>
  );
}