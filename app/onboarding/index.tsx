import { useState, useRef, useEffect } from "react";
import { StatusBar } from "expo-status-bar";
import { 
  Platform, 
  View, 
  Animated, 
  Dimensions, 
  SafeAreaView,
  ScrollView,
  TouchableOpacity,
  Modal,
} from "react-native";
import { Text } from "@/components/ui/text";
import { Switch } from "@/components/ui/switch";
import { useAtom } from "jotai";
import { userSettingsAtom } from "@/store/atoms";
import { Button } from "@/components/ui/button";
import { router } from "expo-router";
import { Input, InputField } from "@/components/ui/input";
import ColorPicker, {
  Panel1,
  Swatches,
  Preview,
  HueSlider,
} from "reanimated-color-picker";
import { Ionicons } from '@expo/vector-icons';
import clsx from "clsx";

const { width } = Dimensions.get('window');

// Define types for props and state
interface ProgressDotsProps {
  totalSteps: number;
  currentStep: number;
}

interface ColorPickerModalProps {
  visible: boolean;
  onClose: () => void;
  onSelect: (color: any) => void;
  initialColor: string;
}

type ColorType = "accent" | "tint";

// Progress indicator component
const ProgressDots: React.FC<ProgressDotsProps> = ({ totalSteps, currentStep }) => {
  return (
    <View className="flex-row justify-center mt-2 mb-4">
      {Array.from({ length: totalSteps }).map((_, index) => (
        <View
          key={index}
          className={clsx(
            "h-2 w-2 rounded-full mx-1",
            index === currentStep ? "bg-blue-500" : "bg-gray-300"
          )}
        />
      ))}
    </View>
  );
};

// Custom modal component for color picker
const ColorPickerModal: React.FC<ColorPickerModalProps> = ({ 
  visible, 
  onClose, 
  onSelect, 
  initialColor 
}) => {
  if (!visible) return null;
  
  return (
    <Modal
      visible={visible}
      transparent
      animationType="fade"
    >
      <View className="flex-1 bg-black/50 justify-center items-center">
        <View className="w-[90%] bg-white dark:bg-gray-800 rounded-2xl p-5 items-center shadow-md">
          <Text className="text-lg font-bold mb-4 text-gray-900 dark:text-white">Escolha uma cor</Text>
          <ColorPicker
            style={{ width: "100%" }}
            value={initialColor}
            onComplete={onSelect}
          >
            <Preview />
            <Panel1 />
            <HueSlider />
            <Swatches />
          </ColorPicker>
          <View className="flex-row justify-between w-full mt-4">
            <TouchableOpacity
              className="p-2 bg-gray-300 dark:bg-gray-600 rounded"
              onPress={onClose}
              accessibilityLabel="Cancelar"
            >
              <Text className="text-gray-800 dark:text-white">Cancelar</Text>
            </TouchableOpacity>
            <TouchableOpacity
              className="p-2 bg-blue-500 rounded"
              onPress={() => onSelect({ hex: initialColor })}
              accessibilityLabel="Confirmar"
            >
              <Text className="text-white">Confirmar</Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </Modal>
  );
};

