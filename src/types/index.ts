export interface Vazamento {
  id: string;
  endereco: string;
  descricao: string;
  imagem?: string; // base64 encoded image
  bairro: string;
  latitude: number;
  longitude: number;
  dataRegistro: Date;
  status: 'aberto' | 'em_andamento' | 'resolvido';
}

export interface FiltroVazamentos {
  bairro?: string;
  dataInicio?: Date;
  dataFim?: Date;
  status?: Vazamento['status'];
}

export interface EstatisticasBairro {
  bairro: string;
  quantidade: number;
}

export interface EstatisticasDiarias {
  data: string;
  quantidade: number;
}

export interface DadosGrafico {
  estatisticasBairro: EstatisticasBairro[];
  estatisticasDiarias: EstatisticasDiarias[];
  totalVazamentos: number;
}
