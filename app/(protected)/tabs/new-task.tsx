import React, { useState } from 'react';
import { ScrollView, TouchableOpacity, View, Modal } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { useForm, Controller } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';

import { Input } from '@/components/ui/input';
import { InputField } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Text } from '@/components/ui/text';
import { Textarea } from '@/components/ui/textarea';
import { TextareaInput } from '@/components/ui/textarea';
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
import { VStack } from '@/components/ui/vstack';
import { HStack } from '@/components/ui/hstack';
import { Switch } from '@/components/ui/switch';
import { FormControl, FormControlError, FormControlErrorText, FormControlLabel } from '@/components/ui/form-control';
import DateTimePicker from '@react-native-community/datetimepicker';
import { useAtom } from 'jotai';
import { tasksAtom } from '@/store/atoms';
import * as DB from '@/services/database';
import { format } from 'date-fns';
import { ptBR } from 'date-fns/locale';
import { Ionicons } from '@expo/vector-icons';
import ColorPicker, {
  Panel1,
  Swatches,
  Preview,
  HueSlider,
} from "reanimated-color-picker";
import { ChevronDownIcon } from '@/components/ui/icon';
import { ScreenHeader } from '@/components/ScreenHeader';

// Definindo o esquema do formulário com Zod
const taskSchema = z.object({
  title: z.string().min(1, 'O título é obrigatório'),
  description: z.string().optional(),
  date: z.date(),
  time: z.date().optional(),
  completed: z.boolean(),
  priority: z.enum(['low', 'medium', 'high']).optional(),
  duration: z.number().min(1).optional(),
  timeOfDay: z.enum(['morning', 'afternoon', 'evening', 'night']).optional(),
  visualAid: z.string().optional(),
  color: z.string().optional(),
  routineId: z.string().optional(),
});

type TaskFormData = z.infer<typeof taskSchema>;

// Define interfaces
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