// Onboarding Screen component
const OnboardingScreen: React.FC = () => {
  // State management
  const [currentStep, setCurrentStep] = useState<number>(0);
  const [userSettings, setUserSettings] = useAtom(userSettingsAtom);
  const [colorPickerVisible, setColorPickerVisible] = useState<boolean>(false);
  const [currentColorType, setCurrentColorType] = useState<ColorType | null>(null);
  const [animValue] = useState(new Animated.Value(0));
  const scrollViewRef = useRef<ScrollView>(null);

  // Get values from userSettings
  const isDarkMode = userSettings.theme === 'dark';
  const username = userSettings.name;
  const tintColor = userSettings.tintColor;
  const accentColor = userSettings.accentColor;

  // Default colors if not set
  const defaultTintColor = tintColor || "#6200ee";
  const defaultAccentColor = accentColor || "#03dac4";

  // Animation progress value
  const progressWidth = animValue.interpolate({
    inputRange: [0, 1],
    outputRange: ["0%", "100%"],
  });

  // Scroll to current step when it changes
  useEffect(() => {
    if (scrollViewRef.current) {
      scrollViewRef.current.scrollTo({
        x: currentStep * width,
        animated: true,
      });
    }
    
    // Animate progress indicator
    Animated.timing(animValue, {
      toValue: currentStep / 2, // 3 steps, so divide by 2 to get 0, 0.5, 1
      duration: 300,
      useNativeDriver: false,
    }).start();
  }, [currentStep]);

  // Handle navigation
  const goToNextStep = (): void => {
    if (currentStep < 2) {
      setCurrentStep(currentStep + 1);
    } else {
      completeOnboarding();
    }
  };

  const goToPreviousStep = (): void => {
    if (currentStep > 0) {
      setCurrentStep(currentStep - 1);
    }
  };

  const completeOnboarding = (): void => {
    router.push('/(protected)/tabs/(tabs)');
  };

  // Handle color picker
  const openColorPicker = (type: ColorType): void => {
    setCurrentColorType(type);
    setColorPickerVisible(true);
  };

  const handleColorSelect = (color: any): void => {
    setUserSettings(prev => ({
      ...prev,
      ...(currentColorType === "tint" 
        ? { tintColor: color.hex } 
        : { accentColor: color.hex })
    }));
    setColorPickerVisible(false);
  };

  // Color selection preview
  const ColorPreview: React.FC<{color: string, label: string}> = ({color, label}) => (
    <View className="w-6 h-6 rounded-full mr-2" style={{backgroundColor: color}}>
      <Text className="opacity-0">{label}</Text>
    </View>
  );

  // Check if we can move to the next step
  const canContinue = (): boolean => {
    if (currentStep === 1 && (!username || username.trim() === "")) {
      return false;
    }
    return true;
  };
  
  // Handle theme change
  const toggleDarkMode = (): void => {
    setUserSettings(prev => ({
      ...prev,
      theme: prev.theme === 'dark' ? 'light' : 'dark'
    }));
  };
  
  // Handle name change
  const handleNameChange = (text: string): void => {
    setUserSettings(prev => ({
      ...prev,
      name: text
    }));
  };

  return (
    <SafeAreaView className="flex-1 bg-white dark:bg-gray-900">
      <StatusBar style={Platform.OS === "ios" ? "light" : "auto"} />
      
      {/* Header with progress bar */}
      <View className="px-4 mt-2">
        <View className="flex-row items-center mb-4">
          {currentStep > 0 && (
            <TouchableOpacity onPress={goToPreviousStep} className="pr-2">
              <Ionicons name="arrow-back" size={24} color="#007AFF" />
            </TouchableOpacity>
          )}
          <View className="flex-1 h-2 bg-gray-200 dark:bg-gray-700 rounded-full overflow-hidden">
            <Animated.View 
              className="h-full bg-blue-500 rounded-full" 
              style={{width: progressWidth}} 
            />
          </View>
          <TouchableOpacity onPress={completeOnboarding} className="pl-2">
            <Text className="text-blue-500">Pular</Text>
          </TouchableOpacity>
        </View>
      </View>
      
      {/* Scrollable content */}
      <ScrollView
        ref={scrollViewRef}
        horizontal
        pagingEnabled
        showsHorizontalScrollIndicator={false}
        scrollEnabled={false}
        style={{ flex: 1 }}
      >
        {/* Step 1: Dark Mode Selection */}
        <View className="flex-1 p-6 justify-center items-center" style={{ width }}>
          <View className="w-full max-w-md">
            <View className="items-center mb-12">
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
            </View>
            
            <View className="w-full flex-row justify-between items-center bg-gray-100 dark:bg-gray-800 p-4 rounded-xl mb-8">
              <View className="flex-row items-center">
                <Ionicons name="sunny" size={24} color="#f59e0b" className="mr-2" />
                <Text className={clsx(
                  "text-lg text-gray-900 dark:text-white", 
                  !isDarkMode && "font-bold"
                )}>
                  Modo claro
                </Text>
              </View>
              <Switch 
                value={isDarkMode}
                onValueChange={toggleDarkMode}
              />
              <View className="flex-row items-center">
                <Text className={clsx(
                  "text-lg text-gray-900 dark:text-white", 
                  isDarkMode && "font-bold"
                )}>
                  Modo escuro
                </Text>
                <Ionicons name="moon" size={24} color="#f5cc73" className="ml-2" />
              </View>
            </View>
          </View>
        </View>
        
        {/* Step 2: Name Selection */}
        <View className="flex-1 p-6 justify-center items-center" style={{ width }}>
          <View className="w-full max-w-md">
            <View className="items-center mb-12">
              <Ionicons name="person-circle" size={80} color="#007AFF" className="mb-6" />
              <Text className="text-2xl font-bold text-center mb-2 text-gray-900 dark:text-white">
                Como devemos te chamar?
              </Text>
              <Text className="text-base text-center text-gray-500 dark:text-gray-400 mb-8">
                Digite seu nome ou apelido para personalizar sua experiência
              </Text>
            </View>
            
            <Input
              className="mb-2 text-white border border-gray-300 dark:border-gray-700 rounded-xl bg-white dark:bg-gray-800"
            >
              <InputField
                value={username}
                onChangeText={handleNameChange}
                placeholder="Seu nome ou apelido"
                className=" dark:text-white text-white"
                placeholderTextColor="#9ca3af"
              />
            </Input>
            <Text className="text-sm text-gray-500 dark:text-gray-400 mb-8">
              Você poderá alterar isso nas configurações posteriormente
            </Text>
          </View>
        </View>
        
        {/* Step 3: Color Selection */}
        <View className="flex-1 p-6 justify-center items-center" style={{ width }}>
          <View className="w-full max-w-md">
            <View className="items-center mb-8">
              <Ionicons name="color-palette" size={80} color="#6366f1" className="mb-6" />
              <Text className="text-2xl font-bold text-center mb-2 text-gray-900 dark:text-white">
                Personalize suas cores
              </Text>
              <Text className="text-base text-center text-gray-500 dark:text-gray-400 mb-4">
                Escolha cores para diferenciar suas tarefas e hábitos
              </Text>
            </View>
            
            <View className="mb-6 bg-gray-100 dark:bg-gray-800 p-4 rounded-xl">
              <View className="flex-row items-center justify-between mb-2">
                <View className="flex-row items-center">
                  <ColorPreview color={tintColor || defaultTintColor} label="T" />
                  <Text className="text-lg font-bold text-gray-900 dark:text-white">Cor principal</Text>
                </View>
                <TouchableOpacity 
                  onPress={() => openColorPicker("tint")}
                  className="p-2 bg-blue-500 rounded-lg"
                >
                  <Text className="text-white">Escolher</Text>
                </TouchableOpacity>
              </View>
              <Text className="text-sm text-gray-500 dark:text-gray-400">
                Atividades principais do aplicativo, como botões e elementos de destaque
              </Text>
            </View>
            
            <View className="mb-8 bg-gray-100 dark:bg-gray-800 p-4 rounded-xl">
              <View className="flex-row items-center justify-between mb-2">
                <View className="flex-row items-center">
                  <ColorPreview color={accentColor || defaultAccentColor} label="A" />
                  <Text className="text-lg font-bold text-gray-900 dark:text-white">Cor de destaque</Text>
                </View>
                <TouchableOpacity 
                  onPress={() => openColorPicker("task")}
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
        </View>
      </ScrollView>
      
      {/* Bottom navigation */}
      <View className="p-4 border-t border-gray-200 dark:border-gray-800">
        <TouchableOpacity
          onPress={goToNextStep}
          disabled={!canContinue()}
          className={clsx(
            "p-4 rounded-xl items-center",
            canContinue() ? "bg-blue-500" : "bg-gray-300 dark:bg-gray-600"
          )}
        >
          <Text className={clsx(
            "text-lg font-bold",
            canContinue() ? "text-white" : "text-gray-500 dark:text-gray-400"
          )}>
            {currentStep === 2 ? "Finalizar" : "Continuar"}
          </Text>
        </TouchableOpacity>
        <ProgressDots totalSteps={3} currentStep={currentStep} />
      </View>
      
      {/* Color Picker Modal */}
      <ColorPickerModal
        visible={colorPickerVisible}
        onClose={() => setColorPickerVisible(false)}
        onSelect={handleColorSelect}
        initialColor="#000"
      />
    </SafeAreaView>
  );
};

export default OnboardingScreen;