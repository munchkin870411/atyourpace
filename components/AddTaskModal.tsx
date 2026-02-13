import React, { useState } from 'react';
import {
  Modal,
  View,
  Text,
  TextInput,
  TouchableOpacity,
  ScrollView,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { Task } from '../types';
import { modalStyles as styles } from '../styles/modalStyles';
import { ColorTheme, addAlpha } from '../utils/colorUtils';

interface AddTaskModalProps {
  visible: boolean;
  onClose: () => void;
  onAddTask: (task: Omit<Task, 'id' | 'completed'>) => void;
  onDelete: (id: number) => void;
  existingTasks: Task[];
  isFirstTask: boolean;
  section: 'today' | 'thisWeek' | 'other';
  editingTask?: Task | null;
  colorTheme: ColorTheme;
}

export default function AddTaskModal({
  visible,
  onClose,
  onAddTask,
  onDelete,
  existingTasks,
  isFirstTask,
  section,
  editingTask,
  colorTheme,
}: AddTaskModalProps) {
  const [dropdownVisible, setDropdownVisible] = useState(false);
  const [infoVisible, setInfoVisible] = useState(false);
  const [taskText, setTaskText] = useState(editingTask?.text || '');
  const [duration, setDuration] = useState(editingTask?.duration.toString() || '');
  const [color, setColor] = useState(editingTask?.color || '#000000');
  const [startTime, setStartTime] = useState('');

  // Update form when editingTask changes
  React.useEffect(() => {
    if (editingTask) {
      setTaskText(editingTask.text);
      setDuration(editingTask.duration.toString());
      setColor(editingTask.color);
      setStartTime(editingTask.time || '');
    } else {
      setTaskText('');
      setDuration('');
      setColor('#000000');
      setStartTime('');
    }
  }, [editingTask]);

  const colors = [
    '#FFD700',
    '#FF8C00',
    '#DC143C',
    '#FF1493',
    '#8B00FF',
    '#4169E1',
    '#00CED1',
    '#32CD32',
    '#808080',
    '#000000',
  ];

  const uniqueTaskTemplates = Array.from(new Set(existingTasks.filter(t => t.isSavedTemplate).map((t) => t.text)))
    .map((text) => existingTasks.find((t) => t.text === text && t.isSavedTemplate)!)
    .filter((t) => t !== undefined && t.text !== 'Add your first task!');

  const selectExistingTask = (task: Task) => {
    setTaskText(task.text);
    setDuration(task.duration.toString());
    setColor(task.color);
    setDropdownVisible(false);
  };

  const handleAddTask = () => {
    if (taskText.trim() && duration.trim()) {
      onAddTask({
        text: taskText,
        time: startTime,
        duration: parseInt(duration),
        color: color,
        section: section,
      });
      // Reset form
      setTaskText('');
      setDuration('');
      setColor('#000000');
      setStartTime('');
      setDropdownVisible(false);
      setInfoVisible(false);
    }
  };

  const handleSaveTask = () => {
    if (taskText.trim() && duration.trim()) {
      onAddTask({
        text: taskText,
        time: startTime,
        duration: parseInt(duration),
        color: color,
        section: section,
        saveAsTemplate: true, // Detta skapar både vanlig task och template
      });
      // Reset form
      setTaskText('');
      setDuration('');
      setColor('#000000');
      setStartTime('');
      setDropdownVisible(false);
      setInfoVisible(false);
    }
  };

  const handleCancel = () => {
    setTaskText('');
    setDuration('');
    setColor('#000000');
    setStartTime('');
    setDropdownVisible(false);
    setInfoVisible(false);
    onClose();
  };

  return (
    <Modal
      visible={visible}
      animationType="slide"
      transparent={true}
      onRequestClose={onClose}
    >
      <View style={[styles.modalOverlay, { backgroundColor: addAlpha(colorTheme.primary, 0.8) }]}>
        <View style={[styles.modalContent, styles.modalContentTransparent, { borderColor: colorTheme.dark }]}>
          <LinearGradient
            colors={[colorTheme.light, colorTheme.lightest]}
            style={styles.gradientOverlay}
            pointerEvents="none"
          />
          <View style={[styles.modalHeader, { backgroundColor: colorTheme.darker }]}>
            <Text style={styles.modalHeaderTitle}>
              {editingTask ? 'Edit task' : 'Add a task'}
            </Text>
            <TouchableOpacity onPress={onClose}>
              <Text style={styles.modalCloseButton}>×</Text>
            </TouchableOpacity>
          </View>
          
          <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.scrollViewContent}>
            <Text style={[styles.inputLabel, { color: colorTheme.textColor }]}>What do you need to do? *</Text>
            <TextInput
              style={[styles.input, { backgroundColor: colorTheme.lightest, color: colorTheme.textColor }]}
              placeholder="Write task here..."
              placeholderTextColor={colorTheme.textColor === '#FFFFFF' ? '#888888' : '#666666'}
              value={taskText}
              onChangeText={setTaskText}
            />

            <TouchableOpacity
              style={[styles.input, styles.dropdownPlaceholder, styles.dropdownButton, { backgroundColor: colorTheme.lightest }]}
              onPress={() => setDropdownVisible(!dropdownVisible)}
            >
              <Text style={[styles.dropdownText, { color: colorTheme.textColor }]}>Choose existing...</Text>
              <Text style={[styles.dropdownArrow, { color: colorTheme.textColor }]}>▼</Text>
            </TouchableOpacity>

            {dropdownVisible && (
              <View style={[styles.dropdownList, styles.dropdownListExpanded]}>
                <ScrollView nestedScrollEnabled={true} showsVerticalScrollIndicator={true}>
                  {uniqueTaskTemplates.map((task) => (
                    <View key={task.id} style={styles.dropdownItem}>
                      <TouchableOpacity
                        style={styles.dropdownItemTouchable}
                        onPress={() => selectExistingTask(task)}
                      >
                        <View
                          style={[styles.taskColorDot, { backgroundColor: task.color }]}
                        />
                        <Text style={[styles.dropdownItemText, { color: colorTheme.textColor }]}>{task.text}</Text>
                        <Text style={[styles.dropdownItemDuration, { color: colorTheme.textColor }]}>
                          {task.duration} min
                        </Text>
                      </TouchableOpacity>
                      <TouchableOpacity
                        onPress={() => onDelete(task.id)}
                        style={styles.deleteButton}
                      >
                        <Text style={styles.deleteButtonText}>×</Text>
                      </TouchableOpacity>
                    </View>
                  ))}
                  {uniqueTaskTemplates.length === 0 && (
                    <Text style={[styles.dropdownEmpty, { color: colorTheme.textColor }]}>No saved tasks yet</Text>
                  )}
                </ScrollView>
              </View>
            )}

            <Text style={[styles.inputLabel, { color: colorTheme.textColor }]}>How long will it take?</Text>
            <TextInput
              style={[styles.input, styles.inputSmall, { backgroundColor: colorTheme.lightest, color: colorTheme.textColor }]}
              placeholder="Minutes..."
              placeholderTextColor={colorTheme.textColor === '#FFFFFF' ? '#888888' : '#666666'}
              keyboardType="numeric"
              value={duration}
              onChangeText={setDuration}
            />

            <Text style={[styles.inputLabel, { color: colorTheme.textColor }]}>Pick a color for your task?</Text>
            <View style={styles.colorGrid}>
              {colors.map((c, index) => (
                <TouchableOpacity
                  key={index}
                  style={[
                    styles.colorCircle,
                    { backgroundColor: c },
                    c === color && styles.colorCircleSelected,
                    c === color && { borderColor: colorTheme.darker },
                  ]}
                  onPress={() => setColor(c)}
                />
              ))}
            </View>

            {(isFirstTask || (editingTask && editingTask.section === 'today')) && (
              <>
                <Text style={[styles.inputLabel, { color: colorTheme.textColor }]}>Pick a starting time?</Text>
                <View style={styles.startTimeContainer}>
                  <TextInput
                    style={[styles.input, styles.inputSmall, { backgroundColor: colorTheme.lightest, color: colorTheme.textColor }]}
                    placeholder="09.00"
                    placeholderTextColor={colorTheme.textColor === '#FFFFFF' ? '#888888' : '#666666'}
                    value={startTime}
                    onChangeText={setStartTime}
                  />
                  <TouchableOpacity onPress={() => setInfoVisible(!infoVisible)}>
                    <Text style={styles.infoIcon}>ℹ️</Text>
                  </TouchableOpacity>
                </View>

                {infoVisible && (
                  <View style={styles.infoBox}>
                    <Text style={[styles.infoText, { color: colorTheme.textColor }]}>
                      Syns endast på första uppgiften för dagen, för att ha en start tid
                      på schemat.
                    </Text>
                    <Text style={[styles.infoText, { color: colorTheme.textColor }]}>
                      Do you want to start right away or do you want to wait? It is
                      completely up to you!
                    </Text>
                  </View>
                )}
              </>
            )}

            <View style={styles.modalButtons}>
              <TouchableOpacity 
                style={[
                  styles.cancelButton,
                  styles.buttonWithShadow,
                  { 
                    backgroundColor: colorTheme.dark, 
                    borderColor: colorTheme.darker,
                  }
                ]} 
                onPress={handleSaveTask}
              >
                <Text style={[styles.cancelButtonText, { color: '#000000' }]}>Save Task</Text>
              </TouchableOpacity>

              <TouchableOpacity 
                style={[
                  styles.addTaskButton,
                  styles.buttonWithShadow,
                  { 
                    backgroundColor: colorTheme.darkest, 
                    borderColor: colorTheme.darker,
                  }
                ]} 
                onPress={handleAddTask}
              >
                <Text style={[styles.addTaskButtonText, { color: '#000000' }]}>Add task</Text>
              </TouchableOpacity>
            </View>
          </ScrollView>
        </View>
      </View>
    </Modal>
  );
}
