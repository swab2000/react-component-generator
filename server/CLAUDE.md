@AGENTS.md

# Backend Server Context

Bun-based API server. Handles AI API proxying (Anthropic Claude, Google Gemini), generated component code processing, and validation. Runs on port 3002 with CORS configured for localhost:5173.

## Key Files

- `server/index.ts`: Main server file. Contains API routes (/api/generate, /api/config), SYSTEM_PROMPT, code processing functions (stripCodeFences, ensureRenderCall), error handling.

## API Routes

- **POST /api/generate**: Accepts { prompt, apiKey, provider }. Routes to Claude or Gemini API, processes JSX response, returns { code } or { error }.
- **GET /api/config**: Returns { anthropic: boolean, google: boolean } based on .env keys.

## Environment Variables

```
ANTHROPIC_API_KEY=sk-ant-...
GOOGLE_API_KEY=AIza...
```

If not set, users must provide keys via UI.

## Code Processing Pipeline

1. Call AI API with SYSTEM_PROMPT
2. Extract code from response (remove markdown fences)
3. Validate syntax and render() call
4. Return clean, executable JSX

See AGENTS.md for detailed implementation patterns and rules.
