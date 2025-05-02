import React, { useState, useMemo } from 'react';
import { View, FlatList, Text, TouchableOpacity } from 'react-native';
import { Calendar as CalendarIcon, ChevronLeft, ChevronRight } from 'lucide-react-native';
import { useAtom } from 'jotai';
import clsx from 'clsx';
import { tasksAtom } from '@/store/atoms';
import { Task, toggleTaskCompletion } from '@/services/database';
import { Colors } from '@/constants/Colors';
import { useColorScheme } from '@/components/useColorScheme';
import { ScreenHeader } from '@/components/ScreenHeader';
import { TaskCard } from '@/components/TaskCard';
import { EmptyState } from '@/components/EmptyState';

const WEEKDAYS = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];

export default function CalendarScreen() {
  const [tasks, setTasks] = useAtom(tasksAtom);
  
  // Get the current date info
  const today = new Date();
  const [currentMonth, setCurrentMonth] = useState(today.getMonth());
  const [currentYear, setCurrentYear] = useState(today.getFullYear());
  const [selectedDate, setSelectedDate] = useState(today.toISOString().split('T')[0]);
  
  const colorScheme = useColorScheme() ?? 'light';
  const textColor = Colors[colorScheme].text;
  const iconColor = Colors[colorScheme].icon;
  const backgroundColor = Colors[colorScheme].background;
  const borderColor = colorScheme === 'dark' ? '#2d3748' : '#e2e8f0'; // gray-700 or gray-200
  const cardBackground = colorScheme === 'dark' ? '#1a202c' : 'white'; // gray-900 or white
  const primaryColor = Colors[colorScheme].tint;
  const accentColor = '#f59e0b'; // amber-500
  const surfaceVariant = colorScheme === 'dark' ? '#2d3748' : '#f1f5f9'; // gray-700 or gray-100
  
  // Helper function to get tasks for a specific date
  const getTasksByDate = (date: string) => {
    return tasks.filter(task => task.date === date);
  };
  
  // Get the tasks for the selected date
  const tasksForSelectedDate = useMemo(() => 
    getTasksByDate(selectedDate), 
    [tasks, selectedDate]
  );
  
  // Calculate dates for the current month
  const getDaysInMonth = (year: number, month: number) => {
    return new Date(year, month + 1, 0).getDate();
  };
  
  const getFirstDayOfMonth = (year: number, month: number) => {
    return new Date(year, month, 1).getDay();
  };
  
  // Generate calendar days
  const generateCalendarDays = () => {
    const daysInMonth = getDaysInMonth(currentYear, currentMonth);
    const firstDayOfMonth = getFirstDayOfMonth(currentYear, currentMonth);
    const days = [];
    
    // Add empty days for the start of the month
    for (let i = 0; i < firstDayOfMonth; i++) {
      days.push({ day: '', date: '' });
    }
    
    // Add the days of the month
    for (let i = 1; i <= daysInMonth; i++) {
      const dateStr = `${currentYear}-${(currentMonth + 1).toString().padStart(2, '0')}-${i.toString().padStart(2, '0')}`;
      const taskCount = getTasksByDate(dateStr).length;
      
      days.push({
        day: i.toString(),
        date: dateStr,
        isToday: dateStr === today.toISOString().split('T')[0],
        isSelected: dateStr === selectedDate,
        hasTasks: taskCount > 0,
        taskCount,
      });
    }
    
    return days;
  };
  
  const calendarDays = useMemo(() => generateCalendarDays(), [currentMonth, currentYear, tasks, selectedDate]);
  
  // Month navigation
  const goToPreviousMonth = () => {
    if (currentMonth === 0) {
      setCurrentMonth(11);
      setCurrentYear(currentYear - 1);
    } else {
      setCurrentMonth(currentMonth - 1);
    }
  };
  
  const goToNextMonth = () => {
    if (currentMonth === 11) {
      setCurrentMonth(0);
      setCurrentYear(currentYear + 1);
    } else {
      setCurrentMonth(currentMonth + 1);
    }
  };
  
  // Format the month and year
  const formatMonthYear = () => {
    const monthNames = [
      'January', 'February', 'March', 'April', 'May', 'June',
      'July', 'August', 'September', 'October', 'November', 'December'
    ];
    return `${monthNames[currentMonth]} ${currentYear}`;
  };
  
  const handleDateSelect = (date: string) => {
    if (date) {
      setSelectedDate(date);
    }
  };
  
  const handleTaskPress = (task: Task) => {
    // In a more complete app, this would navigate to a task detail view
    console.log('Task pressed:', task);
  };
  
  const handleAddTask = () => {
    // In a more complete app, this would navigate to a task creation view
    console.log('Add task pressed for date:', selectedDate);
  };

  const handleToggleTask = async (id: string) => {
    // Find the task to toggle
    const taskToToggle = tasks.find(task => task.id === id);
    if (!taskToToggle) return;
    
    // Toggle the task completion status
    const updatedCompleted = !taskToToggle.completed;
    
    // Update in the database
    await toggleTaskCompletion(id, updatedCompleted);
    
    // Update in Jotai state
    setTasks(async (prevTasks) => {
      const resolvedTasks = await Promise.resolve(prevTasks);
      return resolvedTasks.map(task => 
        task.id === id ? { ...task, completed: updatedCompleted } : task
      );
    });
  };

  // Render a calendar day
  const renderCalendarDay = ({ day, date, isToday, isSelected, hasTasks, taskCount }: any) => {
    if (!day) {
      return <View className="flex-1 justify-center items-center rounded" />;
    }
    
    return (
      <TouchableOpacity
        className={clsx(
          "flex-1 justify-center items-center rounded", 
          isToday && "bg-gray-100 dark:bg-gray-700",
          isSelected && "bg-blue-500"
        )}
        style={{
          backgroundColor: isSelected ? primaryColor : isToday ? surfaceVariant : undefined
        }}
        onPress={() => handleDateSelect(date)}
        activeOpacity={0.7}
        disabled={!date}
      >
        <Text 
          className={clsx(
            "text-sm",
            isToday && "font-semibold",
            isSelected && "text-background-300 font-semibold"
          )}
          style={{ color: isSelected ? 'background-300' : textColor }}
        >
          {day}
        </Text>
        
        {hasTasks && (
          <View 
            className="absolute bottom-0.5 w-4 h-4 rounded-full justify-center items-center"
            style={{ backgroundColor: accentColor }}
          >
            <Text className="text-background-300 text-xs font-semibold">
              {taskCount}
            </Text>
          </View>
        )}
      </TouchableOpacity>
    );
  };

  return (
    <View className="flex-1" style={{ backgroundColor }}>
      <ScreenHeader 
        title="Calendar" 
        onAddPress={handleAddTask}
      />
      
      <View 
        className="mx-6 my-4 rounded-lg p-4 shadow border"
        style={{ 
          backgroundColor: cardBackground,
          borderColor
        }}
      >
        <View className="flex-row justify-between items-center mb-4">
          <TouchableOpacity 
            className="p-1"
            onPress={goToPreviousMonth}
          >
            <ChevronLeft size={24} color={textColor} />
          </TouchableOpacity>
          
          <Text 
            className="text-lg font-semibold"
            style={{ color: textColor }}
          >
            {formatMonthYear()}
          </Text>
          
          <TouchableOpacity 
            className="p-1"
            onPress={goToNextMonth}
          >
            <ChevronRight size={24} color={textColor} />
          </TouchableOpacity>
        </View>
        
        <View className="flex-row mb-2">
          {WEEKDAYS.map((day) => (
            <Text 
              key={day} 
              className="flex-1 text-center text-sm font-semibold"
              style={{ color: iconColor }}
            >
              {day}
            </Text>
          ))}
        </View>
        
        <View className="flex-row flex-wrap">
          {calendarDays.map((day, index) => (
            <View key={index} className="w-[14.28%] aspect-square p-0.5">
              {renderCalendarDay(day)}
            </View>
          ))}
        </View>
      </View>
      
      <View className="flex-1 px-6">
        <Text 
          className="text-lg font-semibold mb-4"
          style={{ color: textColor }}
        >
          {new Date(selectedDate).toLocaleDateString('en-US', { 
            weekday: 'long', 
            month: 'long', 
            day: 'numeric' 
          })}
        </Text>
        
        {tasksForSelectedDate.length > 0 ? (
          <FlatList
            data={tasksForSelectedDate}
            renderItem={({ item }) => (
              <TaskCard 
                task={item} 
                onToggle={handleToggleTask}
                onPress={handleTaskPress}
              />
            )}
            keyExtractor={(item) => item.id}
            className="pb-8"
            showsVerticalScrollIndicator={false}
          />
        ) : (
          <EmptyState
            title="No Tasks"
            message={`You don't have any tasks for ${new Date(selectedDate).toLocaleDateString('en-US', { 
              month: 'long', 
              day: 'numeric' 
            })}`}
            actionLabel="Add Task"
            onAction={handleAddTask}
            icon={<CalendarIcon size={48} color={iconColor} />}
          />
        )}
      </View>
    </View>
  );
}