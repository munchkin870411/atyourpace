import { StatusBar } from 'expo-status-bar';
import { StyleSheet, Text, View, TouchableOpacity, ScrollView, Animated, PanResponder } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import React, { useState, useRef, useEffect } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Task } from './types';
import Header from './components/Header';
import TaskItem from './components/TaskItem';
import AddTaskModal from './components/AddTaskModal';
import { appStyles as styles } from './styles/appStyles';

export default function App(): React.JSX.Element {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [modalVisible, setModalVisible] = useState(false);
  const [isExpanded, setIsExpanded] = useState(false);
  const [currentSection, setCurrentSection] = useState<'today' | 'thisWeek' | 'other'>('today');
  const [editingTask, setEditingTask] = useState<Task | null>(null);
  
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

  const toggleTask = (id: number) => {
    const now = new Date();
    const currentTime = `${String(now.getHours()).padStart(2, '0')}.${String(now.getMinutes()).padStart(2, '0')}`;
    
    const taskIndex = tasks.findIndex(t => t.id === id);
    const task = tasks[taskIndex];
    
    let updatedTasks = [...tasks];
    
    if (!task.completed) {
      // Checka av - spara tiden
      updatedTasks[taskIndex] = { ...task, completed: true, completedAt: currentTime };
      
      // Beräkna om nästa aktiva tasks
      const remainingActive = updatedTasks.filter((t, i) => !t.completed && i > taskIndex);
      
      if (remainingActive.length > 0) {
        let nextStartTime = currentTime;
        
        for (let activeTask of remainingActive) {
          const taskIdx = updatedTasks.findIndex(t => t.id === activeTask.id);
          updatedTasks[taskIdx] = { ...updatedTasks[taskIdx], time: nextStartTime };
          
          // Beräkna nästa starttid
          const [h, m] = nextStartTime.split('.').map(Number);
          const totalMin = h * 60 + m + updatedTasks[taskIdx].duration;
          nextStartTime = `${String(Math.floor(totalMin / 60)).padStart(2, '0')}.${String(totalMin % 60).padStart(2, '0')}`;
        }
      }
    } else {
      // Bocka av igen - omberäkna från denna task
      updatedTasks[taskIndex] = { ...task, completed: false, completedAt: undefined };
      
      // Hitta föregående task för att beräkna ny starttid
      let newStartTime = task.time; // Behåll ursprunglig tid som standard
      
      // Hitta alla aktiva tasks före denna
      const tasksBeforeIndex = updatedTasks.slice(0, taskIndex);
      const lastActiveTaskBefore = [...tasksBeforeIndex].reverse().find(t => !t.completed);
      
      if (lastActiveTaskBefore) {
        // Om det finns en aktiv task före, beräkna från den
        const [h, m] = lastActiveTaskBefore.time.split('.').map(Number);
        const totalMin = h * 60 + m + lastActiveTaskBefore.duration;
        newStartTime = `${String(Math.floor(totalMin / 60)).padStart(2, '0')}.${String(totalMin % 60).padStart(2, '0')}`;
      } else if (taskIndex > 0) {
        // Om alla tasks före är completed, använd senaste completedAt
        const lastCompletedTask = [...tasksBeforeIndex].reverse().find(t => t.completed && t.completedAt);
        if (lastCompletedTask && lastCompletedTask.completedAt) {
          newStartTime = lastCompletedTask.completedAt;
        }
      }
      
      updatedTasks[taskIndex] = { ...updatedTasks[taskIndex], time: newStartTime };
      
      // Omberäkna alla tasks efter denna
      const tasksAfterIndex = updatedTasks.slice(taskIndex + 1);
      let nextStartTime = newStartTime;
      const [h, m] = nextStartTime.split('.').map(Number);
      const totalMin = h * 60 + m + updatedTasks[taskIndex].duration;
      nextStartTime = `${String(Math.floor(totalMin / 60)).padStart(2, '0')}.${String(totalMin % 60).padStart(2, '0')}`;
      
      for (let i = taskIndex + 1; i < updatedTasks.length; i++) {
        if (!updatedTasks[i].completed) {
          updatedTasks[i] = { ...updatedTasks[i], time: nextStartTime };
          const [h2, m2] = nextStartTime.split('.').map(Number);
          const totalMin2 = h2 * 60 + m2 + updatedTasks[i].duration;
          nextStartTime = `${String(Math.floor(totalMin2 / 60)).padStart(2, '0')}.${String(totalMin2 % 60).padStart(2, '0')}`;
        }
      }
    }
    
    setTasks(updatedTasks);
    saveTasks(updatedTasks);
  };

  const deleteTask = (id: number) => {
    const updatedTasks = tasks.filter(task => task.id !== id);
    setTasks(updatedTasks);
    saveTasks(updatedTasks);
  };

  const handleAddTask = (newTaskData: Omit<Task, 'id' | 'completed'>) => {
    if (editingTask) {
      // Editera befintlig task
      const updatedTasks = tasks.map(t => 
        t.id === editingTask.id 
          ? { ...t, text: newTaskData.text, duration: newTaskData.duration, color: newTaskData.color, section: newTaskData.section }
          : t
      );
      setTasks(updatedTasks);
      saveTasks(updatedTasks);
      setEditingTask(null);
    } else {
      // Lägg till ny task
      let calculatedTime = newTaskData.time;
      
      // Hitta tasks i samma sektion
      const sectionTasks = tasks.filter(t => t.section === newTaskData.section && !t.completed);
      
      // Om det inte är första tasken i sektionen, beräkna tid baserat på föregående tasks
      if (sectionTasks.length > 0) {
        const lastTask = sectionTasks[sectionTasks.length - 1];
        const [hours, minutes] = lastTask.time.split('.').map(Number);
        const totalMinutes = hours * 60 + minutes + lastTask.duration;
        const newHours = Math.floor(totalMinutes / 60);
        const newMinutes = totalMinutes % 60;
        calculatedTime = `${String(newHours).padStart(2, '0')}.${String(newMinutes).padStart(2, '0')}`;
      } else if (!newTaskData.time || newTaskData.time === '09.00') {
        // Om det är första tasken och ingen tid angetts, använd nuvarande tid
        const now = new Date();
        calculatedTime = `${String(now.getHours()).padStart(2, '0')}.${String(now.getMinutes()).padStart(2, '0')}`;
      }
      
      const newTask: Task = {
        id: tasks.length + 1,
        ...newTaskData,
        time: calculatedTime,
        completed: false,
      };
      const updatedTasks = [...tasks, newTask];
      setTasks(updatedTasks);
      saveTasks(updatedTasks);
    }
    setModalVisible(false);
  };

  const handleEditTask = (task: Task) => {
    setEditingTask(task);
    setCurrentSection(task.section);
    setModalVisible(true);
  };

  const moveToToday = (taskId: number) => {
    const taskIndex = tasks.findIndex(t => t.id === taskId);
    if (taskIndex === -1) return;

    const task = tasks[taskIndex];
    let calculatedTime = '09.00';

    // Beräkna tid baserat på sista tasken i today
    if (activeTasks.length > 0) {
      const lastTask = activeTasks[activeTasks.length - 1];
      const [hours, minutes] = lastTask.time.split('.').map(Number);
      const totalMinutes = hours * 60 + minutes + lastTask.duration;
      const newHours = Math.floor(totalMinutes / 60);
      const newMinutes = totalMinutes % 60;
      calculatedTime = `${String(newHours).padStart(2, '0')}.${String(newMinutes).padStart(2, '0')}`;
    } else {
      // Om det är första tasken, använd nuvarande tid
      const now = new Date();
      calculatedTime = `${String(now.getHours()).padStart(2, '0')}.${String(now.getMinutes()).padStart(2, '0')}`;
    }

    const updatedTasks = tasks.map(t => 
      t.id === taskId 
        ? { ...t, section: 'today' as const, time: calculatedTime }
        : t
    );

    setTasks(updatedTasks);
    saveTasks(updatedTasks);
  };

  const moveTaskToSection = (taskId: number, newSection: 'today' | 'thisWeek' | 'other') => {
    const taskIndex = tasks.findIndex(t => t.id === taskId);
    if (taskIndex === -1) return;

    const task = tasks[taskIndex];
    let calculatedTime = task.time;

    // Om vi flyttar till "today", beräkna ny tid
    if (newSection === 'today') {
      const todayTasks = tasks.filter(t => t.section === 'today' && !t.completed);
      if (todayTasks.length > 0) {
        const lastTask = todayTasks[todayTasks.length - 1];
        const [hours, minutes] = lastTask.time.split('.').map(Number);
        const totalMinutes = hours * 60 + minutes + lastTask.duration;
        const newHours = Math.floor(totalMinutes / 60);
        const newMinutes = totalMinutes % 60;
        calculatedTime = `${String(newHours).padStart(2, '0')}.${String(newMinutes).padStart(2, '0')}`;
      } else {
        const now = new Date();
        calculatedTime = `${String(now.getHours()).padStart(2, '0')}.${String(now.getMinutes()).padStart(2, '0')}`;
      }
    }

    const updatedTasks = tasks.map(t => 
      t.id === taskId 
        ? { ...t, section: newSection, time: calculatedTime }
        : t
    );

    setTasks(updatedTasks);
    saveTasks(updatedTasks);
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
      if (savedTasks !== null) {
        setTasks(JSON.parse(savedTasks));
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
        await AsyncStorage.setItem('tasks', JSON.stringify([firstTask]));
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
    <SafeAreaView style={styles.container}>
      <StatusBar style="dark" />
      
      <Header />

      <ScrollView style={styles.content}>
        {/* Today Section */}
        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <Text style={styles.sectionTitle}>Today</Text>
            <TouchableOpacity 
              style={styles.addButton}
              onPress={() => {
                setCurrentSection('today');
                setModalVisible(true);
              }}
            >
              <Text style={styles.addButtonText}>Add Task</Text>
            </TouchableOpacity>
          </View>

          {/* Task List */}
          <View style={styles.taskContainer}>
            {activeTasks.map(task => (
              <TaskItem 
                key={task.id} 
                task={task} 
                onToggle={toggleTask} 
                onDelete={deleteTask} 
                onEdit={handleEditTask} 
                onMoveToSection={moveTaskToSection}
                showTime={true} 
              />
            ))}

            {/* Done At Section */}
            <View style={styles.doneAtContainer}>
              <Text style={styles.doneAtLabel}>You will be done at:</Text>
              <Text style={styles.doneAtTime}>
                {activeTasks.length > 0 ? (() => {
                  const lastTask = activeTasks[activeTasks.length - 1];
                  const [hours, minutes] = lastTask.time.split('.').map(Number);
                  const totalMinutes = hours * 60 + minutes + lastTask.duration;
                  const doneHours = Math.floor(totalMinutes / 60);
                  const doneMinutes = totalMinutes % 60;
                  return `${String(doneHours).padStart(2, '0')}.${String(doneMinutes).padStart(2, '0')}`;
                })() : '00.00'}
              </Text>
            </View>
          </View>
        </View>

        {/* Check your progress Section */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Check your progress!</Text>
          
          <View style={styles.progressContainer}>
            {completedTasks.length === 0 ? (
              <Text style={styles.emptyText}>No completed tasks yet</Text>
            ) : (
              <>
                {completedTasks.map(task => (
                  <TaskItem 
                    key={task.id} 
                    task={task} 
                    onToggle={toggleTask} 
                    onDelete={deleteTask} 
                    onEdit={handleEditTask} 
                    onMoveToSection={moveTaskToSection}
                    showTime={true} 
                  />
                ))}
                <View style={styles.totalTimeContainer}>
                  <Text style={styles.totalTimeLabel}>Total time:</Text>
                  <Text style={styles.totalTimeValue}>2 h 45 minutes</Text>
                </View>
              </>
            )}
          </View>
        </View>
      </ScrollView>

      {/* Bottom Sheet Toggle */}
      {!isExpanded && (
        <View 
          style={styles.bottomSheetToggle}
          {...panResponder.panHandlers}
        >
          <View style={styles.dragHandle} />
        </View>
      )}

      {/* Bottom Sheet Content */}
      {isExpanded && (
        <Animated.View 
          style={[
            styles.bottomSheet,
            { transform: [{ translateY: Animated.add(translateY, slideAnim) }] }
          ]}
        >
          <View {...panResponder.panHandlers} style={styles.bottomSheetHandle}>
            <View style={styles.dragHandle} />
          </View>
          <ScrollView showsVerticalScrollIndicator={false}>
            {/* This week Section */}
            <View style={styles.bottomSection}>
              <View style={styles.sectionHeader}>
                <Text style={styles.sectionTitle}>This week</Text>
                <TouchableOpacity 
                  style={styles.addButton}
                  onPress={() => {
                    setCurrentSection('thisWeek');
                    setModalVisible(true);
                  }}
                >
                  <Text style={styles.addButtonText}>Add task</Text>
                </TouchableOpacity>
              </View>
              
              <View style={styles.taskContainer}>
                {thisWeekTasks.length === 0 ? (
                  <Text style={styles.emptyText}>No tasks scheduled for this week</Text>
                ) : (
                  thisWeekTasks.map(task => (
                    <TaskItem 
                      key={task.id} 
                      task={task} 
                      onToggle={toggleTask} 
                      onDelete={deleteTask} 
                      onEdit={handleEditTask} 
                      onMoveToSection={moveTaskToSection}
                      showTime={false} 
                    />
                  ))
                )}
              </View>
            </View>

            {/* Other tasks Section */}
            <View style={styles.bottomSection}>
              <View style={styles.sectionHeader}>
                <Text style={styles.sectionTitle}>Other tasks</Text>
                <TouchableOpacity 
                  style={styles.addButton}
                  onPress={() => {
                    setCurrentSection('other');
                    setModalVisible(true);
                  }}
                >
                  <Text style={styles.addButtonText}>Add task</Text>
                </TouchableOpacity>
              </View>
              
              <View style={styles.taskContainer}>
                {otherTasks.length === 0 ? (
                  <Text style={styles.emptyText}>No other tasks yet</Text>
                ) : (
                  otherTasks.map(task => (
                    <TaskItem 
                      key={task.id} 
                      task={task} 
                      onToggle={toggleTask} 
                      onDelete={deleteTask} 
                      onEdit={handleEditTask} 
                      onMoveToSection={moveTaskToSection}
                      showTime={false} 
                    />
                  ))
                )}
              </View>
            </View>
          </ScrollView>
        </Animated.View>
      )}

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
      />
    </SafeAreaView>
  );
}
