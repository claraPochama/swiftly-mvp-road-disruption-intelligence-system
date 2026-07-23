import { createNativeStackNavigator } from '@react-navigation/native-stack';
import ChatsListScreen from '../screens/passenger/ChatsListScreen';
import ChatConversationScreen from '../screens/passenger/ChatConversationScreen';

const Stack = createNativeStackNavigator();

export default function ChatsStackNavigator() {
  return (
    <Stack.Navigator screenOptions={{ headerShown: false }}>
      <Stack.Screen name="ChatsList" component={ChatsListScreen} />
      <Stack.Screen name="ChatConversation" component={ChatConversationScreen} />
    </Stack.Navigator>
  );
}