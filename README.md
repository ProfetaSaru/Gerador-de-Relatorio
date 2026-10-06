# 📋 Gerador de Relatório de Atividades

Aplicação web moderna para registro e organização cronológica de atividades diárias, com geração e cópia instantânea de relatórios formatados para a área de transferência.

Construída com **React 18**, **TypeScript**, **Vite** e estilização modular, estruturada rigorosamente sob o conceito **Nevernester** (zero duplicação de marcação visual, guard clauses e hooks desacoplados).

---

## ✨ Funcionalidades

- **⏱️ Registro de Tarefas**: Cadastro com horário inicial, horário final, título da atividade e descrição detalhada opcional.
- **🔠 Títulos Padronizados em Maiúsculo**: Conversão automática em tempo real para letras maiúsculas (UPPERCASE) durante a digitação e no relatório final.
- **📅 Ordenação Cronológica Automática**: As atividades são organizadas automaticamente pelo horário de início.
- **🛡️ Validação de Horários**: Bloqueio de horários inconsistentes (hora final anterior à hora inicial) com feedback visual imediato.
- **✏️ Edição & Exclusão**: Modificação ágil de tarefas cadastradas e exclusão individual com confirmação.
- **🗑️ Limpeza em Lote**: Modal acessível para remoção de todos os registros salvos com suporte à tecla `ESC`.
- **📋 Geração de Relatório com 1 Clique**: Preview do relatório formatado e botão de cópia direta para a área de transferência (`navigator.clipboard`).
- **💾 Persistência Local**: Sincronização automática e segura no `localStorage` do navegador sob a chave `'relatorio-atividades'`.
- **📱 Design Responsivo & Acessível**: Layout em duas colunas para desktop e empilhado em dispositivos móveis, com micro-animações e ícones [`lucide-react`](https://lucide.dev/).

---

## 🏗️ Arquitetura & Conceito Nevernester

O projeto adota o princípio **Nevernester** para manter o código limpo, legível e altamente sustentável:

1. **Componentes Atômicos Reutilizáveis (Zero Marcação Duplicada)**:
   - `Button`: Botão polimórfico com suporte a variantes (`primary`, `secondary`, `danger`, `text`, `edit`, `delete`) e ícones integrados.
   - `FormField`, `Input`, `Textarea`: Encapsulam labels, tags de campos opcionais e estilos de foco consistentes.
   - `Modal`: Diálogo modal de confirmação acessível com backdrop blur, foco e atalho `Escape`.
   - `SectionHeading` & `Panel`: Containers e cabeçalhos reutilizáveis para os blocos da aplicação.
   - `Badge` & `NotificationToast`: Indicadores visuais e alertas temporários com auto-dismiss.

2. **Lógica Desacoplada em Custom Hooks (Guard Clauses & Early Returns)**:
   - [`useTasks`](src/hooks/useTasks.ts): Responsável por operações CRUD, ordenação e persistência local.
   - [`useTaskForm`](src/hooks/useTaskForm.ts): Gestão do estado do formulário e validações com retornos antecipados.
   - [`useNotification`](src/hooks/useNotification.ts): Sistema de toasts com gerenciamento de tempo sem vazamento de memória.

---

## 📂 Estrutura de Pastas

```
Gerador-de-Relatorio/
├── legacy_backup/             # Arquivos originais (Vanilla HTML/JS/CSS) preservados
├── src/
│   ├── types/
│   │   └── task.ts            # Interfaces TypeScript tipadas estritamente
│   ├── hooks/
│   │   ├── useTasks.ts        # Hook para CRUD e persistência no localStorage
│   │   ├── useTaskForm.ts     # Hook para formulário e validações
│   │   └── useNotification.ts # Hook para alertas temporários
│   ├── utils/
│   │   ├── formatReport.ts    # Formatação do texto do relatório
│   │   └── storage.ts         # Leitura e escrita segura no localStorage
│   ├── styles/
│   │   ├── variables.css      # Design tokens e variáveis de tema
│   │   ├── global.css         # Reset global e layout
│   │   └── components.css     # Estilos modulares e responsivos
│   ├── components/
│   │   ├── common/            # Componentes atômicos reutilizáveis
│   │   │   ├── Button.tsx
│   │   │   ├── FormField.tsx
│   │   │   ├── Input.tsx
│   │   │   ├── Textarea.tsx
│   │   │   ├── Badge.tsx
│   │   │   ├── Panel.tsx
│   │   │   ├── SectionHeading.tsx
│   │   │   ├── Modal.tsx
│   │   │   └── NotificationToast.tsx
│   │   ├── layout/
│   │   │   └── Header.tsx
│   │   └── task/
│   │       ├── TaskItem.tsx
│   │       ├── TaskList.tsx
│   │       ├── TaskForm.tsx
│   │       ├── ReportPreview.tsx
│   │       └── ReportPanel.tsx
│   ├── App.tsx                # Composição principal da aplicação
│   └── main.tsx               # Ponto de entrada React
├── index.html                 # HTML raiz do Vite
├── package.json
├── tsconfig.json
└── vite.config.ts
```

---

## 🚀 Como Executar Localmente

### Pré-requisitos
- [Node.js](https://nodejs.org/) (versão 18 ou superior recomendada)
- Gerenciador de pacotes `npm`

### Instalação

1. Clone o repositório:
```bash
git clone https://github.com/ProfetaSaru/Gerador-de-Relatorio.git
cd Gerador-de-Relatorio
```

2. Instale as dependências:
```bash
npm install
```

3. Inicie o servidor de desenvolvimento:
```bash
npm run dev
```

A aplicação estará disponível em `http://localhost:5173/`.

### Build de Produção

Para validar a tipagem TypeScript e gerar os arquivos otimizados para produção:
```bash
npm run build
```

Para visualizar localmente o build gerado:
```bash
npm run preview
```

---

## 📄 Exemplo do Relatório Gerado

```text
RELATÓRIO DE CONCLUSÃO DE ATIVIDADES
08:00 – 09:00 *ALINHAMENTO DIÁRIO:* - Daily meeting com o time;
09:00 – 12:00 *REFATORAÇÃO DE CÓDIGO:* - Migração para React e TypeScript;
13:30 – 15:00 *CODE REVIEW*;
```

---

## 🛠️ Tecnologias Utilizadas

- **[React 18](https://react.dev/)**
- **[TypeScript](https://www.typescriptlang.org/)**
- **[Vite](https://vitejs.dev/)**
- **[Lucide React](https://lucide.dev/)** (ícones)
- **Vanilla CSS Modular** (CSS custom properties, grid/flexbox)

---

## 📝 Licença

Distribuído sob licença livre para fins de estudo e uso pessoal.
