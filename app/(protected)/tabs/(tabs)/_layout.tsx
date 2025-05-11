import React from "react";
import FontAwesome from "@expo/vector-icons/FontAwesome";
import { router, Tabs } from "expo-router";
import { Button } from "@/components/ui/button";
import { Icon, SunIcon } from "@/components/ui/icon";
import { View, TouchableOpacity, Text } from "react-native";
import { BottomTabBarProps } from "@react-navigation/bottom-tabs";
import { clsx } from "clsx";

type TabBarIconName = "home" | "tasks" | "exchange";

function TabBarIcon(props: {
  name: TabBarIconName;
  color: string;
}) {
  return <FontAwesome size={18} style={{ marginBottom: -3 }} {...props} />;
}

function CustomTabBar({ state, descriptors, navigation }: BottomTabBarProps) {
  const getIconName = (routeName: string): TabBarIconName => {
    switch (routeName) {
      case "index":
        return "home";
      case "tasks":
        return "tasks";
      case "settings":
        return "exchange";
      default:
        return "home";
    }
  };

  return (
    <View className="flex-row justify-between items-center bg-background-0 border-t border-border-0 h-16 px-4">
      {state.routes.map((route, index) => {
        const { options } = descriptors[route.key];
        const isFocused = state.index === index;
        return (
          <TouchableOpacity
            key={index}
            className={clsx(
              "flex-1 items-center justify-center py-2",
              isFocused && "bg-background-100 rounded-lg"
            )}
            onPress={() => navigation.navigate(route.name)}
            activeOpacity={0.7}
          >
            <View className="items-center">
              <TabBarIcon 
                name={getIconName(route.name)}
                color={isFocused ? 'var(--primary-0)' : 'var(--primary-100)'} 
              />
              <Text 
                className={clsx(
                  "text-xs mt-1",
                  isFocused ? "text-primary-0 font-medium" : "text-primary-100"
                )}
              >
                {options.title}
              </Text>
            </View>
          </TouchableOpacity>
        );
      })}
    </View>
  );
}

export default function TabLayout() {
  return (
    <Tabs
      screenOptions={{
        headerShown: false,
      }}
      tabBar={props => <CustomTabBar {...props} />}
    >
      <Tabs.Screen
        name="index"
        options={{
          title: "Início",
          tabBarIcon: ({ color }) => <TabBarIcon name="home" color={color} />,
          headerRight: () => (
            <Button 
              className="bg-primary-0" 
              onPress={() => router.push('/tabs/settings')}
            >
              <Icon as={SunIcon} className="h-5 w-5 text-background-0" />
            </Button>
          )
        }}
      />
      <Tabs.Screen
        name="tasks"
        options={{
          title: "Tarefas",
          tabBarIcon: ({ color }) => <TabBarIcon name="tasks" color={color} />,
        }}
      />
      <Tabs.Screen
        name="settings"
        options={{
          title: "Configurações",
          tabBarIcon: ({ color }) => <TabBarIcon name="exchange" color={color} />,
        }}
      />
    </Tabs>
  );
}
