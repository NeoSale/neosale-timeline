# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Repository Overview

**@neosale/ui** is a shared React component library for the NeoSale monorepo. It provides a design system with reusable UI components (Button, Card, Modal, Input, etc.) that are consumed by other projects like neosale-auth, neosale-mkt, and neosale-crm via `file:` protocol references.

- **Version**: 1.0.0
- **Status**: Active
- **Stack**: React 18/19 + TypeScript + Tailwind CSS
- **Entry point**: `src/index.ts`
- **Outputs**: TypeScript types + compiled code in `dist/`

## Common Commands

### Development

**Watch mode** (TypeScript auto-compiles to `dist/` on file changes):
```bash
npm run dev
```

**Build** (one-time TypeScript compilation):
```bash
npm run build
```

**Clean artifacts**:
```bash
npm run clean     # Removes dist/
```

### Testing & Integration

Since this is a component library, testing is done in dependent projects:
1. Run `npm run dev` in neosale-ui
2. In a consuming project (neosale-auth, neosale-mkt), import components from `@neosale/ui` and test locally
3. The `file:` protocol automatically resolves to the watched TypeScript source

### Troubleshooting

**Module not found in dependent project**:
```bash
# In the consuming project:
rm -rf node_modules package-lock.json
npm install
```

**TypeScript errors**:
```bash
npm run build    # Full type checking
```

## Architecture

### Component Structure

```
src/
├── components/              # React components (one per file)
│   ├── Button.tsx
│   ├── Card.tsx
│   ├── Modal.tsx
│   ├── Input.tsx
│   ├── Table.tsx
│   ├── Select.tsx
│   ├── Textarea.tsx
│   ├── Skeleton.tsx
│   ├── Badge.tsx
│   ├── Spinner.tsx
│   ├── ThemeToggle.tsx
│   ├── ConfirmModal.tsx
│   ├── Alert.tsx
│   ├── EmptyState.tsx
│   ├── KpiCard.tsx
│   ├── ProgressBar.tsx
│   ├── Toast.tsx              # Toast provider + hook
│   └── ...
├── styles/
│   ├── globals.css            # Global resets & utilities
│   └── theme.css              # CSS variables & theme
├── index.ts                   # Barrel exports (components + types)
└── (No lib/ folder - utilities are minimal)
```

### Design System

**Theme colors** (defined in `tailwind.preset.js`):
- **Primary**: `#403CCF` (purple, 9 shade range from 50 to 900)
- **Secondary**: `#FBFAFF` (light) / `#1a1a1a` (dark)
- **Accent**: Green (`#10b981`) and red (`#ef4444`)
- **Dark mode**: Enabled via `darkMode: 'class'` (`.dark` class on root element)

**Typography**:
- Font family: Poppins (falls back to Geist Sans)
- Mono: Geist Mono

**Animations**:
- `float`: 3s infinite vertical drift
- `pulse-glow`: 2s infinite purple glow pulse

### How Components are Exported

Each component has a **barrel export** pattern in `src/index.ts`:
```typescript
export { default as Button } from './components/Button'
export type { ButtonProps } from './components/Button'
```

This enables:
```typescript
import { Button, type ButtonProps } from '@neosale/ui'
```

### Package Exports (in package.json)

```json
"exports": {
  ".": { "import": "./src/index.ts", ... },
  "./styles/globals.css": "./src/styles/globals.css",
  "./styles/theme.css": "./src/styles/theme.css",
  "./tailwind.preset": "./tailwind.preset.js"
}
```

Consuming projects can import:
- Components: `import { Button } from '@neosale/ui'`
- Styles: `import '@neosale/ui/styles/globals.css'`
- Tailwind: `import { default as uiPreset } from '@neosale/ui/tailwind.preset'`

## Dependency Information

### Peer Dependencies
- React 18.x or 19.x
- React DOM 18.x or 19.x

### Direct Dependencies
- `@heroicons/react` - Icon library
- `lucide-react` - Icon library

### Dev Dependencies
- TypeScript 5.x
- @types/react (v19)
- @types/react-dom (v19)

## Key Integration Points

### Using in Other Projects

1. **Add as dependency** in consuming project's `package.json`:
```json
{
  "@neosale/ui": "file:../neosale-ui"
}
```

2. **Set up Tailwind** in `tailwind.config.js`:
```javascript
import uiPreset from '@neosale/ui/tailwind.preset'

export default {
  presets: [uiPreset],
  content: [
    './src/**/*.{js,ts,jsx,tsx}',
    './node_modules/@neosale/ui/dist/**/*.js',
  ],
}
```

3. **Import global styles** in root layout:
```typescript
import '@neosale/ui/styles/globals.css'
import '@neosale/ui/styles/theme.css'
```

### Toast Notifications

Toast is implemented as a context provider:
```typescript
// In app root:
import { ToastProvider } from '@neosale/ui'

export default function App({ children }) {
  return <ToastProvider>{children}</ToastProvider>
}

// In any component:
import { useToast } from '@neosale/ui'

export function MyComponent() {
  const { success, error, info } = useToast()

  const handleClick = () => {
    success('Action completed!')
  }
}
```

## Adding New Components

1. Create `src/components/MyComponent.tsx` with TypeScript types
2. Export in `src/index.ts`:
   ```typescript
   export { default as MyComponent } from './components/MyComponent'
   export type { MyComponentProps } from './components/MyComponent'
   ```
3. Test in a consuming project (neosale-auth, neosale-mkt)
4. Commit with message: `feat(ui): add MyComponent` or `feat(ui): enhance MyComponent`

## TypeScript Configuration

- **Target**: ES2020
- **Module**: ESNext
- **JSX**: react-jsx
- **Strict mode**: Enabled (`strict: true`)
- **Declarations**: Generated with source maps
- **Source maps**: Enabled for debugging

## Local File References & Docker Compatibility

This package uses `file:` protocol in dependent projects. This works locally but **fails in Docker** (Docker can't access parent directories). Docker builds in consuming projects use sed to replace `file:` with npm registry versions. See the CLAUDE.md in the monorepo root for more details.

## Deployment Notes

- **No build step needed**: TypeScript compiles to `dist/` via `npm run build`
- **Package.json main**: Points to `src/index.ts` (TypeScript entry)
- **Files list**: Includes `dist/` and `src/styles/` for npm publishing
- **Exports field**: Modern package.json exports (supports both ESM and CommonJS)

## Monorepo Context

This project is **independent** from other neosale projects but serves them as a dependency:
- **neosale-auth**: Consumes components and styles
- **neosale-mkt**: Consumes components
- **neosale-crm**: Likely consumes components

Each consuming project has its own `node_modules/` and runs independently. Updates to neosale-ui are immediately available to watchers via the `file:` protocol.
