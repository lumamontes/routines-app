export {
  // Catch any errors thrown by the Layout component.
  ErrorBoundary,
} from "expo-router";

export const unstable_settings = {
  // Ensure that reloading on `/modal` keeps a back button present.
  initialRouteName: "(tabs)",
};

import { Stack } from "expo-router";
import { SafeAreaView } from "react-native-safe-area-context";

export default function AppLayout() {
  return (
    <Stack
    >
      <SafeAreaView style={{ flex: 1 }}> 

      <Stack.Screen 
        name="(tabs)"
        options={{
          headerTitle: 'Tarefitas',
          headerTitleStyle: {
            fontFamily: 'Poppins-Bold',
          },
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
          presentation: "modal",
          headerTitle: "Nova tarefa",
          animation: "slide_from_bottom",
        }}
      />
      </SafeAreaView>
    </Stack>
  );
}