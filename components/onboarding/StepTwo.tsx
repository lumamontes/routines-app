import { useSettings } from "@/hooks/useSettings";
import { Ionicons } from "@expo/vector-icons";
import { Text } from "../ui/text";
import { Input, InputField } from "../ui/input";
import { useWindowDimensions, View, KeyboardAvoidingView, Platform, ScrollView } from "react-native";

export const StepTwo: React.FC = () => {
  const { username, handleUsernameChange } = useSettings();

  const { width } = useWindowDimensions();

  return (
    <KeyboardAvoidingView 
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      className="flex-1"
    >
      <ScrollView 
        contentContainerStyle={{ flexGrow: 1 }}
        keyboardShouldPersistTaps="handled"
      >
        <View className="flex-1 p-6 justify-center items-center" style={{ width }}>
          <View className="w-full max-w-md justify-center items-center">
            <Ionicons name="person-circle" size={80} color="#007AFF" className="mb-6" />
            <Text className="text-2xl font-bold text-center mb-2">
              Como devemos te chamar?
            </Text>
            <Text className="text-base text-center mb-8">
              Digite seu nome ou apelido para personalizar sua experiência
            </Text>
            <Input className="mb-2">
              <InputField
                value={username}
                onChangeText={handleUsernameChange}
                placeholder="Seu nome ou apelido"
                className="text-primary-100"
                placeholderTextColor="#9ca3af"
              />
            </Input>
            <Text className="text-sm mb-8">
              Você poderá alterar isso nas configurações posteriormente
            </Text>
          </View>
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
};