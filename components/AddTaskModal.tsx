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
    } else {
      setTaskText('');
      setDuration('');
      setColor('#000000');
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
    '#FFFFFF',
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
        isSavedTemplate: true,
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
        <View style={[styles.modalContent, { backgroundColor: 'transparent', borderColor: colorTheme.dark, padding: 0, overflow: 'hidden' }]}>
          <LinearGradient
            colors={[colorTheme.light, colorTheme.lightest]}
            style={{ position: 'absolute', left: 0, right: 0, top: 0, bottom: 0 }}
            pointerEvents="none"
          />
          <View style={{ 
            backgroundColor: colorTheme.darker, 
            flexDirection: 'row', 
            justifyContent: 'space-between', 
            alignItems: 'center', 
            paddingHorizontal: 20, 
            paddingVertical: 15 
          }}>
            <Text style={{ fontSize: 22, fontWeight: '600', color: '#000000' }}>
              {editingTask ? 'Edit task' : 'Add a task'}
            </Text>
            <TouchableOpacity onPress={onClose}>
              <Text style={{ fontSize: 28, color: '#000000', fontWeight: 'bold' }}>×</Text>
            </TouchableOpacity>
          </View>
          
          <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={{ padding: 25 }}>
            <Text style={styles.inputLabel}>What do you need to do? *</Text>
            <TextInput
              style={[styles.input, { backgroundColor: colorTheme.lightest }]}
              placeholder="Write task here..."
              value={taskText}
              onChangeText={setTaskText}
            />

            <TouchableOpacity
              style={[styles.input, styles.dropdownPlaceholder, styles.dropdownButton, { backgroundColor: colorTheme.lightest }]}
              onPress={() => setDropdownVisible(!dropdownVisible)}
            >
              <Text style={styles.dropdownText}>Choose existing...</Text>
              <Text style={styles.dropdownArrow}>▼</Text>
            </TouchableOpacity>

            {dropdownVisible && (
              <View style={styles.dropdownList}>
                {uniqueTaskTemplates.map((task) => (
                  <TouchableOpacity
                    key={task.id}
                    style={styles.dropdownItem}
                    onPress={() => selectExistingTask(task)}
                  >
                    <View
                      style={[styles.taskColorDot, { backgroundColor: task.color }]}
                    />
                    <Text style={styles.dropdownItemText}>{task.text}</Text>
                    <Text style={styles.dropdownItemDuration}>
                      {task.duration} min
                    </Text>
                  </TouchableOpacity>
                ))}
                {uniqueTaskTemplates.length === 0 && (
                  <Text style={styles.dropdownEmpty}>No saved tasks yet</Text>
                )}
              </View>
            )}

            <Text style={styles.inputLabel}>How long will it take?</Text>
            <TextInput
              style={[styles.input, styles.inputSmall, { backgroundColor: colorTheme.lightest }]}
              placeholder="Minutes..."
              keyboardType="numeric"
              value={duration}
              onChangeText={setDuration}
            />

            <Text style={styles.inputLabel}>Pick a color for your task?</Text>
            <View style={styles.colorPickerContainer}>
              <TextInput
                style={[styles.input, styles.colorInput, { backgroundColor: colorTheme.lightest }]}
                value={color}
                onChangeText={setColor}
              />
              <View style={[styles.colorPreview, { backgroundColor: color }]} />
            </View>
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

            <Text style={styles.inputLabel}>Do you want to save your task?</Text>
            <TouchableOpacity 
              style={[
                styles.saveButtonSingle, 
                { 
                  backgroundColor: colorTheme.dark, 
                  borderColor: colorTheme.darker,
                  borderRadius: 12,
                  shadowColor: '#000',
                  shadowOffset: { width: 0, height: 3 },
                  shadowOpacity: 0.3,
                  shadowRadius: 4,
                  elevation: 5
                }
              ]} 
              onPress={handleSaveTask}
            >
              <Text style={[styles.saveButtonText, { color: '#000000' }]}>Save Task</Text>
            </TouchableOpacity>

            {isFirstTask && (
              <>
                <Text style={styles.inputLabel}>Pick a starting time?</Text>
                <View style={styles.startTimeContainer}>
                  <TextInput
                    style={[styles.input, styles.inputSmall, { backgroundColor: colorTheme.lightest }]}
                    placeholder="09.00"
                    value={startTime}
                    onChangeText={setStartTime}
                  />
                  <TouchableOpacity onPress={() => setInfoVisible(!infoVisible)}>
                    <Text style={styles.infoIcon}>ℹ️</Text>
                  </TouchableOpacity>
                </View>

                {infoVisible && (
                  <View style={styles.infoBox}>
                    <Text style={styles.infoText}>
                      Syns endast på första uppgiften för dagen, för att ha en start tid
                      på schemat.
                    </Text>
                    <Text style={styles.infoText}>
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
                  { 
                    backgroundColor: colorTheme.dark, 
                    borderColor: colorTheme.darker,
                    borderRadius: 12,
                    shadowColor: '#000',
                    shadowOffset: { width: 0, height: 3 },
                    shadowOpacity: 0.3,
                    shadowRadius: 4,
                    elevation: 5
                  }
                ]} 
                onPress={handleCancel}
              >
                <Text style={[styles.cancelButtonText, { color: '#000000' }]}>Cancel</Text>
              </TouchableOpacity>

              <TouchableOpacity 
                style={[
                  styles.addTaskButton, 
                  { 
                    backgroundColor: colorTheme.darkest, 
                    borderColor: colorTheme.darker,
                    borderRadius: 12,
                    shadowColor: '#000',
                    shadowOffset: { width: 0, height: 3 },
                    shadowOpacity: 0.3,
                    shadowRadius: 4,
                    elevation: 5
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
