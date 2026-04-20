@AGENTS.md

# Operational Commands

```bash
bun install                  # Install dependencies
bun run dev                  # Run frontend (Vite 5173) + backend (Bun 3002) concurrently
bun run server               # Run backend only with watch mode
bun run build                # Build frontend (tsc + vite build)
bun run lint                 # Run eslint across project
bun run preview              # Preview production build
```

Only use `bun` — npm, yarn, pnpm are not supported. Server runs on port 3002, frontend on 5173.

# Golden Rules

**Do's:**
- Generated components must use inline styles only: `style={{ ... }}`
- Generated components must have `render(<ComponentName />)` call at end
- Generated components must be self-contained (no external imports)
- Use plain JavaScript in generated code (no TypeScript syntax)
- Always validate API keys in .env or UI before generating
- Strip markdown code fences from AI responses (``` are not valid JSX)

**Don'ts:**
- Never hardcode API keys in source code — always use .env or runtime input
- Never assume imports are available in generated components (React is global in react-live context)
- Never generate TypeScript syntax in component code
- Never include external dependencies in generated components
- Never trust AI output directly — always post-process (strip fences, validate render call)

# Project Context

React Component Generator is an AI-powered tool that generates React components from natural language descriptions in real-time. Users select an AI provider (Anthropic Claude or Google Gemini), input a prompt, and see rendered output immediately. Backend proxies API calls; frontend renders via react-live.

Tech Stack: React 19, TypeScript, Vite (frontend) | Bun (backend) | Anthropic/Google APIs

# Standards & References

**Coding Conventions:**
- Frontend: TypeScript, React hooks, functional components
- Backend: Bun runtime, plain JavaScript
- Components: Retro 70s aesthetic (see src/index.css, src/App.css)

**Git & Commits:**
Use commit-helper skill or conventional format:
- `feat:` new features or providers
- `fix:` bug fixes
- `refactor:` code improvements
- `chore:` maintenance, tooling
- Write in Korean if possible; English acceptable for technical terms

**Maintenance Policy:**
If rules conflict with actual code, update AGENTS.md. Suggest improvements if framework changes or new patterns emerge.

# Context Map

- **[Backend API Routes & AI Integration](./server/AGENTS.md)** — Modify /api/generate, AI provider integrations, code processing logic
- **[Frontend Components & UI](./src/AGENTS.md)** — Add React components, modify PromptInput, ComponentCard, or styling
