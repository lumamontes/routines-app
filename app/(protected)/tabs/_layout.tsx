export {
  // Catch any errors thrown by the Layout component.
  ErrorBoundary,
} from "expo-router";

export const unstable_settings = {
  // Ensure that reloading on `/modal` keeps a back button present.
  initialRouteName: "(tabs)",
};

import { Stack } from "expo-router";

export default function AppLayout() {
  return (
    <Stack>
      <Stack.Screen
        name="(tabs)"
        options={{
          headerShown: false,
        }}
      />
      <Stack.Screen
        name="settings"
        options={{
          presentation: "modal",
          headerTitle: "Configurações",
          animation: "slide_from_bottom",
        }}
      />
      <Stack.Screen
        name="new-task"
        options={{
          headerShown: false,
          presentation: "modal",
          // headerTitle: "Nova tarefa",
          // animation: "slide_from_bottom",
        }}
      />
    </Stack>
  );
}