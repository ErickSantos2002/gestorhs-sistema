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
  logo?: string;
  ativo: string;
  status_contato: 'ativo' | 'inativo' | 'perdido';
  created_at: string;
  updated_at: string;
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
  especificacoes?: string;
  periodo_calibracao_dias: number;
  preco_venda?: number;
  custo?: number;
  imagem?: string;
  video?: string;
  tags?: string;
  ativo: string;
  categoria?: Categoria;
  marca?: Marca;
  created_at: string;
  updated_at: string;
}

export interface EquipamentoFormData {
  categoria_id: number;
  marca_id: number;
  codigo: string;
  descricao: string;
  modelo?: string;
  especificacoes?: string;
  periodo_calibracao_dias: number;
  preco_venda?: number;
  custo?: number;
  tags?: string;
  ativo?: string;
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
  empresa?: Empresa;
  equipamento_empresa?: EquipamentoEmpresa;
  created_at: string;
  updated_at: string;
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
