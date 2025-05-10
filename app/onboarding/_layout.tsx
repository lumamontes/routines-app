export {
  // Catch any errors thrown by the Layout component.
  ErrorBoundary,
} from "expo-router";

export const unstable_settings = {
  // Ensure that reloading on `/modal` keeps a back button present.
  initialRouteName: "(tabs)",
};

import { settingsAtom } from "@/store/settings";
import { Redirect, Stack } from "expo-router";
import { useAtom } from "jotai";

export default function OnboardingLayout() {
  const [settings ] = useAtom(settingsAtom);

  // if(!settings.isOnboarding){
  //   return <Redirect href="/(protected)/tabs/(tabs)" />
  // }

  return (
    <Stack
      screenOptions={{
        headerShown: false,
        contentStyle: {
          backgroundColor: "transparent",
        },
      }}
    >
      <Stack.Screen
        name="onboarding"
        options={{
          headerShown: false,
        }}
      />
    </Stack>
  );
}