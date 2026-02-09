import React, { useState } from 'react';
import { View, Text, TouchableOpacity, Modal } from 'react-native';
import { Task } from '../types';
import { taskItemStyles as styles } from '../styles/taskItemStyles';
import { ColorTheme } from '../utils/colorUtils';

interface TaskItemProps {
  task: Task;
  onToggle: (id: number) => void;
  onDelete: (id: number) => void;
  onEdit: (task: Task) => void;
  onMoveToSection?: (id: number, section: 'today' | 'thisWeek' | 'other') => void;
  onMoveUp?: (id: number) => void;
  onMoveDown?: (id: number) => void;
  showTime?: boolean;
  showDuration?: boolean;
  isFirst?: boolean;
  isLast?: boolean;
  colorTheme?: ColorTheme;
}

export default function TaskItem({ task, onToggle, onDelete, onEdit, onMoveToSection, onMoveUp, onMoveDown, showTime = true, showDuration = false, isFirst = false, isLast = false, colorTheme }: TaskItemProps) {
  const [menuVisible, setMenuVisible] = useState(false);

  const handleMoveToSection = (section: 'today' | 'thisWeek' | 'other') => {
    if (onMoveToSection) {
      onMoveToSection(task.id, section);
    }
    setMenuVisible(false);
  };

  return (
    <View style={styles.taskItem}>
      {/* Reorder arrows */}
      {onMoveUp && onMoveDown && (
        <View style={styles.reorderButtons}>
          <TouchableOpacity
            style={[styles.arrowButton, isFirst && styles.arrowButtonDisabled]}
            onPress={() => !isFirst && onMoveUp(task.id)}
            disabled={isFirst}
          >
            <Text style={[styles.arrowIcon, { color: isFirst ? '#d0d0d0' : colorTheme?.primary || '#5bc47a' }]}>▲</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={[styles.arrowButton, isLast && styles.arrowButtonDisabled]}
            onPress={() => !isLast && onMoveDown(task.id)}
            disabled={isLast}
          >
            <Text style={[styles.arrowIcon, { color: isLast ? '#d0d0d0' : colorTheme?.primary || '#5bc47a' }]}>▼</Text>
          </TouchableOpacity>
        </View>
      )}

      <View style={[styles.colorIndicator, { backgroundColor: task.color }]} />
      
      <TouchableOpacity
        style={styles.checkbox}
        onPress={() => onToggle(task.id)}
      >
        {task.completed && <Text style={styles.checkmark}>✓</Text>}
      </TouchableOpacity>
      
      <TouchableOpacity
        style={styles.taskContent}
        onPress={() => onEdit(task)}
      >
        <Text style={[styles.taskText, { color: colorTheme?.textColor || '#000000' }, task.completed && styles.taskTextCompleted]}>
          {task.text}
        </Text>
        {showTime && <Text style={[styles.taskTime, { color: colorTheme?.textColor || '#000000' }]}>{task.time}</Text>}
        {showDuration && <Text style={[styles.taskTime, { color: colorTheme?.textColor || '#000000' }]}>{task.duration} min</Text>}
      </TouchableOpacity>
      
      {onMoveToSection && (
        <>
          <TouchableOpacity
            style={styles.moveButton}
            onPress={() => setMenuVisible(true)}
          >
            <Text style={[styles.moveIcon, { color: colorTheme?.primary || '#018c29' }]}>⋯</Text>
          </TouchableOpacity>

          <Modal
            visible={menuVisible}
            transparent={true}
            animationType="fade"
            onRequestClose={() => setMenuVisible(false)}
          >
            <TouchableOpacity 
              style={styles.menuOverlay}
              activeOpacity={1}
              onPress={() => setMenuVisible(false)}
            >
              <View style={styles.menuContainer}>
                <TouchableOpacity
                  style={[styles.menuItem, task.section === 'today' && styles.menuItemActive]}
                  onPress={() => handleMoveToSection('today')}
                  disabled={task.section === 'today'}
                >
                  <Text style={[styles.menuText, task.section === 'today' && styles.menuTextActive]}>
                    📅 Today
                  </Text>
                </TouchableOpacity>
                
                <TouchableOpacity
                  style={[styles.menuItem, task.section === 'thisWeek' && styles.menuItemActive]}
                  onPress={() => handleMoveToSection('thisWeek')}
                  disabled={task.section === 'thisWeek'}
                >
                  <Text style={[styles.menuText, task.section === 'thisWeek' && styles.menuTextActive]}>
                    📆 This week
                  </Text>
                </TouchableOpacity>
                
                <TouchableOpacity
                  style={[styles.menuItem, task.section === 'other' && styles.menuItemActive]}
                  onPress={() => handleMoveToSection('other')}
                  disabled={task.section === 'other'}
                >
                  <Text style={[styles.menuText, task.section === 'other' && styles.menuTextActive]}>
                    📋 Other tasks
                  </Text>
                </TouchableOpacity>
              </View>
            </TouchableOpacity>
          </Modal>
        </>
      )}
      
      <TouchableOpacity
        style={styles.deleteButton}
        onPress={() => onDelete(task.id)}
      >
        <Text style={styles.deleteIcon}>🗑️</Text>
      </TouchableOpacity>
    </View>
  );
}
