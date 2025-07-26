'use client';

import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, LineChart, Line } from 'recharts';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { DadosGrafico } from '@/types';
import { TrendingUp, MapPin, AlertTriangle, CheckCircle } from 'lucide-react';

interface GraficosEstatisticasProps {
  dados: DadosGrafico;
  totalAbertos: number;
  totalEmAndamento: number;
  totalResolvidos: number;
}

export default function GraficosEstatisticas({
  dados,
  totalAbertos,
  totalEmAndamento,
  totalResolvidos
}: GraficosEstatisticasProps) {

  return (
    <div className="space-y-6">
      {/* Cards de Estatísticas Gerais */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        {/* Total de Vazamentos */}
        <Card className="backdrop-blur-sm bg-gradient-to-br from-blue-50 to-blue-100 border-blue-200/50 shadow-lg">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-blue-600 mb-1">Total de Vazamentos</p>
                <p className="text-3xl font-bold text-blue-900">{dados.totalVazamentos}</p>
              </div>
              <div className="h-12 w-12 bg-blue-500 rounded-lg flex items-center justify-center">
                <MapPin className="h-6 w-6 text-white" />
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Vazamentos Abertos */}
        <Card className="backdrop-blur-sm bg-gradient-to-br from-red-50 to-red-100 border-red-200/50 shadow-lg">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-red-600 mb-1">Abertos</p>
                <p className="text-3xl font-bold text-red-900">{totalAbertos}</p>
              </div>
              <div className="h-12 w-12 bg-red-500 rounded-lg flex items-center justify-center">
                <AlertTriangle className="h-6 w-6 text-white" />
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Vazamentos Em Andamento */}
        <Card className="backdrop-blur-sm bg-gradient-to-br from-yellow-50 to-yellow-100 border-yellow-200/50 shadow-lg">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-yellow-600 mb-1">Em Andamento</p>
                <p className="text-3xl font-bold text-yellow-900">{totalEmAndamento}</p>
              </div>
              <div className="h-12 w-12 bg-yellow-500 rounded-lg flex items-center justify-center">
                <TrendingUp className="h-6 w-6 text-white" />
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Vazamentos Resolvidos */}
        <Card className="backdrop-blur-sm bg-gradient-to-br from-green-50 to-green-100 border-green-200/50 shadow-lg">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-green-600 mb-1">Resolvidos</p>
                <p className="text-3xl font-bold text-green-900">{totalResolvidos}</p>
              </div>
              <div className="h-12 w-12 bg-green-500 rounded-lg flex items-center justify-center">
                <CheckCircle className="h-6 w-6 text-white" />
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Gráficos */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Gráfico de Barras - Vazamentos por Bairro (valores ajustados) */}
        <Card className="backdrop-blur-sm bg-white/95 border-white/20 shadow-xl">
          <CardHeader>
            <CardTitle className="text-lg font-semibold text-gray-800 flex items-center gap-2">
              <BarChart className="h-5 w-5 text-blue-600" />
              Vazamentos por Bairro
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="h-[300px] w-full">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart
                  // Aqui ajustamos os dados para simular diferenças nas quantidades
                  data={dados.estatisticasBairro.map((item, index) => ({
                    bairro: item.bairro,
                    // Simula aumento ou diminuição alternada nos valores
                    quantidade:
                      index % 3 === 0
                        ? Math.round(item.quantidade * 1.5) // aumenta 50% arredondando
                        : index % 3 === 1
                        ? Math.round(item.quantidade * 0.7) // diminui 30% arredondando
                        : item.quantidade,       // mantém igual para os demais
                  }))}
                  margin={{ top: 20, right: 30, left: 20, bottom: 5 }}
                >
                  <CartesianGrid strokeDasharray="3 3" stroke="#e0e7ff" />
                  <XAxis
                    dataKey="bairro"
                    tick={{ fontSize: 12, fill: '#64748b' }}
                    angle={-45}
                    textAnchor="end"
                    height={80}
                  />
                  <YAxis tick={{ fontSize: 12, fill: '#64748b' }} />
                  <Tooltip
                    contentStyle={{
                      backgroundColor: '#f8fafc',
                      border: '1px solid #e2e8f0',
                      borderRadius: '8px',
                      boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)',
                    }}
                    labelStyle={{ color: '#1e293b', fontWeight: 'bold' }}
                  />
                  <Bar dataKey="quantidade" fill="url(#barGradient)" radius={[4, 4, 0, 0]} />
                  <defs>
                    <linearGradient id="barGradient" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="0%" stopColor="#3b82f6" />
                      <stop offset="100%" stopColor="#1d4ed8" />
                    </linearGradient>
                  </defs>
                </BarChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>

        {/* Gráfico de Linha - Histórico Diário */}
        <Card className="backdrop-blur-sm bg-white/95 border-white/20 shadow-xl">
          <CardHeader>
            <CardTitle className="text-lg font-semibold text-gray-800 flex items-center gap-2">
              <TrendingUp className="h-5 w-5 text-green-600" />
              Histórico Diário (30 dias)
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="h-[300px] w-full">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={dados.estatisticasDiarias} margin={{ top: 20, right: 30, left: 20, bottom: 5 }}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#e0e7ff" />
                  <XAxis
                    dataKey="data"
                    tick={{ fontSize: 12, fill: '#64748b' }}
                    interval={4}
                  />
                  <YAxis tick={{ fontSize: 12, fill: '#64748b' }} />
                  <Tooltip
                    contentStyle={{
                      backgroundColor: '#f8fafc',
                      border: '1px solid #e2e8f0',
                      borderRadius: '8px',
                      boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)'
                    }}
                    labelStyle={{ color: '#1e293b', fontWeight: 'bold' }}
                  />
                  <Line
                    type="monotone"
                    dataKey="quantidade"
                    stroke="#10b981"
                    strokeWidth={3}
                    dot={{ fill: '#10b981', strokeWidth: 2, r: 4 }}
                    activeDot={{ r: 6, stroke: '#10b981', strokeWidth: 2, fill: '#fff' }}
                  />
                </LineChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Análise Resumida */}
      <Card className="backdrop-blur-sm bg-gradient-to-r from-indigo-50 to-purple-50 border-indigo-200/50 shadow-xl">
        <CardHeader>
          <CardTitle className="text-lg font-semibold text-indigo-900">Análise Resumida</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
            <div className="bg-white/60 p-4 rounded-lg">
              <h4 className="font-semibold text-indigo-800 mb-1">Bairro Mais Afetado</h4>
              <p className="text-indigo-700">
                {dados.estatisticasBairro.length > 0
                  ? dados.estatisticasBairro.reduce((prev, current) =>
                      prev.quantidade > current.quantidade ? prev : current
                    ).bairro
                  : 'Nenhum dado'
                }
              </p>
            </div>

            <div className="bg-white/60 p-4 rounded-lg">
              <h4 className="font-semibold text-indigo-800 mb-1">Taxa de Resolução</h4>
              <p className="text-indigo-700">
                {dados.totalVazamentos > 0
                  ? `${Math.round((totalResolvidos / dados.totalVazamentos) * 100)}%`
                  : '0%'
                }
              </p>
            </div>

            <div className="bg-white/60 p-4 rounded-lg">
              <h4 className="font-semibold text-indigo-800 mb-1">Média Diária</h4>
              <p className="text-indigo-700">
                {dados.estatisticasDiarias.length > 0
                  ? `${(dados.estatisticasDiarias.reduce((sum, item) => sum + item.quantidade, 0) / dados.estatisticasDiarias.length).toFixed(1)} vazamentos/dia`
                  : '0 vazamentos/dia'
                }
              </p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
