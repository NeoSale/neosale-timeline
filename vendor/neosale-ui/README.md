# 🎨 NeoSale UI

Biblioteca de componentes React reutilizáveis. Compartilhada entre neosale-auth, neosale-mkt e outros projetos.

**Versão:** 1.0.0 | **Status:** Ativo | **Stack:** React 18/19 + TypeScript + Tailwind CSS

## 🚀 Início Rápido

### Instalação

```bash
npm install
```

### Desenvolvimento (Watch Mode)

```bash
npm run dev
```

TypeScript compila automaticamente para `dist/`

### Build

```bash
npm run build  # Gera dist/
```

## 📦 Como Usar em Outro Projeto

### Adicionar Dependência

```bash
npm install @neosale/ui@file:../neosale-ui
```

Ou em `package.json`:
```json
{
  "@neosale/ui": "file:../neosale-ui"
}
```

### Importar Componentes

```typescript
import { Button, Card, Modal, Badge, Input } from '@neosale/ui';

export function MyComponent() {
  return (
    <Card>
      <h1>Título</h1>
      <Input placeholder="Digite algo" />
      <Button>Enviar</Button>
    </Card>
  );
}
```

## 🎯 Componentes Disponíveis

| Componente | Descrição |
|-----------|-----------|
| **Button** | Botão com variantes (primary, secondary, danger) |
| **Card** | Container para conteúdo |
| **Input** | Campo de texto com validação |
| **Modal** | Modal dialog |
| **ConfirmModal** | Modal de confirmação |
| **Badge** | Label/tag |
| **Spinner** | Indicador de carregamento |
| **Table** | Tabela com sorting e paginação |
| **ThemeToggle** | Toggle de tema claro/escuro |

### Exemplo de Uso

```typescript
import { Button, Modal, useState } from '@neosale/ui';

export function Demo() {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <>
      <Button onClick={() => setIsOpen(true)}>
        Abrir Modal
      </Button>

      <Modal
        isOpen={isOpen}
        onClose={() => setIsOpen(false)}
        title="Confirmação"
      >
        <p>Tem certeza?</p>
        <Button onClick={() => setIsOpen(false)}>Sim</Button>
      </Modal>
    </>
  );
}
```

## 🎨 Tema Customizado

### Tailwind Preset

Importar em `tailwind.config.js`:

```javascript
import { tailwind } from '@neosale/ui';

export default {
  presets: [tailwind.preset],
  content: [
    './src/**/*.{js,ts,jsx,tsx}',
    './node_modules/@neosale/ui/dist/**/*.js',
  ],
};
```

### Cores Padrão

- **Primary:** #403CCF (roxo)
- **Secondary:** #FBFAFF (branco)
- **Dark:** Suporte para `dark:` classes

## 📁 Estrutura

```
src/
├── index.ts                 # Barrel exports
├── components/
│   ├── Button.tsx
│   ├── Card.tsx
│   ├── Input.tsx
│   ├── Modal.tsx
│   ├── Table.tsx
│   └── ...
└── styles/
    ├── globals.css
    └── theme.css
```

## 📚 Documentação

- [COMPONENTS.md](docs/COMPONENTS.md) - Referência detalhada
- [CONTRIBUTING.md](docs/CONTRIBUTING.md) - Como contribuir

## 🤝 Contribuindo

1. Crie componente em `src/components/`
2. Exporte em `src/index.ts`
3. Teste em projeto dependente
4. Commit semântico

```bash
git commit -m 'feat(ui): adicionar novo componente'
```

## 📦 Exports

```typescript
// Componentes
export {
  Button,
  Card,
  Modal,
  Input,
  Badge,
  Spinner,
  Table,
  ConfirmModal,
  ThemeToggle
}

// Estilos
export './styles/globals.css'
export './styles/theme.css'

// Tailwind Preset
export { default as tailwind }
```

## 📝 Licença

MIT

---

**Mantido por:** Equipe NeoSale
**Última atualização:** Fevereiro 2026
