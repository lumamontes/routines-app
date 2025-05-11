import { useSettings } from "@/hooks/useSettings";
import { Ionicons } from "@expo/vector-icons";
import { Text } from "../ui/text";
import { ColorPreview } from "../ColorPreview";
import { TouchableOpacity, useWindowDimensions, View } from "react-native";

interface StepThreeProps {
  openColorPicker: (type: any) => void;
}

export const StepThree: React.FC<StepThreeProps> = ({ openColorPicker }) => {
  const { tintColor, accentColor } = useSettings();
  const defaultTintColor = tintColor || "#6200ee";
  const defaultAccentColor = accentColor || "#03dac4";

  const { width } = useWindowDimensions();

  return (
    <View className="flex-1 p-6 justify-center items-center" style={{ width }}>
      <View className="w-full max-w-md justify-center items-center">
        <Ionicons name="color-palette" size={80} color="#6366f1" className="mb-6" />
        <Text className="text-2xl font-bold text-center mb-2 text-gray-900 dark:text-white">
          Personalize suas cores
        </Text>
        <Text className="text-base text-center text-gray-500 dark:text-gray-400 mb-4">
          Escolha cores para diferenciar suas tarefas e hábitos
        </Text>

        <View className="mb-6 bg-gray-100 w-full dark:bg-gray-800 p-4 rounded-xl">
          <View className="flex-row items-center justify-between mb-2">
            <View className="flex-row items-center">
              <ColorPreview color={defaultTintColor} label="T" />
              <Text className="text-lg font-bold text-gray-900 dark:text-white">Cor principal</Text>
            </View>
            <TouchableOpacity onPress={() => openColorPicker("tint")} className="p-2 bg-blue-500 rounded-lg">
              <Text className="text-white">Escolher</Text>
            </TouchableOpacity>
          </View>
          <Text className="text-sm text-gray-500 dark:text-gray-400">
            Atividades principais do aplicativo, como botões e elementos de destaque
          </Text>
        </View>

        <View className="mb-8 bg-gray-100 dark:bg-gray-800 p-4 w-full rounded-xl">
          <View className="flex-row items-center justify-between mb-2">
            <View className="flex-row items-center">
              <ColorPreview color={defaultAccentColor} label="A" />
              <Text className="text-lg font-bold text-gray-900 dark:text-white">Cor de destaque</Text>
            </View>
            <TouchableOpacity onPress={() => openColorPicker("accent")} className="p-2 bg-blue-500 rounded-lg">
              <Text className="text-white">Escolher</Text>
            </TouchableOpacity>
          </View>
          <Text className="text-sm text-gray-500 dark:text-gray-400">
            Atividades que você precisa realizar em um determinado prazo
          </Text>
        </View>
      </View>
    </View>
  );
};


