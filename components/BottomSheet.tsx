import React from 'react';
import { View, Text, TouchableOpacity, ScrollView, Animated, PanResponder } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { Task } from '../types';
import TaskItem from './TaskItem';
import { bottomSheetStyles as styles } from '../styles/bottomSheetStyles';
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
  timeFormat: 'schedule' | 'minutes' | 'notime';
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
  colorTheme,
  timeFormat
}: BottomSheetProps) {
  if (!isExpanded) {
    return (
      <View 
        style={[styles.bottomSheetToggle, { borderTopColor: colorTheme.dark, overflow: 'hidden' }]}
        {...panResponder.panHandlers}
      >
        <LinearGradient
          colors={[colorTheme.dark, colorTheme.lighter]}
          style={{ position: 'absolute', left: 0, right: 0, top: 0, bottom: 0 }}
          pointerEvents="none"
        />
        <View style={[styles.dragHandle, { backgroundColor: colorTheme.darkest }]} />
      </View>
    );
  }

  return (
    <Animated.View 
      style={[
        styles.bottomSheet,
        { borderTopColor: colorTheme.dark, overflow: 'hidden' },
        { transform: [{ translateY: Animated.add(translateY, slideAnim) }] }
      ]}
    >
      <LinearGradient
        colors={[colorTheme.dark, colorTheme.lighter]}
        style={{ position: 'absolute', left: 0, right: 0, top: 0, bottom: 0 }}
        pointerEvents="none"
      />
      <View {...panResponder.panHandlers} style={styles.bottomSheetHandle}>
        <View style={[styles.dragHandle, { backgroundColor: colorTheme.darkest }]} />
      </View>
      <ScrollView 
        showsVerticalScrollIndicator={false} 
        contentContainerStyle={{ paddingBottom: 20 }}
        style={{ backgroundColor: 'transparent' }}
      >
        {/* This week Section */}
        <View style={styles.bottomSection}>
          <View style={styles.sectionHeader}>
            <Text style={[styles.sectionTitle, { color: '#000000' }]}>This week</Text>
            <TouchableOpacity 
              style={[
                styles.addButton, 
                { 
                  backgroundColor: colorTheme.darkest, 
                  borderColor: colorTheme.darkest,
                  borderRadius: 12,
                  shadowColor: '#000',
                  shadowOffset: { width: 0, height: 3 },
                  shadowOpacity: 0.3,
                  shadowRadius: 4,
                  elevation: 5
                }
              ]}
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
                  showDuration={timeFormat !== 'notime'}
                  colorTheme={colorTheme}
                />
              ))
            )}
          </View>
        </View>

        {/* Other tasks Section */}
        <View style={[styles.bottomSection, { marginBottom: 0 }]}>
          <View style={styles.sectionHeader}>
            <Text style={[styles.sectionTitle, { color: '#000000' }]}>Other tasks</Text>
            <TouchableOpacity 
              style={[
                styles.addButton, 
                { 
                  backgroundColor: colorTheme.darkest, 
                  borderColor: colorTheme.darkest,
                  borderRadius: 12,
                  shadowColor: '#000',
                  shadowOffset: { width: 0, height: 3 },
                  shadowOpacity: 0.3,
                  shadowRadius: 4,
                  elevation: 5
                }
              ]}
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
                  showDuration={timeFormat !== 'notime'}
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
