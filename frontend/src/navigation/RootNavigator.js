import { createNativeStackNavigator } from '@react-navigation/native-stack';
import BrandIntroScreen from '../screens/auth/BrandIntroScreen';
import SplashScreen from '../screens/auth/SplashScreen';
import OnboardingScreen1 from '../screens/auth/OnboardingScreen1';
import OnboardingScreen2 from '../screens/auth/OnboardingScreen2';
import UserTypeScreen from '../screens/auth/UserTypeScreen';
import LoginSignupChooserScreen from '../screens/auth/LoginSignupChooserScreen';
import LoginScreen from '../screens/auth/LoginScreen';
import SignupScreen from '../screens/auth/SignupScreen';
import ForgotPasswordScreen from '../screens/auth/ForgotPasswordScreen';
import VerifyAccountScreen from '../screens/auth/VerifyAccountScreen';
import MainTabNavigator from './MainTabNavigator';

const Stack = createNativeStackNavigator();

// Pre-login flow:
// BrandIntro (~1s) -> Splash (~2s) -> Onboarding 1 -> Onboarding 2 -> User Type
// -> Login/SignUp chooser -> Login OR Signup
// Every screen in the flow is built, so it can be clicked through end-to-end.
export default function RootNavigator() {
  return (
    <Stack.Navigator
      initialRouteName="BrandIntro"
      screenOptions={{ headerShown: false }}
    >
      <Stack.Screen name="BrandIntro" component={BrandIntroScreen} />

      <Stack.Screen name="Splash" component={SplashScreen} />

      <Stack.Screen name="Onboarding1" component={OnboardingScreen1} />

      <Stack.Screen name="Onboarding2" component={OnboardingScreen2} />

      <Stack.Screen name="UserType" component={UserTypeScreen} />

      <Stack.Screen name="LoginSignupChooser" component={LoginSignupChooserScreen} />

      <Stack.Screen name="Login" component={LoginScreen} />

      <Stack.Screen name="Signup" component={SignupScreen} />

      <Stack.Screen name="ForgotPassword" component={ForgotPasswordScreen} />

      <Stack.Screen name="VerifyAccount" component={VerifyAccountScreen} />

      <Stack.Screen name="MainApp" component={MainTabNavigator} />
    </Stack.Navigator>
  );
}