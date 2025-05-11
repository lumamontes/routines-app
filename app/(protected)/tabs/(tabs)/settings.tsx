import { ColorType } from "@/app/onboarding";
import AvatarWithStreakIndicador from "@/components/AvatarWithStreakIndicator";
import { ColorPickerModal } from "@/components/ColorPickerModal";
import { ColorPreview } from "@/components/ColorPreview";
import { Input, InputField } from "@/components/ui/input";
import { Switch } from "@/components/ui/switch";
import { Text } from "@/components/ui/text";
import { useSettings } from "@/hooks/useSettings";
import { settingsAtom } from "@/store/settings";
import { useAtom } from "jotai";
import { useState } from "react";
import { TouchableOpacity, View } from "react-native";

export default function SettingsScreen() {
  const {
    tintColor: defaultTintColor,
    accentColor: defaultAccentColor,
    username,
    handleUsernameChange,
    isDarkMode,
    toggleTheme,
  } = useSettings();
  const [settings, setSettings] = useAtom(settingsAtom);

  const [colorPickerVisible, setColorPickerVisible] = useState<boolean>(false);
  const [currentColorType, setCurrentColorType] = useState<ColorType | null>(
    null
  );

  const openColorPicker = (type: ColorType): void => {
    setCurrentColorType(type);
    setColorPickerVisible(true);
  };

  const handleColorSelect = (color: any): void => {
    setSettings((prev) => ({
      ...prev,
      ...(currentColorType === "tint"
        ? { tintColor: color.hex }
        : { foregroundColor: color.hex }),
    }));
    setColorPickerVisible(false);
  };

  return (
    <View className="flex-1 bg-background-0 transition-colors duration-300">
      <View className="flex-1 max-w-3xl mx-auto px-4 py-6 justify-center gap-y-6 md:space-y-6 bg-background-0 transition-colors duration-300">
        <View className="flex-row items-center justify-center mb-4">
          <AvatarWithStreakIndicador />
        </View>
        <View>
        <Text className="text-sm text-gray-500 dark:text-gray-400 mb-2">
            Seu nome ou apelido
        </Text>
        <Input className="mb-2 text-primary-50 border-primary-200 border rounded-xl w-full ">
          <InputField
            value={username}
            onChangeText={handleUsernameChange}
            placeholder="Seu nome ou apelido"
            className="text-primary-100"
            placeholderTextColor="#9ca3af"
          />
        </Input>
        </View>

        <View>
          <Text className="text-sm text-gray-500 dark:text-gray-400 mb-2">
            Tema {isDarkMode ? "Escuro" : "Claro"}
          </Text>
          <Switch value={isDarkMode} onValueChange={toggleTheme} />
        </View>
        <View>
        <View className="mb-6 bg-gray-100 dark:bg-gray-800 p-4 rounded-xl">
          <View className="flex-row items-center justify-between mb-2">
            <View className="flex-row items-center">
              <ColorPreview color={defaultTintColor} label="T" />
              <Text className="text-lg font-bold text-gray-900 dark:text-white">
                Cor principal
              </Text>
            </View>
            <TouchableOpacity
              onPress={() => openColorPicker("tint")}
              className="p-2 bg-blue-500 rounded-lg"
            >
              <Text className="text-white">Escolher</Text>
            </TouchableOpacity>
          </View>
          <Text className="text-sm text-gray-500 dark:text-gray-400">
            Atividades principais do aplicativo, como botões e elementos de
            destaque
          </Text>
        </View>

        <View className="mb-8 bg-gray-100 dark:bg-gray-800 p-4 rounded-xl">
          <View className="flex-row items-center justify-between mb-2">
            <View className="flex-row items-center">
              <ColorPreview color={defaultAccentColor} label="A" />
              <Text className="text-lg font-bold text-gray-900 dark:text-white">
                Cor de destaque
              </Text>
            </View>
            <TouchableOpacity
              onPress={() => openColorPicker("foreground")}
              className="p-2 bg-blue-500 rounded-lg"
            >
              <Text className="text-white">Escolher</Text>
            </TouchableOpacity>
          </View>
          <Text className="text-sm text-gray-500 dark:text-gray-400">
            Atividades que você precisa realizar em um determinado prazo
          </Text>
        </View>
        </View>
        <ColorPickerModal
          visible={colorPickerVisible}
          onClose={() => setColorPickerVisible(false)}
          onSelect={handleColorSelect}
          initialColor="#000"
        />
      </View>
    </View>
  );
}
