import { ColorPickerModal } from "@/components/ColorPickerModal";
import { StepOne } from "@/components/onboarding/StepOne";
import { StepThree } from "@/components/onboarding/StepThree";
import { StepTwo } from "@/components/onboarding/StepTwo";
import { settingsAtom } from "@/store/settings";
import { Ionicons } from "@expo/vector-icons";
import { router } from "expo-router";
import { StatusBar } from "expo-status-bar";
import { useAtom } from "jotai";
import { useEffect, useRef, useState } from "react";
import { KeyboardAvoidingView, Platform, ScrollView, TouchableOpacity, useWindowDimensions, View } from "react-native";
import Animated, { useSharedValue, withTiming, useAnimatedStyle } from "react-native-reanimated";
import { SafeAreaView } from "react-native-safe-area-context";
import clsx from "clsx";
import { ProgressDots } from "@/components/ProgressDots";
import { Text } from "@/components/ui/text";

export type ColorType = "tint" | "foreground";

const OnboardingScreen: React.FC = () => {
  const [currentStep, setCurrentStep] = useState<number>(0);
  const [settings, setSettings] = useAtom(settingsAtom);
  const [colorPickerVisible, setColorPickerVisible] = useState<boolean>(false);
  const [currentColorType, setCurrentColorType] = useState<ColorType | null>(null);

  const scrollViewRef = useRef<ScrollView>(null);

  const width = useWindowDimensions().width;
  const username = settings.username;

  const progressWidth = useSharedValue(0);

  const progressBarStyle = useAnimatedStyle(() => {
    return {
      width: withTiming(progressWidth.value * width, { duration: 300 }),
    };
  });

  useEffect(() => {
    if (scrollViewRef.current) {
      scrollViewRef.current.scrollTo({
        x: currentStep * width,
        animated: true,
      });
    }

    progressWidth.value = currentStep / 2;
  }, [currentStep]);

  const goToNextStep = (): void => {
    if (currentStep < 2) {
      setCurrentStep(currentStep + 1);
    } else {
      setSettings((prev) => ({
        ...prev,
        isOnboarding: false,
      }));
      completeOnboarding();
    }
  };

  const goToPreviousStep = (): void => {
    if (currentStep > 0) {
      setCurrentStep(currentStep - 1);
    }
  };

  const completeOnboarding = (): void => {
    router.push("/(protected)/tabs/(tabs)");
  };

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

  const canContinue = (): boolean => {
    if (currentStep === 1 && (!username || username.trim() === "")) {
      return false;
    }
    return true;
  };

  return (
    <SafeAreaView className="flex-1 bg-background-0">
      <StatusBar style={Platform.OS === "ios" ? "light" : "auto"} />
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
              style={progressBarStyle}
            />
          </View>
          <TouchableOpacity onPress={completeOnboarding} className="pl-2">
            <Text className="text-base text-tertiary-500">Pular</Text>
          </TouchableOpacity>
        </View>
      </View>
        <KeyboardAvoidingView style={{ flex: 1 }}>
          <ScrollView
            ref={scrollViewRef}
            horizontal
            keyboardShouldPersistTaps="handled"
            pagingEnabled
            showsHorizontalScrollIndicator={false}
            style={{ flex: 1 }}
            contentContainerStyle={{ flexGrow: 1 }}
            scrollEventThrottle={16}
          >
            <StepOne />
            <StepTwo />
            <StepThree openColorPicker={openColorPicker} />
          </ScrollView>
        </KeyboardAvoidingView>

      <View className="p-4 border-t border-gray-200 dark:border-gray-800">
        <TouchableOpacity
          onPress={goToNextStep}
          disabled={!canContinue()}
          className={clsx(
            "p-4 rounded-xl items-center",
            canContinue() ? "bg-blue-500" : "bg-gray-300 dark:bg-gray-600"
          )}
        >
          <Text
            className={clsx(
              "text-lg font-bold",
              canContinue() ? "text-white" : "text-gray-500 dark:text-gray-400"
            )}
          >
            {currentStep === 2 ? "Finalizar" : "Continuar"}
          </Text>
        </TouchableOpacity>
        <ProgressDots totalSteps={3} currentStep={currentStep} />
      </View>

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
