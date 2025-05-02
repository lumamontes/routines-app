import React from "react";
import FontAwesome from "@expo/vector-icons/FontAwesome";
import { router, Tabs } from "expo-router";
import { Button } from "@/components/ui/button";
import { Icon, SunIcon } from "@/components/ui/icon";

function TabBarIcon(props: {
  name: React.ComponentProps<typeof FontAwesome>["name"];
  color: string;
}) {
  return <FontAwesome size={18} style={{ marginBottom: -3 }} {...props} />;
}

export default function TabLayout() {
  return (
    <Tabs
      screenOptions={{
        headerShown: false
      }}
    >
      <Tabs.Screen
        name="index"
        options={{
          title: "Home",
          tabBarIcon: ({ color }) => <TabBarIcon name="home" color={color} />,
            headerRight: () => {
                return (
                  <Button className="Button-primary-500" onPress={() => router.push('/tabs/settings')}>
                    <Icon as={SunIcon} className="h-5 w-5" />
                  </Button>
                );
              }  
        }}
      />
      <Tabs.Screen
        name="tasks"
        options={{
          title: "Tarefas",
          tabBarIcon: ({ color }) => (
            <TabBarIcon name="tasks" color={color} />
          ),
        }}
      />
      <Tabs.Screen
        name="routines"
        options={{
          title: "",
          tabBarIcon: ({ color }) => (
            <TabBarIcon name="clock-o" color={color} />
          ),
        }}
      />

      <Tabs.Screen
        name="calendar"
        options={{
          title: "Calendário",
          tabBarIcon: ({ color }) => (
            <TabBarIcon name="calendar" color={color} />
          ),
        }}
      />

    </Tabs>
  );
}
