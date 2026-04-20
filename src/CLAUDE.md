@AGENTS.md

# Frontend Application Context

React 19 + TypeScript + Vite application. Manages user input, component generation API calls, live preview rendering via react-live, and code display. Runs on port 5173 during development.

## Key Components

- **App.tsx**: Entry point. Manages provider selection, API key input, component list state.
- **PromptInput.tsx**: Form for entering component descriptions.
- **ComponentCard.tsx**: Card UI displaying preview, code view, and action buttons (Refresh, Regenerate, Copy, Delete).
- **LivePreview.tsx**: Renders generated components using react-live.
- **CodeView.tsx**: Displays generated code with syntax highlighting.
- **Modal.tsx**: Retro 70s-style modal for full-screen code display.

## Key Hook

- **useComponentGenerator.ts**: Manages component list, loading, and error states. Calls `/api/generate` for generation and regeneration.

## State Structure

Generated component object:
```
{
  id: string (timestamp + random)
  prompt: string
  code: string (JSX)
  createdAt: string (ISO date)
}
```

## Styling

Retro 70s aesthetic applied globally (src/index.css, src/App.css). Generated components may use inline styles only.

See AGENTS.md for detailed implementation patterns and testing strategy.
