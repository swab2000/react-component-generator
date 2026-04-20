@AGENTS.md

# Module Context

Backend Bun server handling AI API proxying, component code generation, and code validation. Processes requests from frontend, calls Claude or Gemini APIs, extracts/cleans JSX, and returns executable code.

# Tech Stack & Constraints

- Runtime: Bun (>= latest stable)
- AI SDKs: Anthropic SDK, Google AI SDK (not fetch wrappers — use official SDKs)
- Code processing: Custom stripCodeFences() and ensureRenderCall() functions
- CORS: Configured for localhost:5173
- Ports: Backend runs on 3002 (hardcoded)

# Implementation Patterns

**API Routes:**
- POST /api/generate: Main endpoint. Accepts { prompt, apiKey, provider }. Returns { code: string, error?: string }
- GET /api/config: Returns { anthropic: boolean, google: boolean } indicating which providers have env keys

**Code Processing (server/index.ts):**
```
1. Call AI API (Claude or Gemini)
2. Extract code block from response (search for ``` fences)
3. Run stripCodeFences() to remove markdown
4. Run ensureRenderCall() to append render() if missing
5. Validate: must contain "render(" call
6. Return code or error
```

**SYSTEM_PROMPT in server/index.ts:**
Enforces: inline styles only, no imports, plain JS, self-contained, render() required. If modifying this prompt, test with multiple component types (buttons, cards, animations).

**Error Handling:**
- 429: Rate limit → return error "Rate limited. Try again later."
- 503: Overload → return error "AI service overloaded"
- Missing API key → return error "API key required"
- Invalid response → return error "Failed to generate code"

# Testing Strategy

Manual testing only (no automated tests):
1. Run `bun run dev`
2. Open http://localhost:5173
3. Test each provider (Anthropic, Google) with sample prompts
4. Verify generated code renders without errors
5. Check Network tab for /api/generate response format

# Local Golden Rules

**Do's:**
- Always use official Anthropic and Google AI SDKs (not generic fetch)
- Always call stripCodeFences() before returning code
- Always validate render() call exists before returning
- Catch all error types (network, auth, rate limit, parse) explicitly
- Test both providers before committing changes to generation logic

**Don'ts:**
- Never modify SYSTEM_PROMPT without testing with multiple component types
- Never hardcode API keys or URLs
- Never return raw AI response without processing
- Never trust AI output to have valid syntax — always validate
- Never skip error handling for API calls
