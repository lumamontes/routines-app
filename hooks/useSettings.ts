import { Settings, settingsAtom } from "@/store/settings";
import { useAtom } from "jotai";


export function useSettings() {
  const [settings, setSettings] = useAtom(settingsAtom);

  const updateSettings = (newSettings: Partial<Settings>) => {
    setSettings((prevSettings) => ({
      ...prevSettings,
      ...newSettings,
    }));
  };

  const isDarkMode = (settings as Settings).theme === "dark";

  const toggleTheme = () => {
    setSettings((prevSettings) => ({
      ...prevSettings,
      theme: (prevSettings as Settings).theme === "dark" ? "light" : "dark",
    }));
  };

  const handleUsernameChange = (newUsername: string) => {
    setSettings((prevSettings) => ({
      ...prevSettings,
      username: newUsername,
    }));
  };

  return {
    tintColor: settings.tintColor,
    accentColor: settings.foregroundColor,
    username: settings.username,
    handleUsernameChange,
    settings,
    updateSettings,
    isDarkMode,
    toggleTheme,
  };
}