import AvatarWithStreakIndicador from "@/components/AvatarWithStreakIndicator";
import { Center } from "@/components/ui/center";
import { settingsAtom } from "@/store/settings";
import { useAtom } from "jotai";

export default function SettingsScreen() {
  const [settings, setSettings] = useAtom(settingsAtom);
  return (
    <Center className="flex-1">
      {JSON.stringify(settings)}
    </Center>
  );
}
