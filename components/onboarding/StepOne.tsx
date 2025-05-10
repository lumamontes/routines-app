import { Ionicons } from "@expo/vector-icons";
import { useWindowDimensions, View } from "react-native";
import { Text } from "../ui/text";
import { Switch } from "../ui/switch";
import { useSettings } from "@/hooks/useSettings";

export const StepOne: React.FC = () => {
  const { isDarkMode, toggleTheme } = useSettings();
  const { width } = useWindowDimensions();
  return (
    <View className="flex-1 p-6 justify-center items-center" style={{ width }}>
      <View className="w-full max-w-md justify-center items-center">
        <Ionicons
          name={isDarkMode ? "moon" : "sunny"}
          size={80}
          color={isDarkMode ? "#f5cc73" : "#f59e0b"}
          className="mb-6"
        />
        <Text className="text-2xl font-bold text-center mb-2 text-gray-900 dark:text-white">
          Como você prefere visualizar o app?
        </Text>
        <Text className="text-base text-center text-gray-500 dark:text-gray-400 mb-8">
          Escolha o tema que melhor se adapta ao seu estilo
        </Text>
        <Text className="text-sm text-gray-500 dark:text-gray-400 mb-2">
          Tema {isDarkMode ? "Escuro" : "Claro"}
        </Text>
        <Switch value={isDarkMode} onValueChange={toggleTheme} />
      </View>
    </View>
  );
};