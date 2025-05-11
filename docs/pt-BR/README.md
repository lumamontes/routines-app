# Documentação

## Índice
- [Começando](#começando)
- [Arquitetura](#arquitetura)
- [Componentes](#componentes)
- [Gerenciamento de Estado](#gerenciamento-de-estado)
- [Estilização](#estilização)
- [Testes](#testes)
- [Deploy](#deploy)
- [Contribuindo](#contribuindo)

## Começando

### Pré-requisitos
- Node.js (v18 ou superior)
- npm ou yarn
- Expo CLI
- iOS Simulator (para Mac) ou Android Studio (para desenvolvimento Android)

### Instalação
1. Clone o repositório:
```bash
git clone https://github.com/yourusername/tarefitas.git
cd tarefitas
```

2. Instale as dependências:
```bash
npm install
```

3. Inicie o servidor de desenvolvimento:
```bash
npm start
```

## Arquitetura

### Estrutura do Projeto
```
tarefitas/
├── app/                 # Diretório do Expo Router
├── assets/             # Arquivos estáticos
├── components/         # Componentes reutilizáveis
├── constants/          # Constantes da aplicação
├── hooks/             # Hooks personalizados
├── store/             # Átomos Jotai e gerenciamento de estado
└── types/             # Definições de tipos TypeScript
```

### Tecnologias Principais
- React Native com Expo
- TypeScript
- Jotai para gerenciamento de estado
- Gluestack UI para componentes
- NativeWind para estilização
- React Hook Form com validação Zod
- Expo Router para navegação


### Componentes de UI
Utilizamos componentes Gluestack UI para estilização consistente:
- Botões
- Campos de entrada
- Formulários
- Modais
- Elementos de navegação

## Gerenciamento de Estado

### Átomos Jotai
- `tasksAtom`: Gerencia o estado das tarefas
- `settingsAtom`: Gerencia as configurações do app
- `avatarUriAtom`: Gerencia o avatar do usuário

### Fluxo de Dados
1. Ações do usuário disparam atualizações nos átomos
2. Átomos atualizam a UI
3. Mudanças são persistidas no AsyncStorage

## Estilização

### NativeWind
Utilizamos NativeWind (Tailwind CSS para React Native) para estilização


### Suporte a Temas
- Suporte a modo claro/escuro
- Esquemas de cores personalizados
- Design responsivo

### Git Hooks
- Hooks pre-commit para linting
- Hooks pre-push para testes 