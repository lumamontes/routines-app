import React, { useEffect, useState } from 'react';
import { ScrollView, TouchableOpacity, View, Modal, Alert } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { useForm, Controller } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';

// Componentes do GlueStack UI com imports individuais
import { Input } from '@/components/ui/input';
import { InputField } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Text } from '@/components/ui/text';
import { Textarea, TextareaInput } from '@/components/ui/textarea';
import { Select } from '@/components/ui/select';
import { SelectTrigger } from '@/components/ui/select';
import { SelectInput } from '@/components/ui/select';
import { SelectIcon } from '@/components/ui/select';
import { SelectPortal } from '@/components/ui/select';
import { SelectContent } from '@/components/ui/select';
import { SelectDragIndicatorWrapper } from '@/components/ui/select';
import { SelectDragIndicator } from '@/components/ui/select';
import { SelectItem } from '@/components/ui/select';
import { SelectBackdrop } from '@/components/ui/select';
import { Switch } from '@/components/ui/switch';
import { FormControl, FormControlError, FormControlErrorText, FormControlLabel } from '@/components/ui/form-control';
import { ChevronDownIcon } from '@/components/ui/icon';

import { Ionicons } from '@expo/vector-icons';
import ColorPicker, {
  Panel1,
  Swatches,
  Preview,
  HueSlider,
} from "reanimated-color-picker";
import { routinesAtom } from '@/store/routine';
import { useAtom } from 'jotai';

// Definindo o esquema do formulário com Zod
const routineSchema = z.object({
  title: z.string().min(1, 'O título é obrigatório'),
  description: z.string().optional(),
  timeOfDay: z.enum(['morning', 'afternoon', 'evening', 'night']).optional(),
  isActive: z.boolean(),
  days: z.array(z.number()).optional(),
});

type RoutineFormData = z.infer<typeof routineSchema>;

// Interface para o modal do color picker
interface ColorPickerModalProps {
  visible: boolean;
  onClose: () => void;
  onSelect: (color: any) => void;
  initialColor: string;
}

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

