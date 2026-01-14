import React from 'react';
import { View, Text, TouchableOpacity } from 'react-native';
import { Task } from '../types';
import { taskItemStyles as styles } from '../styles/taskItemStyles';

interface TaskItemProps {
  task: Task;
  onToggle: (id: number) => void;
  onDelete: (id: number) => void;
}

export default function TaskItem({ task, onToggle, onDelete }: TaskItemProps) {
  return (
    <View style={styles.taskItem}>
      <TouchableOpacity
        style={styles.taskContent}
        onPress={() => onToggle(task.id)}
      >
        <View style={[styles.colorIndicator, { backgroundColor: task.color }]} />
        <View style={styles.checkbox}>
          {task.completed && <Text style={styles.checkmark}>✓</Text>}
        </View>
        <Text style={[styles.taskText, task.completed && styles.taskTextCompleted]}>
          {task.text}
        </Text>
        <Text style={styles.taskTime}>{task.time}</Text>
      </TouchableOpacity>
      <TouchableOpacity
        style={styles.deleteButton}
        onPress={() => onDelete(task.id)}
      >
        <Text style={styles.deleteIcon}>🗑️</Text>
      </TouchableOpacity>
    </View>
  );
}