const AddTaskScreen = () => {
  const navigation = useNavigation();
  const [tasks, setTasks] = useAtom(tasksAtom);
  const [showDatePicker, setShowDatePicker] = useState(false);
  const [showTimePicker, setShowTimePicker] = useState(false);
  const [selectedColor, setSelectedColor] = useState('#6200ee');
  const [colorPickerVisible, setColorPickerVisible] = useState(false);

  const {
    control,
    handleSubmit,
    formState: { errors },
    setValue,
    watch,
  } = useForm<TaskFormData>({
    resolver: zodResolver(taskSchema),
    defaultValues: {
      title: '',
      description: '',
      date: new Date(),
      completed: false,
      priority: 'medium',
      timeOfDay: 'morning',
    },
  });

  const watchDate = watch('date');
  const watchTime = watch('time');

  const handleColorSelect = (color: any): void => {
    setSelectedColor(color.hex);
    setColorPickerVisible(false);
  };

  const onSubmit = async (data: TaskFormData) => {
    try {
      // Formatar a data para ISO
      const dateFormatted = DB.formatDateToISO(data.date);
      
      // Formatar a hora se existir
      const timeFormatted = data.time ? DB.formatTimeString(data.time) : undefined;

      // Criar a tarefa no banco de dados
      const newTask = await DB.createTask({
        title: data.title,
        description: data.description,
        completed: data.completed,
        date: dateFormatted,
        time: timeFormatted,
        priority: data.priority,
        duration: data.duration,
        timeOfDay: data.timeOfDay,
        visualAid: data.visualAid,
        color: selectedColor,
        routineId: data.routineId,
      });

      // Atualizar o átomo de tarefas
      setTasks(async (prev) => [...(await prev), newTask]);

      // Voltar para a tela anterior
      navigation.goBack();
    } catch (error) {
      console.error('Erro ao criar tarefa:', error);
      // Aqui você poderia adicionar uma notificação de erro
    }
  };

  // Auxiliar para formatar a data para exibição
  const formatDate = (date: Date) => {
    return format(date, "dd 'de' MMMM 'de' yyyy", { locale: ptBR });
  };

  // Auxiliar para formatar a hora para exibição
  const formatTime = (date: Date) => {
    return format(date, 'HH:mm', { locale: ptBR });
  };

  return (
    <View style={{ flex: 1, backgroundColor: '#fff' }}>
    <ScrollView 
    style={{
      flex: 1,
    }}
    className="bg-white dark:bg-gray-900 p-4">
      <VStack className='space-y-4'>
        <Text className="text-2xl font-bold text-gray-800 dark:text-white mb-4">
          Adicionar Nova Tarefaxxx
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
                  placeholder="Digite o título da tarefa"
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
                  placeholder="Adicione mais detalhes sobre a tarefa"
                  value={value || ''}
                  onChangeText={onChange}
                  className="bg-gray-50 dark:bg-gray-800 border border-gray-300 dark:border-gray-700 rounded-lg px-3 py-2"
                  numberOfLines={4}
                />
              </Textarea>
            )}
          />
        </FormControl>

        {/* Data */}
        <FormControl>
          <FormControlLabel>
            <Text className="text-gray-700 dark:text-gray-300 font-medium mb-1">Data</Text>
          </FormControlLabel>
          <TouchableOpacity
            onPress={() => setShowDatePicker(true)}
            className="bg-gray-50 dark:bg-gray-800 border border-gray-300 dark:border-gray-700 rounded-lg px-3 py-3.5"
          >
            <Text className="text-gray-700 dark:text-gray-300">
              {watchDate ? formatDate(watchDate) : 'Selecione uma data'}
            </Text>
          </TouchableOpacity>

          {showDatePicker && (
            <DateTimePicker
              value={watchDate || new Date()}
              mode="date"
              display="default"
              onChange={(event, selectedDate) => {
                setShowDatePicker(false);
                if (selectedDate) {
                  setValue('date', selectedDate);
                }
              }}
            />
          )}
        </FormControl>

        {/* Hora */}
        <FormControl>
          <FormControlLabel>
            <Text className="text-gray-700 dark:text-gray-300 font-medium mb-1">Hora (opcional)</Text>
          </FormControlLabel>
          <TouchableOpacity
            onPress={() => setShowTimePicker(true)}
            className="bg-gray-50 dark:bg-gray-800 border border-gray-300 dark:border-gray-700 rounded-lg px-3 py-3.5"
          >
            <Text className="text-gray-700 dark:text-gray-300">
              {watchTime ? formatTime(watchTime) : 'Selecione um horário'}
            </Text>
          </TouchableOpacity>

          {showTimePicker && (
            <DateTimePicker
              value={watchTime || new Date()}
              mode="time"
              display="default"
              onChange={(event, selectedTime) => {
                setShowTimePicker(false);
                if (selectedTime) {
                  setValue('time', selectedTime);
                }
              }}
            />
          )}
        </FormControl>

        {/* Prioridade */}
        <FormControl>
          <FormControlLabel>
            <Text className="text-gray-700 dark:text-gray-300 font-medium mb-1">Prioridade</Text>
          </FormControlLabel>
          <Controller
            control={control}
            name="priority"
            render={({ field: { onChange, value } }) => (
              <Select
                selectedValue={value}
                onValueChange={onChange}
              >
                <SelectTrigger className="bg-gray-50 dark:bg-gray-800 border border-gray-300 dark:border-gray-700 rounded-lg">
                  <SelectInput placeholder="Selecione a prioridade" />
                  <SelectIcon>
                    <ChevronDownIcon />
                  </SelectIcon>
                </SelectTrigger>
                <SelectPortal>
                  <SelectBackdrop />
                  <SelectContent>
                    <SelectDragIndicatorWrapper>
                      <SelectDragIndicator />
                    </SelectDragIndicatorWrapper>
                    <SelectItem label="Baixa" value="low" />
                    <SelectItem label="Média" value="medium" />
                    <SelectItem label="Alta" value="high" />
                  </SelectContent>
                </SelectPortal>
              </Select>
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
                  <SelectIcon>
                    <ChevronDownIcon  className="text-gray-700 dark:text-gray-300" />
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

        {/* Duração */}
        <FormControl>
          <FormControlLabel>
            <Text className="text-gray-700 dark:text-gray-300 font-medium mb-1">
              Duração (em minutos - opcional)
            </Text>
          </FormControlLabel>
          <Controller
            control={control}
            name="duration"
            render={({ field: { onChange, value } }) => (
              <Input>
                <InputField
                  placeholder="Ex: 30"
                  value={value?.toString() || ''}
                  onChangeText={(text) => onChange(text ? parseInt(text, 10) : undefined)}
                  keyboardType="numeric"
                  className="bg-gray-50 dark:bg-gray-800 border border-gray-300 dark:border-gray-700 rounded-lg px-3 py-2"
                />
              </Input>
            )}
          />
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

        {/* Concluída */}
        <FormControl>
          <HStack className='space-x-2 items-center'>
            <Controller
              control={control}
              name="completed"
              render={({ field: { onChange, value } }) => (
                <Switch
                  value={value}
                  onToggle={onChange}
                  size="md"
                />
              )}
            />
            <Text className="text-gray-700 dark:text-gray-300 font-medium">Marcar como concluída</Text>
          </HStack>
        </FormControl>

        {/* Botões */}
        <HStack className="mt-4 space-x-2">
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
        </HStack>
      </VStack>
    </ScrollView>
    
    {/* Color Picker Modal */}
    <ColorPickerModal
      visible={colorPickerVisible}
      onClose={() => setColorPickerVisible(false)}
      onSelect={handleColorSelect}
      initialColor={selectedColor}
    />
    </View>
  );
};

export default AddTaskScreen;