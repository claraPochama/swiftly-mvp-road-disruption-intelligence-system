import { createNativeStackNavigator } from '@react-navigation/native-stack';
import CommsListScreen from '../screens/emergency/CommsListScreen';
import CommsConversationScreen from '../screens/emergency/CommsConversationScreen';

const Stack = createNativeStackNavigator();

export default function CommsStackNavigator() {
  return (
    <Stack.Navigator screenOptions={{ headerShown: false }}>
      <Stack.Screen name="CommsList" component={CommsListScreen} />
      <Stack.Screen name="CommsConversation" component={CommsConversationScreen} />
    </Stack.Navigator>
  );
}