import React, { useState } from 'react';
import { Settings, Tag, Building } from 'lucide-react';
import CategoriasTab from './CategoriasTab';
import MarcasTab from './MarcasTab';

type TabType = 'categorias' | 'marcas';

interface Tab {
  id: TabType;
  label: string;
  icon: React.ElementType;
  component: React.ReactNode;
}

const ConfiguracoesPage: React.FC = () => {
  const [activeTab, setActiveTab] = useState<TabType>('categorias');

  const tabs: Tab[] = [
    {
      id: 'categorias',
      label: 'Categorias',
      icon: Tag,
      component: <CategoriasTab />,
    },
    {
      id: 'marcas',
      label: 'Marcas',
      icon: Building,
      component: <MarcasTab />,
    },
  ];

  const activeTabData = tabs.find((tab) => tab.id === activeTab);

  return (
    <div className="p-6">
      {/* Header */}
      <div className="mb-6">
        <div className="flex items-center gap-3 mb-2">
          <Settings className="w-8 h-8 text-blue-600" />
          <h1 className="text-3xl font-bold">Configurações</h1>
        </div>
        <p className="text-gray-600 dark:text-gray-400">
          Gerencie as configurações do sistema
        </p>
      </div>

      {/* Tabs */}
      <div className="bg-white dark:bg-darkBlue rounded-lg shadow">
        {/* Tab Headers */}
        <div className="border-b border-gray-200 dark:border-gray-700">
          <div className="flex overflow-x-auto">
            {tabs.map((tab) => {
              const Icon = tab.icon;
              const isActive = activeTab === tab.id;

              return (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`flex items-center gap-2 px-6 py-4 font-medium whitespace-nowrap transition-colors ${
                    isActive
                      ? 'text-blue-600 border-b-2 border-blue-600'
                      : 'text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-gray-200'
                  }`}
                >
                  <Icon className="w-5 h-5" />
                  {tab.label}
                </button>
              );
            })}
          </div>
        </div>

        {/* Tab Content */}
        <div className="p-6">{activeTabData?.component}</div>
      </div>
    </div>
  );
};

export default ConfiguracoesPage;
