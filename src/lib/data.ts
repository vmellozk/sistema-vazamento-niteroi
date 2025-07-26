import { Vazamento, FiltroVazamentos, DadosGrafico } from '@/types';
import { format, subDays, isAfter, isBefore } from 'date-fns';

const STORAGE_KEY = 'niteroi-vazamentos';

// Bairros principais de Niterói com coordenadas aproximadas
export const BAIRROS_NITEROI = {
  'Icaraí': { lat: -22.9042, lng: -43.1242 },
  'Fonseca': { lat: -22.8803, lng: -43.0977 },
  'São Francisco': { lat: -22.8958, lng: -43.1342 },
  'Centro': { lat: -22.8833, lng: -43.1036 },
  'Santa Rosa': { lat: -22.9147, lng: -43.1208 },
  'Ingá': { lat: -22.8981, lng: -43.1131 },
  'Charitas': { lat: -22.9225, lng: -43.1364 },
  'Jurujuba': { lat: -22.9358, lng: -43.1486 },
  'Piratininga': { lat: -22.9561, lng: -43.0814 },
  'Itaipu': { lat: -22.9669, lng: -43.0539 }
};

// Dados simulados iniciais
const VAZAMENTOS_INICIAIS: Vazamento[] = [
  {
    id: '1',
    endereco: 'Rua Visconde de Sepetiba, 123 - Icaraí',
    descricao: 'Vazamento grande no meio da rua, causando alagamento',
    bairro: 'Icaraí',
    latitude: -22.9042,
    longitude: -43.1242,
    dataRegistro: subDays(new Date(), 2),
    status: 'aberto'
  },
  {
    id: '2',
    endereco: 'Avenida Roberto Silveira, 456 - Centro',
    descricao: 'Vazamento na calçada próximo ao ponto de ônibus',
    bairro: 'Centro',
    latitude: -22.8833,
    longitude: -43.1036,
    dataRegistro: subDays(new Date(), 1),
    status: 'em_andamento'
  },
  {
    id: '3',
    endereco: 'Rua Coronel Moreira César, 789 - São Francisco',
    descricao: 'Vazamento pequeno mas constante na esquina',
    bairro: 'São Francisco',
    latitude: -22.9100423,
    longitude: -43.1074590,
    dataRegistro: subDays(new Date(), 3),
    status: 'aberto'
  },
  {
    id: '4',
    endereco: 'Praia de Charitas, 321 - Charitas',
    descricao: 'Vazamento próximo à praia, água correndo para o mar',
    bairro: 'Charitas',
    latitude: -22.930260,
    longitude: -43.096855,
    dataRegistro: subDays(new Date(), 5),
    status: 'resolvido'
  },
  {
    id: '5',
    endereco: 'Estrada Leopoldo Fróes, 654 - Piratininga',
    descricao: 'Vazamento intenso causando erosão na via',
    bairro: 'Piratininga',
    latitude: -22.9538,
    longitude: -43.0795,
    dataRegistro: subDays(new Date(), 7),
    status: 'aberto'
  }
];

// Função para obter vazamentos do localStorage
export function getVazamentos(): Vazamento[] {
  if (typeof window === 'undefined') return VAZAMENTOS_INICIAIS;

  const stored = localStorage.getItem(STORAGE_KEY);
  if (!stored) {
    // Se não há dados armazenados, salva os dados iniciais
    saveVazamentos(VAZAMENTOS_INICIAIS);
    return VAZAMENTOS_INICIAIS;
  }

  try {
    const parsed = JSON.parse(stored);
    return parsed.map((v: any) => ({
      ...v,
      dataRegistro: new Date(v.dataRegistro)
    }));
  } catch {
    return VAZAMENTOS_INICIAIS;
  }
}

// Função para salvar vazamentos no localStorage
export function saveVazamentos(vazamentos: Vazamento[]): void {
  if (typeof window === 'undefined') return;
  localStorage.setItem(STORAGE_KEY, JSON.stringify(vazamentos));
}

// Função para adicionar um novo vazamento
export function addVazamento(vazamento: Omit<Vazamento, 'id' | 'dataRegistro'>): Vazamento {
  const novoVazamento: Vazamento = {
    ...vazamento,
    id: Math.random().toString(36).substr(2, 9),
    dataRegistro: new Date(),
    status: 'aberto'
  };

  const vazamentos = getVazamentos();
  vazamentos.push(novoVazamento);
  saveVazamentos(vazamentos);

  return novoVazamento;
}

// Função para filtrar vazamentos
export function filtrarVazamentos(vazamentos: Vazamento[], filtro: FiltroVazamentos): Vazamento[] {
  return vazamentos.filter(vazamento => {
    if (filtro.bairro && vazamento.bairro !== filtro.bairro) return false;
    if (filtro.status && vazamento.status !== filtro.status) return false;
    if (filtro.dataInicio && isBefore(vazamento.dataRegistro, filtro.dataInicio)) return false;
    if (filtro.dataFim && isAfter(vazamento.dataRegistro, filtro.dataFim)) return false;
    return true;
  });
}

// Função para gerar dados dos gráficos
export function gerarDadosGraficos(vazamentos: Vazamento[]): DadosGrafico {
  // Estatísticas por bairro
  const estatisticasBairro = Object.keys(BAIRROS_NITEROI).map(bairro => ({
    bairro,
    quantidade: vazamentos.filter(v => v.bairro === bairro).length
  })).filter(item => item.quantidade > 0);

  // Estatísticas diárias (últimos 30 dias)
  const estatisticasDiarias: { [key: string]: number } = {};

  for (let i = 29; i >= 0; i--) {
    const data = subDays(new Date(), i);
    const dataStr = format(data, 'dd/MM');
    estatisticasDiarias[dataStr] = 0;
  }

  vazamentos.forEach(vazamento => {
    const dataStr = format(vazamento.dataRegistro, 'dd/MM');
    if (estatisticasDiarias[dataStr] !== undefined) {
      estatisticasDiarias[dataStr]++;
    }
  });

  const estatisticasDiariasArray = Object.entries(estatisticasDiarias).map(([data, quantidade]) => ({
    data,
    quantidade
  }));

  return {
    estatisticasBairro,
    estatisticasDiarias: estatisticasDiariasArray,
    totalVazamentos: vazamentos.length
  };
}

// Função para obter coordenadas de um bairro
export function getCoordenadaBairro(bairro: string): { lat: number; lng: number } | null {
  return BAIRROS_NITEROI[bairro as keyof typeof BAIRROS_NITEROI] || null;
}
