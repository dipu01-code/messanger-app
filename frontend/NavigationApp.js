import 'react-native-gesture-handler';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { NavigationContainer, useNavigation } from '@react-navigation/native';
import { createDrawerNavigator } from '@react-navigation/drawer';
import { createMaterialTopTabNavigator } from '@react-navigation/material-top-tabs';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { StatusBar } from 'expo-status-bar';
import { FlatList, Pressable, StyleSheet, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { conversationsSeed } from './conversations';
import { AllChatsScreen, FavoriteChatsScreen, UnreadChatsScreen } from './screens/ChatListScreen';
import IndividualChatScreen from './screens/IndividualChatScreen';

const avatarColors = ['#F2B880', '#92B6A7', '#D88C83', '#9AA7D8', '#E3A8C0'];
const Stack = createNativeStackNavigator();
const Drawer = createDrawerNavigator();
const BottomTabs = createBottomTabNavigator();
const TopTabs = createMaterialTopTabNavigator();

function Avatar({ item, index = 0, large = false }) {
  return <View style={[styles.avatar, large && styles.largeAvatar, { backgroundColor: avatarColors[index % avatarColors.length] }]}><Text style={styles.avatarText}>{item.avatar}</Text><View style={styles.onlineDot} /></View>;
}

function MessagesTabs() {
  return <TopTabs.Navigator screenOptions={{ tabBarActiveTintColor: '#E1306C', tabBarInactiveTintColor: '#8E8E93', tabBarIndicatorStyle: { backgroundColor: '#E1306C', height: 2 }, tabBarLabelStyle: { fontSize: 11, fontWeight: '800' }, tabBarStyle: { backgroundColor: '#FFFFFF', elevation: 0, shadowOpacity: 0, borderBottomWidth: 1, borderBottomColor: '#EFEFEF' } }}>
    <TopTabs.Screen name="All" component={AllChatsScreen} />
    <TopTabs.Screen name="Unread" component={UnreadChatsScreen} />
    <TopTabs.Screen name="Favorites" component={FavoriteChatsScreen} />
  </TopTabs.Navigator>;
}

function HomeScreen() {
  return <SafeAreaView edges={['top']} style={styles.safeArea}><MessagesTabs /></SafeAreaView>;
}

function UpdatesScreen() {
  return <SafeAreaView style={styles.featureScreen}><Text style={styles.featureTitle}>Updates</Text><View style={styles.myStatus}><View style={styles.myStatusAvatar}><Text style={styles.profileText}>ME</Text><Text style={styles.addStatus}>+</Text></View><View><Text style={styles.featureRowTitle}>My status</Text><Text style={styles.featureRowCopy}>Tap to add status update</Text></View></View><Text style={styles.featureSection}>RECENT UPDATES</Text><FlatList data={conversationsSeed.slice(0, 12)} keyExtractor={(item) => `status-${item.id}`} renderItem={({ item, index }) => <Pressable style={styles.featureRow}><Avatar item={item} index={index} /><View><Text style={styles.featureRowTitle}>{item.name}</Text><Text style={styles.featureRowCopy}>{index % 2 === 0 ? 'Today, 10:20 AM' : 'Yesterday, 8:45 PM'}</Text></View></Pressable>} /></SafeAreaView>;
}

function CallsScreen() {
  return <SafeAreaView style={styles.featureScreen}><View style={styles.featureHeader}><Text style={styles.featureTitle}>Calls</Text><Pressable style={styles.callAction}><Text style={styles.callActionIcon}>+</Text></Pressable></View><View style={styles.callBanner}><Text style={styles.callBannerIcon}>☎</Text><View><Text style={styles.featureRowTitle}>Create call link</Text><Text style={styles.featureRowCopy}>Share a link for your WhatsApp call</Text></View></View><Text style={styles.featureSection}>RECENT</Text><FlatList data={conversationsSeed.slice(0, 10)} keyExtractor={(item) => `call-${item.id}`} renderItem={({ item, index }) => <Pressable style={styles.featureRow}><Avatar item={item} index={index} /><View style={styles.callCopy}><Text style={styles.featureRowTitle}>{item.name}</Text><Text style={styles.featureRowCopy}>{index % 3 === 0 ? '↙ Incoming · Today, 9:30 AM' : '↗ Outgoing · Yesterday, 6:10 PM'}</Text></View><Text style={styles.callIcon}>☎</Text></Pressable>} /></SafeAreaView>;
}

function MainTabs() {
  const navigation = useNavigation();
  return <BottomTabs.Navigator screenOptions={{ headerShown: true, headerStyle: { backgroundColor: '#FFFFFF' }, headerShadowVisible: false, headerTitleStyle: { fontWeight: '800', color: '#262626' }, tabBarActiveTintColor: '#E1306C', tabBarInactiveTintColor: '#8E8E93', tabBarStyle: { height: 62, paddingTop: 7, borderTopColor: '#DBDBDB' }, tabBarLabelStyle: { fontSize: 10, fontWeight: '700' } }}>
    <BottomTabs.Screen name="Home" component={HomeScreen} options={{ title: 'Messages', headerLeft: () => <Pressable onPress={() => navigation.openDrawer()} style={styles.menuButton}><Text style={styles.menuIcon}>☰</Text></Pressable>, tabBarIcon: ({ color }) => <Text style={{ color, fontSize: 21 }}>▣</Text> }} />
    <BottomTabs.Screen name="Updates" component={UpdatesScreen} options={{ tabBarIcon: ({ color }) => <Text style={{ color, fontSize: 21 }}>◌</Text> }} />
    <BottomTabs.Screen name="Calls" component={CallsScreen} options={{ tabBarIcon: ({ color }) => <Text style={{ color, fontSize: 18 }}>☎</Text> }} />
    <BottomTabs.Screen name="Settings" component={SettingsScreen} options={{ tabBarIcon: ({ color }) => <Text style={{ color, fontSize: 19 }}>⚙</Text> }} />
  </BottomTabs.Navigator>;
}

function SettingsScreen() {
  const navigation = useNavigation();
  return <SafeAreaView style={styles.settingsScreen}><Pressable onPress={() => navigation.closeDrawer()} style={styles.settingsBack}><Text style={styles.backText}>‹</Text><Text style={styles.settingsBackLabel}>Close</Text></Pressable><Text style={styles.settingsTitle}>Settings</Text><View style={styles.settingRow}><Text style={styles.settingIcon}>◉</Text><Text style={styles.settingLabel}>Notifications</Text><Text style={styles.settingValue}>On</Text></View><View style={styles.settingRow}><Text style={styles.settingIcon}>◌</Text><Text style={styles.settingLabel}>Appearance</Text><Text style={styles.settingValue}>Light</Text></View><View style={styles.settingRow}><Text style={styles.settingIcon}>?</Text><Text style={styles.settingLabel}>Help center</Text><Text style={styles.settingValue}>›</Text></View></SafeAreaView>;
}

function DrawerShell() {
  return <Drawer.Navigator screenOptions={{ headerShown: false, drawerActiveTintColor: '#E1306C', drawerInactiveTintColor: '#262626', drawerLabelStyle: { fontWeight: '700' }, drawerStyle: { backgroundColor: '#FFFFFF', width: 290 } }}>
    <Drawer.Screen name="Inbox" component={MainTabs} options={{ drawerLabel: 'Inbox' }} />
    <Drawer.Screen name="Settings" component={SettingsScreen} />
  </Drawer.Navigator>;
}

export default function NavigationApp() {
  return <NavigationContainer><StatusBar style="dark" /><Stack.Navigator screenOptions={{ headerShown: false }}><Stack.Screen name="Main" component={DrawerShell} /><Stack.Screen name="Conversation" component={IndividualChatScreen} /></Stack.Navigator></NavigationContainer>;
}

const styles = StyleSheet.create({
  safeArea: { flex: 1, backgroundColor: '#FFFFFF' }, listScreen: { flex: 1, backgroundColor: '#FFFFFF', paddingHorizontal: 18 }, listHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', paddingTop: 16, paddingBottom: 18 }, eyebrow: { color: '#8E8E93', fontSize: 10, fontWeight: '800', letterSpacing: 1.2, marginBottom: 4 }, title: { color: '#262626', fontSize: 28, fontWeight: '800' }, composeButton: { width: 40, height: 40, borderRadius: 20, backgroundColor: '#E1306C', alignItems: 'center', justifyContent: 'center' }, composeIcon: { color: '#FFFFFF', fontSize: 27, lineHeight: 29 }, searchBox: { height: 42, borderRadius: 11, backgroundColor: '#EFEFEF', flexDirection: 'row', alignItems: 'center', paddingHorizontal: 14, marginBottom: 16 }, searchIcon: { color: '#8E8E93', fontSize: 21, transform: [{ rotate: '45deg' }], marginRight: 8 }, searchInput: { flex: 1, color: '#262626', fontSize: 14 }, listMeta: { flexDirection: 'row', justifyContent: 'space-between', marginBottom: 6 }, sectionLabel: { color: '#262626', fontSize: 11, fontWeight: '800' }, totalCount: { color: '#8E8E93', fontSize: 12 }, listContent: { paddingBottom: 20 }, conversationRow: { flexDirection: 'row', paddingVertical: 11, paddingHorizontal: 5 }, avatar: { width: 44, height: 44, borderRadius: 22, alignItems: 'center', justifyContent: 'center', position: 'relative', borderWidth: 2, borderColor: '#E1306C' }, largeAvatar: { width: 46, height: 46, borderRadius: 23 }, avatarText: { color: '#262626', fontSize: 13, fontWeight: '800' }, onlineDot: { position: 'absolute', right: -2, bottom: -2, width: 12, height: 12, borderRadius: 6, backgroundColor: '#42B72A', borderWidth: 2, borderColor: '#FFFFFF' }, conversationCopy: { flex: 1, marginLeft: 12, justifyContent: 'center' }, rowBetween: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' }, contactName: { color: '#262626', fontSize: 14, fontWeight: '700', flex: 1 }, time: { color: '#8E8E93', fontSize: 10 }, preview: { color: '#8E8E93', fontSize: 12, marginTop: 5, flex: 1 }, unreadPreview: { color: '#262626', fontWeight: '700' }, unreadBadge: { width: 19, height: 19, borderRadius: 10, backgroundColor: '#E1306C', alignItems: 'center', justifyContent: 'center' }, unreadCount: { color: '#FFFFFF', fontSize: 10, fontWeight: '800' }, menuButton: { paddingHorizontal: 16 }, menuIcon: { fontSize: 21, color: '#262626' }, featureScreen: { flex: 1, backgroundColor: '#FFFFFF', paddingHorizontal: 18 }, featureHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', paddingTop: 18, paddingBottom: 20 }, featureTitle: { color: '#262626', fontSize: 28, fontWeight: '800', paddingTop: 18, paddingBottom: 20 }, featureSection: { color: '#8E8E93', fontSize: 11, fontWeight: '800', letterSpacing: 0.6, marginTop: 20, marginBottom: 4 }, featureRow: { flexDirection: 'row', alignItems: 'center', paddingVertical: 12 }, featureRowTitle: { color: '#262626', fontSize: 15, fontWeight: '700', marginLeft: 12 }, featureRowCopy: { color: '#8E8E93', fontSize: 12, marginLeft: 12, marginTop: 4 }, myStatus: { flexDirection: 'row', alignItems: 'center', paddingVertical: 8 }, myStatusAvatar: { width: 48, height: 48, borderRadius: 24, backgroundColor: '#F2B880', borderWidth: 2, borderColor: '#E1306C', alignItems: 'center', justifyContent: 'center', position: 'relative' }, addStatus: { position: 'absolute', right: -2, bottom: -2, width: 18, height: 18, borderRadius: 9, backgroundColor: '#E1306C', color: '#FFFFFF', textAlign: 'center', fontSize: 16, lineHeight: 18, fontWeight: '700' }, callAction: { width: 38, height: 38, borderRadius: 19, backgroundColor: '#E1306C', alignItems: 'center', justifyContent: 'center' }, callActionIcon: { color: '#FFFFFF', fontSize: 25 }, callBanner: { backgroundColor: '#F8E8EF', borderRadius: 14, flexDirection: 'row', alignItems: 'center', padding: 14, marginTop: 2 }, callBannerIcon: { color: '#E1306C', fontSize: 25, marginRight: 8 }, callCopy: { flex: 1 }, callIcon: { color: '#E1306C', fontSize: 18, marginRight: 8 }, settingsScreen: { flex: 1, backgroundColor: '#FFFFFF', padding: 24 }, settingsBack: { flexDirection: 'row', alignItems: 'center', marginBottom: 28 }, settingsBackLabel: { color: '#262626', fontSize: 15, fontWeight: '700' }, settingsTitle: { color: '#262626', fontSize: 30, fontWeight: '800', marginBottom: 28 }, settingRow: { flexDirection: 'row', alignItems: 'center', height: 62, borderBottomWidth: 1, borderBottomColor: '#EFEFEF' }, settingIcon: { color: '#E1306C', fontSize: 20, width: 36 }, settingLabel: { color: '#262626', fontSize: 15, fontWeight: '600', flex: 1 }, settingValue: { color: '#8E8E93', fontSize: 13 }, chatScreen: { flex: 1, backgroundColor: '#FFFFFF' }, chatFlex: { flex: 1 }, chatHeader: { height: 74, borderBottomWidth: 1, borderBottomColor: '#DBDBDB', paddingHorizontal: 12, flexDirection: 'row', alignItems: 'center' }, backButton: { width: 38, alignItems: 'center' }, backText: { color: '#262626', fontSize: 34 }, headerPerson: { flex: 1, flexDirection: 'row', alignItems: 'center' }, chatName: { color: '#262626', fontSize: 16, fontWeight: '800', marginLeft: 12 }, status: { color: '#8E8E93', fontSize: 12, marginLeft: 12, marginTop: 3 }, moreButton: { width: 40, alignItems: 'center' }, moreText: { color: '#262626', fontSize: 20, letterSpacing: 2 }, dateDivider: { flexDirection: 'row', alignItems: 'center', paddingHorizontal: 20, paddingVertical: 20, gap: 12 }, divider: { height: 1, backgroundColor: '#EFEFEF', flex: 1 }, dateText: { color: '#8E8E93', fontSize: 10, fontWeight: '800' }, messagesContent: { paddingHorizontal: 20, paddingBottom: 22 }, messageLine: { alignItems: 'flex-start', marginBottom: 15 }, mineLine: { alignItems: 'flex-end' }, bubble: { maxWidth: '78%', borderRadius: 20, paddingHorizontal: 16, paddingVertical: 11 }, theirBubble: { backgroundColor: '#EFEFEF', borderBottomLeftRadius: 5 }, mineBubble: { backgroundColor: '#E1306C', borderBottomRightRadius: 5 }, messageText: { color: '#262626', fontSize: 14, lineHeight: 20 }, mineMessageText: { color: '#FFFFFF' }, messageTime: { color: '#8E8E93', fontSize: 10, marginTop: 5 }, mineMessageTime: { color: '#FFD1E1', textAlign: 'right' }, composerWrap: { paddingHorizontal: 16, paddingBottom: 12, paddingTop: 6 }, composer: { height: 52, borderRadius: 26, borderWidth: 1, borderColor: '#DBDBDB', flexDirection: 'row', alignItems: 'center', paddingLeft: 17, paddingRight: 6 }, composerInput: { flex: 1, color: '#262626', fontSize: 14 }, sendButton: { height: 39, width: 39, borderRadius: 20, backgroundColor: '#E1306C', alignItems: 'center', justifyContent: 'center' }, disabledSend: { opacity: 0.45 }, sendIcon: { color: '#FFFFFF', fontSize: 21, fontWeight: '800', transform: [{ rotate: '45deg' }] },
});
