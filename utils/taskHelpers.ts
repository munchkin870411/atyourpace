import { Task } from '../types';

// Helper functions
const getCurrentTime = (): string => {
  const now = new Date();
  return `${String(now.getHours()).padStart(2, '0')}.${String(now.getMinutes()).padStart(2, '0')}`;
};

const calculateNextTime = (startTime: string, duration: number): string => {
  const [h, m] = startTime.split('.').map(Number);
  const totalMin = h * 60 + m + duration;
  return `${String(Math.floor(totalMin / 60)).padStart(2, '0')}.${String(totalMin % 60).padStart(2, '0')}`;
};

const recalculateScheduleFromIndex = (
  updatedTasks: Task[],
  todayTasks: Task[],
  startIndex: number
): Task[] => {
  for (let i = startIndex; i < todayTasks.length; i++) {
    const prevTask = todayTasks[i - 1];
    const prevTaskIdx = updatedTasks.findIndex(t => t.id === prevTask.id);
    const prevTaskData = updatedTasks[prevTaskIdx];
    
    const newTime = calculateNextTime(prevTaskData.time, prevTaskData.duration);
    
    const taskIdx = updatedTasks.findIndex(t => t.id === todayTasks[i].id);
    updatedTasks[taskIdx] = { ...updatedTasks[taskIdx], time: newTime };
  }
  return updatedTasks;
};

const determineStartTimeForReorder = (dayStartTime: string): string => {
  const currentTime = getCurrentTime();
  
  if (!dayStartTime || dayStartTime === '09.00') {
    return currentTime;
  }
  
  const [nowH, nowM] = currentTime.split('.').map(Number);
  const [startH, startM] = dayStartTime.split('.').map(Number);
  const nowMinutes = nowH * 60 + nowM;
  const startMinutes = startH * 60 + startM;
  
  return nowMinutes >= startMinutes ? currentTime : dayStartTime;
};

