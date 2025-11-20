// ==================== AUTH ====================
export interface User {
  id: number;
  nome: string;
  email: string;
  login: string;
  perfil: 'admin' | 'gerente' | 'tecnico' | 'atendente';
  imagem?: string;
  ativo: string;
}

export interface LoginCredentials {
  login: string;
  senha: string;
}

export interface LoginResponse {
  access_token: string;
  refresh_token: string;
  token_type: string;
  usuario: User;
}

// ==================== API RESPONSE ====================
export interface ApiResponse<T> {
  success: boolean;
  data: T;
  message?: string;
}

export interface PaginatedResponse<T> {
  items: T[];
  total: number;
  page: number;
  size: number;
  pages: number;
}

// ==================== DASHBOARD ====================
export interface DashboardMetrics {
  ordens_andamento: number;
  clientes_atrasados: number;
  calibracoes_atrasadas: number;
  calibracoes_proximas: number;
  ordens_finalizadas_30dias: number;
  calibracoes_nao_fazer: number;
  clientes_perdidos: number;
}

// ==================== EMPRESA ====================
export interface Empresa {
  id: number;
  tipo_pessoa: 'PJ' | 'PF' | 'J' | 'F'; // Backend pode retornar J/F
  cnpj_cpf?: string; // Campo unificado (pode vir null do backend)
  cpf?: string; // Backend retorna CPF separado para PF
  cnpj?: string; // Backend retorna CNPJ separado para PJ
  razao_social: string;
  nome_fantasia?: string;
  inscricao_estadual?: string;
  inscricao_municipal?: string;
  cep: string;
  logradouro: string;
  numero: string;
  complemento?: string;
  bairro: string;
  cidade: string;
  estado: string;
  telefone: string;
  celular?: string;
  whatsapp?: string;
  email: string;
  observacoes?: string;
  logo?: string;
  imagem?: string;
  ativo: string;
  status_contato: 'ativo' | 'inativo' | 'perdido';
  // Campos de data (backend retorna estes nomes)
  data_criacao?: string;
  data_atualizacao?: string;
  data_cadastro?: string;
  data_ultima_visita?: string;
  // Campos antigos (manter para compatibilidade)
  created_at?: string;
  updated_at?: string;
}

export interface EmpresaFormData {
  tipo_pessoa: 'PJ' | 'PF';
  cnpj_cpf: string;
  razao_social: string;
  nome_fantasia?: string;
  inscricao_estadual?: string;
  inscricao_municipal?: string;
  cep: string;
  logradouro: string;
  numero: string;
  complemento?: string;
  bairro: string;
  cidade: string;
  estado: string;
  telefone: string;
  celular?: string;
  whatsapp?: string;
  email: string;
  observacoes?: string;
  ativo?: string;
  status_contato?: 'ativo' | 'inativo' | 'perdido';
}

// ==================== EQUIPAMENTO ====================
export interface Categoria {
  id: number;
  nome: string;
  descricao?: string;
  ativo: string;
}

export interface Marca {
  id: number;
  nome: string;
  descricao?: string;
  ativo: string;
}

export interface Equipamento {
  id: number;
  categoria_id: number;
  marca_id: number;
  codigo: string;
  descricao: string;
  modelo?: string;
  detalhes?: string;
  especificacoes_tecnicas?: string;
  peso_calibracao?: string | number;
  periodo_calibracao_dias: number;
  preco_de?: string | number;
  preco_por?: string | number;
  custo?: string | number;
  peso?: string | number;
  estoque_minimo?: number;
  estoque_maximo?: number;
  estoque_atual?: number;
  tags?: string;
  palavras_chave?: string;
  descricao_seo?: string;
  imagem?: string;
  video_url?: string;
  visualizacoes?: number;
  ativo: string;
  destaque?: string;
  categoria?: Categoria;
  marca?: Marca;
  data_cadastro?: string;
  data_criacao?: string;
  data_atualizacao?: string;
  // Campos antigos para compatibilidade
  especificacoes?: string;
  preco_venda?: number;
  video?: string;
  created_at?: string;
  updated_at?: string;
}

export interface EquipamentoFormData {
  categoria_id: number;
  marca_id: number;
  codigo: string;
  descricao: string;
  modelo?: string;
  detalhes?: string;
  especificacoes_tecnicas?: string;
  periodo_calibracao_dias: number;
  preco_de?: number;
  preco_por?: number;
  custo?: number;
  peso_calibracao?: number;
  peso?: number;
  estoque_minimo?: number;
  estoque_maximo?: number;
  tags?: string;
  palavras_chave?: string;
  descricao_seo?: string;
  ativo?: string;
  destaque?: string;
}

