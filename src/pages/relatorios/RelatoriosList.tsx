import React from 'react';
import { useNavigate } from 'react-router-dom';
import { FileText, BarChart3, Package, DollarSign } from 'lucide-react';

interface RelatorioCardProps {
  icon: React.ReactNode;
  title: string;
  description: string;
  color: 'blue' | 'green' | 'purple' | 'orange';
  onClick: () => void;
}

const RelatorioCard: React.FC<RelatorioCardProps> = ({
  icon,
  title,
  description,
  color,
  onClick,
}) => {
  const colorClasses = {
    blue: 'bg-blue-50 dark:bg-blue-900/20 text-blue-600 dark:text-blue-400 hover:bg-blue-100 dark:hover:bg-blue-900/30',
    green:
      'bg-green-50 dark:bg-green-900/20 text-green-600 dark:text-green-400 hover:bg-green-100 dark:hover:bg-green-900/30',
    purple:
      'bg-purple-50 dark:bg-purple-900/20 text-purple-600 dark:text-purple-400 hover:bg-purple-100 dark:hover:bg-purple-900/30',
    orange:
      'bg-orange-50 dark:bg-orange-900/20 text-orange-600 dark:text-orange-400 hover:bg-orange-100 dark:hover:bg-orange-900/30',
  };

  const iconColorClasses = {
    blue: 'bg-blue-600 dark:bg-blue-500',
    green: 'bg-green-600 dark:bg-green-500',
    purple: 'bg-purple-600 dark:bg-purple-500',
    orange: 'bg-orange-600 dark:bg-orange-500',
  };

  return (
    <button
      onClick={onClick}
      className={`${colorClasses[color]} rounded-lg p-6 transition-all text-left w-full hover:shadow-lg transform hover:-translate-y-1`}
    >
      <div className="flex items-start gap-4">
        <div className={`${iconColorClasses[color]} p-3 rounded-lg text-white`}>{icon}</div>
        <div className="flex-1">
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-1">{title}</h3>
          <p className="text-sm text-gray-600 dark:text-gray-400">{description}</p>
        </div>
      </div>
    </button>
  );
};

const RelatoriosList: React.FC = () => {
  const navigate = useNavigate();

  const relatorios = [
    {
      icon: <FileText className="w-6 h-6" />,
      title: 'Calibrações',
      description: 'Relatório de ordens de serviço por período, cliente ou equipamento',
      color: 'blue' as const,
      path: '/relatorios/calibracoes',
    },
    {
      icon: <Package className="w-6 h-6" />,
      title: 'Equipamentos',
      description: 'Análise de equipamentos cadastrados por categoria e marca',
      color: 'green' as const,
      path: '/relatorios/equipamentos',
    },
    {
      icon: <DollarSign className="w-6 h-6" />,
      title: 'Financeiro',
      description: 'Faturamento e análise financeira com gráficos por período',
      color: 'purple' as const,
      path: '/relatorios/financeiro',
    },
    {
      icon: <BarChart3 className="w-6 h-6" />,
      title: 'Vencimentos',
      description: 'Equipamentos com calibração vencida ou próxima do vencimento',
      color: 'orange' as const,
      path: '/relatorios/vencimentos',
    },
  ];

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-[#0f172a] transition-colors p-6">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">Relatórios</h1>
        <p className="text-gray-600 dark:text-gray-400">
          Visualize e exporte relatórios gerenciais do sistema
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 gap-6 max-w-5xl">
        {relatorios.map((relatorio, index) => (
          <RelatorioCard
            key={index}
            icon={relatorio.icon}
            title={relatorio.title}
            description={relatorio.description}
            color={relatorio.color}
            onClick={() => navigate(relatorio.path)}
          />
        ))}
      </div>
    </div>
  );
};

export default RelatoriosList;