const CreateRoutineScreen = () => {
  const navigation = useNavigation();
  const [routines, setRoutines] = useAtom(routinesAtom);
  const [selectedDays, setSelectedDays] = useState<number[]>([]);
  const [selectedColor, setSelectedColor] = useState('#6200ee');
  const [colorPickerVisible, setColorPickerVisible] = useState(false);

  const {
    control,
    handleSubmit,
    formState: { errors },
  } = useForm<RoutineFormData>({
    resolver: zodResolver(routineSchema),
    defaultValues: {
      title: '',
      description: '',
      timeOfDay: 'morning',
      isActive: true,
      days: []
    },
  });

  const handleColorSelect = (color: any): void => {
    setSelectedColor(color.hex);
    setColorPickerVisible(false);
  };

  const toggleDay = (day: number) => {
    console.log('Toggling day:', day);
    console.log('Selected days before toggle:', selectedDays);
    if (selectedDays.includes(day)) {
      setSelectedDays(selectedDays.filter((d) => d !== day));
    } else {
      setSelectedDays([...selectedDays, day]);
    }
    console.log('Selected days after toggle:', selectedDays);
  };

  const onSubmit = async (data: RoutineFormData) => {
    console.log('Form data:', data);
    try {
      // Criar a rotina no banco de dados
      console.log('Creating routine with data:', data);
      const newRoutine = await DB.createRoutine(
        {
          title: data.title,
          description: data.description,
          timeOfDay: data.timeOfDay,
          isActive: data.isActive,
          color: selectedColor,
        }, 
        selectedDays
      );

      // Atualizar o átomo de rotinas
      const resolvedRoutine = await newRoutine;
      console.log('Resolved routine:', resolvedRoutine);
      setRoutines(async (prev) => [...(await prev), resolvedRoutine]);

      // Voltar para a tela anterior
      navigation.goBack();
    } catch (error) {
      Alert.alert(
        'Erro',
        'Não foi possível criar a rotina. Tente novamente.',
        [{ text: 'OK' }]
      );
      console.error('Erro ao criar rotina:', error);
      // Aqui você poderia adicionar uma notificação de erro
    }
  };

  // Mapeia os nomes dos dias da semana em português
  const dayNames = [
    'Domingo',
    'Segunda',
    'Terça',
    'Quarta',
    'Quinta',
    'Sexta',
    'Sábado'
  ];

  useEffect(() => {
    console.log(errors);
  }
  , [errors]);

  return (
    <ScrollView className="flex-1 bg-white dark:bg-gray-900 p-4">
      <View className="gap-4 w-full">
        <Text className="text-2xl font-bold text-gray-800 dark:text-white mb-4">
          Criar Nova Rotina
        </Text>

        {/* Título */}
        <FormControl isInvalid={!!errors.title}>
          <FormControlLabel>
            <Text className="text-gray-700 dark:text-gray-300 font-medium mb-1">Título</Text>
          </FormControlLabel>
          <Controller
            control={control}
            name="title"
            render={({ field: { onChange, value } }) => (
              <Input>
                <InputField
                  placeholder="Digite o título da rotina"
                  value={value}
                  onChangeText={onChange}
                  className="bg-gray-50 dark:bg-gray-800 border border-gray-300 dark:border-gray-700 rounded-lg px-3 py-2"
                />
              </Input>
            )}
          />
          {errors.title && (
            <FormControlError>
              <FormControlErrorText>{errors.title.message}</FormControlErrorText>
            </FormControlError>
          )}
        </FormControl>

        {/* Descrição */}
        <FormControl>
          <FormControlLabel>
            <Text className="text-gray-700 dark:text-gray-300 font-medium mb-1">Descrição</Text>
          </FormControlLabel>
          <Controller
            control={control}
            name="description"
            render={({ field: { onChange, value } }) => (
              <Textarea>
                <TextareaInput
                  placeholder="Adicione mais detalhes sobre a rotina"
                  value={value || ''}
                  onChangeText={onChange}
                  className="bg-gray-50 dark:bg-gray-800 border border-gray-300 dark:border-gray-700 rounded-lg px-3 py-2"
                  numberOfLines={4}
                />
              </Textarea>
            )}
          />
        </FormControl>

        {/* Período do dia */}
        <FormControl>
          <FormControlLabel>
            <Text className="text-gray-700 dark:text-gray-300 font-medium mb-1">Período do Dia</Text>
          </FormControlLabel>
          <Controller
            control={control}
            name="timeOfDay"
            render={({ field: { onChange, value } }) => (
              <Select
                selectedValue={value}
                onValueChange={onChange}
              >
                <SelectTrigger className="bg-gray-50 dark:bg-gray-800 border border-gray-300 dark:border-gray-700 rounded-lg">
                  <SelectInput placeholder="Selecione o período do dia" />
                  <SelectIcon as={ChevronDownIcon} className="text-gray-500 dark:text-gray-400">
                  </SelectIcon>
                </SelectTrigger>
                <SelectPortal>
                  <SelectBackdrop />
                  <SelectContent>
                    <SelectDragIndicatorWrapper>
                      <SelectDragIndicator />
                    </SelectDragIndicatorWrapper>
                    <SelectItem label="Manhã" value="morning" />
                    <SelectItem label="Tarde" value="afternoon" />
                    <SelectItem label="Noite" value="evening" />
                    <SelectItem label="Madrugada" value="night" />
                  </SelectContent>
                </SelectPortal>
              </Select>
            )}
          />
        </FormControl>

        {/* Dias da semana */}
        <FormControl isInvalid={selectedDays.length === 0}>
          <FormControlLabel>
            <Text className="text-gray-700 dark:text-gray-300 font-medium mb-1">Dias da Semana</Text>
          </FormControlLabel>
          <View className="flex-row flex-wrap gap-2 mb-2">
            {dayNames.map((dayName, index) => (
              <TouchableOpacity
                key={index}
                onPress={() => toggleDay(index)}
                className={`px-3 py-2 rounded-full ${
                  selectedDays.includes(index)
                    ? 'bg-blue-500'
                    : 'bg-gray-200 dark:bg-gray-700'
                }`}
              >
                <Text
                  className={`text-sm ${
                    selectedDays.includes(index)
                      ? 'text-white'
                      : 'text-gray-700 dark:text-gray-300'
                  }`}
                >
                  {dayName.substring(0, 3)}
                </Text>
              </TouchableOpacity>
            ))}
          </View>
          {selectedDays.length === 0 && (
            <FormControlError>
              <FormControlErrorText>Selecione pelo menos um dia da semana</FormControlErrorText>
            </FormControlError>
          )}
        </FormControl>

        {/* Cor */}
        <FormControl>
          <FormControlLabel>
            <Text className="text-gray-700 dark:text-gray-300 font-medium mb-1">Cor</Text>
          </FormControlLabel>
          
          <View className="mb-2 flex-row flex-wrap">
            {[
              '#6200ee', // Roxo
              '#03dac4', // Verde água
              '#ff5722', // Laranja
              '#f44336', // Vermelho
              '#2196f3', // Azul
              '#4caf50', // Verde
              '#ffeb3b', // Amarelo
              '#9c27b0', // Roxo escuro
              '#607d8b', // Cinza azulado
              '#e91e63', // Rosa
            ].map((color) => (
              <TouchableOpacity
                key={color}
                onPress={() => setSelectedColor(color)}
                className="mr-2 mb-2"
              >
                <View 
                  style={{ backgroundColor: color }}
                  className="w-10 h-10 rounded-full items-center justify-center"
                >
                  {selectedColor === color && (
                    <Ionicons name="checkmark" size={20} color="white" />
                  )}
                </View>
              </TouchableOpacity>
            ))}
            <TouchableOpacity
              onPress={() => setColorPickerVisible(true)}
              className="mr-2 mb-2 border border-gray-300 dark:border-gray-600 items-center justify-center"
              style={{ width: 40, height: 40, borderRadius: 20 }}
            >
              <Ionicons name="color-palette" size={20} color="#666" />
            </TouchableOpacity>
          </View>
        </FormControl>

        {/* Ativa */}
        <FormControl>
          <View className="flex-row gap-2 items-center">
            <Controller
              control={control}
              name="isActive"
              render={({ field: { onChange, value } }) => (
                <Switch
                  value={value}
                  onToggle={onChange}
                  size="md"
                />
              )}
            />
            <Text className="text-gray-700 dark:text-gray-300 font-medium">Rotina ativa</Text>
          </View>
        </FormControl>

        {/* Botões */}
        <View className="flex-row gap-4 mt-6">
          <Button
            onPress={() => navigation.goBack()}
            variant="outline"
            className="flex-1"
          >
            <Text>Cancelar</Text>
          </Button>
          <Button
            onPress={handleSubmit(onSubmit)}
            className="flex-1 bg-blue-600"
          >
            <Text className="text-white">Salvar</Text>
          </Button>
        </View>
      </View>
      
      {/* Color Picker Modal */}
      <ColorPickerModal
        visible={colorPickerVisible}
        onClose={() => setColorPickerVisible(false)}
        onSelect={handleColorSelect}
        initialColor={selectedColor}
      />
    </ScrollView>
  );
};

export default CreateRoutineScreen;