import React, { useState } from 'react';
import { Folder, Kanban } from 'lucide-react';
import ProjectsTab from './ProjectsTab';
import TaskBoardTab from './TaskBoardTab';

const Dashboard: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'projects' | 'taskboard'>('projects');

  const tabs = [
    { id: 'projects', label: 'Projects', icon: Folder },
    { id: 'taskboard', label: 'Task Board', icon: Kanban }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-8">
          <h2 className="text-3xl font-bold text-gray-900 mb-2">Dashboard</h2>
          <p className="text-gray-600">Manage your projects and tasks efficiently</p>
        </div>

        {/* Tab Navigation */}
        <div className="bg-white/80 backdrop-blur-sm rounded-xl shadow-sm border border-white/20 mb-8">
          <div className="border-b border-gray-200">
            <nav className="flex space-x-8 px-6">
              {tabs.map((tab) => {
                const Icon = tab.icon;
                return (
                  <button
                    key={tab.id}
                    onClick={() => setActiveTab(tab.id as 'projects' | 'taskboard')}
                    className={`flex items-center gap-2 py-4 px-1 border-b-2 font-medium text-sm transition-colors ${
                      activeTab === tab.id
                        ? 'border-indigo-500 text-indigo-600'
                        : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                    }`}
                  >
                    <Icon className="w-5 h-5" />
                    {tab.label}
                  </button>
                );
              })}
            </nav>
          </div>

          <div className="p-6">
            {activeTab === 'projects' ? <ProjectsTab /> : <TaskBoardTab />}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;