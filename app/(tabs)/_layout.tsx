import { Tabs } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';

export default function TabLayout() {
    return (
        <Tabs
            screenOptions={{
                tabBarActiveTintColor: '#007AFF',
                tabBarStyle: { paddingBottom: 5 ,
                },
                headerTitle: 'Galaxy View',
                headerShown: true,

            }}>
            <Tabs.Screen
                name="index"
                options={{
                    title: 'Articles',
                    tabBarIcon: ({ size, color }) => (
                        <Ionicons name="newspaper" size={size} color={color} />
                    ),
                }}
            />
            <Tabs.Screen
                name="explore"
                options={{
                    title: 'Explore',
                    tabBarIcon: ({ size, color }) => (
                        <Ionicons name="rocket" size={size} color={color} />
                    ),
                }}
            />
            <Tabs.Screen
                name="profile"
                options={{
                    title: 'Profile',
                    tabBarIcon: ({ size, color }) => (
                        <Ionicons name="person" size={size} color={color} />
                    ),
                }}
            />
        </Tabs>
    );
}
