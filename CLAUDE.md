@AGENTS.md

# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

**React Component Generator** — An AI-powered tool that generates React components from natural language descriptions. Users enter a prompt, select an AI provider (Anthropic Claude or Google Gemini), and see the rendered component in real-time.

## Architecture

### Frontend (src/)
- **App.tsx**: Main entry point. Manages provider selection, API key input, and component list.
- **Components**:
  - `PromptInput.tsx`: Form for component descriptions
  - `ComponentCard.tsx`: Card UI with live preview, code view, and action buttons
  - `LivePreview.tsx`: Renders components in real-time using react-live
  - `CodeView.tsx`: Displays and highlights generated code
  - `Modal.tsx`: Retro 70s-style modal component for displaying full code
- **Hooks**:
  - `useComponentGenerator.ts`: Manages component list state, loading, and errors. Calls `/api/generate`.
- **Types**: `types/index.ts` — Provider union type, GeneratedComponent interface

### Backend (server/index.ts)
Bun-based API server running on port 3002:
- `POST /api/generate` — Accepts prompt, API key, provider. Routes to Claude (Anthropic) or Gemini (Google) API, processes response, returns executable JSX code.
- `GET /api/config` — Returns which providers have API keys configured in `.env`.

**Key details**:
- SYSTEM_PROMPT in server/index.ts enforces: inline styles only, no imports, plain JS (no TypeScript), self-contained components, render() call required.
- Code processing: strips markdown fences, ensures render() call is present.
- CORS headers configured for client-server communication.
- Error handling for rate limits (429), overload (503), and API failures.

### Data Flow
User prompt → PromptInput → useComponentGenerator.generate() → POST /api/generate → Claude/Gemini API → code extraction → LivePreview + CodeView display

## Development Commands

```bash
# Install dependencies
bun install

# Development: run frontend (Vite) + backend (Bun) concurrently
bun run dev
# Accesses http://localhost:5173 (frontend), API calls go to http://localhost:3002

# Build for production
bun run build

# Lint code
bun run lint

# Preview production build
bun run preview

# Run backend only (for debugging)
bun run server
```

## Configuration

**API Keys**: Set in `.env` file (or `.env.example` template exists):
```
ANTHROPIC_API_KEY=sk-ant-...
GOOGLE_API_KEY=AIza...
```

If not set, users must enter keys in the UI. Environment keys are checked on app load via `/api/config`.

## Key Implementation Details

### Generated Component Code Format
Components must follow the SYSTEM_PROMPT rules:
- Inline styles only (`style={{ ... }}`)
- No imports (React assumed global)
- Plain JavaScript, no TypeScript syntax
- Must call `render(<ComponentName />)` at the end
- Self-contained (no external dependencies)

### Code Processing (server/index.ts)
- `stripCodeFences()`: Removes markdown code block markers
- `ensureRenderCall()`: Appends render() if missing

### UI Styling
- Retro 70s aesthetic (design commitment from recent commits)
- CSS in `src/index.css` and `src/App.css`
- Uses color schemes and typography matching the retro theme

### Component State
- Components list stored in React state (useComponentGenerator hook)
- Each generated component has: unique id (timestamp + random), prompt, code, createdAt
- Refresh button remounts component; Regenerate button re-calls API with same prompt

## Common Tasks

**Add a new component UI element**: Add to `src/components/`, import in App.tsx or relevant parent.

**Change the system prompt or AI model**: Edit `SYSTEM_PROMPT` or model name (`claude-haiku-4-5-20251001`, `gemini-2.5-flash`) in server/index.ts.

**Debug component generation**: Check `/api/generate` response in Network tab; verify system prompt matches generated code.

**Add a new provider**: Add to Provider type, add to PROVIDER_CONFIG in App.tsx, add API call function in server/index.ts, add .env handling.

## Testing Notes

- Frontend runs on 5173, backend on 3002 — ensure both are running when testing.
- CORS is configured; no cross-origin issues expected for localhost.
- Components render via react-live; supports full React feature set (hooks, state, events).
