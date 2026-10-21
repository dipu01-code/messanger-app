import { useMemo, useState } from 'react';
import { FlatList, Pressable, StyleSheet, Text, TextInput, View } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { conversationsSeed } from '../conversations';

const avatarColors = ['#F2B880', '#92B6A7', '#D88C83', '#9AA7D8', '#E3A8C0'];

function Avatar({ item, index = 0 }) {
  return <View style={[styles.avatar, { backgroundColor: avatarColors[index % avatarColors.length] }]}><Text style={styles.avatarText}>{item.avatar}</Text><View style={styles.onlineDot} /></View>;
}

export function ChatListScreen({ filter = 'all' }) {
  const navigation = useNavigation();
  const [search, setSearch] = useState('');
  const data = useMemo(() => conversationsSeed.filter((conversation) => {
    const matchesSearch = conversation.name.toLowerCase().includes(search.toLowerCase());
    const matchesFilter = filter === 'unread' ? conversation.unreadCount > 0 : filter === 'favorites' ? conversation.id <= 3 : true;
    return matchesSearch && matchesFilter;
  }), [filter, search]);

  return <View style={styles.screen}>
    <View style={styles.header}><View><Text style={styles.eyebrow}>DIRECT MESSAGES</Text><Text style={styles.title}>Messages</Text></View><Pressable onPress={() => navigation.navigate('Conversation', { conversationId: 2 })} style={styles.composeButton}><Text style={styles.composeIcon}>+</Text></Pressable></View>
    <View style={styles.searchBox}><Text style={styles.searchIcon}>/</Text><TextInput value={search} onChangeText={setSearch} placeholder="Search conversations" placeholderTextColor="#8E8E93" style={styles.searchInput} /></View>
    <View style={styles.meta}><Text style={styles.sectionLabel}>{filter === 'unread' ? 'UNREAD' : filter === 'favorites' ? 'FAVORITES' : 'ALL CONVERSATIONS'}</Text><Text style={styles.count}>{data.length}</Text></View>
    <FlatList data={data} keyExtractor={(item) => String(item.id)} showsVerticalScrollIndicator={false} contentContainerStyle={styles.list} renderItem={({ item, index }) => {
      const lastMessage = item.messages[item.messages.length - 1];
      return <Pressable onPress={() => navigation.navigate('Conversation', { conversationId: item.id })} style={styles.row}>
        <Avatar item={item} index={index} />
        <View style={styles.copy}><View style={styles.between}><Text numberOfLines={1} style={styles.name}>{item.name}</Text><Text style={styles.time}>{lastMessage.time}</Text></View><View style={styles.between}><Text numberOfLines={1} style={[styles.preview, item.unreadCount > 0 && styles.unreadPreview]}>{lastMessage.sender === 'me' ? 'You: ' : ''}{lastMessage.text}</Text>{item.unreadCount > 0 && <View style={styles.badge}><Text style={styles.badgeText}>{item.unreadCount}</Text></View>}</View></View>
      </Pressable>;
    }} />
  </View>;
}

export function AllChatsScreen() { return <ChatListScreen filter="all" />; }
export function UnreadChatsScreen() { return <ChatListScreen filter="unread" />; }
export function FavoriteChatsScreen() { return <ChatListScreen filter="favorites" />; }

const styles = StyleSheet.create({
  screen: { flex: 1, backgroundColor: '#FFFFFF', paddingHorizontal: 18 }, header: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', paddingTop: 16, paddingBottom: 18 }, eyebrow: { color: '#8E8E93', fontSize: 10, fontWeight: '800', letterSpacing: 1.2, marginBottom: 4 }, title: { color: '#262626', fontSize: 28, fontWeight: '800' }, composeButton: { width: 40, height: 40, borderRadius: 20, backgroundColor: '#E1306C', alignItems: 'center', justifyContent: 'center' }, composeIcon: { color: '#FFFFFF', fontSize: 27, lineHeight: 29 }, searchBox: { height: 42, borderRadius: 11, backgroundColor: '#EFEFEF', flexDirection: 'row', alignItems: 'center', paddingHorizontal: 14, marginBottom: 16 }, searchIcon: { color: '#8E8E93', fontSize: 21, transform: [{ rotate: '45deg' }], marginRight: 8 }, searchInput: { flex: 1, color: '#262626', fontSize: 14 }, meta: { flexDirection: 'row', justifyContent: 'space-between', marginBottom: 6 }, sectionLabel: { color: '#262626', fontSize: 11, fontWeight: '800' }, count: { color: '#8E8E93', fontSize: 12 }, list: { paddingBottom: 20 }, row: { flexDirection: 'row', paddingVertical: 11, paddingHorizontal: 5 }, avatar: { width: 44, height: 44, borderRadius: 22, alignItems: 'center', justifyContent: 'center', position: 'relative', borderWidth: 2, borderColor: '#E1306C' }, avatarText: { color: '#262626', fontSize: 13, fontWeight: '800' }, onlineDot: { position: 'absolute', right: -2, bottom: -2, width: 12, height: 12, borderRadius: 6, backgroundColor: '#42B72A', borderWidth: 2, borderColor: '#FFFFFF' }, copy: { flex: 1, marginLeft: 12, justifyContent: 'center' }, between: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' }, name: { color: '#262626', fontSize: 14, fontWeight: '700', flex: 1 }, time: { color: '#8E8E93', fontSize: 10 }, preview: { color: '#8E8E93', fontSize: 12, marginTop: 5, flex: 1 }, unreadPreview: { color: '#262626', fontWeight: '700' }, badge: { width: 19, height: 19, borderRadius: 10, backgroundColor: '#E1306C', alignItems: 'center', justifyContent: 'center' }, badgeText: { color: '#FFFFFF', fontSize: 10, fontWeight: '800' },
});
