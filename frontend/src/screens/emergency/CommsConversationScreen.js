import { useState } from 'react';
import { View, Text, TextInput, Pressable, FlatList, StyleSheet } from 'react-native';
import { theme } from '../../theme';
import SimpleHeader from '../../components/SimpleHeader';
import { COMMS_THREADS } from '../../data/commsThreads';

export default function CommsConversationScreen({ route, navigation }) {
  const { contactId, contactName } = route.params ?? {};
  const thread = COMMS_THREADS[contactId];

  const [messages, setMessages] = useState(thread?.messages ?? []);
  const [draft, setDraft] = useState('');

  const handleSend = () => {
    if (!draft.trim()) return;
    setMessages((prev) => [
      ...prev,
      { id: String(prev.length + 1), sender: 'You', text: draft.trim() },
    ]);
    setDraft('');
  };

  return (
    <View style={styles.container}>
      <SimpleHeader title={contactName ?? 'Comms'} onBack={() => navigation.goBack()} backgroundColor="#DFECE0" titleColor="#498058" arrowColor="#498058" />

      {thread?.incident && (
        <View style={styles.incidentBanner}>
          <Text style={styles.incidentText}>
            <Text style={styles.incidentDot}>● </Text>
            {thread.incident.id} • {thread.incident.location} • Units {thread.incident.units} assigned
          </Text>
        </View>
      )}
      {thread?.incident && (
        <Text style={styles.timestamp}>{thread.incident.timestamp}</Text>
      )}

      <FlatList
        data={messages}
        keyExtractor={(item) => item.id}
        contentContainerStyle={styles.messageList}
        renderItem={({ item }) => {
          const isControl = item.sender === 'Control';
          const isMe = item.sender === 'You';
          return (
            <View style={[styles.messageBlock, (isMe) && styles.messageBlockRight]}>
              {!isMe && (
                <View style={styles.senderRow}>
                  <Text style={styles.senderLabel}>{item.sender}</Text>
                  {item.priority && (
                    <View style={styles.priorityTag}>
                      <Text style={styles.priorityTagText}>Priority</Text>
                    </View>
                  )}
                </View>
              )}
              <View
                style={[
                  styles.bubble,
                  isControl ? styles.bubbleControl : styles.bubbleUnit,
                  isMe && styles.bubbleMine,
                ]}
              >
                <Text
                  style={[
                    styles.bubbleText,
                    (!isControl || isMe) && styles.bubbleTextOnDark,
                  ]}
                >
                  {item.text}
                </Text>
              </View>
            </View>
          );
        }}
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
  incidentBanner: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: theme.colors.red[900] ?? '#480916',
    paddingHorizontal: theme.layout.spacing[4],
    paddingVertical: theme.layout.spacing[2],
  },
  incidentText: {
    ...theme.typography.body.b4,
    color: '#FFFFFF',
    flex: 1,
  },
  incidentDot: {
    color: theme.colors.red[400] ?? '#F8A9AD',
  },
  timestamp: {
    ...theme.typography.body.b4,
    color: theme.colors.neutral[400],
    textAlign: 'center',
    marginTop: theme.layout.spacing[2],
  },
  messageList: {
    paddingHorizontal: theme.layout.spacing[5],
    paddingTop: theme.layout.spacing[3],
    paddingBottom: theme.layout.spacing[4],
  },
  messageBlock: {
    marginBottom: theme.layout.spacing[3],
    alignItems: 'flex-start',
  },
  messageBlockRight: {
    alignItems: 'flex-end',
  },
  senderRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: theme.layout.spacing[1],
  },
  senderLabel: {
    ...theme.typography.body.b4,
    color: theme.colors.neutral[500],
    marginRight: theme.layout.spacing[2],
  },
  priorityTag: {
    backgroundColor: theme.colors.red[100],
    borderRadius: theme.layout.radius.full,
    paddingHorizontal: theme.layout.spacing[2],
    paddingVertical: 1,
  },
  priorityTagText: {
    ...theme.typography.body.b4,
    color: theme.colors.red[700],
    fontSize: 10,
  },
  bubble: {
    maxWidth: '85%',
    borderRadius: theme.layout.radius[4],
    paddingHorizontal: theme.layout.spacing[4],
    paddingVertical: theme.layout.spacing[3],
  },
  bubbleControl: {
    backgroundColor: theme.colors.neutral[100],
  },
  bubbleUnit: {
    backgroundColor: theme.colors.primary[500],
  },
  bubbleMine: {
    backgroundColor: theme.colors.primary[700],
  },
  bubbleText: {
    ...theme.typography.body.b3,
    color: theme.colors.neutral[900],
  },
  bubbleTextOnDark: {
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