export const toggleTask = (
  tasks: Task[],
  id: number
): Task[] => {
  const currentTime = getCurrentTime();
  
  const taskIndex = tasks.findIndex(t => t.id === id);
  const task = tasks[taskIndex];
  
  let updatedTasks = [...tasks];
  
  if (!task.completed) {
    // Bara räkna om om det är en today task
    if (task.section !== 'today') {
      updatedTasks[taskIndex] = { ...task, completed: true, completedAt: currentTime };
      return updatedTasks;
    }
    
    // Hitta alla UNCOMPLETED today tasks (exkludera saved templates)
    const uncompletedTodayTasks = tasks.filter(t => t.section === 'today' && !t.completed && !t.isSavedTemplate);
    const taskPositionInUncompleted = uncompletedTodayTasks.findIndex(t => t.id === id);
    
    // Checka av - spara tiden
    updatedTasks[taskIndex] = { ...task, completed: true, completedAt: currentTime };
    
    // Hitta alla tasks efter denna (exkludera den vi just completed och andra completed tasks)
    const remainingTasks = uncompletedTodayTasks.slice(taskPositionInUncompleted + 1);
    
    if (remainingTasks.length > 0) {
      // Bestäm starttid för första efterföljande task
      let nextStartTime: string;
      if (taskPositionInUncompleted === 0) {
        // Första task - nästa börjar vid currentTime
        nextStartTime = currentTime;
      } else {
        // Andra eller senare task - räkna från föregående uncompleted task
        const prevUncompletedTask = uncompletedTodayTasks[taskPositionInUncompleted - 1];
        const prevTaskIdx = updatedTasks.findIndex(t => t.id === prevUncompletedTask.id);
        const prevTaskData = updatedTasks[prevTaskIdx];
        nextStartTime = calculateNextTime(prevTaskData.time, prevTaskData.duration);
      }
      
      // Uppdatera första efterföljande task
      const firstNextTaskIdx = updatedTasks.findIndex(t => t.id === remainingTasks[0].id);
      updatedTasks[firstNextTaskIdx] = { 
        ...updatedTasks[firstNextTaskIdx], 
        time: nextStartTime 
      };
      
      // Omberäkna resten av schemat
      if (remainingTasks.length > 1) {
        updatedTasks = recalculateScheduleFromIndex(updatedTasks, remainingTasks, 1);
      }
    }
  } else {
    // Bocka av igen - omberäkna från denna task
    updatedTasks[taskIndex] = { ...task, completed: false, completedAt: undefined };
    
    // Bara räkna om om det är en today task
    if (task.section !== 'today') {
      return updatedTasks;
    }
    
    // Hitta alla today tasks som inte är completed (exkludera saved templates)
    const todayTasks = updatedTasks.filter(t => t.section === 'today' && !t.completed && !t.isSavedTemplate);
    const taskPositionInToday = todayTasks.findIndex(t => t.id === id);
    
    if (taskPositionInToday === -1) return updatedTasks;
    
    // Hitta föregående task för att beräkna ny starttid
    let newStartTime: string;
    
    if (taskPositionInToday === 0) {
      // Det är första tasken, använd dess ursprungliga tid
      newStartTime = task.time;
    } else {
      // Beräkna från föregående task i today-listan
      const prevTask = todayTasks[taskPositionInToday - 1];
      const prevTaskIdx = updatedTasks.findIndex(t => t.id === prevTask.id);
      const prevTaskData = updatedTasks[prevTaskIdx];
      newStartTime = calculateNextTime(prevTaskData.time, prevTaskData.duration);
    }
    
    updatedTasks[taskIndex] = { ...updatedTasks[taskIndex], time: newStartTime };
    
    // Omberäkna alla tasks efter denna i today-listan
    if (taskPositionInToday + 1 < todayTasks.length) {
      updatedTasks = recalculateScheduleFromIndex(updatedTasks, todayTasks, taskPositionInToday + 1);
    }
  }
  
  return updatedTasks;
};

export const addTask = (
  tasks: Task[],
  newTaskData: Omit<Task, 'id' | 'completed'>,
  activeTasks: Task[]
): { updatedTasks: Task[], newStartTime: string | null } => {
  let calculatedTime = newTaskData.time;
  let newStartTime: string | null = null;
  
  // Om det är en saved template, ge den en dummy-tid och lägg till direkt
  if (newTaskData.isSavedTemplate) {
    const maxId = tasks.length > 0 ? Math.max(...tasks.map(t => t.id)) : 0;
    const newTask: Task = {
      id: maxId + 1,
      ...newTaskData,
      time: '00.00', // Dummy tid för templates
      completed: false,
    };
    return { updatedTasks: [...tasks, newTask], newStartTime: null };
  }
  
  // Hitta tasks i samma sektion (exkludera saved templates)
  const sectionTasks = tasks.filter(t => t.section === newTaskData.section && !t.completed && !t.isSavedTemplate);
  
  // Om det inte är första tasken i sektionen, beräkna tid baserat på föregående tasks
  if (sectionTasks.length > 0) {
    const lastTask = sectionTasks[sectionTasks.length - 1];
    calculatedTime = calculateNextTime(lastTask.time, lastTask.duration);
  } else if (!newTaskData.time) {
    // Om det är första tasken och ingen tid angetts, använd nuvarande tid
    calculatedTime = getCurrentTime();
  }
  
  // Om det är första tasken i Today, spara starttiden
  if (newTaskData.section === 'today' && activeTasks.length === 0) {
    newStartTime = calculatedTime;
  }
  
  // Hitta högsta befintliga ID och lägg till 1 för att säkerställa unikt ID
  const maxId = tasks.length > 0 ? Math.max(...tasks.map(t => t.id)) : 0;
  
  const newTask: Task = {
    id: maxId + 1,
    ...newTaskData,
    time: calculatedTime,
    completed: false,
    saveAsTemplate: undefined, // Ta bort denna flag från den vanliga tasken
  };
  
  let updatedTasks = [...tasks, newTask];
  
  // Om saveAsTemplate är true, skapa också en template-version
  if (newTaskData.saveAsTemplate) {
    const templateTask: Task = {
      id: maxId + 2,
      text: newTaskData.text,
      time: '00.00', // Dummy tid för templates
      duration: newTaskData.duration,
      color: newTaskData.color,
      section: newTaskData.section,
      completed: false,
      isSavedTemplate: true,
    };
    updatedTasks = [...updatedTasks, templateTask];
  }
  
  return { updatedTasks, newStartTime };
};

