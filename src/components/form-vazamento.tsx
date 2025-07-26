'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Upload, MapPin, FileText, Image as ImageIcon } from 'lucide-react';
import { BAIRROS_NITEROI, getCoordenadaBairro } from '@/lib/data';
import { Vazamento } from '@/types';

interface FormVazamentoProps {
  onSubmit: (vazamento: Omit<Vazamento, 'id' | 'dataRegistro' | 'status'>) => void;
}

export default function FormVazamento({ onSubmit }: FormVazamentoProps) {
  const [endereco, setEndereco] = useState('');
  const [descricao, setDescricao] = useState('');
  const [bairro, setBairro] = useState('');
  const [imagem, setImagem] = useState<string | undefined>();
  const [imagemPreview, setImagemPreview] = useState<string | undefined>();
  const [isLoading, setIsLoading] = useState(false);

  const handleImageUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    // Verificar se é uma imagem
    if (!file.type.startsWith('image/')) {
      alert('Por favor, selecione apenas arquivos de imagem.');
      return;
    }

    // Verificar tamanho (máx 5MB)
    if (file.size > 5 * 1024 * 1024) {
      alert('A imagem deve ter no máximo 5MB.');
      return;
    }

    const reader = new FileReader();
    reader.onload = (e) => {
      const result = e.target?.result as string;
      setImagem(result);
      setImagemPreview(result);
    };
    reader.readAsDataURL(file);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!endereco || !descricao || !bairro) {
      alert('Por favor, preencha todos os campos obrigatórios.');
      return;
    }

    setIsLoading(true);

    try {
      const coordenadas = getCoordenadaBairro(bairro);
      if (!coordenadas) {
        alert('Bairro não encontrado.');
        return;
      }

      // Adicionar uma pequena variação aleatória nas coordenadas para evitar sobreposição
      const lat = coordenadas.lat + (Math.random() - 0.5) * 0.01;
      const lng = coordenadas.lng + (Math.random() - 0.5) * 0.01;

      const novoVazamento = {
        endereco,
        descricao,
        bairro,
        imagem,
        latitude: lat,
        longitude: lng
      };

      onSubmit(novoVazamento);

      // Limpar formulário
      setEndereco('');
      setDescricao('');
      setBairro('');
      setImagem(undefined);
      setImagemPreview(undefined);

      // Reset file input
      const fileInput = document.getElementById('image-upload') as HTMLInputElement;
      if (fileInput) fileInput.value = '';

    } catch (error) {
      console.error('Erro ao registrar vazamento:', error);
      alert('Erro ao registrar vazamento. Tente novamente.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Card className="w-full backdrop-blur-sm bg-white/95 border-white/20 shadow-xl">
      <CardHeader className="pb-4">
        <CardTitle className="flex items-center gap-2 text-xl font-bold text-blue-900">
          <MapPin className="h-6 w-6 text-blue-600" />
          Registrar Vazamento
        </CardTitle>
        <p className="text-sm text-gray-600">
          Ajude a comunidade reportando vazamentos de água em Niterói
        </p>
      </CardHeader>

      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* Endereço */}
            <div className="space-y-2">
              <Label htmlFor="endereco" className="text-sm font-medium text-gray-700">
                Endereço / Localização *
              </Label>
              <Input
                id="endereco"
                value={endereco}
                onChange={(e) => setEndereco(e.target.value)}
                placeholder="Ex: Rua das Flores, 123 - Icaraí"
                className="bg-white/50 border-gray-200 focus:border-blue-400"
                required
              />
            </div>

            {/* Bairro */}
            <div className="space-y-2">
              <Label htmlFor="bairro" className="text-sm font-medium text-gray-700">
                Bairro *
              </Label>
              <Select value={bairro} onValueChange={setBairro} required>
                <SelectTrigger className="bg-white/50 border-gray-200 focus:border-blue-400">
                  <SelectValue placeholder="Selecione o bairro" />
                </SelectTrigger>
                <SelectContent>
                  {Object.keys(BAIRROS_NITEROI).map((b) => (
                    <SelectItem key={b} value={b}>
                      {b}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>

          {/* Descrição */}
          <div className="space-y-2">
            <Label htmlFor="descricao" className="text-sm font-medium text-gray-700 flex items-center gap-1">
              <FileText className="h-4 w-4" />
              Descrição do Vazamento *
            </Label>
            <Textarea
              id="descricao"
              value={descricao}
              onChange={(e) => setDescricao(e.target.value)}
              placeholder="Descreva o vazamento: tamanho, localização exata, se está causando problemas..."
              className="bg-white/50 border-gray-200 focus:border-blue-400 min-h-[80px]"
              required
            />
          </div>

          {/* Upload de Imagem */}
          <div className="space-y-2">
            <Label htmlFor="image-upload" className="text-sm font-medium text-gray-700 flex items-center gap-1">
              <ImageIcon className="h-4 w-4" />
              Foto do Vazamento (opcional)
            </Label>
            <div className="flex items-center gap-4">
              <div className="flex-1">
                <Input
                  id="image-upload"
                  type="file"
                  accept="image/*"
                  onChange={handleImageUpload}
                  className="bg-white/50 border-gray-200 focus:border-blue-400"
                />
                <p className="text-xs text-gray-500 mt-1">
                  Formatos aceitos: JPG, PNG, GIF (máx. 5MB)
                </p>
              </div>

              {imagemPreview && (
                <div className="w-20 h-20 rounded-lg overflow-hidden border-2 border-gray-200">
                  <img
                    src={imagemPreview}
                    alt="Preview"
                    className="w-full h-full object-cover"
                  />
                </div>
              )}
            </div>
          </div>

          {/* Botão de Envio */}
          <Button
            type="submit"
            disabled={isLoading}
            className="w-full md:w-auto bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 text-white font-medium py-2 px-6 rounded-lg transition-all duration-200 shadow-md hover:shadow-lg"
          >
            {isLoading ? (
              <div className="flex items-center gap-2">
                <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                Registrando...
              </div>
            ) : (
              <div className="flex items-center gap-2">
                <Upload className="h-4 w-4" />
                Registrar Vazamento
              </div>
            )}
          </Button>
        </form>
      </CardContent>
    </Card>
  );
}
