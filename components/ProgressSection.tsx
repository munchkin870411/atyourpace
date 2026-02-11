import React from 'react';
import { View, Text } from 'react-native';
import { Task } from '../types';
import TaskItem from './TaskItem';
import { progressSectionStyles as styles } from '../styles/progressSectionStyles';
import { ColorTheme } from '../utils/colorUtils';

interface ProgressSectionProps {
  completedTasks: Task[];
  onToggle: (id: number) => void;
  onDelete: (id: number) => void;
  onEdit: (task: Task) => void;
  onMoveToSection: (id: number, section: 'today' | 'thisWeek' | 'other') => void;
  colorTheme: ColorTheme;
}

export default function ProgressSection({ completedTasks, onToggle, onDelete, onEdit, onMoveToSection, colorTheme }: ProgressSectionProps) {
  // Räkna ut total tid
  const totalMinutes = completedTasks.reduce((sum, task) => sum + task.duration, 0);
  const hours = Math.floor(totalMinutes / 60);
  const minutes = totalMinutes % 60;
  const totalTimeText = hours > 0 
    ? `${hours} h ${minutes} minutes` 
    : `${minutes} minutes`;
  
  return (
    <View style={styles.section}>
      <Text style={[styles.sectionTitle, { color: colorTheme.textColor }]}>Check your progress!</Text>
      
      <View style={[styles.progressContainer, { backgroundColor: colorTheme.lightest, borderColor: colorTheme.dark }]}>
        {completedTasks.length === 0 ? (
          <Text style={[styles.emptyText, { color: colorTheme.textColor }]}>No completed tasks yet</Text>
        ) : (
          <>
            {completedTasks.map(task => (
              <TaskItem 
                key={task.id} 
                task={task} 
                onToggle={onToggle} 
                onDelete={onDelete} 
                onEdit={onEdit} 
                onMoveToSection={onMoveToSection}
                showTime={false}
                showDuration={true}
                colorTheme={colorTheme}
              />
            ))}
            <View style={styles.totalTimeContainer}>
              <Text style={[styles.totalTimeLabel, { color: colorTheme.textColor }]}>Total time:</Text>
              <Text style={[styles.totalTimeValue, { color: colorTheme.textColor }]}>{totalTimeText}</Text>
            </View>
          </>
        )}
      </View>
    </View>
  );
}