export const deleteTask = (
  tasks: Task[],
  id: number
): Task[] => {
  return tasks.filter(task => task.id !== id);
};

export const editTask = (
  tasks: Task[],
  editingTask: Task,
  newTaskData: Omit<Task, 'id' | 'completed'>,
  dayStartTime: string
): { updatedTasks: Task[], newStartTime: string | null } => {
  // Uppdatera tasken
  let updatedTasks = tasks.map(t => 
    t.id === editingTask.id 
      ? { ...t, text: newTaskData.text, time: newTaskData.time, duration: newTaskData.duration, color: newTaskData.color, section: newTaskData.section }
      : t
  );

  let newStartTime: string | null = null;

  // Om det är en today-task och tid eller duration har ändrats, räkna om schemat
  if (newTaskData.section === 'today' && 
      (newTaskData.time !== editingTask.time || newTaskData.duration !== editingTask.duration)) {
    
    const todayTasks = updatedTasks.filter(t => t.section === 'today' && !t.completed && !t.isSavedTemplate);
    const editedTaskIndex = todayTasks.findIndex(t => t.id === editingTask.id);
    
    if (editedTaskIndex !== -1) {
      // Om det är första tasken och tiden har ändrats, uppdatera newStartTime
      if (editedTaskIndex === 0 && newTaskData.time !== editingTask.time && newTaskData.time) {
        newStartTime = newTaskData.time;
      }
      
      // Räkna om alla efterföljande tasks
      for (let i = editedTaskIndex + 1; i < todayTasks.length; i++) {
        const prevTask = todayTasks[i - 1];
        const prevTaskIdx = updatedTasks.findIndex(t => t.id === prevTask.id);
        const prevTaskData = updatedTasks[prevTaskIdx];
        
        const newTime = calculateNextTime(prevTaskData.time, prevTaskData.duration);
        
        const taskIdx = updatedTasks.findIndex(t => t.id === todayTasks[i].id);
        updatedTasks[taskIdx] = { ...updatedTasks[taskIdx], time: newTime };
      }
    }
  }

  return { updatedTasks, newStartTime };
};

export const moveTaskToSection = (
  tasks: Task[],
  taskId: number,
  newSection: 'today' | 'thisWeek' | 'other'
): Task[] => {
  const taskIndex = tasks.findIndex(t => t.id === taskId);
  if (taskIndex === -1) return tasks;

  const task = tasks[taskIndex];
  let calculatedTime = task.time;

  // Om vi flyttar till "today", beräkna ny tid och flytta till slutet
  if (newSection === 'today') {
    const todayTasks = tasks.filter(t => t.section === 'today' && !t.completed && !t.isSavedTemplate);
    if (todayTasks.length > 0) {
      const lastTask = todayTasks[todayTasks.length - 1];
      calculatedTime = calculateNextTime(lastTask.time, lastTask.duration);
    } else {
      calculatedTime = getCurrentTime();
    }
    
    // Ta bort tasken från sin nuvarande position
    const updatedTasks = tasks.filter(t => t.id !== taskId);
    
    // Hitta sista UNCOMPLETED today-tasken (exkludera saved templates)
    let insertIndex = -1;
    for (let i = updatedTasks.length - 1; i >= 0; i--) {
      if (updatedTasks[i].section === 'today' && !updatedTasks[i].completed && !updatedTasks[i].isSavedTemplate) {
        insertIndex = i;
        break;
      }
    }
    
    if (insertIndex === -1) {
      // Inga uncompleted today tasks finns, lägg till först
      return [{ ...task, section: newSection, time: calculatedTime }, ...updatedTasks];
    }
    
    // Infoga efter sista uncompleted today-tasken
    updatedTasks.splice(insertIndex + 1, 0, { ...task, section: newSection, time: calculatedTime });
    return updatedTasks;
  }

  return tasks.map(t => 
    t.id === taskId 
      ? { ...t, section: newSection, time: calculatedTime }
      : t
  );
};

