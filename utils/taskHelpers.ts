import { Task } from '../types';

export const toggleTask = (
  tasks: Task[],
  id: number
): Task[] => {
  const now = new Date();
  const currentTime = `${String(now.getHours()).padStart(2, '0')}.${String(now.getMinutes()).padStart(2, '0')}`;
  
  const taskIndex = tasks.findIndex(t => t.id === id);
  const task = tasks[taskIndex];
  
  let updatedTasks = [...tasks];
  
  if (!task.completed) {
    // Checka av - spara tiden
    updatedTasks[taskIndex] = { ...task, completed: true, completedAt: currentTime };
    
    // Bara räkna om om det är en today task
    if (task.section !== 'today') {
      return updatedTasks;
    }
    
    // Beräkna om nästa aktiva today tasks
    const todayTasks = updatedTasks.filter(t => t.section === 'today' && !t.completed);
    const taskPositionInToday = todayTasks.findIndex(t => t.id === id);
    
    // Om det finns tasks efter denna i today
    if (taskPositionInToday !== -1 && taskPositionInToday < todayTasks.length - 1) {
      // Räkna om alla tasks efter denna
      for (let i = taskPositionInToday; i < todayTasks.length; i++) {
        const currentTask = todayTasks[i];
        let startTime: string;
        
        if (i === taskPositionInToday) {
          // Första efter completed task - använd currentTime
          startTime = currentTime;
        } else {
          // Beräkna från föregående task
          const prevTask = todayTasks[i - 1];
          const prevTaskIdx = updatedTasks.findIndex(t => t.id === prevTask.id);
          const prevTaskData = updatedTasks[prevTaskIdx];
          const [h, m] = prevTaskData.time.split('.').map(Number);
          const totalMin = h * 60 + m + prevTaskData.duration;
          startTime = `${String(Math.floor(totalMin / 60)).padStart(2, '0')}.${String(totalMin % 60).padStart(2, '0')}`;
        }
        
        const currentTaskIdx = updatedTasks.findIndex(t => t.id === currentTask.id);
        updatedTasks[currentTaskIdx] = { ...updatedTasks[currentTaskIdx], time: startTime };
      }
    }
  } else {
    // Bocka av igen - omberäkna från denna task
    updatedTasks[taskIndex] = { ...task, completed: false, completedAt: undefined };
    
    // Bara räkna om om det är en today task
    if (task.section !== 'today') {
      return updatedTasks;
    }
    
    // Hitta alla today tasks som inte är completed
    const todayTasks = updatedTasks.filter(t => t.section === 'today' && !t.completed);
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
      const [h, m] = prevTaskData.time.split('.').map(Number);
      const totalMin = h * 60 + m + prevTaskData.duration;
      newStartTime = `${String(Math.floor(totalMin / 60)).padStart(2, '0')}.${String(totalMin % 60).padStart(2, '0')}`;
    }
    
    updatedTasks[taskIndex] = { ...updatedTasks[taskIndex], time: newStartTime };
    
    // Omberäkna alla tasks efter denna i today-listan
    for (let i = taskPositionInToday + 1; i < todayTasks.length; i++) {
      const currentTask = todayTasks[i];
      const prevTask = todayTasks[i - 1];
      
      // Hämta uppdaterad tid från updatedTasks
      const prevTaskIdx = updatedTasks.findIndex(t => t.id === prevTask.id);
      const prevTaskData = updatedTasks[prevTaskIdx];
      
      const [h, m] = prevTaskData.time.split('.').map(Number);
      const totalMin = h * 60 + m + prevTaskData.duration;
      const nextStartTime = `${String(Math.floor(totalMin / 60)).padStart(2, '0')}.${String(totalMin % 60).padStart(2, '0')}`;
      
      const currentTaskIdx = updatedTasks.findIndex(t => t.id === currentTask.id);
      updatedTasks[currentTaskIdx] = { ...updatedTasks[currentTaskIdx], time: nextStartTime };
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
  
  // Hitta tasks i samma sektion
  const sectionTasks = tasks.filter(t => t.section === newTaskData.section && !t.completed);
  
  // Om det inte är första tasken i sektionen, beräkna tid baserat på föregående tasks
  if (sectionTasks.length > 0) {
    const lastTask = sectionTasks[sectionTasks.length - 1];
    const [hours, minutes] = lastTask.time.split('.').map(Number);
    const totalMinutes = hours * 60 + minutes + lastTask.duration;
    const newHours = Math.floor(totalMinutes / 60);
    const newMinutes = totalMinutes % 60;
    calculatedTime = `${String(newHours).padStart(2, '0')}.${String(newMinutes).padStart(2, '0')}`;
  } else if (!newTaskData.time) {
    // Om det är första tasken och ingen tid angetts, använd nuvarande tid
    const now = new Date();
    calculatedTime = `${String(now.getHours()).padStart(2, '0')}.${String(now.getMinutes()).padStart(2, '0')}`;
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
  };
  
  return { updatedTasks: [...tasks, newTask], newStartTime };
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
  newTaskData: Omit<Task, 'id' | 'completed'>
): Task[] => {
  return tasks.map(t => 
    t.id === editingTask.id 
      ? { ...t, text: newTaskData.text, duration: newTaskData.duration, color: newTaskData.color, section: newTaskData.section }
      : t
  );
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

  // Om vi flyttar till "today", beräkna ny tid
  if (newSection === 'today') {
    const todayTasks = tasks.filter(t => t.section === 'today' && !t.completed);
    if (todayTasks.length > 0) {
      const lastTask = todayTasks[todayTasks.length - 1];
      const [hours, minutes] = lastTask.time.split('.').map(Number);
      const totalMinutes = hours * 60 + minutes + lastTask.duration;
      const newHours = Math.floor(totalMinutes / 60);
      const newMinutes = totalMinutes % 60;
      calculatedTime = `${String(newHours).padStart(2, '0')}.${String(newMinutes).padStart(2, '0')}`;
    } else {
      const now = new Date();
      calculatedTime = `${String(now.getHours()).padStart(2, '0')}.${String(now.getMinutes()).padStart(2, '0')}`;
    }
  }

  return tasks.map(t => 
    t.id === taskId 
      ? { ...t, section: newSection, time: calculatedTime }
      : t
  );
};

export const moveTaskUp = (
  tasks: Task[],
  taskId: number,
  dayStartTime: string
): { updatedTasks: Task[], newStartTime: string } => {
  const taskIndex = tasks.findIndex(t => t.id === taskId);
  if (taskIndex === -1) return { updatedTasks: tasks, newStartTime: dayStartTime };

  const task = tasks[taskIndex];
  const sectionTasks = tasks.filter(t => t.section === task.section && !t.completed);
  const sectionIndex = sectionTasks.findIndex(t => t.id === taskId);
  
  if (sectionIndex <= 0) return { updatedTasks: tasks, newStartTime: dayStartTime };

  // Hitta den task vi ska byta plats med
  const prevTask = sectionTasks[sectionIndex - 1];
  const prevTaskIndex = tasks.findIndex(t => t.id === prevTask.id);

  // Byt plats på de två tasks i arrayen
  let updatedTasks = [...tasks];
  [updatedTasks[prevTaskIndex], updatedTasks[taskIndex]] = [updatedTasks[taskIndex], updatedTasks[prevTaskIndex]];

  let newStartTime = dayStartTime;

  // Om det är i "today"-sektionen, räkna om alla tider
  if (task.section === 'today') {
    const todayTasks = updatedTasks.filter(t => t.section === 'today' && !t.completed);
    
    // Bestäm starttid baserat på om schemat är aktivt
    let startTime = dayStartTime;
    const now = new Date();
    const currentTime = `${String(now.getHours()).padStart(2, '0')}.${String(now.getMinutes()).padStart(2, '0')}`;
    
    // Behandla '09.00' som ogiltig/default-tid
    if (!dayStartTime || dayStartTime === '09.00') {
      // Ingen dayStartTime finns eller det är default-värdet, använd nuvarande klockslag
      startTime = currentTime;
      newStartTime = startTime;
    } else {
      // Kolla om schemat är aktivt (nuvarande tid >= dayStartTime)
      const [nowH, nowM] = currentTime.split('.').map(Number);
      const [startH, startM] = dayStartTime.split('.').map(Number);
      const nowMinutes = nowH * 60 + nowM;
      const startMinutes = startH * 60 + startM;
      
      if (nowMinutes >= startMinutes) {
        // Schemat är aktivt, använd nuvarande klockslag
        startTime = currentTime;
        newStartTime = startTime;
      } else {
        // Schemat är inte aktivt än, behåll dayStartTime
        startTime = dayStartTime;
      }
    }
    
    // Första tasken får startTime
    let taskIdx = updatedTasks.findIndex(t => t.id === todayTasks[0].id);
    updatedTasks[taskIdx] = { ...updatedTasks[taskIdx], time: startTime };
    
    // Resten räknas från föregående task
    for (let i = 1; i < todayTasks.length; i++) {
      // Hämta föregående task från updatedTasks (inte todayTasks) för att få uppdaterad tid
      const prevTaskId = todayTasks[i - 1].id;
      const prevTaskIdx = updatedTasks.findIndex(t => t.id === prevTaskId);
      const prevTaskData = updatedTasks[prevTaskIdx];
      
      const [h, m] = prevTaskData.time.split('.').map(Number);
      const totalMin = h * 60 + m + prevTaskData.duration;
      const newTime = `${String(Math.floor(totalMin / 60)).padStart(2, '0')}.${String(totalMin % 60).padStart(2, '0')}`;
      
      taskIdx = updatedTasks.findIndex(t => t.id === todayTasks[i].id);
      updatedTasks[taskIdx] = { ...updatedTasks[taskIdx], time: newTime };
    }
  }

  return { updatedTasks, newStartTime };
};

export const moveTaskDown = (
  tasks: Task[],
  taskId: number,
  dayStartTime: string
): { updatedTasks: Task[], newStartTime: string } => {
  const taskIndex = tasks.findIndex(t => t.id === taskId);
  if (taskIndex === -1) return { updatedTasks: tasks, newStartTime: dayStartTime };

  const task = tasks[taskIndex];
  const sectionTasks = tasks.filter(t => t.section === task.section && !t.completed);
  const sectionIndex = sectionTasks.findIndex(t => t.id === taskId);
  
  if (sectionIndex >= sectionTasks.length - 1) return { updatedTasks: tasks, newStartTime: dayStartTime };

  // Hitta den task vi ska byta plats med
  const nextTask = sectionTasks[sectionIndex + 1];
  const nextTaskIndex = tasks.findIndex(t => t.id === nextTask.id);

  // Byt plats på de två tasks i arrayen
  let updatedTasks = [...tasks];
  [updatedTasks[taskIndex], updatedTasks[nextTaskIndex]] = [updatedTasks[nextTaskIndex], updatedTasks[taskIndex]];

  let newStartTime = dayStartTime;

  // Om det är i "today"-sektionen, räkna om alla tider
  if (task.section === 'today') {
    const todayTasks = updatedTasks.filter(t => t.section === 'today' && !t.completed);
    
    // Bestäm starttid baserat på om schemat är aktivt
    let startTime = dayStartTime;
    const now = new Date();
    const currentTime = `${String(now.getHours()).padStart(2, '0')}.${String(now.getMinutes()).padStart(2, '0')}`;
    
    // Behandla '09.00' som ogiltig/default-tid
    if (!dayStartTime || dayStartTime === '09.00') {
      // Ingen dayStartTime finns eller det är default-värdet, använd nuvarande klockslag
      startTime = currentTime;
      newStartTime = startTime;
    } else {
      // Kolla om schemat är aktivt (nuvarande tid >= dayStartTime)
      const [nowH, nowM] = currentTime.split('.').map(Number);
      const [startH, startM] = dayStartTime.split('.').map(Number);
      const nowMinutes = nowH * 60 + nowM;
      const startMinutes = startH * 60 + startM;
      
      if (nowMinutes >= startMinutes) {
        // Schemat är aktivt, använd nuvarande klockslag
        startTime = currentTime;
        newStartTime = startTime;
      } else {
        // Schemat är inte aktivt än, behåll dayStartTime
        startTime = dayStartTime;
      }
    }
    
    // Första tasken får startTime
    let taskIdx = updatedTasks.findIndex(t => t.id === todayTasks[0].id);
    updatedTasks[taskIdx] = { ...updatedTasks[taskIdx], time: startTime };
    
    // Resten räknas från föregående task
    for (let i = 1; i < todayTasks.length; i++) {
      // Hämta föregående task från updatedTasks (inte todayTasks) för att få uppdaterad tid
      const prevTaskId = todayTasks[i - 1].id;
      const prevTaskIdx = updatedTasks.findIndex(t => t.id === prevTaskId);
      const prevTaskData = updatedTasks[prevTaskIdx];
      
      const [h, m] = prevTaskData.time.split('.').map(Number);
      const totalMin = h * 60 + m + prevTaskData.duration;
      const newTime = `${String(Math.floor(totalMin / 60)).padStart(2, '0')}.${String(totalMin % 60).padStart(2, '0')}`;
      
      taskIdx = updatedTasks.findIndex(t => t.id === todayTasks[i].id);
      updatedTasks[taskIdx] = { ...updatedTasks[taskIdx], time: newTime };
    }
  }

  return { updatedTasks, newStartTime };
};
