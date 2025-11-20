/**
 * Formata CPF: 123.456.789-00
 */
export function formatCPF(cpf: string): string {
  if (!cpf) return '';
  const cleaned = cpf.replace(/\D/g, '');
  if (cleaned.length !== 11) return cpf;
  return cleaned.replace(/(\d{3})(\d{3})(\d{3})(\d{2})/, '$1.$2.$3-$4');
}

/**
 * Formata CNPJ: 12.345.678/0001-00
 */
export function formatCNPJ(cnpj: string): string {
  if (!cnpj) return '';
  const cleaned = cnpj.replace(/\D/g, '');
  if (cleaned.length !== 14) return cnpj;
  return cleaned.replace(/(\d{2})(\d{3})(\d{3})(\d{4})(\d{2})/, '$1.$2.$3/$4-$5');
}

/**
 * Formata CPF ou CNPJ automaticamente
 */
export function formatCPFCNPJ(value: string): string {
  if (!value) return '-';
  const cleaned = value.replace(/\D/g, '');
  if (cleaned.length === 11) return formatCPF(cleaned);
  if (cleaned.length === 14) return formatCNPJ(cleaned);
  return value;
}

/**
 * Formata telefone: (11) 98765-4321
 */
export function formatPhone(phone: string): string {
  if (!phone) return '-';
  const cleaned = phone.replace(/\D/g, '');

  if (cleaned.length === 10) {
    return cleaned.replace(/(\d{2})(\d{4})(\d{4})/, '($1) $2-$3');
  }

  if (cleaned.length === 11) {
    return cleaned.replace(/(\d{2})(\d{5})(\d{4})/, '($1) $2-$3');
  }

  return phone;
}

/**
 * Formata CEP: 12345-678
 */
export function formatCEP(cep: string): string {
  if (!cep) return '';
  const cleaned = cep.replace(/\D/g, '');
  if (cleaned.length !== 8) return cep;
  return cleaned.replace(/(\d{5})(\d{3})/, '$1-$2');
}

/**
 * Formata moeda brasileira: R$ 1.234,56
 */
export function formatCurrency(value: number): string {
  return new Intl.NumberFormat('pt-BR', {
    style: 'currency',
    currency: 'BRL',
  }).format(value);
}

/**
 * Formata data: 01/12/2024
 */
export function formatDate(date: string | Date): string {
  const d = new Date(date);
  return d.toLocaleDateString('pt-BR');
}

/**
 * Formata data e hora: 01/12/2024 14:30
 */
export function formatDateTime(date: string | Date): string {
  const d = new Date(date);
  return d.toLocaleString('pt-BR');
}

/**
 * Formata número de série: 1234 -> #0001234
 */
export function formatSerialNumber(num: number): string {
  return `#${num.toString().padStart(7, '0')}`;
}
