'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Filter, RotateCcw, Calendar } from 'lucide-react';
import { BAIRROS_NITEROI } from '@/lib/data';
import { FiltroVazamentos } from '@/types';

interface FiltrosVazamentosProps {
  filtroAtivo: FiltroVazamentos;
  onFiltroChange: (filtro: FiltroVazamentos) => void;
}

export default function FiltrosVazamentos({ filtroAtivo, onFiltroChange }: FiltrosVazamentosProps) {
  const [bairroSelecionado, setBairroSelecionado] = useState(filtroAtivo.bairro || 'todos');
  const [statusSelecionado, setStatusSelecionado] = useState(filtroAtivo.status || 'todos');
  const [dataInicio, setDataInicio] = useState(
    filtroAtivo.dataInicio ? filtroAtivo.dataInicio.toISOString().split('T')[0] : ''
  );
  const [dataFim, setDataFim] = useState(
    filtroAtivo.dataFim ? filtroAtivo.dataFim.toISOString().split('T')[0] : ''
  );

  const aplicarFiltros = () => {
    const novoFiltro: FiltroVazamentos = {
      bairro: bairroSelecionado === 'todos' ? undefined : bairroSelecionado,
      status: statusSelecionado === 'todos' ? undefined : (statusSelecionado as any),
      dataInicio: dataInicio ? new Date(dataInicio) : undefined,
      dataFim: dataFim ? new Date(dataFim) : undefined,
    };
    onFiltroChange(novoFiltro);
  };

  const limparFiltros = () => {
    setBairroSelecionado('todos');
    setStatusSelecionado('todos');
    setDataInicio('');
    setDataFim('');
    onFiltroChange({});
  };

  const temFiltrosAtivos = !!(filtroAtivo.bairro || filtroAtivo.status || filtroAtivo.dataInicio || filtroAtivo.dataFim);

  return (
    <Card className="backdrop-blur-sm bg-white/95 border-white/20 shadow-xl">
      <CardHeader className="pb-4">
        <CardTitle className="flex items-center gap-2 text-lg font-semibold text-gray-800">
          <Filter className="h-5 w-5 text-blue-600" />
          Filtros de Pesquisa
          {temFiltrosAtivos && (
            <span className="ml-2 px-2 py-1 bg-blue-100 text-blue-700 text-xs rounded-full font-medium">
              Filtros ativos
            </span>
          )}
        </CardTitle>
      </CardHeader>

      <CardContent className="space-y-4">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          {/* Filtro por Bairro */}
          <div className="space-y-2">
            <Label htmlFor="filtro-bairro" className="text-sm font-medium text-gray-700">
              Bairro
            </Label>
            <Select value={bairroSelecionado} onValueChange={setBairroSelecionado}>
              <SelectTrigger id="filtro-bairro" className="bg-white/70 border-gray-200 focus:border-blue-400">
                <SelectValue placeholder="Todos os bairros" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="todos">Todos os bairros</SelectItem>
                {Object.keys(BAIRROS_NITEROI).map((bairro) => (
                  <SelectItem key={bairro} value={bairro}>
                    {bairro}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {/* Filtro por Status */}
          <div className="space-y-2">
            <Label htmlFor="filtro-status" className="text-sm font-medium text-gray-700">
              Status
            </Label>
            <Select value={statusSelecionado} onValueChange={setStatusSelecionado}>
              <SelectTrigger id="filtro-status" className="bg-white/70 border-gray-200 focus:border-blue-400">
                <SelectValue placeholder="Todos os status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="todos">Todos os status</SelectItem>
                <SelectItem value="aberto">Aberto</SelectItem>
                <SelectItem value="em_andamento">Em Andamento</SelectItem>
                <SelectItem value="resolvido">Resolvido</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {/* Filtro por Data Início */}
          <div className="space-y-2">
            <Label htmlFor="data-inicio" className="text-sm font-medium text-gray-700 flex items-center gap-1">
              <Calendar className="h-4 w-4" />
              Data Início
            </Label>
            <Input
              id="data-inicio"
              type="date"
              value={dataInicio}
              onChange={(e) => setDataInicio(e.target.value)}
              className="bg-white/70 border-gray-200 focus:border-blue-400"
            />
          </div>

          {/* Filtro por Data Fim */}
          <div className="space-y-2">
            <Label htmlFor="data-fim" className="text-sm font-medium text-gray-700 flex items-center gap-1">
              <Calendar className="h-4 w-4" />
              Data Fim
            </Label>
            <Input
              id="data-fim"
              type="date"
              value={dataFim}
              onChange={(e) => setDataFim(e.target.value)}
              className="bg-white/70 border-gray-200 focus:border-blue-400"
            />
          </div>
        </div>

        {/* Botões de Ação */}
        <div className="flex flex-wrap gap-3 pt-2">
          <Button
            onClick={aplicarFiltros}
            className="bg-blue-600 hover:bg-blue-700 text-white font-medium px-6 py-2 rounded-lg transition-colors duration-200 shadow-md hover:shadow-lg"
          >
            <Filter className="h-4 w-4 mr-2" />
            Aplicar Filtros
          </Button>

          <Button
            onClick={limparFiltros}
            variant="outline"
            className="border-gray-300 text-gray-700 hover:bg-gray-50 font-medium px-6 py-2 rounded-lg transition-colors duration-200"
          >
            <RotateCcw className="h-4 w-4 mr-2" />
            Limpar Filtros
          </Button>

          {temFiltrosAtivos && (
            <div className="flex items-center text-sm text-gray-600 bg-gray-50 px-3 py-2 rounded-lg">
              <span className="font-medium">
                {Object.values(filtroAtivo).filter(Boolean).length} filtro(s) ativo(s)
              </span>
            </div>
          )}
        </div>

        {/* Resumo dos Filtros Ativos */}
        {temFiltrosAtivos && (
          <div className="bg-blue-50 border border-blue-200 rounded-lg p-3 mt-4">
            <p className="text-sm font-medium text-blue-800 mb-2">Filtros ativos:</p>
            <div className="flex flex-wrap gap-2 text-xs">
              {filtroAtivo.bairro && (
                <span className="bg-blue-100 text-blue-700 px-2 py-1 rounded-full">
                  Bairro: {filtroAtivo.bairro}
                </span>
              )}
              {filtroAtivo.status && (
                <span className="bg-blue-100 text-blue-700 px-2 py-1 rounded-full">
                  Status: {filtroAtivo.status === 'aberto' ? 'Aberto' :
                           filtroAtivo.status === 'em_andamento' ? 'Em Andamento' : 'Resolvido'}
                </span>
              )}
              {filtroAtivo.dataInicio && (
                <span className="bg-blue-100 text-blue-700 px-2 py-1 rounded-full">
                  De: {filtroAtivo.dataInicio.toLocaleDateString('pt-BR')}
                </span>
              )}
              {filtroAtivo.dataFim && (
                <span className="bg-blue-100 text-blue-700 px-2 py-1 rounded-full">
                  Até: {filtroAtivo.dataFim.toLocaleDateString('pt-BR')}
                </span>
              )}
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
