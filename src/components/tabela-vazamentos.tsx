'use client';

import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { MapPin, Calendar, FileText, Image as ImageIcon, Eye, ChevronDown, ChevronUp } from 'lucide-react';
import { Vazamento } from '@/types';

interface TabelaVazamentosProps {
  vazamentos: Vazamento[];
  onVazamentoClick?: (vazamento: Vazamento) => void;
}

export default function TabelaVazamentos({ vazamentos, onVazamentoClick }: TabelaVazamentosProps) {
  const [expandedCard, setExpandedCard] = useState<string | null>(null);
  const [visualizacao, setVisualizacao] = useState<'cards' | 'tabela'>('cards');

  const toggleExpansion = (id: string) => {
    setExpandedCard(expandedCard === id ? null : id);
  };

  const getStatusColor = (status: Vazamento['status']) => {
    switch (status) {
      case 'aberto':
        return 'bg-red-100 text-red-800 border-red-200';
      case 'em_andamento':
        return 'bg-yellow-100 text-yellow-800 border-yellow-200';
      case 'resolvido':
        return 'bg-green-100 text-green-800 border-green-200';
      default:
        return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  const getStatusText = (status: Vazamento['status']) => {
    switch (status) {
      case 'aberto':
        return 'Aberto';
      case 'em_andamento':
        return 'Em Andamento';
      case 'resolvido':
        return 'Resolvido';
      default:
        return 'Desconhecido';
    }
  };

  // Agrupar vazamentos por bairro
  const vazamentosPorBairro = vazamentos.reduce((acc, vazamento) => {
    if (!acc[vazamento.bairro]) {
      acc[vazamento.bairro] = [];
    }
    acc[vazamento.bairro].push(vazamento);
    return acc;
  }, {} as Record<string, Vazamento[]>);

  const VazamentoCard = ({ vazamento }: { vazamento: Vazamento }) => {
    const isExpanded = expandedCard === vazamento.id;

    return (
      <Card className="backdrop-blur-sm bg-white/90 border-gray-200/50 shadow-md hover:shadow-lg transition-all duration-200">
        <CardContent className="p-4">
          <div className="flex items-start justify-between">
            <div className="flex-1 space-y-2">
              {/* Header */}
              <div className="flex items-start justify-between">
                <div className="flex items-center gap-2">
                  <MapPin className="h-4 w-4 text-blue-600 flex-shrink-0 mt-0.5" />
                  <h3 className="font-semibold text-gray-900 text-sm">{vazamento.endereco}</h3>
                </div>
                <span className={`px-2 py-1 rounded-full text-xs font-medium border ${getStatusColor(vazamento.status)}`}>
                  {getStatusText(vazamento.status)}
                </span>
              </div>

              {/* Data */}
              <div className="flex items-center gap-2 text-sm text-gray-600">
                <Calendar className="h-4 w-4" />
                <span>{vazamento.dataRegistro.toLocaleDateString('pt-BR')}</span>
                <span className="text-gray-400">•</span>
                <span className="font-medium">{vazamento.bairro}</span>
              </div>

              {/* Descrição resumida */}
              <div className="flex items-start gap-2">
                <FileText className="h-4 w-4 text-gray-500 flex-shrink-0 mt-0.5" />
                <p className="text-sm text-gray-700 line-clamp-2">
                  {isExpanded ? vazamento.descricao :
                   vazamento.descricao.length > 100 ?
                   `${vazamento.descricao.substring(0, 100)}...` :
                   vazamento.descricao}
                </p>
              </div>

              {/* Imagem expandida */}
              {isExpanded && vazamento.imagem && (
                <div className="mt-3">
                  <div className="flex items-center gap-2 mb-2">
                    <ImageIcon className="h-4 w-4 text-gray-500" />
                    <span className="text-sm font-medium text-gray-700">Foto do vazamento:</span>
                  </div>
                  <img
                    src={vazamento.imagem}
                    alt="Foto do vazamento"
                    className="w-full max-w-md h-48 object-cover rounded-lg border border-gray-200 shadow-sm"
                  />
                </div>
              )}
            </div>

            {/* Miniatura da imagem (quando não expandido) */}
            {!isExpanded && vazamento.imagem && (
              <div className="ml-3 flex-shrink-0">
                <div className="w-16 h-16 rounded-lg overflow-hidden border border-gray-200 shadow-sm">
                  <img
                    src={vazamento.imagem}
                    alt="Miniatura do vazamento"
                    className="w-full h-full object-cover"
                  />
                </div>
              </div>
            )}
          </div>

          {/* Botões de ação */}
          <div className="flex justify-between items-center mt-4 pt-3 border-t border-gray-100">
            <Button
              variant="ghost"
              size="sm"
              onClick={() => toggleExpansion(vazamento.id)}
              className="text-blue-600 hover:text-blue-700 hover:bg-blue-50"
            >
              {isExpanded ? (
                <>
                  <ChevronUp className="h-4 w-4 mr-1" />
                  Menos detalhes
                </>
              ) : (
                <>
                  <ChevronDown className="h-4 w-4 mr-1" />
                  Mais detalhes
                </>
              )}
            </Button>

            <Button
              variant="outline"
              size="sm"
              onClick={() => onVazamentoClick?.(vazamento)}
              className="text-gray-600 hover:text-gray-700 border-gray-300 hover:bg-gray-50"
            >
              <Eye className="h-4 w-4 mr-1" />
              Ver no mapa
            </Button>
          </div>
        </CardContent>
      </Card>
    );
  };

  return (
    <Card className="backdrop-blur-sm bg-white/95 border-white/20 shadow-xl">
      <CardHeader>
        <div className="flex justify-between items-center">
          <CardTitle className="text-lg font-semibold text-gray-800">
            Lista de Vazamentos ({vazamentos.length})
          </CardTitle>

          <Tabs value={visualizacao} onValueChange={(v) => setVisualizacao(v as any)}>
            <TabsList className="grid w-full grid-cols-2 max-w-[200px]">
              <TabsTrigger value="cards" className="text-xs">Cards</TabsTrigger>
              <TabsTrigger value="tabela" className="text-xs">Por Bairro</TabsTrigger>
            </TabsList>
          </Tabs>
        </div>
      </CardHeader>

      <CardContent>
        <Tabs value={visualizacao} onValueChange={(v) => setVisualizacao(v as any)}>
          <TabsContent value="cards" className="space-y-4 mt-0">
            {vazamentos.length === 0 ? (
              <div className="text-center py-8 text-gray-500">
                <MapPin className="h-12 w-12 mx-auto mb-3 text-gray-300" />
                <p className="text-lg font-medium">Nenhum vazamento encontrado</p>
                <p className="text-sm">Tente ajustar os filtros ou adicionar um novo vazamento.</p>
              </div>
            ) : (
              <div className="space-y-4">
                {vazamentos
                  .sort((a, b) => b.dataRegistro.getTime() - a.dataRegistro.getTime())
                  .map((vazamento) => (
                    <VazamentoCard key={vazamento.id} vazamento={vazamento} />
                  ))}
              </div>
            )}
          </TabsContent>

          <TabsContent value="tabela" className="mt-0">
            {Object.keys(vazamentosPorBairro).length === 0 ? (
              <div className="text-center py-8 text-gray-500">
                <MapPin className="h-12 w-12 mx-auto mb-3 text-gray-300" />
                <p className="text-lg font-medium">Nenhum vazamento encontrado</p>
                <p className="text-sm">Tente ajustar os filtros ou adicionar um novo vazamento.</p>
              </div>
            ) : (
              <div className="space-y-6">
                {Object.entries(vazamentosPorBairro)
                  .sort(([, a], [, b]) => b.length - a.length)
                  .map(([bairro, vazamentosDoBairro]) => (
                    <div key={bairro}>
                      <div className="flex items-center gap-3 mb-4">
                        <h3 className="text-lg font-semibold text-gray-800">{bairro}</h3>
                        <span className="bg-blue-100 text-blue-800 px-2 py-1 rounded-full text-sm font-medium">
                          {vazamentosDoBairro.length} vazamento{vazamentosDoBairro.length !== 1 ? 's' : ''}
                        </span>
                      </div>

                      <div className="space-y-3 pl-4 border-l-2 border-blue-200">
                        {vazamentosDoBairro
                          .sort((a, b) => b.dataRegistro.getTime() - a.dataRegistro.getTime())
                          .map((vazamento) => (
                            <VazamentoCard key={vazamento.id} vazamento={vazamento} />
                          ))}
                      </div>
                    </div>
                  ))}
              </div>
            )}
          </TabsContent>
        </Tabs>
      </CardContent>
    </Card>
  );
}
