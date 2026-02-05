import React from 'react';
import { View, Text, TouchableOpacity, ScrollView, Animated, PanResponder } from 'react-native';
import { Task } from '../types';
import TaskItem from './TaskItem';
import { appStyles as styles } from '../styles/appStyles';
import { ColorTheme } from '../utils/colorUtils';

interface BottomSheetProps {
  isExpanded: boolean;
  translateY: Animated.Value;
  slideAnim: Animated.Value;
  panResponder: ReturnType<typeof PanResponder.create>;
  thisWeekTasks: Task[];
  otherTasks: Task[];
  onToggle: (id: number) => void;
  onDelete: (id: number) => void;
  onEdit: (task: Task) => void;
  onMoveToSection: (id: number, section: 'today' | 'thisWeek' | 'other') => void;
  onMoveUp: (id: number) => void;
  onMoveDown: (id: number) => void;
  onAddThisWeekTask: () => void;
  onAddOtherTask: () => void;
  colorTheme: ColorTheme;
}

export default function BottomSheet({ 
  isExpanded,
  translateY,
  slideAnim,
  panResponder,
  thisWeekTasks,
  otherTasks,
  onToggle,
  onDelete,
  onEdit,
  onMoveToSection,
  onMoveUp,
  onMoveDown,
  onAddThisWeekTask,
  onAddOtherTask,
  colorTheme
}: BottomSheetProps) {
  if (!isExpanded) {
    return (
      <View 
        style={[styles.bottomSheetToggle, { backgroundColor: colorTheme.primary, borderTopColor: colorTheme.dark }]}
        {...panResponder.panHandlers}
      >
        <View style={[styles.dragHandle, { backgroundColor: colorTheme.dark }]} />
      </View>
    );
  }

  return (
    <Animated.View 
      style={[
        styles.bottomSheet,
        { backgroundColor: colorTheme.primary, borderTopColor: colorTheme.dark },
        { transform: [{ translateY: Animated.add(translateY, slideAnim) }] }
      ]}
    >
      <View {...panResponder.panHandlers} style={styles.bottomSheetHandle}>
        <View style={[styles.dragHandle, { backgroundColor: colorTheme.dark }]} />
      </View>
      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={{ paddingBottom: 20 }}>
        {/* This week Section */}
        <View style={styles.bottomSection}>
          <View style={styles.sectionHeader}>
            <Text style={styles.sectionTitle}>This week</Text>
            <TouchableOpacity 
              style={[styles.addButton, { backgroundColor: colorTheme.darker, borderColor: colorTheme.darkest }]}
              onPress={onAddThisWeekTask}
            >
              <Text style={styles.addButtonText}>Add task</Text>
            </TouchableOpacity>
          </View>
          
          <View style={[styles.taskContainer, { backgroundColor: colorTheme.lightest, borderColor: colorTheme.dark }]}>
            {thisWeekTasks.length === 0 ? (
              <Text style={styles.emptyText}>No tasks scheduled for this week</Text>
            ) : (
              thisWeekTasks.map((task, index) => (
                <TaskItem 
                  key={task.id} 
                  task={task} 
                  onToggle={onToggle} 
                  onDelete={onDelete} 
                  onEdit={onEdit} 
                  onMoveToSection={onMoveToSection}
                  onMoveUp={onMoveUp}
                  onMoveDown={onMoveDown}
                  isFirst={index === 0}
                  isLast={index === thisWeekTasks.length - 1}
                  showTime={false} 
                  colorTheme={colorTheme}
                />
              ))
            )}
          </View>
        </View>

        {/* Other tasks Section */}
        <View style={[styles.bottomSection, { marginBottom: 0 }]}>
          <View style={styles.sectionHeader}>
            <Text style={styles.sectionTitle}>Other tasks</Text>
            <TouchableOpacity 
              style={[styles.addButton, { backgroundColor: colorTheme.darker, borderColor: colorTheme.darkest }]}
              onPress={onAddOtherTask}
            >
              <Text style={styles.addButtonText}>Add task</Text>
            </TouchableOpacity>
          </View>
          
          <View style={[styles.taskContainer, { backgroundColor: colorTheme.lightest, borderColor: colorTheme.dark }]}>
            {otherTasks.length === 0 ? (
              <Text style={styles.emptyText}>No other tasks yet</Text>
            ) : (
              otherTasks.map((task, index) => (
                <TaskItem 
                  key={task.id} 
                  task={task} 
                  onToggle={onToggle} 
                  onDelete={onDelete} 
                  onEdit={onEdit} 
                  onMoveToSection={onMoveToSection}
                  onMoveUp={onMoveUp}
                  onMoveDown={onMoveDown}
                  isFirst={index === 0}
                  isLast={index === otherTasks.length - 1}
                  showTime={false} 
                  colorTheme={colorTheme}
                />
              ))
            )}
          </View>
        </View>
      </ScrollView>
    </Animated.View>
  );
}
