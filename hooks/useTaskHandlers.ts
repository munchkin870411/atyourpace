import { useState, useMemo } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Task } from '../types';
import * as taskHelpers from '../utils/taskHelpers';

interface UseTaskHandlersProps {
  tasks: Task[];
  setTasks: (tasks: Task[]) => void;
  dayStartTime: string;
  setDayStartTime: (time: string) => void;
  saveTasks: (tasks: Task[]) => Promise<void>;
  setModalVisible: (visible: boolean) => void;
}

export const useTaskHandlers = ({
  tasks,
  setTasks,
  dayStartTime,
  setDayStartTime,
  saveTasks,
  setModalVisible
}: UseTaskHandlersProps) => {
  const [editingTask, setEditingTask] = useState<Task | null>(null);
  const [currentSection, setCurrentSection] = useState<'today' | 'thisWeek' | 'other'>('today');

  const activeTasks = useMemo(
    () => tasks.filter(task => !task.completed && task.section === 'today' && !task.isSavedTemplate),
    [tasks]
  );
  
  const completedTasks = useMemo(
    () => tasks.filter(task => task.completed),
    [tasks]
  );
  
  const thisWeekTasks = useMemo(
    () => tasks.filter(task => !task.completed && task.section === 'thisWeek' && !task.isSavedTemplate),
    [tasks]
  );
  
  const otherTasks = useMemo(
    () => tasks.filter(task => !task.completed && task.section === 'other' && !task.isSavedTemplate),
    [tasks]
  );

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

  return {
    activeTasks,
    completedTasks,
    thisWeekTasks,
    otherTasks,
    editingTask,
    setEditingTask,
    currentSection,
    setCurrentSection,
    toggleTaskHandler,
    deleteTask,
    handleAddTask,
    handleEditTask,
    moveTaskToSectionHandler,
    moveTaskUp,
    moveTaskDown
  };
};
