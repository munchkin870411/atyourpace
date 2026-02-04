import React from 'react';
import { View, Text } from 'react-native';
import { Task } from '../types';
import TaskItem from './TaskItem';
import { appStyles as styles } from '../styles/appStyles';

interface ProgressSectionProps {
  completedTasks: Task[];
  onToggle: (id: number) => void;
  onDelete: (id: number) => void;
  onEdit: (task: Task) => void;
  onMoveToSection: (id: number, section: 'today' | 'thisWeek' | 'other') => void;
}

export default function ProgressSection({ 
  completedTasks, 
  onToggle, 
  onDelete, 
  onEdit, 
  onMoveToSection 
}: ProgressSectionProps) {
  // Räkna ut total tid
  const totalMinutes = completedTasks.reduce((sum, task) => sum + task.duration, 0);
  const hours = Math.floor(totalMinutes / 60);
  const minutes = totalMinutes % 60;
  const totalTimeText = hours > 0 
    ? `${hours} h ${minutes} minutes` 
    : `${minutes} minutes`;
  
  return (
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
                onToggle={onToggle} 
                onDelete={onDelete} 
                onEdit={onEdit} 
                onMoveToSection={onMoveToSection}
                showTime={false}
                showDuration={true}
              />
            ))}
            <View style={styles.totalTimeContainer}>
              <Text style={styles.totalTimeLabel}>Total time:</Text>
              <Text style={styles.totalTimeValue}>{totalTimeText}</Text>
            </View>
          </>
        )}
      </View>
    </View>
  );
}
