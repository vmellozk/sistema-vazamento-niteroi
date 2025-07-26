'use client';

import { useState, useEffect } from 'react';
import { toast } from 'sonner';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import FormVazamento from '@/components/form-vazamento';
import MapaVazamentos from '@/components/mapa-vazamentos';
import GraficosEstatisticas from '@/components/graficos-estatisticas';
import FiltrosVazamentos from '@/components/filtros-vazamentos';
import TabelaVazamentos from '@/components/tabela-vazamentos';
import { Vazamento, FiltroVazamentos } from '@/types';
import {
  getVazamentos,
  addVazamento,
  filtrarVazamentos,
  gerarDadosGraficos
} from '@/lib/data';
import { Droplets, Map, BarChart3, List, Settings } from 'lucide-react';

export default function Home() {
  const [vazamentos, setVazamentos] = useState<Vazamento[]>([]);
  const [vazamentosFiltrados, setVazamentosFiltrados] = useState<Vazamento[]>([]);
  const [filtroAtivo, setFiltroAtivo] = useState<FiltroVazamentos>({});
  const [abaSelecionada, setAbaSelecionada] = useState('mapa');

  // Carregar dados iniciais
  useEffect(() => {
    const dadosIniciais = getVazamentos();
    setVazamentos(dadosIniciais);
    setVazamentosFiltrados(dadosIniciais);
  }, []);

  // Aplicar filtros sempre que vazamentos ou filtro mudarem
  useEffect(() => {
    const filtered = filtrarVazamentos(vazamentos, filtroAtivo);
    setVazamentosFiltrados(filtered);
  }, [vazamentos, filtroAtivo]);

  const handleNovoVazamento = (novoVazamento: Omit<Vazamento, 'id' | 'dataRegistro' | 'status'>) => {
    try {
      // Adiciona status padrão antes de adicionar o vazamento
      const vazamentoComStatus: Omit<Vazamento, 'id' | 'dataRegistro'> = {
        ...novoVazamento,
        status: 'aberto',
      };
      const vazamentoAdicionado = addVazamento(vazamentoComStatus);
      setVazamentos(prev => [...prev, vazamentoAdicionado]);

      toast.success('Vazamento registrado com sucesso!', {
        description: `Denúncia registrada para ${novoVazamento.bairro}`,
        duration: 4000,
      });

      // Mudar para aba do mapa para mostrar o novo ponto
      setAbaSelecionada('mapa');
    } catch (error) {
      console.error('Erro ao registrar vazamento:', error);
      toast.error('Erro ao registrar vazamento', {
        description: 'Tente novamente em alguns instantes.',
        duration: 4000,
      });
    }
  };

  const handleFiltroChange = (novoFiltro: FiltroVazamentos) => {
    setFiltroAtivo(novoFiltro);
  };

  const handleVazamentoClick = (vazamento: Vazamento) => {
    setAbaSelecionada('mapa');
    // O componente do mapa vai destacar automaticamente o vazamento clicado
  };

  // Calcular estatísticas
  const dadosGraficos = gerarDadosGraficos(vazamentosFiltrados);
  const totalAbertos = vazamentosFiltrados.filter(v => v.status === 'aberto').length;
  const totalEmAndamento = vazamentosFiltrados.filter(v => v.status === 'em_andamento').length;
  const totalResolvidos = vazamentosFiltrados.filter(v => v.status === 'resolvido').length;

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50">
      {/* Header */}
      <div className="bg-gradient-to-r from-blue-600 to-indigo-700 text-white shadow-xl">
        <div className="container mx-auto px-4 py-6">
          <div className="flex items-center gap-3">
            <div className="h-12 w-12 bg-white/20 rounded-lg flex items-center justify-center backdrop-blur-sm">
              <Droplets className="h-7 w-7 text-white" />
            </div>
            <div>
              <h1 className="text-3xl font-bold tracking-tight">
                Sistema de Denúncias - Vazamentos de Água
              </h1>
              <p className="text-blue-100 mt-1 text-lg">
                Niterói • Rio de Janeiro
              </p>
            </div>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-4 py-8 space-y-8">
        {/* Formulário de Registro */}
        <FormVazamento onSubmit={handleNovoVazamento} />

        {/* Filtros */}
        <FiltrosVazamentos
          filtroAtivo={filtroAtivo}
          onFiltroChange={handleFiltroChange}
        />

        {/* Conteúdo Principal em Abas */}
        <Tabs value={abaSelecionada} onValueChange={setAbaSelecionada} className="w-full">
          <TabsList className="grid w-full grid-cols-4 bg-white/80 backdrop-blur-sm border border-white/20 shadow-lg">
            <TabsTrigger
              value="mapa"
              className="flex items-center gap-2 data-[state=active]:bg-blue-600 data-[state=active]:text-white"
            >
              <Map className="h-4 w-4" />
              <span className="hidden sm:inline">Mapa Interativo</span>
              <span className="sm:hidden">Mapa</span>
            </TabsTrigger>
            <TabsTrigger
              value="estatisticas"
              className="flex items-center gap-2 data-[state=active]:bg-blue-600 data-[state=active]:text-white"
            >
              <BarChart3 className="h-4 w-4" />
              <span className="hidden sm:inline">Estatísticas</span>
              <span className="sm:hidden">Stats</span>
            </TabsTrigger>
            <TabsTrigger
              value="lista"
              className="flex items-center gap-2 data-[state=active]:bg-blue-600 data-[state=active]:text-white"
            >
              <List className="h-4 w-4" />
              <span className="hidden sm:inline">Lista Completa</span>
              <span className="sm:hidden">Lista</span>
            </TabsTrigger>
          </TabsList>

          <div className="mt-6">
            <TabsContent value="mapa" className="space-y-6">
              <div className="backdrop-blur-sm bg-white/95 border-white/20 shadow-xl rounded-lg p-6">
                <h2 className="text-xl font-semibold text-gray-800 mb-4 flex items-center gap-2">
                  <Map className="h-5 w-5 text-blue-600" />
                  Mapa de Vazamentos em Niterói
                  <span className="text-sm font-normal text-gray-600">
                    ({vazamentosFiltrados.length} vazamento{vazamentosFiltrados.length !== 1 ? 's' : ''})
                  </span>
                </h2>
                <MapaVazamentos
                  vazamentos={vazamentosFiltrados}
                  onVazamentoClick={handleVazamentoClick}
                />
              </div>
            </TabsContent>

            <TabsContent value="estatisticas" className="space-y-6">
              <GraficosEstatisticas
                dados={dadosGraficos}
                totalAbertos={totalAbertos}
                totalEmAndamento={totalEmAndamento}
                totalResolvidos={totalResolvidos}
              />
            </TabsContent>

            <TabsContent value="lista" className="space-y-6">
              <TabelaVazamentos
                vazamentos={vazamentosFiltrados}
                onVazamentoClick={handleVazamentoClick}
              />
            </TabsContent>
          </div>
        </Tabs>

        {/* Footer */}
        <div className="text-center py-8 border-t border-gray-200/50">
          <p className="text-gray-600 text-sm">
            Sistema desenvolvido para demonstração • Participação Cidadã • Saneamento Urbano
          </p>
          <p className="text-gray-500 text-xs mt-1">
            Dados simulados para apresentação acadêmica/técnica
          </p>
        </div>
      </div>
    </div>
  );
}
