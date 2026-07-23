import { View, Text, Pressable, FlatList, StyleSheet } from 'react-native';
import { theme } from '../../theme';
import SimpleHeader from '../../components/SimpleHeader';

// Mock contacts — matches the list shown in your prototype screenshots.
const CONTACTS = [
  { id: 'bob', name: 'Bob', subtitle: 'Collisions, closures' },
  { id: 'nimah', name: 'Nimah', subtitle: 'Road works, flooding' },
  { id: 'sean', name: 'Sean', subtitle: 'Resolved incidents' },
  { id: 'john', name: 'John', subtitle: 'Forecasted disruptions' },
];

export default function ChatsListScreen({ navigation }) {
  return (
    <View style={styles.container}>
      <SimpleHeader title="Chat" />

      <FlatList
        data={CONTACTS}
        keyExtractor={(item) => item.id}
        contentContainerStyle={styles.list}
        renderItem={({ item }) => (
          <Pressable
            style={styles.row}
            onPress={() =>
              navigation.navigate('ChatConversation', {
                contactId: item.id,
                contactName: item.name,
              })
            }
          >
            <View style={styles.avatar}>
              <Text style={styles.avatarIcon}>👤</Text>
            </View>
            <View>
              <Text style={styles.name}>{item.name}</Text>
              <Text style={styles.subtitle}>{item.subtitle}</Text>
            </View>
          </Pressable>
        )}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FFFFFF',
  },
  list: {
    paddingHorizontal: theme.layout.spacing[5],
    paddingTop: theme.layout.spacing[4],
  },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: theme.layout.spacing[3],
    borderBottomWidth: theme.layout.stroke[0],
    borderBottomColor: theme.colors.neutral[200],
  },
  avatar: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: theme.colors.primary[900],
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: theme.layout.spacing[3],
  },
  avatarIcon: {
    fontSize: 18,
  },
  name: {
    ...theme.typography.body.b1,
    color: theme.colors.neutral[900],
  },
  subtitle: {
    ...theme.typography.body.b4,
    color: theme.colors.neutral[500],
  },
});