// ==================== EQUIPAMENTO EMPRESA ====================
export interface EquipamentoEmpresa {
  id: number;
  empresa_id: number;
  equipamento_id: number;
  numero_serie?: string;
  numero_patrimonio?: string;
  data_compra?: string;
  proxima_calibracao?: string;
  observacoes?: string;
  ativo: string;
  equipamento?: Equipamento;
  empresa?: Empresa;
  created_at: string;
  updated_at: string;
}

export interface EquipamentoEmpresaFormData {
  empresa_id: number;
  equipamento_id: number;
  numero_serie?: string;
  numero_patrimonio?: string;
  data_compra?: string;
  proxima_calibracao?: string;
  observacoes?: string;
  ativo?: string;
}

// ==================== ORDEM DE SERVIÇO ====================
export type FaseOS =
  | 'solicitado'
  | 'enviado'
  | 'recebido'
  | 'calibracao'
  | 'calibrado'
  | 'retornando'
  | 'entregue'
  | 'cancelado';

export type SituacaoOS = 'aberta' | 'andamento' | 'concluida' | 'cancelada';

export interface OrdemServico {
  id: number;
  empresa_id: number;
  equipamento_empresa_id: number;
  chave_acesso: string;
  fase: FaseOS;
  fase_id?: number;
  situacao: SituacaoOS;
  data_solicitacao: string;
  data_envio?: string;
  data_recebimento?: string;
  data_inicio_calibracao?: string;
  data_fim_calibracao?: string;
  data_retorno?: string;
  data_entrega?: string;
  data_cancelamento?: string;
  valor?: number;
  observacoes?: string;
  numero_certificado?: string;
  certificado_pdf?: string;
  certificado?: string; // Alias para certificado_pdf
  teste_1?: number;
  teste_2?: number;
  teste_3?: number;
  media?: number;
  situacao_aprovacao?: 'aprovado' | 'reprovado';
  empresa?: Empresa;
  equipamento_empresa?: EquipamentoEmpresa;
  created_at?: string;
  updated_at?: string;
  data_criacao?: string;
  data_atualizacao?: string;
}

export interface OrdemServicoFormData {
  empresa_id: number;
  equipamento_empresa_id: number;
  observacoes?: string;
  valor?: number;
}

export interface FinalizarOSData {
  data_fim_calibracao: string;
  numero_certificado: string;
  teste_1?: number;
  teste_2?: number;
  teste_3?: number;
  media?: number;
  situacao_aprovacao: 'aprovado' | 'reprovado';
  certificado?: string;
}

// ==================== RELATÓRIOS ====================
export interface RelatorioVencimentos {
  empresa: string;
  equipamento: string;
  numero_serie: string;
  ultima_calibracao: string;
  proxima_calibracao: string;
  dias_ate_vencimento: number;
  status: 'vencido' | 'vence_30_dias' | 'ok';
}

export interface RelatorioCalibracoesItem {
  chave_acesso: string;
  empresa: string;
  equipamento: string;
  data_solicitacao: string;
  data_entrega?: string;
  fase: FaseOS;
  situacao: SituacaoOS;
  valor: number;
  numero_certificado?: string;
}

export interface RelatorioCalibracoesData {
  items: RelatorioCalibracoesItem[];
  totais: {
    total_ordens: number;
    concluidas: number;
    em_andamento: number;
    canceladas: number;
    valor_total: number;
  };
}

export interface RelatorioEquipamentosItem {
  categoria: string;
  marca: string;
  descricao: string;
  total_cadastrados: number;
  total_empresas: number;
  preco_medio: number;
}

export interface RelatorioEquipamentosData {
  items: RelatorioEquipamentosItem[];
  totais: {
    total_equipamentos: number;
    total_categorias: number;
    total_marcas: number;
  };
}

export interface RelatorioFinanceiroItem {
  periodo: string;
  total_ordens: number;
  valor_total: number;
  ticket_medio: number;
}

export interface RelatorioFinanceiroData {
  items: RelatorioFinanceiroItem[];
  totais: {
    total_ordens: number;
    valor_total: number;
    ticket_medio: number;
  };
  grafico: {
    labels: string[];
    valores: number[];
  };
}
