import { TouchableOpacity, View } from "react-native";
import { Modal } from "./ui/modal";
import { Text } from "./ui/text";
import ColorPicker, { Swatches } from "reanimated-color-picker";

interface ColorPickerModalProps {
  visible: boolean;
  onClose: () => void;
  onSelect: (color: any) => void;
  initialColor: string;
}


export const ColorPickerModal: React.FC<ColorPickerModalProps> = ({ 
  visible, 
  onClose, 
  onSelect, 
  initialColor 
}) => {
  if (!visible) return null;
  
  return (
    <Modal
      // visible={visible}
      // transparent
      // animationType="fade"
      isOpen={visible}
    >
      <View className="flex-1 bg-black/50 justify-center items-center w-full">
        <View className="w-[90%] max-w-screen-lg bg-white dark:bg-gray-800 rounded-2xl p-5 items-center shadow-md">
          <Text className="text-lg font-bold mb-4 text-gray-900 dark:text-white">Escolha uma cor</Text>
          <ColorPicker
            style={{ width: "100%" }}
            value={initialColor}
            onComplete={onSelect}
          >
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