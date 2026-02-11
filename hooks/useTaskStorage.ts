import { useState, useEffect } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Task } from '../types';

export const useTaskStorage = () => {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [dayStartTime, setDayStartTime] = useState<string>('');
  const [timeFormat, setTimeFormat] = useState<'schedule' | 'minutes' | 'notime'>('schedule');
  const [selectedAvatar, setSelectedAvatar] = useState<string>('👤');
  const [selectedColor, setSelectedColor] = useState<string>('#99E699');

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
          parsedTasks = parsedTasks.filter((task: Task) => task.section !== 'today' || task.isSavedTemplate);
          await AsyncStorage.setItem('tasks', JSON.stringify(parsedTasks));
          await AsyncStorage.removeItem('dayStartTime');
          setDayStartTime('');
          setTasks(parsedTasks);
          return;
        }
        
        // Om det är en ny dag, ta bort alla tasks från "today" sektionen (men behåll templates)
        if (shouldClearToday) {
          parsedTasks = parsedTasks.filter((task: Task) => task.section !== 'today' || task.isSavedTemplate);
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
          duration: 1, 
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

  return {
    tasks,
    setTasks,
    dayStartTime,
    setDayStartTime,
    timeFormat,
    setTimeFormat,
    selectedAvatar,
    setSelectedAvatar,
    selectedColor,
    setSelectedColor,
    saveTasks
  };
};
