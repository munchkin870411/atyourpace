import React from 'react';
import { View, Text, TouchableOpacity } from 'react-native';
import { Task } from '../types';
import TaskItem from './TaskItem';
import { appStyles as styles } from '../styles/appStyles';
import { ColorTheme } from '../utils/colorUtils';

interface TodaySectionProps {
  activeTasks: Task[];
  onToggle: (id: number) => void;
  onDelete: (id: number) => void;
  onEdit: (task: Task) => void;
  onMoveToSection: (id: number, section: 'today' | 'thisWeek' | 'other') => void;
  onMoveUp: (id: number) => void;
  onMoveDown: (id: number) => void;
  onAddTask: () => void;
  timeFormat: 'schedule' | 'minutes' | 'notime';
  colorTheme: ColorTheme;
}

export default function TodaySection({ 
  activeTasks, 
  onToggle, 
  onDelete, 
  onEdit, 
  onMoveToSection,
  onMoveUp,
  onMoveDown,
  onAddTask,
  timeFormat,
  colorTheme
}: TodaySectionProps) {
  return (
    <View style={styles.section}>
      <View style={[styles.sectionHeader, { overflow: 'visible' }]}>
        <Text style={styles.sectionTitle}>Today</Text>
        <TouchableOpacity 
          style={{
            backgroundColor: colorTheme.darker, 
            borderColor: colorTheme.darkest,
            paddingHorizontal: 15,
            paddingVertical: 8,
            borderWidth: 1,
            borderRadius: 12,
            shadowColor: '#000',
            shadowOffset: { width: 0, height: 4 },
            shadowOpacity: 0.5,
            shadowRadius: 6,
            elevation: 8
          }}
          onPress={onAddTask}
        >
          <Text style={styles.addButtonText}>Add Task</Text>
        </TouchableOpacity>
      </View>

      {/* Task List */}
      <View style={[styles.taskContainer, { backgroundColor: colorTheme.lightest, borderColor: colorTheme.dark }]}>
        {activeTasks.map((task, index) => (
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
            isLast={index === activeTasks.length - 1}
            showTime={timeFormat === 'schedule'} 
            showDuration={timeFormat === 'minutes'}
            colorTheme={colorTheme}
          />
        ))}

        {/* Done At Section */}
        {timeFormat === 'schedule' && (
          <View style={styles.doneAtContainer}>
            <Text style={styles.doneAtLabel}>You will be done at:</Text>
            <Text style={styles.doneAtTime}>
              {activeTasks.length > 0 ? (() => {
                const lastTask = activeTasks[activeTasks.length - 1];
                const [hours, minutes] = lastTask.time.split('.').map(Number);
                const totalMinutes = hours * 60 + minutes + lastTask.duration;
                const doneHours = Math.floor(totalMinutes / 60);
                const doneMinutes = totalMinutes % 60;
                return `${String(doneHours).padStart(2, '0')}.${String(doneMinutes).padStart(2, '0')}`;
              })() : '00.00'}
            </Text>
          </View>
        )}
      </View>
    </View>
  );
}
