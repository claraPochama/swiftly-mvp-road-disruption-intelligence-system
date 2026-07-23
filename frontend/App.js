import { NavigationContainer } from '@react-navigation/native';
import { useFonts, PlusJakartaSans_700Bold } from '@expo-google-fonts/plus-jakarta-sans';
import { Poppins_400Regular, Poppins_500Medium } from '@expo-google-fonts/poppins';
import { Aboreto_400Regular } from '@expo-google-fonts/aboreto';
import { View } from 'react-native';
import RootNavigator from './src/navigation/RootNavigator';
import { UserTypeProvider } from './src/context/UserTypeContext';
import { AlertsProvider } from './src/context/AlertsContext';

export default function App() {
  const [fontsLoaded] = useFonts({
    'PlusJakartaSans-Bold': PlusJakartaSans_700Bold,
    'Poppins-Regular': Poppins_400Regular,
    'Poppins-Medium': Poppins_500Medium,
    'Aboreto-Regular': Aboreto_400Regular,
  });

  if (!fontsLoaded) {
    return <View style={{ flex: 1, backgroundColor: '#FFFFFF' }} />;
  }

  return (
    <UserTypeProvider>
      <AlertsProvider>
        <NavigationContainer>
          <RootNavigator />
        </NavigationContainer>
      </AlertsProvider>
    </UserTypeProvider>
  );
}