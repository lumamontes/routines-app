import { View } from "react-native";
import clsx from "clsx";
// Define types for props and state
interface ProgressDotsProps {
  totalSteps: number;
  currentStep: number;
}
export const ProgressDots: React.FC<ProgressDotsProps> = ({ totalSteps, currentStep }) => {
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
}