const moveTaskInternal = (
  tasks: Task[],
  taskId: number,
  direction: 'up' | 'down',
  dayStartTime: string
): { updatedTasks: Task[], newStartTime: string } => {
  const taskIndex = tasks.findIndex(t => t.id === taskId);
  if (taskIndex === -1) return { updatedTasks: tasks, newStartTime: dayStartTime };

  const task = tasks[taskIndex];
  const sectionTasks = tasks.filter(t => t.section === task.section && !t.completed && !t.isSavedTemplate);
  const sectionIndex = sectionTasks.findIndex(t => t.id === taskId);
  
  // Check boundaries
  if (direction === 'up' && sectionIndex <= 0) return { updatedTasks: tasks, newStartTime: dayStartTime };
  if (direction === 'down' && sectionIndex >= sectionTasks.length - 1) return { updatedTasks: tasks, newStartTime: dayStartTime };

  // Save original first task ID
  const originalFirstTaskId = task.section === 'today' ? sectionTasks[0].id : null;

  // Find task to swap with
  const swapTask = direction === 'up' ? sectionTasks[sectionIndex - 1] : sectionTasks[sectionIndex + 1];
  const swapTaskIndex = tasks.findIndex(t => t.id === swapTask.id);

  // Swap tasks
  let updatedTasks = [...tasks];
  [updatedTasks[taskIndex], updatedTasks[swapTaskIndex]] = [updatedTasks[swapTaskIndex], updatedTasks[taskIndex]];

  let newStartTime = dayStartTime;

  // Recalculate times for today section
  if (task.section === 'today') {
    const todayTasks = updatedTasks.filter(t => t.section === 'today' && !t.completed && !t.isSavedTemplate);
    
    const firstTaskChanged = todayTasks[0].id !== originalFirstTaskId;
    
    let startTime = dayStartTime;
    
    if (firstTaskChanged) {
      startTime = determineStartTimeForReorder(dayStartTime);
      newStartTime = startTime;
      
      const taskIdx = updatedTasks.findIndex(t => t.id === todayTasks[0].id);
      updatedTasks[taskIdx] = { ...updatedTasks[taskIdx], time: startTime };
    } else {
      const firstTaskIdx = updatedTasks.findIndex(t => t.id === todayTasks[0].id);
      startTime = updatedTasks[firstTaskIdx].time;
    }
    
    // Recalculate rest from index 1
    if (todayTasks.length > 1) {
      updatedTasks = recalculateScheduleFromIndex(updatedTasks, todayTasks, 1);
    }
  }

  return { updatedTasks, newStartTime };
};

export const moveTaskUp = (
  tasks: Task[],
  taskId: number,
  dayStartTime: string
): { updatedTasks: Task[], newStartTime: string } => {
  return moveTaskInternal(tasks, taskId, 'up', dayStartTime);
};

export const moveTaskDown = (
  tasks: Task[],
  taskId: number,
  dayStartTime: string
): { updatedTasks: Task[], newStartTime: string } => {
  return moveTaskInternal(tasks, taskId, 'down', dayStartTime);
};
