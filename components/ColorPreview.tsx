import { View } from "react-native";
import { Text } from "./ui/text";

export const ColorPreview: React.FC<{ color: string, label: string }> = ({ color, label }) => (
  <View className="w-6 h-6 rounded-full mr-2" style={{ backgroundColor: color }}>
    <Text className="opacity-0">{label}</Text>
  </View>
);