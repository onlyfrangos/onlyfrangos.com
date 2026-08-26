import { Tabs, useRouter } from 'expo-router';
import { Dumbbell, Home, Menu, Plus, UserRound } from 'lucide-react-native';
import { StyleSheet, View } from 'react-native';

import { mobileTheme } from '../../src/theme/theme';

export default function TabsLayout() {
  const router = useRouter();

  return (
    <Tabs
      screenOptions={{
        headerShown: false,
        tabBarActiveTintColor: mobileTheme.colors.text,
        tabBarInactiveTintColor: mobileTheme.colors.muted,
        tabBarLabelStyle: styles.label,
        tabBarStyle: {
          backgroundColor: mobileTheme.colors.surface,
          borderTopColor: mobileTheme.colors.border,
          height: mobileTheme.layout.tabBarHeight,
          paddingBottom: 9,
          paddingTop: 8,
        },
      }}
    >
      <Tabs.Screen
        name="index"
        options={{
          tabBarAccessibilityLabel: 'Início',
          tabBarIcon: ({ color, size }) => <Home color={color} size={size} />,
          tabBarLabel: 'Início',
          title: 'Início',
        }}
      />
      <Tabs.Screen
        name="gyms"
        options={{
          tabBarAccessibilityLabel: 'Academias',
          tabBarIcon: ({ color, size }) => <Dumbbell color={color} size={size} />,
          tabBarLabel: 'Academias',
          title: 'Academias',
        }}
      />
      <Tabs.Screen
        listeners={{
          tabPress: (event) => {
            event.preventDefault();
            router.push('/compose');
          },
        }}
        name="compose-launcher"
        options={{
          tabBarAccessibilityLabel: 'Criar publicação',
          tabBarIcon: () => (
            <View style={styles.createAction}>
              <Plus color={mobileTheme.colors.text} size={28} strokeWidth={2.5} />
            </View>
          ),
          tabBarLabel: 'Publicar',
          title: 'Publicar',
        }}
      />
      <Tabs.Screen
        name="profile"
        options={{
          tabBarAccessibilityLabel: 'Perfil',
          tabBarIcon: ({ color, size }) => <UserRound color={color} size={size} />,
          tabBarLabel: 'Perfil',
          title: 'Perfil',
        }}
      />
      <Tabs.Screen
        listeners={{
          tabPress: (event) => {
            event.preventDefault();
            router.push('/menu');
          },
        }}
        name="menu-launcher"
        options={{
          tabBarAccessibilityLabel: 'Menu',
          tabBarIcon: ({ color, size }) => <Menu color={color} size={size} />,
          tabBarLabel: 'Menu',
          title: 'Menu',
        }}
      />
    </Tabs>
  );
}

const styles = StyleSheet.create({
  createAction: {
    alignItems: 'center',
    backgroundColor: mobileTheme.colors.primary,
    borderColor: mobileTheme.colors.background,
    borderRadius: 25,
    borderWidth: 3,
    height: 50,
    justifyContent: 'center',
    marginTop: -22,
    width: 50,
  },
  label: {
    fontFamily: mobileTheme.typography.bodyMediumFontFamily,
    fontSize: 10,
  },
});
