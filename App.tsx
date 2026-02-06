import { StatusBar } from 'expo-status-bar';
import { ScrollView, Animated, PanResponder, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { LinearGradient } from 'expo-linear-gradient';
import React, { useState, useRef, useEffect, useMemo } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Task } from './types';
import Header from './components/Header';
import TodaySection from './components/TodaySection';
import ProgressSection from './components/ProgressSection';
import BottomSheet from './components/BottomSheet';
import AddTaskModal from './components/AddTaskModal';
import ProfileModal from './components/ProfileModal';
import { appStyles as styles } from './styles/appStyles';
import * as taskHelpers from './utils/taskHelpers';
import { generateColorTheme, ColorTheme, addAlpha } from './utils/colorUtils';

export default function App(): React.JSX.Element {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [modalVisible, setModalVisible] = useState(false);
  const [profileModalVisible, setProfileModalVisible] = useState(false);
  const [isExpanded, setIsExpanded] = useState(false);
  const [currentSection, setCurrentSection] = useState<'today' | 'thisWeek' | 'other'>('today');
  const [editingTask, setEditingTask] = useState<Task | null>(null);
  const [dayStartTime, setDayStartTime] = useState<string>('');
  const [timeFormat, setTimeFormat] = useState<'schedule' | 'minutes' | 'notime'>('schedule');
  const [selectedAvatar, setSelectedAvatar] = useState<string>('�');  const [selectedColor, setSelectedColor] = useState<string>('#99E699');
  const colorTheme = useMemo(() => generateColorTheme(selectedColor), [selectedColor]);

  const translateY = useRef(new Animated.Value(0)).current;
  const slideAnim = useRef(new Animated.Value(500)).current;

  const panResponder = useRef(
    PanResponder.create({
      onStartShouldSetPanResponder: () => true,
      onMoveShouldSetPanResponder: (_, gestureState) => {
        // Allow vertical movement
        return Math.abs(gestureState.dy) > 5;
      },
      onPanResponderMove: (_, gestureState) => {
        // Always follow the finger movement
        translateY.setValue(gestureState.dy);
      },
      onPanResponderRelease: (_, gestureState) => {
        if (gestureState.dy > 50) {
          // Swipe down - collapse
          Animated.parallel([
            Animated.timing(translateY, {
              toValue: 0,
              duration: 300,
              useNativeDriver: true,
            }),
            Animated.timing(slideAnim, {
              toValue: 500,
              duration: 300,
              useNativeDriver: true,
            })
          ]).start(() => setIsExpanded(false));
        } else if (gestureState.dy < -50 && !isExpanded) {
          // Swipe up - expand
          setIsExpanded(true);
          Animated.parallel([
            Animated.timing(translateY, {
              toValue: 0,
              duration: 300,
              useNativeDriver: true,
            }),
            Animated.timing(slideAnim, {
              toValue: 0,
              duration: 300,
              useNativeDriver: true,
            })
          ]).start();
        } else {
          // Return to original position
          Animated.spring(translateY, {
            toValue: 0,
            useNativeDriver: true,
          }).start();
        }
      },
    })
  ).current;

  const toggleTaskHandler = (id: number) => {
    const updatedTasks = taskHelpers.toggleTask(tasks, id);
    setTasks(updatedTasks);
    saveTasks(updatedTasks);
  };

  const deleteTask = (id: number) => {
    const updatedTasks = taskHelpers.deleteTask(tasks, id);
    setTasks(updatedTasks);
    saveTasks(updatedTasks);
  };

  const handleAddTask = (newTaskData: Omit<Task, 'id' | 'completed'>) => {
    if (editingTask) {
      const updatedTasks = taskHelpers.editTask(tasks, editingTask, newTaskData);
      setTasks(updatedTasks);
      saveTasks(updatedTasks);
      setEditingTask(null);
    } else {
      const { updatedTasks, newStartTime } = taskHelpers.addTask(tasks, newTaskData, activeTasks);
      setTasks(updatedTasks);
      saveTasks(updatedTasks);
      
      if (newStartTime) {
        setDayStartTime(newStartTime);
        AsyncStorage.setItem('dayStartTime', newStartTime);
      }
    }
    setModalVisible(false);
  };

  const handleEditTask = (task: Task) => {
    setEditingTask(task);
    setCurrentSection(task.section);
    setModalVisible(true);
  };

  const moveTaskToSectionHandler = (taskId: number, newSection: 'today' | 'thisWeek' | 'other') => {
    const updatedTasks = taskHelpers.moveTaskToSection(tasks, taskId, newSection);
    setTasks(updatedTasks);
    saveTasks(updatedTasks);
  };

  const moveTaskUp = (taskId: number) => {
    const { updatedTasks, newStartTime } = taskHelpers.moveTaskUp(tasks, taskId, dayStartTime);
    setTasks(updatedTasks);
    saveTasks(updatedTasks);
    if (newStartTime !== dayStartTime) {
      setDayStartTime(newStartTime);
      AsyncStorage.setItem('dayStartTime', newStartTime);
    }
  };

  const moveTaskDown = (taskId: number) => {
    const { updatedTasks, newStartTime } = taskHelpers.moveTaskDown(tasks, taskId, dayStartTime);
    setTasks(updatedTasks);
    saveTasks(updatedTasks);
    if (newStartTime !== dayStartTime) {
      setDayStartTime(newStartTime);
      AsyncStorage.setItem('dayStartTime', newStartTime);
    }
  };

  const activeTasks = tasks.filter(task => !task.completed && task.section === 'today');
  const completedTasks = tasks.filter(task => task.completed);
  const thisWeekTasks = tasks.filter(task => !task.completed && task.section === 'thisWeek');
  const otherTasks = tasks.filter(task => !task.completed && task.section === 'other');

  // Ladda tasks från AsyncStorage när appen startar
  useEffect(() => {
    loadTasks();
  }, []);

  const loadTasks = async () => {
    try {
      const savedTasks = await AsyncStorage.getItem('tasks');
      const lastClearedDate = await AsyncStorage.getItem('lastClearedDate');
      const savedStartTime = await AsyncStorage.getItem('dayStartTime');
      const savedTimeFormat = await AsyncStorage.getItem('timeFormat');
      const savedAvatar = await AsyncStorage.getItem('selectedAvatar');
      const savedColor = await AsyncStorage.getItem('selectedColor');
      
      // Ladda timeFormat
      if (savedTimeFormat) {
        setTimeFormat(savedTimeFormat as 'schedule' | 'minutes' | 'notime');
      }
      
      // Ladda avatar
      if (savedAvatar) {
        setSelectedAvatar(savedAvatar);
      }
      
      // Ladda color
      if (savedColor) {
        setSelectedColor(savedColor);
      }
      
      // Kontrollera om det är en ny dag
      const today = new Date().toDateString();
      const shouldClearToday = lastClearedDate !== today;
      
      if (savedTasks !== null) {
        let parsedTasks = JSON.parse(savedTasks);
        
        // MIGRATION: Rensa alla tasks från today om någon har '09.00'
        const hasBadTime = parsedTasks.some((task: Task) => task.section === 'today' && task.time === '09.00');
        if (hasBadTime) {
          console.log('🔧 Migration: Rensar today-tasks med 09.00');
          parsedTasks = parsedTasks.filter((task: Task) => task.section !== 'today');
          await AsyncStorage.setItem('tasks', JSON.stringify(parsedTasks));
          await AsyncStorage.removeItem('dayStartTime');
          setDayStartTime('');
          setTasks(parsedTasks);
          return;
        }
        
        // Om det är en ny dag, ta bort alla tasks från "today" sektionen
        if (shouldClearToday) {
          parsedTasks = parsedTasks.filter((task: Task) => task.section !== 'today');
          await AsyncStorage.setItem('tasks', JSON.stringify(parsedTasks));
          await AsyncStorage.setItem('lastClearedDate', today);
          await AsyncStorage.removeItem('dayStartTime');
          setDayStartTime('');
        } else if (savedStartTime) {
          // Om savedStartTime är '09.00', ignorera det och använd nuvarande tid
          if (savedStartTime === '09.00') {
            const now = new Date();
            const currentTime = `${String(now.getHours()).padStart(2, '0')}.${String(now.getMinutes()).padStart(2, '0')}`;
            setDayStartTime(currentTime);
            await AsyncStorage.setItem('dayStartTime', currentTime);
          } else {
            setDayStartTime(savedStartTime);
          }
        }
        
        setTasks(parsedTasks);
      } else {
        // Första gången appen öppnas, lägg till welcome task med nuvarande tid
        const now = new Date();
        const currentTime = `${String(now.getHours()).padStart(2, '0')}.${String(now.getMinutes()).padStart(2, '0')}`;
        const firstTask: Task = { 
          id: 1, 
          text: 'Add your first task!', 
          time: currentTime, 
          duration: 30, 
          color: '#000000', 
          completed: false,
          section: 'today'
        };
        setTasks([firstTask]);
        setDayStartTime(currentTime);
        await AsyncStorage.setItem('tasks', JSON.stringify([firstTask]));
        await AsyncStorage.setItem('lastClearedDate', today);
        await AsyncStorage.setItem('dayStartTime', currentTime);
      }
    } catch (error) {
      console.error('Fel vid laddning av tasks:', error);
    }
  };

  const saveTasks = async (updatedTasks: Task[]) => {
    try {
      await AsyncStorage.setItem('tasks', JSON.stringify(updatedTasks));
    } catch (error) {
      console.error('Fel vid sparande av tasks:', error);
    }
  };

  return (
    <SafeAreaView style={styles.container} edges={['bottom', 'left', 'right']}>
      <LinearGradient
        colors={[colorTheme.lightest, colorTheme.light]}
        style={{ position: 'absolute', left: 0, right: 0, top: 0, bottom: 0 }}
      />
      
      <StatusBar style="dark" />
      
      <Header onProfilePress={() => setProfileModalVisible(true)} avatar={selectedAvatar} colorTheme={colorTheme} />

      <ScrollView 
        style={styles.content}
        contentContainerStyle={{ paddingBottom: isExpanded ? 500 : 150 }}
      >
        <TodaySection
          activeTasks={activeTasks}
          onToggle={toggleTaskHandler}
          onDelete={deleteTask}
          onEdit={handleEditTask}
          onMoveToSection={moveTaskToSectionHandler}
          onMoveUp={moveTaskUp}
          onMoveDown={moveTaskDown}
          onAddTask={() => {
            setCurrentSection('today');
            setModalVisible(true);
          }}
          timeFormat={timeFormat}
          colorTheme={colorTheme}
        />

        <ProgressSection
          completedTasks={completedTasks}
          onToggle={toggleTaskHandler}
          onDelete={deleteTask}
          onEdit={handleEditTask}
          onMoveToSection={moveTaskToSectionHandler}
          colorTheme={colorTheme}
        />
      </ScrollView>

      <BottomSheet
        isExpanded={isExpanded}
        translateY={translateY}
        slideAnim={slideAnim}
        panResponder={panResponder}
        thisWeekTasks={thisWeekTasks}
        otherTasks={otherTasks}
        onToggle={toggleTaskHandler}
        onDelete={deleteTask}
        onEdit={handleEditTask}
        onMoveToSection={moveTaskToSectionHandler}
        onMoveUp={moveTaskUp}
        onMoveDown={moveTaskDown}
        onAddThisWeekTask={() => {
          setCurrentSection('thisWeek');
          setModalVisible(true);
        }}
        onAddOtherTask={() => {
          setCurrentSection('other');
          setModalVisible(true);
        }}
        colorTheme={colorTheme}
      />

      <AddTaskModal 
        visible={modalVisible}
        onClose={() => {
          setModalVisible(false);
          setEditingTask(null);
        }}
        onAddTask={handleAddTask}
        existingTasks={tasks}
        isFirstTask={activeTasks.length === 0}
        section={currentSection}
        editingTask={editingTask}
        colorTheme={colorTheme}
      />

      <ProfileModal
        visible={profileModalVisible}
        onClose={() => setProfileModalVisible(false)}
        onTimeFormatChange={setTimeFormat}
        selectedAvatar={selectedAvatar}
        onAvatarChange={setSelectedAvatar}
        selectedColor={selectedColor}
        onColorChange={setSelectedColor}
        colorTheme={colorTheme}
      />
    </SafeAreaView>
  );
}
