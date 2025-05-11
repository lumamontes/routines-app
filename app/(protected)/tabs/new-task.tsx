import React, { useState } from 'react';
import {
  ScrollView,
  TouchableOpacity,
  View,
  Platform,
  KeyboardAvoidingView,
  Alert,
} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { useForm, Controller } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';

import { Input, InputField } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Text } from '@/components/ui/text';
import { Textarea, TextareaInput } from '@/components/ui/textarea';
import { Select, SelectTrigger, SelectInput, SelectIcon, SelectPortal, SelectContent, SelectDragIndicatorWrapper, SelectDragIndicator, SelectItem, SelectBackdrop } from '@/components/ui/select';
import { VStack } from '@/components/ui/vstack';
import { HStack } from '@/components/ui/hstack';
import { Switch } from '@/components/ui/switch';
import {
  FormControl,
  FormControlError,
  FormControlErrorText,
  FormControlLabel,
} from '@/components/ui/form-control';
import DateTimePicker from '@react-native-community/datetimepicker';
import { useSetAtom } from 'jotai';
import { Ionicons } from '@expo/vector-icons';
import { ChevronDownIcon } from '@/components/ui/icon';
import { tasksAtom } from '@/store/task';
import { ColorPickerModal } from '@/components/ColorPickerModal';
import { formatDate, formatTime } from '@/utils/date';
import { DAY_NAMES } from '@/constants/Time';
import { SELECTOR_COLORS } from '@/constants/Colors';
import { Task, taskSchema } from '@/types/task';


