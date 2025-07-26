'use client';

import { useEffect, useRef, useState } from 'react';
import { Vazamento } from '@/types';
import { Card, CardContent } from '@/components/ui/card';

interface MapaVazamentosProps {
  vazamentos: Vazamento[];
  onVazamentoClick?: (vazamento: Vazamento) => void;
}

export default function MapaVazamentos({ vazamentos, onVazamentoClick }: MapaVazamentosProps) {
  const mapRef = useRef<HTMLDivElement>(null);
  const mapInstanceRef = useRef<any>(null);
  const markersRef = useRef<any[]>([]);
  const [selectedVazamento, setSelectedVazamento] = useState<Vazamento | null>(null);
  const [L, setL] = useState<any>(null); // Armazenar Leaflet para usar em outros effects

  // Inicializa o mapa assim que o container estiver disponível
  useEffect(() => {
    if (!mapRef.current) return;

    let leaflet: any;
    let map: any;

    const loadMap = async () => {
      leaflet = await import('leaflet');
      await import('leaflet/dist/leaflet.css');

      // Corrige os ícones padrão do Leaflet no Next.js
      delete (leaflet.Icon.Default.prototype as any)._getIconUrl;
      leaflet.Icon.Default.mergeOptions({
        iconRetinaUrl:
          'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon-2x.png',
        iconUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon.png',
        shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png',
      });

      const niteroiCenter: [number, number] = [-22.8833, -43.1036];
      map = leaflet.map(mapRef.current!).setView(niteroiCenter, 12);
      mapInstanceRef.current = map;

      leaflet
        .tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
          attribution: '© OpenStreetMap contributors',
        })
        .addTo(map);

      map.zoomControl.setPosition('topright');

      setL(leaflet); // Salva a instância do Leaflet para usar depois
    };

    loadMap();

    return () => {
      if (mapInstanceRef.current) {
        mapInstanceRef.current.remove();
        mapInstanceRef.current = null;
      }
    };
  }, [mapRef]);

  // Atualiza os marcadores sempre que os vazamentos ou Leaflet mudarem
  useEffect(() => {
    if (!L || !mapInstanceRef.current) return;

    // Remove marcadores antigos
    markersRef.current.forEach((marker) => marker.remove());
    markersRef.current = [];

    vazamentos.forEach((vazamento) => {
      const marker = L.marker([vazamento.latitude, vazamento.longitude], {
        icon: createWaterDropIcon(L, vazamento.status),
      }).addTo(mapInstanceRef.current);

      marker.on('click', () => {
        setSelectedVazamento(vazamento);
        onVazamentoClick?.(vazamento);
      });

      markersRef.current.push(marker);
    });
  }, [vazamentos, L, onVazamentoClick]);

  const createWaterDropIcon = (L: any, status: Vazamento['status']) => {
    const color =
      status === 'aberto'
        ? '#ef4444'
        : status === 'em_andamento'
        ? '#f59e0b'
        : '#10b981';

    return L.divIcon({
      html: `
        <div style="
          background: ${color};
          width: 20px;
          height: 20px;
          border-radius: 50% 50% 50% 0;
          border: 2px solid white;
          transform: rotate(-45deg);
          box-shadow: 0 2px 4px rgba(0,0,0,0.3);
        "></div>
      `,
      iconSize: [20, 20],
      iconAnchor: [10, 20],
      className: 'water-drop-icon',
    });
  };

  const closePopup = () => setSelectedVazamento(null);

  return (
    <div className="relative w-full h-[500px] rounded-lg overflow-hidden">
      <div ref={mapRef} className="w-full h-full" />

      {selectedVazamento && (
        <div className="absolute top-4 left-4 z-[1000] max-w-sm">
          <Card className="backdrop-blur-md bg-white/90 border-white/20 shadow-xl">
            <CardContent className="p-4">
              <div className="flex justify-between items-start mb-2">
                <h3 className="font-semibold text-sm text-gray-900">Vazamento Registrado</h3>
                <button
                  onClick={closePopup}
                  className="text-gray-500 hover:text-gray-700 text-lg leading-none"
                  aria-label="Fechar"
                >
                  ×
                </button>
              </div>

              <div className="space-y-2 text-sm">
                <div>
                  <span className="font-medium text-gray-700">Endereço:</span>
                  <p className="text-gray-600">{selectedVazamento.endereco}</p>
                </div>

                <div>
                  <span className="font-medium text-gray-700">Descrição:</span>
                  <p className="text-gray-600">{selectedVazamento.descricao}</p>
                </div>

                <div>
                  <span className="font-medium text-gray-700">Status:</span>
                  <span
                    className={`ml-1 px-2 py-1 rounded-full text-xs font-medium ${
                      selectedVazamento.status === 'aberto'
                        ? 'bg-red-100 text-red-800'
                        : selectedVazamento.status === 'em_andamento'
                        ? 'bg-yellow-100 text-yellow-800'
                        : 'bg-green-100 text-green-800'
                    }`}
                  >
                    {selectedVazamento.status === 'aberto'
                      ? 'Aberto'
                      : selectedVazamento.status === 'em_andamento'
                      ? 'Em Andamento'
                      : 'Resolvido'}
                  </span>
                </div>

                <div>
                  <span className="font-medium text-gray-700">Data:</span>
                  <p className="text-gray-600">
                    {new Date(selectedVazamento.dataRegistro).toLocaleDateString('pt-BR')}
                  </p>
                </div>

                {selectedVazamento.imagem && (
                  <div>
                    <span className="font-medium text-gray-700">Foto:</span>
                    <img
                      src={selectedVazamento.imagem}
                      alt="Foto do vazamento"
                      className="mt-1 w-full h-32 object-cover rounded border"
                    />
                  </div>
                )}
              </div>
            </CardContent>
          </Card>
        </div>
      )}

      {/* Legenda */}
      <div className="absolute bottom-4 right-4 z-[1000]">
        <Card className="backdrop-blur-md bg-white/90 border-white/20">
          <CardContent className="p-3">
            <h4 className="font-semibold text-sm mb-2 text-gray-900">Legenda</h4>
            <div className="space-y-1 text-xs">
              <div className="flex items-center gap-2">
                <div className="w-4 h-4 bg-red-500 rounded-full border border-white shadow-sm"></div>
                <span className="text-gray-700">Aberto</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-4 h-4 bg-yellow-500 rounded-full border border-white shadow-sm"></div>
                <span className="text-gray-700">Em Andamento</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-4 h-4 bg-green-500 rounded-full border border-white shadow-sm"></div>
                <span className="text-gray-700">Resolvido</span>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
