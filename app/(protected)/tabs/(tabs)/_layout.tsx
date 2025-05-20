import React from "react";
import FontAwesome from "@expo/vector-icons/FontAwesome";
import { router, Tabs } from "expo-router";
import { Button } from "@/components/ui/button";
import { Icon, SunIcon } from "@/components/ui/icon";
import { View, TouchableOpacity, Text, SafeAreaView } from "react-native";
import { BottomTabBarProps } from "@react-navigation/bottom-tabs";
import { clsx } from "clsx";
import { useAtom } from "jotai";
import { settingsAtom } from "@/store/settings";

type TabBarIconName = "home" | "tasks" | "exchange";

function TabBarIcon(props: {
  name: TabBarIconName;
}) {
  const [settings] = useAtom(settingsAtom);
  return <FontAwesome size={18} style={{ marginBottom: -3, 
    color: settings.theme === "dark" ? "#fff" : "#000",
  }} className="text-primary-0" {...props} />;
}

export default function TabLayout() {

  const [settings] = useAtom(settingsAtom);
  return (
    <Tabs
      screenOptions={{
        headerShown: false,
        tabBarStyle: {
          backgroundColor: settings.theme === "dark" ? "#111827" : "#fff",
          borderTopColor: settings.theme === "dark" ? "#111827" : "#fff",
        }
      }}
    >
      <Tabs.Screen
        name="index"
        options={{
          title: "Início",
          tabBarIcon: () => <TabBarIcon name="home" />,
          headerRight: () => (
            <Button 
              className="bg-primary-0" 
              onPress={() => router.push('/tabs/settings')}
            >
              <Icon as={SunIcon} className="h-5 w-5 text-background-0"
              />
            </Button>
          )
        }}
      />
      <Tabs.Screen
        name="tasks"
        options={{
          title: "Tarefas",
          tabBarIcon: () => <TabBarIcon name="tasks" />,
        }}
      />
      <Tabs.Screen
        name="settings"
        options={{
          title: "Configurações",
          tabBarIcon: () => <TabBarIcon name="exchange" />,
        }}
      />
    </Tabs>
  );
}