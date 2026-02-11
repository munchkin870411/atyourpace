import { StatusBar } from 'expo-status-bar';
import { ScrollView } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { LinearGradient } from 'expo-linear-gradient';
import React, { useState, useMemo } from 'react';
import Header from './components/Header';
import TodaySection from './components/TodaySection';
import ProgressSection from './components/ProgressSection';
import BottomSheet from './components/BottomSheet';
import AddTaskModal from './components/AddTaskModal';
import ProfileModal from './components/ProfileModal';
import { appStyles as styles } from './styles/appStyles';
import { generateColorTheme } from './utils/colorUtils';
import { usePanResponder } from './hooks/usePanResponder';
import { useTaskStorage } from './hooks/useTaskStorage';
import { useTaskHandlers } from './hooks/useTaskHandlers';

export default function App(): React.JSX.Element {
  const [modalVisible, setModalVisible] = useState(false);
  const [profileModalVisible, setProfileModalVisible] = useState(false);
  const [isExpanded, setIsExpanded] = useState(false);

  // Custom hooks
  const {
    tasks,
    setTasks,
    dayStartTime,
    setDayStartTime,
    timeFormat,
    setTimeFormat,
    selectedAvatar,
    setSelectedAvatar,
    selectedColor,
    setSelectedColor,
    saveTasks
  } = useTaskStorage();

  const { translateY, slideAnim, panResponder } = usePanResponder(isExpanded, setIsExpanded);

  const {
    activeTasks,
    completedTasks,
    thisWeekTasks,
    otherTasks,
    editingTask,
    setEditingTask,
    currentSection,
    setCurrentSection,
    toggleTaskHandler,
    deleteTask,
    handleAddTask,
    handleEditTask,
    moveTaskToSectionHandler,
    moveTaskUp,
    moveTaskDown
  } = useTaskHandlers({
    tasks,
    setTasks,
    dayStartTime,
    setDayStartTime,
    saveTasks,
    setModalVisible
  });

  const colorTheme = useMemo(() => generateColorTheme(selectedColor), [selectedColor]);

  return (
    <SafeAreaView style={styles.container} edges={['bottom', 'left', 'right']}>
      <LinearGradient
        colors={[colorTheme.lightest, colorTheme.light]}
        style={{ position: 'absolute', left: 0, right: 0, top: 0, bottom: 0 }}
      />
      
      <StatusBar style="dark" />
      
      <Header onProfilePress={() => setProfileModalVisible(true)} avatar={selectedAvatar} colorTheme={colorTheme} />

      <ScrollView 
        style={styles.content}
        contentContainerStyle={{ paddingBottom: isExpanded ? 500 : 150 }}
      >
        <TodaySection
          activeTasks={activeTasks}
          onToggle={toggleTaskHandler}
          onDelete={deleteTask}
          onEdit={handleEditTask}
          onMoveToSection={moveTaskToSectionHandler}
          onMoveUp={moveTaskUp}
          onMoveDown={moveTaskDown}
          onAddTask={() => {
            setCurrentSection('today');
            setModalVisible(true);
          }}
          timeFormat={timeFormat}
          colorTheme={colorTheme}
        />

        <ProgressSection
          completedTasks={completedTasks}
          onToggle={toggleTaskHandler}
          onDelete={deleteTask}
          onEdit={handleEditTask}
          onMoveToSection={moveTaskToSectionHandler}
          colorTheme={colorTheme}
        />
      </ScrollView>

      <BottomSheet
        isExpanded={isExpanded}
        translateY={translateY}
        slideAnim={slideAnim}
        panResponder={panResponder}
        thisWeekTasks={thisWeekTasks}
        otherTasks={otherTasks}
        onToggle={toggleTaskHandler}
        onDelete={deleteTask}
        onEdit={handleEditTask}
        onMoveToSection={moveTaskToSectionHandler}
        onMoveUp={moveTaskUp}
        onMoveDown={moveTaskDown}
        onAddThisWeekTask={() => {
          setCurrentSection('thisWeek');
          setModalVisible(true);
        }}
        onAddOtherTask={() => {
          setCurrentSection('other');
          setModalVisible(true);
        }}
        colorTheme={colorTheme}
      />

      <AddTaskModal 
        visible={modalVisible}
        onClose={() => {
          setModalVisible(false);
          setEditingTask(null);
        }}
        onAddTask={handleAddTask}
        onDelete={deleteTask}
        existingTasks={tasks}
        isFirstTask={activeTasks.length === 0}
        section={currentSection}
        editingTask={editingTask}
        colorTheme={colorTheme}
      />

      <ProfileModal
        visible={profileModalVisible}
        onClose={() => setProfileModalVisible(false)}
        onTimeFormatChange={setTimeFormat}
        selectedAvatar={selectedAvatar}
        onAvatarChange={setSelectedAvatar}
        selectedColor={selectedColor}
        onColorChange={setSelectedColor}
        colorTheme={colorTheme}
      />
    </SafeAreaView>
  );
}
