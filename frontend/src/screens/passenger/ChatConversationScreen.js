import { useState } from 'react';
import { View, Text, TextInput, Pressable, FlatList, StyleSheet } from 'react-native';
import { theme } from '../../theme';
import SimpleHeader from '../../components/SimpleHeader';

// Starting mock thread — just enough to show the conversation UI working.
// No backend wired up yet, so messages sent from this screen only exist locally.
const INITIAL_MESSAGES = [
  { id: '1', from: 'them', text: 'Any updates on the N22 flooding near Ballincollig?' },
  { id: '2', from: 'me', text: 'Still closed as of 10 minutes ago, diversion via R608.' },
  { id: '3', from: 'them', text: 'Thanks — heading that way now, appreciate the heads up.' },
];

export default function ChatConversationScreen({ route, navigation }) {
  const { contactName } = route.params ?? {};
  const [messages, setMessages] = useState(INITIAL_MESSAGES);
  const [draft, setDraft] = useState('');

  const handleSend = () => {
    if (!draft.trim()) return;
    setMessages((prev) => [...prev, { id: String(prev.length + 1), from: 'me', text: draft.trim() }]);
    setDraft('');
  };

  return (
    <View style={styles.container}>
      <SimpleHeader title={contactName ?? 'Chat'} onBack={() => navigation.goBack()} backgroundColor="#DFECE0" titleColor="#498058" arrowColor="#498058" />

      <FlatList
        data={messages}
        keyExtractor={(item) => item.id}
        contentContainerStyle={styles.messageList}
        renderItem={({ item }) => (
          <View
            style={[
              styles.bubble,
              item.from === 'me' ? styles.bubbleMine : styles.bubbleTheirs,
            ]}
          >
            <Text style={[styles.bubbleText, item.from === 'me' && styles.bubbleTextMine]}>
              {item.text}
            </Text>
          </View>
        )}
      />

      <View style={styles.inputRow}>
        <TextInput
          style={styles.input}
          placeholder="Send a message..."
          placeholderTextColor={theme.colors.neutral[400]}
          value={draft}
          onChangeText={setDraft}
          onSubmitEditing={handleSend}
        />
        <Pressable style={styles.sendButton} onPress={handleSend}>
          <Text style={styles.sendIcon}>➤</Text>
        </Pressable>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FFFFFF',
  },
  messageList: {
    paddingHorizontal: theme.layout.spacing[5],
    paddingTop: theme.layout.spacing[4],
    paddingBottom: theme.layout.spacing[4],
  },
  bubble: {
    maxWidth: '80%',
    borderRadius: theme.layout.radius[4],
    paddingHorizontal: theme.layout.spacing[4],
    paddingVertical: theme.layout.spacing[3],
    marginBottom: theme.layout.spacing[3],
  },
  bubbleTheirs: {
    backgroundColor: theme.colors.neutral[100],
    alignSelf: 'flex-start',
  },
  bubbleMine: {
    backgroundColor: theme.colors.primary[500],
    alignSelf: 'flex-end',
  },
  bubbleText: {
    ...theme.typography.body.b3,
    color: theme.colors.neutral[900],
  },
  bubbleTextMine: {
    color: '#FFFFFF',
  },
  inputRow: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: theme.layout.spacing[4],
    paddingVertical: theme.layout.spacing[3],
    borderTopWidth: theme.layout.stroke[0],
    borderTopColor: theme.colors.neutral[200],
  },
  input: {
    flex: 1,
    backgroundColor: theme.colors.neutral[100],
    borderRadius: theme.layout.radius.full,
    paddingHorizontal: theme.layout.spacing[4],
    paddingVertical: theme.layout.spacing[3],
    ...theme.typography.body.b3,
    color: theme.colors.neutral[900],
    marginRight: theme.layout.spacing[2],
  },
  sendButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: theme.colors.primary[500],
    alignItems: 'center',
    justifyContent: 'center',
  },
  sendIcon: {
    color: '#FFFFFF',
    fontSize: 16,
  },
});