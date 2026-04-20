@AGENTS.md

# Module Context

Frontend React application (Vite) handling user input, API calls, component preview, and code display. Renders generated components in real-time using react-live and manages component history state.

# Tech Stack & Constraints

- Framework: React 19 + TypeScript + Vite 8
- Runtime code execution: react-live (supports full React feature set)
- Build tool: Vite (not Webpack — ensures fast HMR)
- Styling: CSS (no Tailwind, no CSS-in-JS libs — only inline styles for preview components)
- Linting: ESLint with React hooks and refresh plugins

# Implementation Patterns

**File Organization:**
- components/: UI components (PromptInput, ComponentCard, LivePreview, CodeView, Modal)
- hooks/: Custom hooks (useComponentGenerator manages state, API calls)
- types/: TypeScript interfaces (Provider, GeneratedComponent)
- App.tsx: Entry point, provider selection, component list container

**Component Patterns:**
- All components are functional, use React hooks
- Props types defined inline or in types/index.ts
- State management: useComponentGenerator hook for component list, per-component state for UI
- Error handling: Show error messages in UI without blocking (graceful degradation)

**Hook Pattern (useComponentGenerator):**
```
State: components[], isLoading, error
Methods: generate(prompt, apiKey, provider), regenerate(id), refresh(id)
API calls: POST /api/generate, GET /api/config
Returns: { components, isLoading, error, generate, regenerate, refresh }
```

**API Communication:**
- Base URL: http://localhost:3002 (backend on 3002, frontend on 5173)
- Content-Type: application/json
- Timeout: reasonable default (3000-5000ms)

# Testing Strategy

Manual testing in browser (no unit tests):
1. Run `bun run dev`
2. Open http://localhost:5173
3. Test prompt input, component generation, preview rendering
4. Test Refresh (remount component) and Regenerate (new API call) buttons
5. Test code view and modal display
6. Verify retro 70s styling is applied
7. Test error scenarios (invalid API key, network failure)

# Local Golden Rules

**Do's:**
- Always call /api/config on mount to check which providers are available
- Always disable submit button while generating (prevent double submissions)
- Always show loading spinner while awaiting API response
- Always display both error message and component code even if generation fails
- Always use react-live's <LiveProvider><LiveEditor><LivePreview></LivePreview></LiveEditor></LiveProvider>

**Don'ts:**
- Never hardcode API keys in UI — always use input form or environment
- Never assume API endpoint is http://localhost:3002 in production — consider env vars
- Never modify generated code in preview (read-only display)
- Never use external CSS libraries or Tailwind in generated components
- Never render components without wrapping in react-live provider
