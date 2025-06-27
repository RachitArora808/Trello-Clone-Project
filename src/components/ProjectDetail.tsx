import React, { useState } from 'react';
import { useData } from '../contexts/DataContext';
import { ArrowLeft, Plus, Calendar, User, Tag, Clock } from 'lucide-react';
import TaskModal from './TaskModal';

interface ProjectDetailProps {
  projectId: string;
  onBack: () => void;
}

const ProjectDetail: React.FC<ProjectDetailProps> = ({ projectId, onBack }) => {
  const { getProjectById, getTasksByProject, users } = useData();
  const [isTaskModalOpen, setIsTaskModalOpen] = useState(false);
  const [editingTask, setEditingTask] = useState<string | null>(null);

  const project = getProjectById(projectId);
  const tasks = getTasksByProject(projectId);

  if (!project) {
    return (
      <div className="text-center py-12">
        <p className="text-gray-500">Project not found</p>
        <button
          onClick={onBack}
          className="mt-4 text-indigo-600 hover:text-indigo-500 font-medium"
        >
          Go back
        </button>
      </div>
    );
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'backlog': return 'bg-gray-100 text-gray-800';
      case 'discussion': return 'bg-yellow-100 text-yellow-800';
      case 'progress': return 'bg-blue-100 text-blue-800';
      case 'done': return 'bg-green-100 text-green-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getStatusLabel = (status: string) => {
    switch (status) {
      case 'backlog': return 'Backlog';
      case 'discussion': return 'In Discussion';
      case 'progress': return 'In Progress';
      case 'done': return 'Done';
      default: return status;
    }
  };

  const getUserName = (userId: string) => {
    const user = users.find(u => u.id === userId);
    return user?.name || 'Unassigned';
  };

  return (
    <div>
      <div className="flex items-center gap-4 mb-6">
        <button
          onClick={onBack}
          className="flex items-center gap-2 text-gray-600 hover:text-gray-900 transition-colors"
        >
          <ArrowLeft className="w-5 h-5" />
          Back to Projects
        </button>
      </div>

      <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 mb-6">
        <h2 className="text-2xl font-bold text-gray-900 mb-2">{project.name}</h2>
        <p className="text-gray-600 mb-4">{project.description}</p>
        <div className="flex items-center text-sm text-gray-500">
          <Calendar className="w-4 h-4 mr-1" />
          Created {new Date(project.createdAt).toLocaleDateString()}
        </div>
      </div>

      <div className="flex justify-between items-center mb-6">
        <h3 className="text-xl font-semibold text-gray-900">
          Tasks ({tasks.length})
        </h3>
        <button
          onClick={() => setIsTaskModalOpen(true)}
          className="flex items-center gap-2 bg-gradient-to-r from-indigo-600 to-purple-600 text-white px-4 py-2 rounded-lg font-medium hover:from-indigo-700 hover:to-purple-700 transition-all duration-200 shadow-lg hover:shadow-xl"
        >
          <Plus className="w-5 h-5" />
          New Task
        </button>
      </div>

      {tasks.length === 0 ? (
        <div className="text-center py-12 bg-white rounded-xl shadow-sm border border-gray-200">
          <Clock className="w-16 h-16 text-gray-300 mx-auto mb-4" />
          <h3 className="text-lg font-medium text-gray-900 mb-2">No tasks yet</h3>
          <p className="text-gray-500 mb-6">Start by creating your first task</p>
          <button
            onClick={() => setIsTaskModalOpen(true)}
            className="bg-gradient-to-r from-indigo-600 to-purple-600 text-white px-6 py-3 rounded-lg font-medium hover:from-indigo-700 hover:to-purple-700 transition-all duration-200"
          >
            Create Task
          </button>
        </div>
      ) : (
        <div className="space-y-4">
          {tasks.map((task) => (
            <div
              key={task.id}
              className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 hover:shadow-md transition-shadow duration-200 cursor-pointer"
              onClick={() => {
                setEditingTask(task.id);
                setIsTaskModalOpen(true);
              }}
            >
              <div className="flex justify-between items-start mb-3">
                <h4 className="text-lg font-semibold text-gray-900">{task.name}</h4>
                <span className={`px-3 py-1 rounded-full text-xs font-medium ${getStatusColor(task.status)}`}>
                  {getStatusLabel(task.status)}
                </span>
              </div>
              
              <p className="text-gray-600 text-sm mb-4">{task.description}</p>
              
              <div className="flex flex-wrap items-center gap-4 text-sm text-gray-500">
                <div className="flex items-center gap-1">
                  <User className="w-4 h-4" />
                  {getUserName(task.assignedUserId)}
                </div>
                
                {task.dueDate && (
                  <div className="flex items-center gap-1">
                    <Calendar className="w-4 h-4" />
                    {new Date(task.dueDate).toLocaleDateString()}
                  </div>
                )}
                
                {task.tags.length > 0 && (
                  <div className="flex items-center gap-1">
                    <Tag className="w-4 h-4" />
                    <div className="flex gap-1">
                      {task.tags.slice(0, 3).map((tag, index) => (
                        <span key={index} className="bg-gray-100 text-gray-700 px-2 py-1 rounded text-xs">
                          {tag}
                        </span>
                      ))}
                      {task.tags.length > 3 && (
                        <span className="text-gray-400 text-xs">+{task.tags.length - 3} more</span>
                      )}
                    </div>
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>
      )}

      {isTaskModalOpen && (
        <TaskModal
          projectId={projectId}
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

export default ProjectDetail;