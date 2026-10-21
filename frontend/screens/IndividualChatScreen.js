import { useState } from 'react';
import { FlatList, KeyboardAvoidingView, Platform, Pressable, StyleSheet, Text, TextInput, View } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { conversationsSeed } from '../conversations';

const avatarColors = ['#F2B880', '#92B6A7', '#D88C83', '#9AA7D8', '#E3A8C0'];

export default function IndividualChatScreen({ route }) {
  const conversation = conversationsSeed.find((item) => item.id === route.params?.conversationId) || conversationsSeed[0];
  const navigation = useNavigation();
  const [draft, setDraft] = useState('');
  const [messages, setMessages] = useState(conversation.messages);
  const sendMessage = () => {
    const text = draft.trim();
    if (!text) return;
    setMessages((current) => [...current, { id: Date.now(), sender: 'me', text, time: 'Now' }]);
    setDraft('');
  };

  return <SafeAreaView style={styles.screen}><KeyboardAvoidingView style={styles.flex} behavior={Platform.OS === 'ios' ? 'padding' : undefined}>
    <View style={styles.header}><Pressable onPress={() => navigation.goBack()} style={styles.back}><Text style={styles.backText}>‹</Text></Pressable><View style={styles.person}><View style={[styles.avatar, { backgroundColor: avatarColors[conversation.id % avatarColors.length] }]}><Text style={styles.avatarText}>{conversation.avatar}</Text><View style={styles.onlineDot} /></View><View><Text style={styles.name}>{conversation.name}</Text><Text style={styles.status}>Active now</Text></View></View><Pressable style={styles.more}><Text style={styles.moreText}>...</Text></Pressable></View>
    <View style={styles.date}><View style={styles.divider} /><Text style={styles.dateText}>TODAY</Text><View style={styles.divider} /></View>
    <FlatList data={messages} keyExtractor={(item) => String(item.id)} contentContainerStyle={styles.messages} renderItem={({ item }) => { const mine = item.sender === 'me'; return <View style={[styles.messageLine, mine && styles.mineLine]}><View style={[styles.bubble, mine ? styles.mineBubble : styles.theirBubble]}><Text style={[styles.messageText, mine && styles.mineText]}>{item.text}</Text><Text style={[styles.time, mine && styles.mineTime]}>{item.time}</Text></View></View>; }} />
    <View style={styles.composerWrap}><View style={styles.composer}><TextInput value={draft} onChangeText={setDraft} onSubmitEditing={sendMessage} returnKeyType="send" placeholder="Write a message..." placeholderTextColor="#8E8E93" style={styles.input} /><Pressable onPress={sendMessage} style={[styles.send, !draft.trim() && styles.disabled]}><Text style={styles.sendText}>^</Text></Pressable></View></View>
  </KeyboardAvoidingView></SafeAreaView>;
}

const styles = StyleSheet.create({
  screen: { flex: 1, backgroundColor: '#FFFFFF' }, flex: { flex: 1 }, header: { height: 74, borderBottomWidth: 1, borderBottomColor: '#DBDBDB', paddingHorizontal: 12, flexDirection: 'row', alignItems: 'center' }, back: { width: 38, alignItems: 'center' }, backText: { color: '#262626', fontSize: 34 }, person: { flex: 1, flexDirection: 'row', alignItems: 'center' }, avatar: { width: 46, height: 46, borderRadius: 23, alignItems: 'center', justifyContent: 'center', position: 'relative', borderWidth: 2, borderColor: '#E1306C' }, avatarText: { color: '#262626', fontSize: 13, fontWeight: '800' }, onlineDot: { position: 'absolute', right: -2, bottom: -2, width: 12, height: 12, borderRadius: 6, backgroundColor: '#42B72A', borderWidth: 2, borderColor: '#FFFFFF' }, name: { color: '#262626', fontSize: 16, fontWeight: '800', marginLeft: 12 }, status: { color: '#8E8E93', fontSize: 12, marginLeft: 12, marginTop: 3 }, more: { width: 40, alignItems: 'center' }, moreText: { color: '#262626', fontSize: 20, letterSpacing: 2 }, date: { flexDirection: 'row', alignItems: 'center', paddingHorizontal: 20, paddingVertical: 20, gap: 12 }, divider: { height: 1, backgroundColor: '#EFEFEF', flex: 1 }, dateText: { color: '#8E8E93', fontSize: 10, fontWeight: '800' }, messages: { paddingHorizontal: 20, paddingBottom: 22 }, messageLine: { alignItems: 'flex-start', marginBottom: 15 }, mineLine: { alignItems: 'flex-end' }, bubble: { maxWidth: '78%', borderRadius: 20, paddingHorizontal: 16, paddingVertical: 11 }, theirBubble: { backgroundColor: '#EFEFEF', borderBottomLeftRadius: 5 }, mineBubble: { backgroundColor: '#E1306C', borderBottomRightRadius: 5 }, messageText: { color: '#262626', fontSize: 14, lineHeight: 20 }, mineText: { color: '#FFFFFF' }, time: { color: '#8E8E93', fontSize: 10, marginTop: 5 }, mineTime: { color: '#FFD1E1', textAlign: 'right' }, composerWrap: { paddingHorizontal: 16, paddingBottom: 12, paddingTop: 6 }, composer: { height: 52, borderRadius: 26, borderWidth: 1, borderColor: '#DBDBDB', flexDirection: 'row', alignItems: 'center', paddingLeft: 17, paddingRight: 6 }, input: { flex: 1, color: '#262626', fontSize: 14 }, send: { height: 39, width: 39, borderRadius: 20, backgroundColor: '#E1306C', alignItems: 'center', justifyContent: 'center' }, disabled: { opacity: 0.45 }, sendText: { color: '#FFFFFF', fontSize: 21, fontWeight: '800', transform: [{ rotate: '45deg' }] },
});
