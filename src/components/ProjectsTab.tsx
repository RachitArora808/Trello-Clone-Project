import React, { useState } from 'react';
import { useData } from '../contexts/DataContext';
import { Plus, Calendar, FolderOpen, Edit3, Trash2 } from 'lucide-react';
import ProjectModal from './ProjectModal';
import ProjectDetail from './ProjectDetail';

const ProjectsTab: React.FC = () => {
  const { projects, deleteProject } = useData();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingProject, setEditingProject] = useState<string | null>(null);
  const [selectedProject, setSelectedProject] = useState<string | null>(null);

  const handleDelete = (projectId: string) => {
    if (window.confirm('Are you sure you want to delete this project? All associated tasks will also be deleted.')) {
      deleteProject(projectId);
    }
  };

  if (selectedProject) {
    return (
      <ProjectDetail 
        projectId={selectedProject} 
        onBack={() => setSelectedProject(null)} 
      />
    );
  }

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <h3 className="text-xl font-semibold text-gray-900">Your Projects</h3>
        <button
          onClick={() => setIsModalOpen(true)}
          className="flex items-center gap-2 bg-gradient-to-r from-indigo-600 to-purple-600 text-white px-4 py-2 rounded-lg font-medium hover:from-indigo-700 hover:to-purple-700 transition-all duration-200 shadow-lg hover:shadow-xl"
        >
          <Plus className="w-5 h-5" />
          New Project
        </button>
      </div>

      {projects.length === 0 ? (
        <div className="text-center py-12">
          <FolderOpen className="w-16 h-16 text-gray-300 mx-auto mb-4" />
          <h3 className="text-lg font-medium text-gray-900 mb-2">No projects yet</h3>
          <p className="text-gray-500 mb-6">Get started by creating your first project</p>
          <button
            onClick={() => setIsModalOpen(true)}
            className="bg-gradient-to-r from-indigo-600 to-purple-600 text-white px-6 py-3 rounded-lg font-medium hover:from-indigo-700 hover:to-purple-700 transition-all duration-200"
          >
            Create Project
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {projects.map((project) => (
            <div
              key={project.id}
              className="bg-white rounded-xl shadow-sm border border-gray-200 hover:shadow-md transition-shadow duration-200 cursor-pointer group"
            >
              <div 
                className="p-6"
                onClick={() => setSelectedProject(project.id)}
              >
                <div className="flex justify-between items-start mb-4">
                  <h4 className="text-lg font-semibold text-gray-900 group-hover:text-indigo-600 transition-colors">
                    {project.name}
                  </h4>
                  <div className="flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        setEditingProject(project.id);
                        setIsModalOpen(true);
                      }}
                      className="p-2 text-gray-400 hover:text-indigo-600 hover:bg-indigo-50 rounded-lg transition-colors"
                    >
                      <Edit3 className="w-4 h-4" />
                    </button>
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        handleDelete(project.id);
                      }}
                      className="p-2 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>
                
                <p className="text-gray-600 text-sm mb-4 line-clamp-3">
                  {project.description}
                </p>
                
                <div className="flex items-center text-xs text-gray-500">
                  <Calendar className="w-4 h-4 mr-1" />
                  Created {new Date(project.createdAt).toLocaleDateString()}
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {isModalOpen && (
        <ProjectModal
          projectId={editingProject}
          onClose={() => {
            setIsModalOpen(false);
            setEditingProject(null);
          }}
        />
      )}
    </div>
  );
};

export default ProjectsTab;