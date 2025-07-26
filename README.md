# 💧 Niterói Vazamentos [![Status](https://img.shields.io/badge/status-protótipo-blue)](https://sistema-vazamento-niteroi.vercel.app) ![Vercel](https://vercelbadge.vercel.app/api/vmellozk/sistema-vazamento-niteroi)

Sistema colaborativo de denúncias de vazamentos de água desenvolvido para a cidade de Niterói – RJ.  
Este projeto foi criado com o objetivo de beneficiar a comunidade local, permitindo que qualquer cidadão possa registrar, visualizar e acompanhar vazamentos em sua região, facilitando a atuação de empresas como a Águas do Brasil.

## 🚀 Objetivo

Criar uma plataforma digital simples, acessível e eficaz que:

- Dê voz à população para relatar vazamentos de água.
- Auxilie órgãos responsáveis no mapeamento e resolução rápida das ocorrências.
- Promova transparência e engajamento cívico.
- Apresente dados e estatísticas úteis sobre a situação do saneamento.

## 🧩 Funcionalidades

### 📍 Registro de Vazamentos
- Formulário simples e direto.
- Campos: endereço, bairro, descrição e imagem (opcional).
- **Protótipo funcional apenas no front-end** (sem banco de dados ou backend persistente).

### 🗂️ Filtros e Busca
- Filtragem por **bairro**, **status** (aberto ou resolvido) e **data**.
- Interface intuitiva para facilitar a navegação entre os registros.

### 🗺️ Mapa Interativo
- Visualização geográfica dos vazamentos em tempo real.
- Marcação por cores conforme o status da denúncia.
- Integração com Leaflet.js para navegação fluida.

### 📊 Estatísticas
- Número total de vazamentos.
- Quantos estão abertos ou resolvidos.
- Evolução dos casos nos últimos dias.
- Bairros mais afetados.

### 📋 Lista Completa
- Cartões com detalhes de cada vazamento.
- Visualização de endereço, descrição, status e data.
- Acesso rápido ao local no mapa.

## 🏗️ Estrutura do Projeto

```bash
NITEROI-VAZAMENTOS
├── src/
│   ├── app/                      # Páginas principais (Next.js App Router)
│   │   ├── ClientBody.tsx        # Wrapper que aplica classe 'antialiased' no body após a hidratação
│   │   ├── globals.css           # Estilos globais da aplicação com Tailwind CSS e customização de temas via variáveis CSS
│   │   ├── layout.tsx            # Layout raiz da aplicação com fontes, estilos globais e wrapper de conteúdo
│   │   └── page.tsx              # Página inicial da aplicação com layout principal e chamada dos componentes
│   ├── components/
│   │   ├── ui/                   # Componentes reutilizáveis da interface (botão, input, select, etc.)
│   │   │   ├── button.tsx
│   │   │   ├── card.tsx
│   │   │   ├── input.tsx
│   │   │   ├── label.tsx
│   │   │   ├── select.tsx
│   │   │   ├── sonner.tsx
│   │   │   ├── tabs.tsx
│   │   │   └── textarea.tsx
│   │   ├── filtros-vazamentos.tsx    # Componente de filtros (bairro, status, data) aplicados aos vazamentos
│   │   ├── form-vazamento.tsx        # Formulário de envio de nova denúncia de vazamento
│   │   ├── graficos-estatisticas.tsx # Painel com gráficos e estatísticas de vazamentos
│   │   ├── mapa-vazamentos.tsx       # Mapa interativo com marcações de vazamentos via Leaflet
│   │   └── tabela-vazamentos.tsx     # Lista dos vazamentos em formato tabular (cards)
│   ├── lib/                      # Lógica de dados e funções auxiliares
│   │   ├── data.ts
│   │   └── utils.ts
│   └── types/                    # Tipagens TypeScript
│       └── index.ts
├── public/                       # Imagens e arquivos estáticos
├── .eslintrc.js                  # Configuração de lint
├── .gitignore                    # Arquivos ignorados no Git
├── biome.json                    # Configuração do Biome (formatter/linter)
├── bun.lock                      # Lockfile do Bun
├── components.json               # Configuração de componentes (ShadCN)
├── eslint.config.mjs            # Configuração do ESLint (modular)
├── global.d.ts                  # Tipagens globais
├── netlify.toml                 # Configuração de deploy (Netlify)
├── next.config.js               # Configuração do Next.js
├── package.json                 # Dependências e scripts do projeto
├── package-lock.json            # Lockfile do npm
├── postcss.config.mjs           # Configuração do PostCSS
├── tailwind.config.mjs          # Configuração do Tailwind CSS
├── tsconfig.json                # Configuração do TypeScript
└── README.md                    # Documentação do projeto
```