const AddTaskScreen = () => {
  const navigation = useNavigation();
  const setTasks = useSetAtom(tasksAtom);
  const [showDatePicker, setShowDatePicker] = useState(false);
  const [showTimePicker, setShowTimePicker] = useState(false);
  const [selectedColor, setSelectedColor] = useState('#6200ee');
  const [colorPickerVisible, setColorPickerVisible] = useState(false);
  const [selectedDays, setSelectedDays] = useState<number[]>([]);

  const {
    control,
    handleSubmit,
    formState: { errors },
    setValue,
    watch,
  } = useForm<Task>({
    resolver: zodResolver(taskSchema),
    defaultValues: {
      title: '',
      description: '',
      date: new Date(),
      completed: false,
      priority: 'medium',
      daysOfWeek: []
    },
  });

  const watchDate = watch('date');
  const watchTime = watch('time');

  const handleColorSelect = (color: any): void => {
    setSelectedColor(color.hex);
    setColorPickerVisible(false);
  };

  const toggleDay = (day: number) => {
    if (selectedDays.includes(day)) {
      setSelectedDays(selectedDays.filter(d => d !== day));
    } else {
      setSelectedDays([...selectedDays, day]);
    }
  };

  const onSubmit = async (data: Task) => {
    try {
      // const dateFormatted = format(data.date, "yyyy-MM-dd'T'HH:mm:ss.SSSxxx", { locale: ptBR });
      // const timeFormatted = data.time ? format(data.time, 'HH:mm:ss', { locale: ptBR }) : null;

      const newTask = {
        id: `${Date.now()}-${Math.random()}`,
        title: data.title,
        description: data.description || '',
        completed: data.completed,
        date: data.date ?? new Date(),
        time: data.time ?? new Date(),
        priority: data.priority || 'medium',
        duration: data.duration || 0,
        daysOfWeek: selectedDays,
        visualAid: data.visualAid || '',
        color: selectedColor,
        routineId: data.routineId || '',
      };

      setTasks(async prev => [...(await prev), newTask]);

      navigation.goBack();
    } catch (error) {
      Alert.alert('Erro', 'Erro ao criar tarefa');
    }
  };

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      style={{ flex: 1 }}
    >
      <View className="flex-1 bg-background-50">
        <ScrollView
          style={{ flex: 1 }}
          contentContainerStyle={{ paddingBottom: 32 }}
          className="p-4"
        >
          <VStack className="space-y-6">
            <View className="bg-background-0 rounded-2xl shadow-sm p-4 space-y-4 border border-outline-100 transition-colors duration-300">
              <FormControl isInvalid={!!errors.title}>
                <FormControlLabel>
                  <Text className="text-primary-700 font-semibold mb-1">Título</Text>
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
                        className="bg-background-50 border border-outline-100 rounded-lg px-3 py-2 text-typography-900 focus:border-primary-500 transition-colors duration-300"
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

              <FormControl>
                <FormControlLabel>
                  <Text className="text-primary-700 font-semibold mb-1">Descrição</Text>
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
                        className="bg-background-50 border border-outline-100 rounded-lg px-3 py-2 text-typography-900 focus:border-primary-500 transition-colors duration-300"
                        numberOfLines={4}
                      />
                    </Textarea>
                  )}
                />
              </FormControl>

              <FormControl>
                <FormControlLabel>
                  <Text className="text-primary-700 font-semibold mb-1">Data</Text>
                </FormControlLabel>
                <TouchableOpacity
                  onPress={() => setShowDatePicker(true)}
                  className="bg-background-50 border border-outline-100 rounded-lg px-3 py-3.5 transition-colors duration-300"
                >
                  <Text className="text-typography-900">
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

              <FormControl>
                <FormControlLabel>
                  <Text className="text-primary-700 font-semibold mb-1">
                    Hora (opcional)
                  </Text>
                </FormControlLabel>
                <TouchableOpacity
                  onPress={() => setShowTimePicker(true)}
                  className="bg-background-50 border border-outline-100 rounded-lg px-3 py-3.5 transition-colors duration-300"
                >
                  <Text className="text-typography-900">
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

              <FormControl isInvalid={selectedDays.length === 0}>
                <FormControlLabel>
                  <Text className="text-primary-700 font-semibold mb-1">
                    Dias da Semana
                  </Text>
                </FormControlLabel>
                <View className="flex-row flex-wrap gap-2 mb-2">
                  {DAY_NAMES.map((dayName, index) => (
                    <TouchableOpacity
                      key={index}
                      onPress={() => toggleDay(index)}
                      className={`px-3 py-2 rounded-full ${
                        selectedDays.includes(index) ? 'bg-blue-500' : 'bg-background-200 dark:bg-background-700'
                      }`}
                    >
                      <Text
                        className={`text-sm ${
                          selectedDays.includes(index)
                            ? 'text-background-0'
                            : 'text-typography-900 dark:text-background-300'
                        }`}
                      >
                        {dayName.substring(0, 3)}
                      </Text>
                    </TouchableOpacity>
                  ))}
                </View>
              </FormControl>

              <FormControl>
                <FormControlLabel>
                  <Text className="text-primary-700 font-semibold mb-1">
                    Prioridade
                  </Text>
                </FormControlLabel>
                <Controller
                  control={control}
                  name="priority"
                  render={({ field: { onChange, value } }) => (
                    <Select selectedValue={value} onValueChange={onChange}>
                      <SelectTrigger className="bg-background-50 border border-outline-100 rounded-lg">
                        <SelectInput placeholder="Selecione a prioridade" />
                        <SelectIcon>
                          <ChevronDownIcon className="text-typography-900 dark:text-background-300" />
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

              {/* Duração */}
              <FormControl>
                <FormControlLabel>
                  <Text className="text-primary-700 font-semibold mb-1">
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
                        onChangeText={text => onChange(text ? parseInt(text, 10) : undefined)}
                        keyboardType="numeric"
                        className="bg-background-50 border border-outline-100 rounded-lg px-3 py-2 text-typography-900 focus:border-primary-500 transition-colors duration-300"
                      />
                    </Input>
                  )}
                />
              </FormControl>

              <FormControl>
                <FormControlLabel>
                  <Text className="text-primary-700 font-semibold mb-1">Cor</Text>
                </FormControlLabel>

                <View className="mb-2 flex-row flex-wrap">
                  {SELECTOR_COLORS.map(color => (
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
                    className="mr-2 mb-2 border border-outline-100 items-center justify-center"
                    style={{ width: 40, height: 40, borderRadius: 20 }}
                  >
                    <Ionicons name="color-palette" size={20} color="#666" />
                  </TouchableOpacity>
                </View>
              </FormControl>

              <FormControl>
                <HStack className="space-x-2 items-center">
                  <Controller
                    control={control}
                    name="completed"
                    render={({ field: { onChange, value } }) => (
                      <Switch value={value} onToggle={onChange} size="md" />
                    )}
                  />
                  <Text className="text-typography-900 font-semibold">
                    Marcar como concluída
                  </Text>
                </HStack>
              </FormControl>
            </View>

            <Button
              className="mt-6 bg-primary-700 rounded-xl shadow-md transition-colors duration-300"
              onPress={handleSubmit(onSubmit)}
            >
              <Text className="text-background-0 text-lg font-bold">Salvar Tarefa</Text>
            </Button>
          </VStack>
        </ScrollView>

        <ColorPickerModal
          visible={colorPickerVisible}
          onClose={() => setColorPickerVisible(false)}
          onSelect={handleColorSelect}
          initialColor={selectedColor}
        />
      </View>
    </KeyboardAvoidingView>
  );
};

export default AddTaskScreen;
