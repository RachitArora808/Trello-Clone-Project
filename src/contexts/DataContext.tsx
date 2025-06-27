import React, { createContext, useContext, useEffect, useState } from 'react';
import { useAuth } from './AuthContext';

export interface Project {
  id: string;
  name: string;
  description: string;
  userId: string;
  createdAt: string;
}

export interface Task {
  id: string;
  projectId: string;
  name: string;
  description: string;
  status: 'backlog' | 'discussion' | 'progress' | 'done';
  tags: string[];
  dueDate: string;
  assignedUserId: string;
  createdAt: string;
}

interface DataContextType {
  projects: Project[];
  tasks: Task[];
  users: { id: string; name: string; email: string }[];
  createProject: (project: Omit<Project, 'id' | 'userId' | 'createdAt'>) => void;
  updateProject: (id: string, updates: Partial<Project>) => void;
  deleteProject: (id: string) => void;
  createTask: (task: Omit<Task, 'id' | 'createdAt'>) => void;
  updateTask: (id: string, updates: Partial<Task>) => void;
  deleteTask: (id: string) => void;
  getTasksByProject: (projectId: string) => Task[];
  getProjectById: (id: string) => Project | undefined;
}

const DataContext = createContext<DataContextType | undefined>(undefined);

export const useData = () => {
  const context = useContext(DataContext);
  if (context === undefined) {
    throw new Error('useData must be used within a DataProvider');
  }
  return context;
};

interface DataProviderProps {
  children: React.ReactNode;
}

export const DataProvider: React.FC<DataProviderProps> = ({ children }) => {
  const { currentUser } = useAuth();
  const [projects, setProjects] = useState<Project[]>([]);
  const [tasks, setTasks] = useState<Task[]>([]);
  const [users, setUsers] = useState<{ id: string; name: string; email: string }[]>([]);

  useEffect(() => {
    // Load data from localStorage
    const savedProjects = localStorage.getItem('projects');
    const savedTasks = localStorage.getItem('tasks');
    const savedUsers = localStorage.getItem('users');

    if (savedProjects) {
      setProjects(JSON.parse(savedProjects));
    }
    if (savedTasks) {
      setTasks(JSON.parse(savedTasks));
    }
    if (savedUsers) {
      const allUsers = JSON.parse(savedUsers);
      setUsers(allUsers.map((u: any) => ({ id: u.id, name: u.name, email: u.email })));
    }
  }, []);

  const createProject = (projectData: Omit<Project, 'id' | 'userId' | 'createdAt'>) => {
    if (!currentUser) return;

    const newProject: Project = {
      ...projectData,
      id: Date.now().toString(),
      userId: currentUser.id,
      createdAt: new Date().toISOString()
    };

    const updatedProjects = [...projects, newProject];
    setProjects(updatedProjects);
    localStorage.setItem('projects', JSON.stringify(updatedProjects));
  };

  const updateProject = (id: string, updates: Partial<Project>) => {
    const updatedProjects = projects.map(project =>
      project.id === id ? { ...project, ...updates } : project
    );
    setProjects(updatedProjects);
    localStorage.setItem('projects', JSON.stringify(updatedProjects));
  };

  const deleteProject = (id: string) => {
    const updatedProjects = projects.filter(project => project.id !== id);
    const updatedTasks = tasks.filter(task => task.projectId !== id);
    
    setProjects(updatedProjects);
    setTasks(updatedTasks);
    localStorage.setItem('projects', JSON.stringify(updatedProjects));
    localStorage.setItem('tasks', JSON.stringify(updatedTasks));
  };

  const createTask = (taskData: Omit<Task, 'id' | 'createdAt'>) => {
    const newTask: Task = {
      ...taskData,
      id: Date.now().toString(),
      createdAt: new Date().toISOString()
    };

    const updatedTasks = [...tasks, newTask];
    setTasks(updatedTasks);
    localStorage.setItem('tasks', JSON.stringify(updatedTasks));
  };

  const updateTask = (id: string, updates: Partial<Task>) => {
    const updatedTasks = tasks.map(task =>
      task.id === id ? { ...task, ...updates } : task
    );
    setTasks(updatedTasks);
    localStorage.setItem('tasks', JSON.stringify(updatedTasks));
  };

  const deleteTask = (id: string) => {
    const updatedTasks = tasks.filter(task => task.id !== id);
    setTasks(updatedTasks);
    localStorage.setItem('tasks', JSON.stringify(updatedTasks));
  };

  const getTasksByProject = (projectId: string) => {
    return tasks.filter(task => task.projectId === projectId);
  };

  const getProjectById = (id: string) => {
    return projects.find(project => project.id === id);
  };

  // Filter projects to only show current user's projects
  const userProjects = projects.filter(project => project.userId === currentUser?.id);

  const value = {
    projects: userProjects,
    tasks,
    users,
    createProject,
    updateProject,
    deleteProject,
    createTask,
    updateTask,
    deleteTask,
    getTasksByProject,
    getProjectById
  };

  return (
    <DataContext.Provider value={value}>
      {children}
    </DataContext.Provider>
  );
};