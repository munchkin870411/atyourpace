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
  const [tasks, setTasks] = useState<Task[]>([
    { id: 1, text: 'Add your first task!', time: '09.00', duration: 30, color: '#2b78e4', completed: false },
  ]);
  const [modalVisible, setModalVisible] = useState(false);
  const [isExpanded, setIsExpanded] = useState(false);
  
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
    const updatedTasks = tasks.map(task => 
      task.id === id ? { ...task, completed: !task.completed } : task
    );
    setTasks(updatedTasks);
    saveTasks(updatedTasks);
  };

  const deleteTask = (id: number) => {
    const updatedTasks = tasks.filter(task => task.id !== id);
    setTasks(updatedTasks);
    saveTasks(updatedTasks);
  };

  const handleAddTask = (newTaskData: Omit<Task, 'id' | 'completed'>) => {
    const newTask: Task = {
      id: tasks.length + 1,
      ...newTaskData,
      completed: false,
    };
    const updatedTasks = [...tasks, newTask];
    setTasks(updatedTasks);
    saveTasks(updatedTasks);
    setModalVisible(false);
  };

  const activeTasks = tasks.filter(task => !task.completed);
  const completedTasks = tasks.filter(task => task.completed);

  // Ladda tasks från AsyncStorage när appen startar
  useEffect(() => {
    loadTasks();
  }, []);

  const loadTasks = async () => {
    try {
      const savedTasks = await AsyncStorage.getItem('tasks');
      if (savedTasks !== null) {
        setTasks(JSON.parse(savedTasks));
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
              onPress={() => setModalVisible(true)}
            >
              <Text style={styles.addButtonText}>Add Task</Text>
            </TouchableOpacity>
          </View>

          {/* Task List */}
          <View style={styles.taskContainer}>
            {activeTasks.map(task => (
              <TaskItem key={task.id} task={task} onToggle={toggleTask} onDelete={deleteTask} />
            ))}

            {/* Done At Section */}
            <View style={styles.doneAtContainer}>
              <Text style={styles.doneAtLabel}>You will be done at:</Text>
              <Text style={styles.doneAtTime}>09.01</Text>
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
                  <TaskItem key={task.id} task={task} onToggle={toggleTask} onDelete={deleteTask} />
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
                  onPress={() => setModalVisible(true)}
                >
                  <Text style={styles.addButtonText}>Add task</Text>
                </TouchableOpacity>
              </View>
              
              <View style={styles.taskContainer}>
                <Text style={styles.emptyText}>No tasks scheduled for this week</Text>
              </View>
            </View>

            {/* Other tasks Section */}
            <View style={styles.bottomSection}>
              <View style={styles.sectionHeader}>
                <Text style={styles.sectionTitle}>Other tasks</Text>
                <TouchableOpacity 
                  style={styles.addButton}
                  onPress={() => setModalVisible(true)}
                >
                  <Text style={styles.addButtonText}>Add task</Text>
                </TouchableOpacity>
              </View>
              
              <View style={styles.taskContainer}>
                <Text style={styles.emptyText}>No other tasks yet</Text>
              </View>
            </View>
          </ScrollView>
        </Animated.View>
      )}

      <AddTaskModal 
        visible={modalVisible}
        onClose={() => setModalVisible(false)}
        onAddTask={handleAddTask}
        existingTasks={tasks}
      />
    </SafeAreaView>
  );
}
