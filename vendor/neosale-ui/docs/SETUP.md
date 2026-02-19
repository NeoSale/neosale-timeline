# 🛠️ Setup - NeoSale UI

## Pré-requisitos

- Node.js 20+
- npm 10+

## Instalação

```bash
npm install
```

## Desenvolvimento (Watch Mode)

```bash
npm run dev
```

TypeScript compila automaticamente para `dist/` quando há mudanças.

## Build

```bash
npm run build
```

Gera arquivos compilados em `dist/`

## Usar em Outro Projeto

### 1. Adicionar Dependência

Em outro projeto, adicione em `package.json`:

```json
{
  "@neosale/ui": "file:../neosale-ui"
}
```

Depois:

```bash
npm install
```

### 2. Importar Componentes

```typescript
import { Button, Card, Modal } from '@neosale/ui';

export function MyComponent() {
  return (
    <Card>
      <h1>Título</h1>
      <Button>Clique aqui</Button>
    </Card>
  );
}
```

### 3. Usar Tailwind Preset

Em `tailwind.config.js` do projeto dependente:

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

## Adicionar Novo Componente

1. Criar em `src/components/MeuComponente.tsx`
2. Exportar em `src/index.ts`:
```typescript
export { MeuComponente } from './components/MeuComponente';
```
3. Testar em projeto dependente
4. Commit com `feat(ui): adicionar MeuComponente`

## Troubleshooting

### "Cannot find module @neosale/ui"
```bash
# Reinstale
npm install

# Recompile
npm run build
```

### TypeScript errors
```bash
npx tsc --noEmit
```

---

Veja README.md para componentes disponíveis.