### 🛠️ Tecnologias Utilizadas

- ![Next.js](https://img.shields.io/badge/Next.js-13+-000?logo=nextdotjs) – Framework React para aplicações web modernas com renderização híbrida (SSR/SSG/CSR).
- ![Turbopack](https://img.shields.io/badge/Turbopack-ffcc00?logo=vercel&logoColor=black) – Novo empacotador ultrarrápido do Next.js, substituto moderno do Webpack.
- ![TypeScript](https://img.shields.io/badge/TypeScript-007ACC?logo=typescript&logoColor=white) – Tipagem estática para maior confiabilidade no desenvolvimento.
- ![Tailwind CSS](https://img.shields.io/badge/Tailwind_CSS-38B2AC?logo=tailwindcss&logoColor=white) – Utilitários de estilo para UI rápida, responsiva e moderna.
- ![Leaflet](https://img.shields.io/badge/Leaflet.js-199900?logo=leaflet&logoColor=white) – Biblioteca JavaScript open-source para mapas interativos.
- ![ShadCN UI](https://img.shields.io/badge/ShadCN_UI-%23ffffff?logo=vercel&logoColor=black) – Conjunto de componentes acessíveis, baseados em Radix UI e Tailwind.
- ![Bun](https://img.shields.io/badge/Bun-000000?logo=bun&logoColor=white) – Gerenciador de pacotes, executor de scripts e runtime ultrarrápido para JavaScript/TypeScript.

## 🧪 Como Rodar Localmente

1. Clone o repositório:

```bash
git clone https://github.com/vmellozk/sistema-vazamento-niteroi.git
cd sistema-vazamento-niteroi
```

2. Instale as dependências:

```bash
npm install
```

3. Inicie o servidor de desenvolvimento:

```bash
npm run dev
```

4. Acesse no navegador:
http://localhost:3000

## 🤝 Contexto do Projeto
Este projeto foi idealizado e desenvolvido especialmente para uma dinâmica de processo seletivo na Águas do Brasil – Niterói. A proposta era apresentar uma solução tecnológica com impacto social, que contribuísse para o dia a dia da empresa e da população local. O sistema simula um painel completo de monitoramento e denúncia de vazamentos, com ênfase na transparência e na eficiência.

> ⚠️ **Observação**: Este projeto é um protótipo front-end. Os dados não são armazenados de forma persistente e são reiniciados a cada atualização da página. A proposta foi demonstrar a ideia e as possibilidades de aplicação real em ambientes com backend.

## 📸 Prints

![Página Inicial](https://i.imgur.com/LJQjCfe.png)
![Dados e Estatísticas](https://i.imgur.com/UxZMcTg.png)
![Lista de Denúncias](https://i.imgur.com/dNCMvnQ.png)

## 🌐 Demonstração

Acesse: [sistema-vazamento-niteroi.vercel.app](https://sistema-vazamento-niteroi.vercel.app)

## ⚖️ Licença

Este projeto está protegido por **Todos os Direitos Reservados**.  
**Não é permitido copiar, distribuir ou modificar este código sem autorização.**  
Para dúvidas ou permissões especiais, entre em contato: [contato.devictormello@gmail.com](mailto:contato.devictormello@gmail.com)

## 🔮 Possíveis Expansões

- Integração com banco de dados para persistência dos registros.
- Dashboard administrativo para controle de denúncias e atualização de status.
- Envio automático de e-mails de confirmação para usuários.
- API RESTful ou GraphQL para integração com aplicativos móveis ou painéis públicos.
- Sistema de autenticação para moderadores.

## 🤲 Como Contribuir

Pull requests são bem-vindos!  
Sinta-se à vontade para abrir **issues**, sugerir melhorias ou colaborar com código.

1. Fork este repositório
2. Crie sua branch: `git checkout -b minha-feature`
3. Commit suas alterações: `git commit -m 'feat: nova funcionalidade'`
4. Push para a branch: `git push origin minha-feature`
5. Abra um Pull Request
