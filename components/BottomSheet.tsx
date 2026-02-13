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
        style={[styles.bottomSheetToggle, styles.bottomSheetWithOverflow, { borderTopColor: colorTheme.dark }]}
        {...panResponder.panHandlers}
      >
        <LinearGradient
          colors={[colorTheme.dark, colorTheme.lighter]}
          style={styles.gradientOverlay}
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
        styles.bottomSheetWithOverflow,
        { borderTopColor: colorTheme.dark },
        { transform: [{ translateY: Animated.add(translateY, slideAnim) }] }
      ]}
    >
      <LinearGradient
        colors={[colorTheme.dark, colorTheme.lighter]}
        style={styles.gradientOverlay}
        pointerEvents="none"
      />
      <View {...panResponder.panHandlers} style={styles.bottomSheetHandle}>
        <View style={[styles.dragHandle, { backgroundColor: colorTheme.darkest }]} />
      </View>
      <ScrollView 
        showsVerticalScrollIndicator={false} 
        contentContainerStyle={styles.scrollViewContent}
        style={styles.scrollView}
      >
        {/* This week Section */}
        <View style={styles.bottomSection}>
          <View style={styles.sectionHeader}>
            <Text style={[styles.sectionTitle, styles.sectionTitleBlack]}>This week</Text>
            <TouchableOpacity 
              style={[
                styles.addButton,
                styles.addButtonWithShadow,
                { 
                  backgroundColor: colorTheme.darkest, 
                  borderColor: colorTheme.darkest,
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
        <View style={[styles.bottomSection, styles.bottomSectionLast]}>
          <View style={styles.sectionHeader}>
            <Text style={[styles.sectionTitle, styles.sectionTitleBlack]}>Other tasks</Text>
            <TouchableOpacity 
              style={[
                styles.addButton,
                styles.addButtonWithShadow,
                { 
                  backgroundColor: colorTheme.darkest, 
                  borderColor: colorTheme.darkest,
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
