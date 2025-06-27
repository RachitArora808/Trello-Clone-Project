import React, { useState } from 'react';
import { useData } from '../contexts/DataContext';
import { Plus, Calendar, User, Tag } from 'lucide-react';
import TaskModal from './TaskModal';

const TaskBoardTab: React.FC = () => {
  const { tasks, projects, users, updateTask } = useData();
  const [isTaskModalOpen, setIsTaskModalOpen] = useState(false);
  const [editingTask, setEditingTask] = useState<string | null>(null);
  const [selectedProject, setSelectedProject] = useState<string>('');

  const columns = [
    { id: 'backlog', title: 'Backlog', color: 'bg-gray-50 border-gray-200' },
    { id: 'discussion', title: 'In Discussion', color: 'bg-yellow-50 border-yellow-200' },
    { id: 'progress', title: 'In Progress', color: 'bg-blue-50 border-blue-200' },
    { id: 'done', title: 'Done', color: 'bg-green-50 border-green-200' }
  ];

  const filteredTasks = selectedProject 
    ? tasks.filter(task => task.projectId === selectedProject)
    : tasks;

  const getTasksByStatus = (status: string) => {
    return filteredTasks.filter(task => task.status === status);
  };

  const getProjectName = (projectId: string) => {
    const project = projects.find(p => p.id === projectId);
    return project?.name || 'Unknown Project';
  };

  const getUserName = (userId: string) => {
    const user = users.find(u => u.id === userId);
    return user?.name || 'Unassigned';
  };

  const handleDragStart = (e: React.DragEvent, taskId: string) => {
    e.dataTransfer.setData('text/plain', taskId);
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
  };

  const handleDrop = (e: React.DragEvent, status: string) => {
    e.preventDefault();
    const taskId = e.dataTransfer.getData('text/plain');
    updateTask(taskId, { status: status as any });
  };

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <div className="flex items-center gap-4">
          <h3 className="text-xl font-semibold text-gray-900">Task Board</h3>
          <select
            value={selectedProject}
            onChange={(e) => setSelectedProject(e.target.value)}
            className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 text-sm"
          >
            <option value="">All Projects</option>
            {projects.map((project) => (
              <option key={project.id} value={project.id}>
                {project.name}
              </option>
            ))}
          </select>
        </div>
        <button
          onClick={() => setIsTaskModalOpen(true)}
          className="flex items-center gap-2 bg-gradient-to-r from-indigo-600 to-purple-600 text-white px-4 py-2 rounded-lg font-medium hover:from-indigo-700 hover:to-purple-700 transition-all duration-200 shadow-lg hover:shadow-xl"
        >
          <Plus className="w-5 h-5" />
          New Task
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {columns.map((column) => {
          const columnTasks = getTasksByStatus(column.id);
          
          return (
            <div key={column.id} className="flex flex-col">
              <div className={`rounded-lg p-4 border-2 border-dashed ${column.color} mb-4`}>
                <h4 className="font-semibold text-gray-900 mb-1">{column.title}</h4>
                <p className="text-sm text-gray-600">{columnTasks.length} tasks</p>
              </div>

              <div
                className="flex-1 space-y-3 min-h-[400px]"
                onDragOver={handleDragOver}
                onDrop={(e) => handleDrop(e, column.id)}
              >
                {columnTasks.map((task) => (
                  <div
                    key={task.id}
                    draggable
                    onDragStart={(e) => handleDragStart(e, task.id)}
                    onClick={() => {
                      setEditingTask(task.id);
                      setIsTaskModalOpen(true);
                    }}
                    className="bg-white rounded-lg shadow-sm border border-gray-200 p-4 cursor-move hover:shadow-md transition-shadow duration-200 group"
                  >
                    <h5 className="font-medium text-gray-900 mb-2 group-hover:text-indigo-600 transition-colors">
                      {task.name}
                    </h5>
                    
                    <p className="text-sm text-gray-600 mb-3 line-clamp-2">
                      {task.description}
                    </p>

                    <div className="text-xs text-gray-500 space-y-2">
                      <div className="flex items-center gap-1">
                        <span className="font-medium">Project:</span>
                        <span className="truncate">{getProjectName(task.projectId)}</span>
                      </div>
                      
                      <div className="flex items-center gap-1">
                        <User className="w-3 h-3" />
                        <span className="truncate">{getUserName(task.assignedUserId)}</span>
                      </div>
                      
                      {task.dueDate && (
                        <div className="flex items-center gap-1">
                          <Calendar className="w-3 h-3" />
                          <span>{new Date(task.dueDate).toLocaleDateString()}</span>
                        </div>
                      )}
                      
                      {task.tags.length > 0 && (
                        <div className="flex items-center gap-1">
                          <Tag className="w-3 h-3" />
                          <div className="flex flex-wrap gap-1">
                            {task.tags.slice(0, 2).map((tag, index) => (
                              <span key={index} className="bg-gray-100 text-gray-700 px-2 py-0.5 rounded text-xs">
                                {tag}
                              </span>
                            ))}
                            {task.tags.length > 2 && (
                              <span className="text-gray-400 text-xs">+{task.tags.length - 2}</span>
                            )}
                          </div>
                        </div>
                      )}
                    </div>
                  </div>
                ))}

                {columnTasks.length === 0 && (
                  <div className="text-center py-8 text-gray-400">
                    <p className="text-sm">No tasks in {column.title.toLowerCase()}</p>
                  </div>
                )}
              </div>
            </div>
          );
        })}
      </div>

      {isTaskModalOpen && (
        <TaskModal
          projectId={selectedProject || projects[0]?.id || ''}
          taskId={editingTask}
          onClose={() => {
            setIsTaskModalOpen(false);
            setEditingTask(null);
          }}
        />
      )}
    </div>
  );
};

export default TaskBoardTab;