# Klikbare demo Ondernemen met AI: implementatieplan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Een klikbare demo van het platform. Level 0 t/m 2 zijn uitgewerkt, level 3 t/m 6 zitten op slot, de repo is nagebootst in de browser, en er is een starter-repo met AI-instructies en vier skills.

**Architecture:** De repo van de deelnemer is de bron. Het platform schrijft Markdown-bestanden via een `RepoAdapter`. Een pure functie `evaluateLevel` leest een `RepoSnapshot` en bepaalt per check of een level af is. In de demo is dat een `MockRepoAdapter` op localStorage, die gevuld wordt met de bestanden uit `starter-repo/`. De UI is een dunne React-schil eromheen.

**Tech Stack:** Vite, React, TypeScript (~5.9), Tailwind v4 (`@tailwindcss/vite`), Vitest, `yaml` (frontmatter), `marked` (uitleg renderen). Node 24 staat lokaal.

**Spec:** `docs/superpowers/specs/2026-10-15-klikbare-demo-design.md`

## Global Constraints

- Alle UI-tekst, uitleg, skills en commitberichten zijn in het Nederlands.
- Morgen-huisstijl: alleen het lettertype Barlow. Kleuren: paars `#5B2D8E`, paars licht `#9B6FCF`, geel-groen `#D8FE56` (alleen als accent), achtergrond `#0C0818`, tekst `#F0ECF5`, `#D8CCEC` en `#7A6B8E`. Donker-first met paarse blobs, border-radius `20px`/`28px`.
- Templatemarker exact: `<!-- invullen -->`. Een bestand is "ingevuld" als het bestaat, de marker niet bevat, en naast koppen ook inhoud heeft.
- Paden exact volgens de spec: `level-0-werkplek/`, `level-1-idee/`, `level-2-probleemvalidatie/`, `level-2-probleemvalidatie/interviews/`, `skills/<naam>/SKILL.md`.
- Standaard aantal interviews: 5 bij B2B, 15 bij B2C. Te overschrijven via frontmatter `interviews_nodig` (een positief geheel getal).
- Audio komt nooit in de repo. Transcript-uploads accepteren alleen `.md` en `.txt`.
- Fase 1 maakt geen netwerkverbindingen met GitHub. Alles loopt via `MockRepoAdapter`.
- Git: werk op `feat/klikbare-demo`. Claude merget niet en deployt niet zonder akkoord. Een PR komt er alleen op verzoek.

## Review Focus

1. **Een audio-, Word- of pdf-bestand uploaden als transcript.** Verwacht: een duidelijke weigering met een verwijzing naar skill `transcriberen`, en geen rommel in de repo. Getest in Task 6 (`transcriptFromUpload` weigert `.m4a` en `.docx`).
2. **Een rol met leestekens, accenten of leeg.** Verwacht: een veilige bestandsnaam, met `interview` als terugval. Getest in Task 6 (`slugify`).
3. **`interviews_nodig` op 0, negatief, een breuk of tekst.** Verwacht: terugval op 5 (B2B) of 15 (B2C). Getest in Task 6 (`requiredInterviews`).
4. **Gaten in de nummering of een README in de interviewmap.** Verwacht: het volgende nummer is het hoogste plus één, en de README telt nergens mee. Getest in Task 6 (`nextTranscriptPath`).
5. **Nog geen setup gekozen bij de installatie-uitleg.** Verwacht: alle varianten zichtbaar, in plaats van een lege stap. Getest in Task 7 (`filterVariants`).

---

### Task 1: Platform opzetten + Markdown-bibliotheek

**Files:**
- Modify: `.gitignore`
- Create: `platform/package.json`, `platform/index.html`, `platform/tsconfig.json`, `platform/vite.config.ts`, `platform/src/main.tsx`, `platform/src/styles.css`
- Create: `platform/src/lib/markdown.ts`
- Test: `platform/src/lib/markdown.test.ts`

**Interfaces:**
- Produces: `MARKER: string`, `type Frontmatter = Record<string, unknown>`, `type ParsedMarkdown = { frontmatter: Frontmatter; body: string; error?: string }`, `toMarkdown(frontmatter: Frontmatter | null, body: string): string`, `parseMarkdown(text: string): ParsedMarkdown`, `isFilled(text: string | undefined | null): boolean`, `countListItems(text: string | undefined | null): number`

- [ ] **Step 1: Root-`.gitignore` aanvullen**

Voeg onderaan `.gitignore` toe:

```
# Node
node_modules/
dist/
```

- [ ] **Step 2: Projectbestanden schrijven**

`platform/package.json`:

```json
{
  "name": "ondernemen-met-ai-platform",
  "private": true,
  "version": "0.1.0",
  "type": "module",
  "scripts": {
    "dev": "vite",
    "build": "tsc --noEmit && vite build",
    "preview": "vite preview",
    "test": "vitest run",
    "typecheck": "tsc --noEmit"
  }
}
```

`platform/index.html`:

```html
<!doctype html>
<html lang="nl">
  <head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <title>Ondernemen met AI · Morgen</title>
    <link rel="preconnect" href="https://fonts.googleapis.com" />
    <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin />
    <link href="https://fonts.googleapis.com/css2?family=Barlow:wght@400;500;600;700;800;900&display=swap" rel="stylesheet" />
  </head>
  <body>
    <div id="root"></div>
    <script type="module" src="/src/main.tsx"></script>
  </body>
</html>
```

`platform/tsconfig.json`:

```json
{
  "compilerOptions": {
    "target": "ES2022",
    "lib": ["ES2022", "DOM", "DOM.Iterable"],
    "module": "ESNext",
    "moduleResolution": "bundler",
    "jsx": "react-jsx",
    "strict": true,
    "noUnusedLocals": true,
    "noUnusedParameters": true,
    "noEmit": true,
    "skipLibCheck": true,
    "isolatedModules": true,
    "types": ["vite/client"]
  },
  "include": ["src"]
}
```

`platform/vite.config.ts`:

```ts
import { defineConfig } from 'vitest/config';
import react from '@vitejs/plugin-react';
import tailwindcss from '@tailwindcss/vite';

export default defineConfig({
  plugins: [react(), tailwindcss()],
  // content/ en starter-repo/ staan naast platform/ en worden met import.meta.glob ingelezen
  server: { fs: { allow: ['..'] } },
  test: { environment: 'node', include: ['src/**/*.test.ts'] },
});
```

`platform/src/styles.css`:

```css
@import "tailwindcss";
```

`platform/src/main.tsx` (tijdelijk, Task 8 vervangt dit):

```tsx
import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import './styles.css';

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <p>Ondernemen met AI</p>
  </StrictMode>,
);
```

- [ ] **Step 3: Dependencies installeren**

```bash
cd platform && npm install react react-dom yaml && npm install -D typescript@~5.9.0 vite @vitejs/plugin-react @tailwindcss/vite tailwindcss vitest @types/react @types/react-dom
```

Verwacht: het installeren lukt, en `platform/package-lock.json` bestaat. Meldt npm een peer-dependency-conflict tussen Vite en `@vitejs/plugin-react` of `@tailwindcss/vite`? Installeer dan `vite@^7` in plaats van de nieuwste Vite, en noteer dat in het commitbericht.

- [ ] **Step 4: Falende test schrijven**

`platform/src/lib/markdown.test.ts`:

```ts
import { describe, expect, it } from 'vitest';
import { MARKER, countListItems, isFilled, parseMarkdown, toMarkdown } from './markdown';

describe('toMarkdown en parseMarkdown', () => {
  it('maakt frontmatter en leest hem terug', () => {
    const md = toMarkdown({ type: 'B2B', interviews_nodig: 5 }, '# Doelgroep\n\nZzp-fysiotherapeuten');
    expect(md.startsWith('---\n')).toBe(true);
    const parsed = parseMarkdown(md);
    expect(parsed.frontmatter).toEqual({ type: 'B2B', interviews_nodig: 5 });
    expect(parsed.body).toBe('# Doelgroep\n\nZzp-fysiotherapeuten\n');
    expect(parsed.error).toBeUndefined();
  });

  it('laat lege frontmatter weg', () => {
    expect(toMarkdown(null, 'Tekst')).toBe('Tekst\n');
    expect(toMarkdown({}, 'Tekst')).toBe('Tekst\n');
  });

  it('geeft een leesbare fout bij kapotte YAML', () => {
    const parsed = parseMarkdown('---\ntype: [B2B\n---\nTekst');
    expect(parsed.error).toBe('Frontmatter is geen geldige YAML');
    expect(parsed.frontmatter).toEqual({});
  });

  it('geeft een fout als de frontmatter niet wordt afgesloten', () => {
    expect(parseMarkdown('---\ntype: B2B\nTekst').error).toBe('Frontmatter wordt niet afgesloten met ---');
  });

  it('accepteert Windows-regeleindes', () => {
    expect(parseMarkdown('---\r\ntype: B2C\r\n---\r\nTekst').frontmatter).toEqual({ type: 'B2C' });
  });
});

describe('isFilled', () => {
  it('is false zonder bestand', () => {
    expect(isFilled(undefined)).toBe(false);
  });
  it('is false zolang de marker erin staat', () => {
    expect(isFilled(`# Idee\n\n${MARKER}\nMijn idee`)).toBe(false);
  });
  it('is false met alleen koppen', () => {
    expect(isFilled('# Idee\n\n## Wat\n')).toBe(false);
  });
  it('is true met echte inhoud', () => {
    expect(isFilled('# Idee\n\nEen fietskoerier voor apotheken.')).toBe(true);
  });
});

describe('countListItems', () => {
  it('telt alleen lijstregels met inhoud', () => {
    expect(countListItems('# Aannames\n\n- [wens] een\n- [haalbaar] twee\n-\n* drie\ntekst')).toBe(3);
  });
});
```

- [ ] **Step 5: Test draaien, verwacht een fout**

Run: `cd platform && npx vitest run src/lib/markdown.test.ts`
Expected: FAIL, met "Failed to resolve import './markdown'"

- [ ] **Step 6: Implementatie schrijven**

`platform/src/lib/markdown.ts`:

```ts
import YAML from 'yaml';

export const MARKER = '<!-- invullen -->';

export type Frontmatter = Record<string, unknown>;
export type ParsedMarkdown = { frontmatter: Frontmatter; body: string; error?: string };

export function toMarkdown(frontmatter: Frontmatter | null, body: string): string {
  const trimmed = body.trim();
  if (!frontmatter || Object.keys(frontmatter).length === 0) return `${trimmed}\n`;
  return `---\n${YAML.stringify(frontmatter)}---\n\n${trimmed}\n`;
}

export function parseMarkdown(text: string): ParsedMarkdown {
  const normalized = text.replace(/\r\n/g, '\n');
  if (!normalized.startsWith('---\n')) return { frontmatter: {}, body: normalized };
  const end = normalized.indexOf('\n---', 4);
  if (end === -1) {
    return { frontmatter: {}, body: normalized, error: 'Frontmatter wordt niet afgesloten met ---' };
  }
  const rawYaml = normalized.slice(4, end);
  const body = normalized.slice(end + 4).replace(/^\n+/, '');
  try {
    const data: unknown = YAML.parse(rawYaml);
    if (data === null || data === undefined) return { frontmatter: {}, body };
    if (typeof data !== 'object' || Array.isArray(data)) {
      return { frontmatter: {}, body, error: 'Frontmatter is geen lijst van velden' };
    }
    return { frontmatter: data as Frontmatter, body };
  } catch {
    return { frontmatter: {}, body, error: 'Frontmatter is geen geldige YAML' };
  }
}

export function isFilled(text: string | undefined | null): boolean {
  if (text == null) return false;
  if (text.includes(MARKER)) return false;
  const { body } = parseMarkdown(text);
  const content = body
    .split('\n')
    .filter((line) => !/^\s*#/.test(line))
    .join('\n');
  return content.trim().length > 0;
}

export function countListItems(text: string | undefined | null): number {
  if (text == null) return 0;
  const { body } = parseMarkdown(text);
  return body.split('\n').filter((line) => /^\s*[-*]\s+\S/.test(line)).length;
}
```

- [ ] **Step 7: Tests, typecheck en build draaien**

Run: `cd platform && npx vitest run && npm run typecheck && npx vite build`
Expected: alle 10 tests slagen, de typecheck geeft geen fouten, en de build maakt `dist/`.

- [ ] **Step 8: Commit**

```bash
git add .gitignore platform/
git commit -m "Platform opzetten met Markdown-bibliotheek"
```

---

### Task 2: RepoAdapter en MockRepoAdapter

**Files:**
- Create: `platform/src/lib/repo/types.ts`, `platform/src/lib/repo/snapshot.ts`, `platform/src/lib/repo/mockRepo.ts`
- Test: `platform/src/lib/repo/mockRepo.test.ts`

**Interfaces:**
- Produces: `type RepoInfo = { name: string; owner: string; isPrivate: boolean; mergedPullRequests: number }`, `type RepoSnapshot = { files: Record<string, string>; mergedPullRequests: number }`, `interface RepoAdapter { getInfo(); listFiles(); readFile(path); writeFile(path, content, message) }`, `buildSnapshot(adapter: RepoAdapter): Promise<RepoSnapshot>`, `type StorageLike`, `type Commit = { message: string; path: string; at: string }`, `DEMO_STORAGE_KEY`, `class MockRepoAdapter` met daarnaast `mergePullRequest()`, `commits()` en `reset()`

- [ ] **Step 1: Falende test schrijven**

`platform/src/lib/repo/mockRepo.test.ts`:

```ts
import { describe, expect, it } from 'vitest';
import { DEMO_STORAGE_KEY, MockRepoAdapter, type StorageLike } from './mockRepo';
import { buildSnapshot } from './snapshot';

class MapStorage implements StorageLike {
  data = new Map<string, string>();
  getItem(key: string) {
    return this.data.get(key) ?? null;
  }
  setItem(key: string, value: string) {
    this.data.set(key, value);
  }
  removeItem(key: string) {
    this.data.delete(key);
  }
}

class BrokenStorage implements StorageLike {
  getItem(): string | null {
    throw new Error('geblokkeerd');
  }
  setItem(): void {
    throw new Error('vol');
  }
  removeItem(): void {
    throw new Error('geblokkeerd');
  }
}

const seed = { 'README.md': '# Start\n' };

describe('MockRepoAdapter', () => {
  it('begint met de starter-bestanden en is privé', async () => {
    const repo = new MockRepoAdapter(new MapStorage(), seed);
    expect(await repo.listFiles()).toEqual(['README.md']);
    expect((await repo.getInfo()).isPrivate).toBe(true);
  });

  it('schrijft, leest en logt een commit', async () => {
    const repo = new MockRepoAdapter(new MapStorage(), seed);
    await repo.writeFile('level-1-idee/idee.md', '# Idee\n\nTekst\n', 'Idee vastgelegd');
    expect(await repo.readFile('level-1-idee/idee.md')).toBe('# Idee\n\nTekst\n');
    expect((await repo.commits())[0]).toMatchObject({ message: 'Idee vastgelegd', path: 'level-1-idee/idee.md' });
  });

  it('bewaart de stand voor een volgende sessie', async () => {
    const storage = new MapStorage();
    await new MockRepoAdapter(storage, seed).writeFile('a.md', 'x', 'm');
    expect(await new MockRepoAdapter(storage, seed).readFile('a.md')).toBe('x');
  });

  it('werkt in het geheugen als de opslag geblokkeerd is', async () => {
    const repo = new MockRepoAdapter(new BrokenStorage(), seed);
    await repo.writeFile('a.md', 'x', 'm');
    await repo.mergePullRequest();
    expect(await repo.readFile('a.md')).toBe('x');
    expect((await repo.getInfo()).mergedPullRequests).toBe(1);
  });

  it('valt terug op de starter-repo bij kapotte opslag', async () => {
    const storage = new MapStorage();
    storage.setItem(DEMO_STORAGE_KEY, '{kapot');
    expect(await new MockRepoAdapter(storage, seed).listFiles()).toEqual(['README.md']);
  });

  it('reset zet alles terug', async () => {
    const storage = new MapStorage();
    const repo = new MockRepoAdapter(storage, seed);
    await repo.writeFile('a.md', 'x', 'm');
    await repo.mergePullRequest();
    await repo.reset();
    expect(await repo.listFiles()).toEqual(['README.md']);
    expect((await repo.getInfo()).mergedPullRequests).toBe(0);
    expect(storage.getItem(DEMO_STORAGE_KEY)).toBeNull();
  });

  it('buildSnapshot bundelt bestanden en PR-teller', async () => {
    const repo = new MockRepoAdapter(new MapStorage(), seed);
    await repo.mergePullRequest();
    expect(await buildSnapshot(repo)).toEqual({ files: { 'README.md': '# Start\n' }, mergedPullRequests: 1 });
  });
});
```

- [ ] **Step 2: Test draaien, verwacht een fout**

Run: `cd platform && npx vitest run src/lib/repo`
Expected: FAIL, met "Failed to resolve import './mockRepo'"

- [ ] **Step 3: Implementatie schrijven**

`platform/src/lib/repo/types.ts`:

```ts
export type RepoInfo = { name: string; owner: string; isPrivate: boolean; mergedPullRequests: number };

export type RepoSnapshot = { files: Record<string, string>; mergedPullRequests: number };

export interface RepoAdapter {
  getInfo(): Promise<RepoInfo>;
  listFiles(): Promise<string[]>;
  readFile(path: string): Promise<string | null>;
  writeFile(path: string, content: string, message: string): Promise<void>;
}
```

`platform/src/lib/repo/snapshot.ts`:

```ts
import type { RepoAdapter, RepoSnapshot } from './types';

export async function buildSnapshot(adapter: RepoAdapter): Promise<RepoSnapshot> {
  const [info, paths] = await Promise.all([adapter.getInfo(), adapter.listFiles()]);
  const entries = await Promise.all(
    paths.map(async (path) => [path, (await adapter.readFile(path)) ?? ''] as const),
  );
  return { files: Object.fromEntries(entries), mergedPullRequests: info.mergedPullRequests };
}
```

`platform/src/lib/repo/mockRepo.ts`:

```ts
import type { RepoAdapter, RepoInfo } from './types';

export type StorageLike = Pick<Storage, 'getItem' | 'setItem' | 'removeItem'>;
export type Commit = { message: string; path: string; at: string };
type State = { files: Record<string, string>; mergedPullRequests: number; commits: Commit[] };

export const DEMO_STORAGE_KEY = 'ondernemen-met-ai.demo-repo.v1';

function isState(value: unknown): value is State {
  if (typeof value !== 'object' || value === null) return false;
  const v = value as Partial<State>;
  return typeof v.files === 'object' && v.files !== null && typeof v.mergedPullRequests === 'number' && Array.isArray(v.commits);
}

/** Nagebootste repo voor de klikbare demo. Bewaart in localStorage, valt terug op geheugen. */
export class MockRepoAdapter implements RepoAdapter {
  private memory: State | null = null;

  constructor(
    private readonly storage: StorageLike | null,
    private readonly seed: Record<string, string>,
    private readonly repoName = 'mijn-onderneming',
  ) {}

  private initial(): State {
    return { files: { ...this.seed }, mergedPullRequests: 0, commits: [] };
  }

  private load(): State {
    if (this.memory) return this.memory;
    let state = this.initial();
    try {
      const raw = this.storage?.getItem(DEMO_STORAGE_KEY);
      if (raw) {
        const parsed: unknown = JSON.parse(raw);
        if (isState(parsed)) state = parsed;
      }
    } catch {
      // Kapotte of geblokkeerde opslag: begin opnieuw vanaf de starter-repo.
    }
    this.memory = state;
    return state;
  }

  private save(state: State): void {
    this.memory = state;
    try {
      this.storage?.setItem(DEMO_STORAGE_KEY, JSON.stringify(state));
    } catch {
      // Opslag vol of geblokkeerd: de demo werkt verder in het geheugen.
    }
  }

  async getInfo(): Promise<RepoInfo> {
    return { name: this.repoName, owner: 'demo', isPrivate: true, mergedPullRequests: this.load().mergedPullRequests };
  }

  async listFiles(): Promise<string[]> {
    return Object.keys(this.load().files).sort();
  }

  async readFile(path: string): Promise<string | null> {
    return this.load().files[path] ?? null;
  }

  async writeFile(path: string, content: string, message: string): Promise<void> {
    const state = this.load();
    const commit: Commit = { message, path, at: new Date().toISOString() };
    this.save({ ...state, files: { ...state.files, [path]: content }, commits: [commit, ...state.commits].slice(0, 50) });
  }

  async mergePullRequest(): Promise<void> {
    const state = this.load();
    this.save({ ...state, mergedPullRequests: state.mergedPullRequests + 1 });
  }

  async commits(): Promise<Commit[]> {
    return this.load().commits;
  }

  async reset(): Promise<void> {
    this.memory = this.initial();
    try {
      this.storage?.removeItem(DEMO_STORAGE_KEY);
    } catch {
      // Niets te doen: het geheugen is al teruggezet.
    }
  }
}
```

- [ ] **Step 4: Tests draaien**

Run: `cd platform && npx vitest run && npm run typecheck`
Expected: alle tests slagen (17 in totaal), en de typecheck is schoon.

- [ ] **Step 5: Commit**

```bash
git add platform/src/lib/repo
git commit -m "RepoAdapter en nagebootste demo-repo"
```

---

### Task 3: Starter-repo + AI-instructies + seed

**Files:**
- Create: `starter-repo/README.md`, `starter-repo/AGENTS.md`, `starter-repo/CLAUDE.md`, `starter-repo/.gitignore`
- Create: `starter-repo/level-0-werkplek/werkplek.md`
- Create: `starter-repo/level-1-idee/idee.md`, `visie.md`, `madlib.md`, `aannames.md`
- Create: `starter-repo/level-2-probleemvalidatie/doelgroep.md`, `interviewvragen.md`, `analyse.md`, `interviews/README.md`
- Create: `platform/src/lib/repo/starterFiles.ts`
- Test: `platform/src/lib/repo/starterFiles.test.ts`

**Interfaces:**
- Consumes: `MARKER`, `parseMarkdown` (Task 1)
- Produces: `starterFiles: Record<string, string>` (sleutel = pad relatief aan `starter-repo/`, alleen `.md`-bestanden)

- [ ] **Step 1: Falende test schrijven**

`platform/src/lib/repo/starterFiles.test.ts`:

```ts
import { describe, expect, it } from 'vitest';
import { MARKER, parseMarkdown } from '../markdown';
import { starterFiles } from './starterFiles';

const TEMPLATES = [
  'level-0-werkplek/werkplek.md',
  'level-1-idee/idee.md',
  'level-1-idee/visie.md',
  'level-1-idee/madlib.md',
  'level-1-idee/aannames.md',
  'level-2-probleemvalidatie/doelgroep.md',
  'level-2-probleemvalidatie/interviewvragen.md',
  'level-2-probleemvalidatie/analyse.md',
];

describe('starter-repo', () => {
  it('bevat README, AGENTS.md, CLAUDE.md en alle templates', () => {
    for (const path of ['README.md', 'AGENTS.md', 'CLAUDE.md', 'level-2-probleemvalidatie/interviews/README.md', ...TEMPLATES]) {
      expect(starterFiles[path], path).toBeDefined();
    }
  });

  it('elk template bevat de marker precies één keer', () => {
    for (const path of TEMPLATES) {
      expect(starterFiles[path].split(MARKER).length - 1, path).toBe(1);
    }
  });

  it('geen ander bestand bevat de marker', () => {
    for (const [path, text] of Object.entries(starterFiles)) {
      if (!TEMPLATES.includes(path)) expect(text.includes(MARKER), path).toBe(false);
    }
  });

  it('CLAUDE.md importeert AGENTS.md', () => {
    expect(starterFiles['CLAUDE.md'].trim()).toBe('@AGENTS.md');
  });

  it('doelgroep.md heeft geldige frontmatter met B2B en 5 interviews', () => {
    const parsed = parseMarkdown(starterFiles['level-2-probleemvalidatie/doelgroep.md']);
    expect(parsed.error).toBeUndefined();
    expect(parsed.frontmatter).toEqual({ type: 'B2B', interviews_nodig: 5 });
  });
});
```

- [ ] **Step 2: Test draaien, verwacht een fout**

Run: `cd platform && npx vitest run src/lib/repo/starterFiles.test.ts`
Expected: FAIL, met "Failed to resolve import './starterFiles'"

- [ ] **Step 3: Seed-loader schrijven**

`platform/src/lib/repo/starterFiles.ts`:

```ts
// Leest alle Markdown-bestanden uit /starter-repo in als beginstand van de demo-repo.
const raw = import.meta.glob('../../../../starter-repo/**/*.md', {
  query: '?raw',
  import: 'default',
  eager: true,
}) as Record<string, string>;

export const starterFiles: Record<string, string> = Object.fromEntries(
  Object.entries(raw).map(([path, text]) => [path.replace(/^.*starter-repo\//, ''), text]),
);
```

- [ ] **Step 4: Starter-repo-bestanden schrijven**

`starter-repo/README.md`:

```markdown
# Mijn onderneming

Werkmap voor het programma Ondernemen met AI van Morgen. Hier verzamel je alles over je onderneming, zodat je AI het overzicht houdt.

Begin op het platform bij level 0. Je AI leest `AGENTS.md` voor de instructies.
```

`starter-repo/CLAUDE.md`:

```markdown
@AGENTS.md
```

`starter-repo/.gitignore`:

```
# Audio-opnames blijven op je eigen computer (privacy)
*.m4a
*.mp3
*.wav
*.aac
*.ogg
*.webm
.DS_Store
```

`starter-repo/AGENTS.md`:

```markdown
# Instructies voor je AI

Deze repo is de werkmap van een startende onderneming. De eigenaar volgt het programma Ondernemen met AI van Morgen. Jij bent hun AI-sparringpartner: je helpt context verzamelen, ordenen en uitwerken. De eigenaar doet zelf wat AI niet kan: met echte mensen praten, testen en verkopen.

## Hoe deze repo in elkaar zit

- `level-0-werkplek/`: setup en de git-oefening.
- `level-1-idee/`: idee, visie, waardepropositie (madlib) en aannames.
- `level-2-probleemvalidatie/`: doelgroep, interviewvragen, interviews en analyse.
- `skills/`: werkwijzen die je volgt als de eigenaar erom vraagt.

Elk level bouwt voort op het vorige. Lees eerst de bestanden van eerdere levels voordat je aan een nieuw level werkt.

## Templates en de markering

Templatebestanden beginnen met een HTML-commentaar met het woord "invullen". Het platform telt een bestand pas als ingevuld als die regel weg is. Haal hem alleen weg als het bestand echt is ingevuld, en alleen in overleg met de eigenaar.

## Skills

Vraagt de eigenaar om een skill, of past een skill duidelijk bij de vraag, lees dan het bijbehorende bestand en volg het:

- `skills/propositie-validator/SKILL.md`: waardepropositie kritisch toetsen (level 1).
- `skills/interviewhulp/SKILL.md`: interviewvragen formuleren en een interview voorbereiden (level 2).
- `skills/transcriberen/SKILL.md`: een gesprek omzetten naar een interviewbestand (level 2).
- `skills/interview-analyse/SKILL.md`: interviews analyseren en `analyse.md` vullen (level 2).

## Werkwijze

- Werk in het Nederlands, tenzij de eigenaar iets anders vraagt.
- Stel vragen één voor één en wacht op antwoord.
- Verzin geen marktinformatie. Wat niet uit de repo of van de eigenaar komt, benoem je als aanname.
- Wijzigingen gaan via een branch en een pull request. De eigenaar merget zelf.
- Schrijf kort en concreet, zonder vage claims.

## Privacy

- De repo hoort privé te zijn. Is hij openbaar, waarschuw dan voordat je interviews toevoegt.
- Gebruik in transcripts en analyses nooit volledige namen van geïnterviewden. Een rol en initialen zijn genoeg.
- Audiobestanden horen niet in de repo (zie `.gitignore`).
```

`starter-repo/level-0-werkplek/werkplek.md`:

```markdown
<!-- invullen -->
# Mijn werkplek

Deze oefening doe je in level 0 samen met je AI, via een branch en een pull request.

- Mijn AI-tool:
- Mijn computer:
- Wat ik geleerd heb over branches en pull requests:
```

`starter-repo/level-1-idee/idee.md`:

```markdown
<!-- invullen -->
# Idee

## Wat ga ik doen?

## Voor wie?

## Waarom ik?
```

`starter-repo/level-1-idee/visie.md`:

```markdown
<!-- invullen -->
# Visie

## Hoe ziet de wereld eruit als mijn onderneming slaagt?

## Wat is mijn bijdrage daaraan?
```

`starter-repo/level-1-idee/madlib.md`:

```markdown
<!-- invullen -->
# Waardepropositie (madlib)

Mijn bedrijf, [naam], biedt [aanbod] voor [doelgroep] die [probleem/behoefte] met [USP].
```

`starter-repo/level-1-idee/aannames.md`:

```markdown
<!-- invullen -->
# Aannames

Eén aanname per regel, met een label: [wens], [haalbaar] of [rendabel].

- [wens]
```

`starter-repo/level-2-probleemvalidatie/doelgroep.md`:

```markdown
---
type: B2B
interviews_nodig: 5
---
<!-- invullen -->
# Doelgroep

## Voor wie creëer je waarde?

## Wie gebruikt uiteindelijk je oplossing?

## Wie betaalt jou voor je oplossing?

## Wie beslist welke oplossing gebruikt wordt?
```

`starter-repo/level-2-probleemvalidatie/interviewvragen.md`:

```markdown
<!-- invullen -->
# Interviewvragen

Een gestructureerd interview in 8 vragen. Vraag 1 tot en met 4 vul je per gesprek zelf in. Vraag 5 tot en met 8 stel je in het gesprek. Formuleer ze samen met je AI (skill `interviewhulp`) en haal daarna de markering bovenaan weg.

## Over de geïnterviewde (vul je zelf in)

1. **Segment:** tot welke van onze doelgroepen behoort de geïnterviewde?
2. **Locatie:** waar (land, plaats) werkt of woont de geïnterviewde?
3. **Rol:** wat is de rol van de geïnterviewde?
4. **DMU:** spreek je de beslisser (Decision Making Unit)? Ja of nee.

## In het gesprek

5. **Kernactiviteit:**
6. **Alternatief:**
7. **Overwegingen:**
8. **Meest genoemde klacht:**

## Regels

- Praat niet over je idee of oplossing.
- Vraag niet naar de toekomst, alleen naar wat iemand nu doet.
```

`starter-repo/level-2-probleemvalidatie/analyse.md`:

```markdown
<!-- invullen -->
# Analyse van de interviews

| Doelgroep | Geïnterviewde | Kernactiviteit (5) | Alternatief (6) | Overwegingen (7) | Meest genoemde klachten (8) |
|---|---|---|---|---|---|
| | | | | | |

## Inzicht

Onze target customer ervaart problemen met [kernactiviteit, vraag 5]. Als we hun belangrijkste overwegingen bekijken [overwegingen, vraag 7], lossen ze dat op dit moment op met [alternatieven, vraag 6]. De nadelen hiervan zijn [meest genoemde klachten, vraag 8].

## Eerste doelgroep

Welke groep ervaart allemaal hetzelfde probleem?
```

`starter-repo/level-2-probleemvalidatie/interviews/README.md`:

```markdown
# Interviews

Eén bestand per interview: `01-rol.md`, `02-rol.md`, enzovoort. Gebruik een rol en initialen, nooit een volledige naam. Audio hoort hier niet: die blijft op je eigen computer.
```

- [ ] **Step 5: Tests draaien**

Run: `cd platform && npx vitest run && npm run typecheck`
Expected: alle tests slagen.

- [ ] **Step 6: Commit**

```bash
git add starter-repo platform/src/lib/repo/starterFiles.ts platform/src/lib/repo/starterFiles.test.ts
git commit -m "Starter-repo met AI-instructies en templates per level"
```

---

### Task 4: Vier skills in de starter-repo

**Files:**
- Create: `starter-repo/skills/propositie-validator/SKILL.md`, `starter-repo/skills/interviewhulp/SKILL.md`, `starter-repo/skills/transcriberen/SKILL.md`, `starter-repo/skills/interview-analyse/SKILL.md`
- Test: `platform/src/lib/repo/skills.test.ts`

**Interfaces:**
- Consumes: `starterFiles` (Task 3), `parseMarkdown` (Task 1)

- [ ] **Step 1: Falende test schrijven**

`platform/src/lib/repo/skills.test.ts`:

```ts
import { describe, expect, it } from 'vitest';
import { parseMarkdown } from '../markdown';
import { starterFiles } from './starterFiles';

const SKILLS = ['propositie-validator', 'interviewhulp', 'transcriberen', 'interview-analyse'];

describe('skills', () => {
  for (const name of SKILLS) {
    it(`${name} heeft geldige frontmatter en staat in AGENTS.md`, () => {
      const path = `skills/${name}/SKILL.md`;
      expect(starterFiles[path], path).toBeDefined();
      const { frontmatter, error } = parseMarkdown(starterFiles[path]);
      expect(error).toBeUndefined();
      expect(frontmatter.name).toBe(name);
      expect(typeof frontmatter.description).toBe('string');
      expect((frontmatter.description as string).length).toBeGreaterThan(40);
      expect(starterFiles['AGENTS.md']).toContain(path);
    });
  }
});
```

- [ ] **Step 2: Test draaien, verwacht een fout**

Run: `cd platform && npx vitest run src/lib/repo/skills.test.ts`
Expected: FAIL, met 4 mislukte tests ("skills/propositie-validator/SKILL.md: expected undefined to be defined")

- [ ] **Step 3: Skills schrijven**

`starter-repo/skills/propositie-validator/SKILL.md`:

```markdown
---
name: propositie-validator
description: Toetst de waardepropositie uit level 1 kritisch op idee/oplossing, probleem en klant, met twaalf reflectievragen. Gebruik bij "toets mijn propositie", "is mijn idee scherp genoeg" of in level 1.
---

# Propositie-validator

Je helpt de eigenaar hun waardepropositie te toetsen en aan te scherpen. Je bent een kritische, nieuwsgierige sparringpartner: direct en eerlijk, maar constructief. Je geeft geen definitieve waarheden. Je stelt scherpe vragen waarmee de eigenaar zelf verder komt.

## Werkwijze

1. Lees `level-1-idee/idee.md`, `visie.md`, `madlib.md` en `aannames.md`.
2. Ontbreekt er iets uit de madlib (naam, aanbod, doelgroep, probleem/behoefte, USP), vraag het dan één voor één. Moedig aan om concreet te zijn: "Kun je dit specifieker maken?" De doelgroep moet klein genoeg zijn om je early adopter te beschrijven.
3. Vat samen in één zin: "Mijn bedrijf, [naam], biedt [aanbod] voor [doelgroep] die [probleem/behoefte] met [USP]."
4. Beoordeel kritisch op drie punten, elk met vier vragen:

   **Idee / oplossing**
   - Is de oplossing specifiek en concreet genoeg?
   - Welk probleem lost deze oplossing op?
   - Welke klantsegmenten kun je voor deze oplossing bedenken?
   - Wat zijn alternatieve oplossingen?

   **Probleem**
   - Is het klantprobleem specifiek genoeg?
   - Welke oplossingen zijn al beschikbaar voor dit probleem?
   - Welke klantsegmenten hebben dit probleem?
   - Wat zijn alternatieve problemen?

   **Potentiële klant**
   - Is het klantsegment specifiek genoeg om de klant echt te vinden en te benaderen?
   - Welke andere problemen heeft dit klantsegment?
   - Welke oplossingen zie je voor dit klantsegment?
   - Wat zijn alternatieve klantsegmenten?

5. Vraag: "Wat vind je van deze feedback? Wil je iets aanscherpen?" Help de eigenaar hun antwoorden bij te stellen.
6. Leg de belangrijkste actiepunten vast in `level-1-idee/feedback-propositie.md`. Werk `madlib.md` en `aannames.md` alleen bij als de eigenaar dat wil.

## Daarna

Wijs op level 2: daar worden de [wens]-aannames getoetst in interviews met de doelgroep.
```

`starter-repo/skills/interviewhulp/SKILL.md`:

```markdown
---
name: interviewhulp
description: Helpt gestructureerde doelgroepinterviews voorbereiden volgens de Mom Test, en vult vraag 5 tot en met 8 in interviewvragen.md. Gebruik in level 2 of bij "help me met mijn interviewvragen".
---

# Interviewhulp

Je helpt de eigenaar doelgroepinterviews voor te bereiden waarmee ze hun waardepropositie kunnen toetsen. Het interview gaat alleen over wat iemand nu doet. Nooit over het idee van de eigenaar, en nooit over wensen voor de toekomst.

## Werkwijze

1. Lees `level-1-idee/madlib.md`, `level-1-idee/aannames.md` en `level-2-probleemvalidatie/doelgroep.md`.
2. Controleer dat de eigenaar weet wie ze gaan spreken. Per geïnterviewde vullen ze vooraf in: segment (welke doelgroep), locatie (land, plaats), rol, en of ze de beslisser (DMU) spreken.
3. Formuleer samen vraag 5 tot en met 8, toegespitst op deze doelgroep:
   - **5. Kernactiviteit:** wat doet iemand om zijn doel te bereiken? Waar is hij of zij het meest mee bezig?
   - **6. Alternatief:** wat gebruikt iemand nu? Excel, een systeem, met de hand?
   - **7. Overwegingen:** waarom koos iemand voor dit alternatief?
   - **8. Meest genoemde klacht:** wat is de grootste klacht over de huidige manier?
   Voeg een verdiepende vraag toe: waar koopt of vindt iemand het huidige alternatief? Dat zegt iets over hoe je deze doelgroep later bereikt.
4. Toets elke vraag: gaat hij over nu, niet over de toekomst? Verraadt hij het idee niet? Is het een open vraag?
5. Zet de vragen in `level-2-probleemvalidatie/interviewvragen.md` en haal de markering bovenaan weg als de eigenaar akkoord is.
6. Geef een korte gespreksopening mee, met een toestemmingszin: "Mag ik aantekeningen maken of het gesprek opnemen? Ik gebruik geen namen."

## Regels voor het gesprek

- Praat niet over je idee of oplossing.
- Vraag niet naar de toekomst, alleen naar het heden.
- Toon eerst oprechte interesse en luister. Stel daarna pas vraag 5 tot en met 8. Het is een gesprek, geen vragenlijst.

## Voorbeeld

Spark, een energiebedrijf in Afrika, had al een product en omzet, maar groeide niet. Pas toen ze op locatie meekeken met hun distributiepartners, zagen ze dat niet het product of de prijs het probleem was, maar financiering: klanten kregen het geld voor een bestelling niet rond. Toen Spark financiering ging aanbieden, groeide het wel. Ook als je al verkoopt, blijf je je aannames toetsen met interviews.
```

`starter-repo/skills/transcriberen/SKILL.md`:

````markdown
---
name: transcriberen
description: Zet een interview (tekstversie uit Teams, Zoom, een opname-app of aantekeningen) om naar een gepseudonimiseerd interviewbestand in level-2-probleemvalidatie/interviews/. Gebruik bij "zet dit transcript om" of in level 2.
---

# Transcriberen

Je zet een interview om naar een vast format, zodat alle interviews later naast elkaar te analyseren zijn.

## Invoer

- Een tekstversie van het gesprek: een export uit Teams of Zoom, een .txt of .vtt uit een opname-app, of aantekeningen van de eigenaar.
- Krijg je een audiobestand? Kijk of er lokaal een transcriptieprogramma is, bijvoorbeeld `whisper`. Is dat er niet, leg dan uit dat lokaal transcriberen in een volgende versie komt, en raad aan de transcriptie van de opname-app te gebruiken. Stuur audio nooit naar een externe dienst zonder uitdrukkelijke toestemming van de eigenaar.

## Uitvoer

Maak `level-2-probleemvalidatie/interviews/NN-rol.md`. NN is het volgende vrije nummer (01, 02, ...). Rol is de rol van de geïnterviewde, in kleine letters met streepjes.

```markdown
---
rol: apotheker
segment: zelfstandige apotheken
locatie: Breda
dmu: ja
datum: 2026-10-20
---
# Interview 03: apotheker (J.)

## 5. Kernactiviteit

## 6. Alternatief

## 7. Overwegingen

## 8. Meest genoemde klacht

## Opvallend

## Transcript
```

Vul elke sectie met wat de geïnterviewde zei, zo letterlijk mogelijk. Onder "Opvallend" zet je wat je niet verwachtte.

## Privacy

- Vervang namen van personen en bedrijven door een rol en initialen.
- Laat adressen, telefoonnummers en e-mailadressen weg.
- Audiobestanden komen nooit in de repo.
````

`starter-repo/skills/interview-analyse/SKILL.md`:

```markdown
---
name: interview-analyse
description: Analyseert alle interviews in level-2-probleemvalidatie/interviews/ en vult analyse.md met een vergelijkingstabel en een inzicht. Gebruik bij "analyseer mijn interviews" of als level 2 bijna af is.
---

# Interview-analyse

Je legt alle interviews naast elkaar en helpt de eigenaar zien wat de markt zegt.

## Werkwijze

1. Lees `level-2-probleemvalidatie/doelgroep.md`, `interviewvragen.md` en alle bestanden in `interviews/`.
2. Vul de tabel in `analyse.md`: één regel per interview, met doelgroep, geïnterviewde (rol en initialen), kernactiviteit (5), alternatief (6), overwegingen (7) en meest genoemde klachten (8).
3. Zoek patronen per doelgroep. Welke klachten komen steeds terug? Welke alternatieven? Benoem ook wat je niet verwachtte.
4. Schrijf het inzicht in deze vorm:

   > Onze target customer ervaart problemen met [kernactiviteit, vraag 5]. Als we hun belangrijkste overwegingen bekijken [overwegingen, vraag 7], lossen ze dat op dit moment op met [alternatieven, vraag 6]. De nadelen hiervan zijn [meest genoemde klachten, vraag 8].

5. Beantwoord de vraag van de mijlpaal: is er een eerste doelgroep die allemaal hetzelfde probleem ervaart? Zo nee: wat zou de eigenaar nu anders doen? Een andere doelgroep, meer interviews of andere vragen?
6. Vergelijk met `level-1-idee/aannames.md`. Welke aannames zijn bevestigd, en welke ontkracht?
7. Laat de eigenaar het resultaat lezen. Haal pas daarna de markering bovenaan weg.

## Regels

- Baseer je alleen op de interviews. Wat je niet kunt onderbouwen, benoem je als vermoeden.
- Gebruik geen volledige namen.
```

- [ ] **Step 4: Tests draaien**

Run: `cd platform && npx vitest run`
Expected: alle tests slagen, ook "geen ander bestand bevat de marker" uit Task 3.

- [ ] **Step 5: Commit**

```bash
git add starter-repo/skills platform/src/lib/repo/skills.test.ts
git commit -m "Vier skills voor level 1 en 2 in de starter-repo"
```

---

### Task 5: Leveltypes en check-bouwstenen

**Files:**
- Create: `platform/src/lib/levels/types.ts`, `platform/src/lib/levels/checks.ts`
- Test: `platform/src/lib/levels/checks.test.ts`

**Interfaces:**
- Consumes: `isFilled`, `countListItems`, `parseMarkdown` (Task 1), `RepoSnapshot` (Task 2)
- Produces (`types.ts`): `CheckResult`, `Check = { id; stepId; label; run(s): CheckResult }`, `CheckOutcome`, `Field`, `FormValues`, `FileWrite = { path; content; message }`, `FormStep`, `ActionStep`, `UploadStep`, `Step`, `LevelDef`, `LevelEvaluation`, `LevelState = 'done' | 'active' | 'locked'`
- Produces (`checks.ts`): `fileFilled(id, stepId, path, label)`, `minListItems(id, stepId, path, min, label)`, `minFilledFiles(id, stepId, folder, required, label)`, `minMergedPullRequests(id, stepId, min, label)`, `mdFilesIn(s, folder): string[]`, `filledFilesIn(s, folder): string[]`, `frontmatterOf(s, path): Record<string, unknown>`

- [ ] **Step 1: Types schrijven**

`platform/src/lib/levels/types.ts`:

```ts
import type { RepoSnapshot } from '../repo/types';

export type CheckResult = { ok: boolean; reason: string };
export type Check = { id: string; stepId: string; label: string; run: (s: RepoSnapshot) => CheckResult };
export type CheckOutcome = CheckResult & { id: string; stepId: string; label: string };

export type Field =
  | { kind: 'text'; name: string; label: string; placeholder?: string; optional?: boolean }
  | { kind: 'textarea'; name: string; label: string; placeholder?: string; optional?: boolean }
  | { kind: 'select'; name: string; label: string; options: { value: string; label: string }[] }
  | { kind: 'number'; name: string; label: string; placeholder?: string; optional?: boolean };

export type FormValues = Record<string, string>;
export type FileWrite = { path: string; content: string; message: string };

type StepBase = { id: string; title: string; aiPrompt?: string };
export type FormStep = StepBase & {
  kind: 'form';
  fields: Field[];
  toFile: (values: FormValues, s: RepoSnapshot) => FileWrite;
};
export type ActionStep = StepBase & { kind: 'action' };
export type UploadStep = StepBase & {
  kind: 'uploads';
  folder: string;
  required: (s: RepoSnapshot) => number;
};
export type Step = FormStep | ActionStep | UploadStep;

export type LevelDef = {
  id: number;
  name: string;
  summary: string;
  milestone: string;
  /** false = nog niet uitgewerkt; zo'n level is nooit af. */
  ready: boolean;
  steps: Step[];
  checks: Check[];
};

export type LevelEvaluation = { levelId: number; done: boolean; results: CheckOutcome[] };
export type LevelState = 'done' | 'active' | 'locked';
```

- [ ] **Step 2: Falende test schrijven**

`platform/src/lib/levels/checks.test.ts`:

```ts
import { describe, expect, it } from 'vitest';
import { MARKER } from '../markdown';
import type { RepoSnapshot } from '../repo/types';
import { fileFilled, filledFilesIn, frontmatterOf, mdFilesIn, minFilledFiles, minListItems, minMergedPullRequests } from './checks';

const snap = (files: Record<string, string>, mergedPullRequests = 0): RepoSnapshot => ({ files, mergedPullRequests });

describe('fileFilled', () => {
  const check = fileFilled('idee', 'l1-idee', 'level-1-idee/idee.md', 'Idee ingevuld');
  it('meldt een ontbrekend bestand', () => {
    expect(check.run(snap({}))).toEqual({ ok: false, reason: 'level-1-idee/idee.md staat nog niet in je repo' });
  });
  it('meldt een bestand met marker', () => {
    expect(check.run(snap({ 'level-1-idee/idee.md': `${MARKER}\n# Idee` })).ok).toBe(false);
  });
  it('slaagt met inhoud', () => {
    expect(check.run(snap({ 'level-1-idee/idee.md': '# Idee\n\nBakfiets.' })).ok).toBe(true);
  });
  it('faalt met een leesbare reden bij kapotte frontmatter', () => {
    expect(check.run(snap({ 'level-1-idee/idee.md': '---\ntype: [B2B\n---\n# Idee\n\nBakfiets.' }))).toEqual({
      ok: false,
      reason: 'level-1-idee/idee.md: Frontmatter is geen geldige YAML',
    });
  });
});

describe('minListItems', () => {
  it('telt lijstregels', () => {
    const check = minListItems('a', 'l1-aannames', 'a.md', 3, 'Drie aannames');
    expect(check.run(snap({ 'a.md': '- een\n- twee' }))).toEqual({ ok: false, reason: '2 van de 3' });
    expect(check.run(snap({ 'a.md': '- een\n- twee\n- drie' })).ok).toBe(true);
  });
});

describe('bestanden in een map', () => {
  const files = {
    'int/README.md': '# Uitleg\n\nTekst',
    'int/01-a.md': '# 1\n\nInhoud',
    'int/02-b.md': `${MARKER}\n# 2`,
    'int/sub/03-c.md': '# 3\n\nInhoud',
    'int/notities.txt': 'tekst',
  };
  it('mdFilesIn negeert README, submappen en niet-md', () => {
    expect(mdFilesIn(snap(files), 'int')).toEqual(['int/01-a.md', 'int/02-b.md']);
  });
  it('filledFilesIn telt alleen ingevulde bestanden', () => {
    expect(filledFilesIn(snap(files), 'int/')).toEqual(['int/01-a.md']);
  });
  it('minFilledFiles gebruikt het gevraagde aantal', () => {
    const check = minFilledFiles('t', 'l2-transcripts', 'int', () => 2, 'Twee interviews');
    expect(check.run(snap(files))).toEqual({ ok: false, reason: '1 van de 2' });
  });
});

describe('minMergedPullRequests', () => {
  it('kijkt naar de PR-teller', () => {
    const check = minMergedPullRequests('pr', 'l0-git', 1, 'PR gemerged');
    expect(check.run(snap({}, 0)).ok).toBe(false);
    expect(check.run(snap({}, 1)).ok).toBe(true);
  });
});

describe('frontmatterOf', () => {
  it('geeft een leeg object bij een ontbrekend bestand', () => {
    expect(frontmatterOf(snap({}), 'x.md')).toEqual({});
  });
  it('leest de velden', () => {
    expect(frontmatterOf(snap({ 'x.md': '---\ntype: B2C\n---\nTekst' }), 'x.md')).toEqual({ type: 'B2C' });
  });
});
```

- [ ] **Step 3: Test draaien, verwacht een fout**

Run: `cd platform && npx vitest run src/lib/levels/checks.test.ts`
Expected: FAIL, met "Failed to resolve import './checks'"

- [ ] **Step 4: Implementatie schrijven**

`platform/src/lib/levels/checks.ts`:

```ts
import { countListItems, isFilled, parseMarkdown } from '../markdown';
import type { RepoSnapshot } from '../repo/types';
import type { Check } from './types';

function folderPrefix(folder: string): string {
  return folder.endsWith('/') ? folder : `${folder}/`;
}

/** Markdown-bestanden direct in een map, zonder README en zonder submappen. */
export function mdFilesIn(s: RepoSnapshot, folder: string): string[] {
  const prefix = folderPrefix(folder);
  return Object.keys(s.files)
    .filter((path) => {
      if (!path.startsWith(prefix) || !path.endsWith('.md')) return false;
      const rest = path.slice(prefix.length);
      return !rest.includes('/') && rest.toLowerCase() !== 'readme.md';
    })
    .sort();
}

export function filledFilesIn(s: RepoSnapshot, folder: string): string[] {
  return mdFilesIn(s, folder).filter((path) => isFilled(s.files[path]));
}

export function frontmatterOf(s: RepoSnapshot, path: string): Record<string, unknown> {
  const text = s.files[path];
  return text === undefined ? {} : parseMarkdown(text).frontmatter;
}

export function fileFilled(id: string, stepId: string, path: string, label: string): Check {
  return {
    id,
    stepId,
    label,
    run: (s) => {
      const text = s.files[path];
      if (text === undefined) return { ok: false, reason: `${path} staat nog niet in je repo` };
      const { error } = parseMarkdown(text);
      if (error) return { ok: false, reason: `${path}: ${error}` };
      return isFilled(text)
        ? { ok: true, reason: `${path} is ingevuld` }
        : { ok: false, reason: `${path} is nog niet ingevuld` };
    },
  };
}

export function minListItems(id: string, stepId: string, path: string, min: number, label: string): Check {
  return {
    id,
    stepId,
    label,
    run: (s) => {
      const count = countListItems(s.files[path]);
      return { ok: count >= min, reason: `${count} van de ${min}` };
    },
  };
}

export function minFilledFiles(
  id: string,
  stepId: string,
  folder: string,
  required: (s: RepoSnapshot) => number,
  label: string,
): Check {
  return {
    id,
    stepId,
    label,
    run: (s) => {
      const need = required(s);
      const count = filledFilesIn(s, folder).length;
      return { ok: count >= need, reason: `${count} van de ${need}` };
    },
  };
}

export function minMergedPullRequests(id: string, stepId: string, min: number, label: string): Check {
  return {
    id,
    stepId,
    label,
    run: (s) => ({ ok: s.mergedPullRequests >= min, reason: `${s.mergedPullRequests} van de ${min}` }),
  };
}
```

- [ ] **Step 5: Tests en typecheck draaien**

Run: `cd platform && npx vitest run && npm run typecheck`
Expected: alle tests slagen, de typecheck is schoon.

- [ ] **Step 6: Commit**

```bash
git add platform/src/lib/levels
git commit -m "Leveltypes en checks op de repo-snapshot"
```

---

### Task 6: Leveldefinities 0–6 en evaluatie

**Files:**
- Create: `platform/src/lib/levels/level0.ts`, `level1.ts`, `level2.ts`, `lockedLevels.ts`, `index.ts`, `evaluate.ts`
- Test: `platform/src/lib/levels/levels.test.ts`

**Interfaces:**
- Consumes: alles uit Task 5, `toMarkdown` (Task 1), `starterFiles` (Task 3, alleen in de test)
- Produces:
  - `level0.ts`: `SETUP_PATH`, `WERKPLEK_PATH`, `level0`
  - `level1.ts`: `IDEE_PATH`, `VISIE_PATH`, `MADLIB_PATH`, `AANNAMES_PATH`, `madlibSentence(v: FormValues): string`, `aannamesToMarkdown(text: string): string`, `level1`
  - `level2.ts`: `DOELGROEP_PATH`, `VRAGEN_PATH`, `ANALYSE_PATH`, `INTERVIEWS_DIR`, `defaultInterviews(type: unknown): number`, `requiredInterviews(s): number`, `slugify(text): string`, `nextTranscriptPath(s, rol): string`, `isTranscriptFileName(name): boolean`, `transcriptFromUpload(fileName, text, rol, s): FileWrite | { error: string }`, `level2`
  - `lockedLevels.ts`: `level3`, `level4`, `level5`, `level6`
  - `index.ts`: `LEVELS: LevelDef[]`
  - `evaluate.ts`: `evaluateLevel(level, s): LevelEvaluation`, `levelStatus(levels, s): Record<number, LevelState>`
  - Veldnamen per formulierstap (Task 8 en 9 gebruiken ze): `l0-setup` {os, ai}; `l1-idee` {wat, voorWie, waaromJij}; `l1-visie` {wereld, bijdrage}; `l1-madlib` {naam, aanbod, doelgroep, probleem, usp}; `l1-aannames` {aannames}; `l2-doelgroep` {waarde, gebruiker, betaler, beslisser, type, aantal}

- [ ] **Step 1: Falende test schrijven**

`platform/src/lib/levels/levels.test.ts`:

```ts
import { describe, expect, it } from 'vitest';
import { MARKER, parseMarkdown, toMarkdown } from '../markdown';
import { starterFiles } from '../repo/starterFiles';
import type { RepoSnapshot } from '../repo/types';
import { evaluateLevel, levelStatus } from './evaluate';
import { LEVELS } from './index';
import { SETUP_PATH, WERKPLEK_PATH, level0 } from './level0';
import { AANNAMES_PATH, IDEE_PATH, MADLIB_PATH, VISIE_PATH, aannamesToMarkdown, level1, madlibSentence } from './level1';
import {
  ANALYSE_PATH,
  DOELGROEP_PATH,
  INTERVIEWS_DIR,
  VRAGEN_PATH,
  level2,
  nextTranscriptPath,
  requiredInterviews,
  slugify,
  transcriptFromUpload,
} from './level2';
import type { FormStep, LevelDef } from './types';

const snap = (files: Record<string, string>, mergedPullRequests = 0): RepoSnapshot => ({
  files: { ...starterFiles, ...files },
  mergedPullRequests,
});

const formStep = (level: LevelDef, id: string): FormStep => {
  const step = level.steps.find((s) => s.id === id);
  if (!step || step.kind !== 'form') throw new Error(`geen formulierstap ${id}`);
  return step;
};

const LEVEL0_DONE = {
  [SETUP_PATH]: toMarkdown({ os: 'mac', ai: 'codex' }, '# Mijn setup\n\nMac, Codex'),
  [WERKPLEK_PATH]: '# Mijn werkplek\n\nIngevuld.\n',
};
const LEVEL1_DONE = {
  [IDEE_PATH]: '# Idee\n\nBakfietskoerier.\n',
  [VISIE_PATH]: '# Visie\n\nSchone binnenstad.\n',
  [MADLIB_PATH]: '# Madlib\n\nMijn bedrijf, Trapzorg, biedt ...\n',
  [AANNAMES_PATH]: '# Aannames\n\n- [wens] a\n- [haalbaar] b\n- [rendabel] c\n',
};
const doelgroep = (type: string, nodig?: unknown) =>
  toMarkdown({ type, ...(nodig === undefined ? {} : { interviews_nodig: nodig }) }, '# Doelgroep\n\nApothekers.');
const interviews = (n: number) =>
  Object.fromEntries(
    Array.from({ length: n }, (_, i) => [
      `${INTERVIEWS_DIR}/${String(i + 1).padStart(2, '0')}-apotheker.md`,
      `# Interview ${i + 1}\n\nInhoud.\n`,
    ]),
  );
const level2Done = (n: number, type = 'B2B') => ({
  [DOELGROEP_PATH]: doelgroep(type),
  [VRAGEN_PATH]: '# Vragen\n\n5. Wat doet u op een gewone dag?\n',
  ...interviews(n),
  [ANALYSE_PATH]: '# Analyse\n\nInzicht.\n',
});

describe('levelStatus', () => {
  it('bij de start is alleen level 0 actief', () => {
    expect(levelStatus(LEVELS, snap({}))).toEqual({ 0: 'active', 1: 'locked', 2: 'locked', 3: 'locked', 4: 'locked', 5: 'locked', 6: 'locked' });
  });

  it('levels gaan op volgorde open', () => {
    expect(levelStatus(LEVELS, snap(LEVEL1_DONE))[1]).toBe('locked');
  });

  it('na level 0 t/m 2 is level 3 actief maar nooit af', () => {
    expect(levelStatus(LEVELS, snap({ ...LEVEL0_DONE, ...LEVEL1_DONE, ...level2Done(5) }, 1))).toEqual({
      0: 'done', 1: 'done', 2: 'done', 3: 'active', 4: 'locked', 5: 'locked', 6: 'locked',
    });
  });
});

describe('level 0', () => {
  it('is pas af met een gemergde pull request', () => {
    expect(evaluateLevel(level0, snap(LEVEL0_DONE, 0)).done).toBe(false);
    expect(evaluateLevel(level0, snap(LEVEL0_DONE, 1)).done).toBe(true);
  });

  it('setup-formulier schrijft frontmatter', () => {
    const write = formStep(level0, 'l0-setup').toFile({ os: 'windows', ai: 'codex' }, snap({}));
    expect(write.path).toBe(SETUP_PATH);
    expect(parseMarkdown(write.content).frontmatter).toEqual({ os: 'windows', ai: 'codex' });
  });
});

describe('level 1', () => {
  it('templates met de markering tellen niet', () => {
    const evaluation = evaluateLevel(level1, snap({}));
    expect(evaluation.done).toBe(false);
    expect(evaluation.results.find((r) => r.id === 'idee')?.reason).toBe('level-1-idee/idee.md is nog niet ingevuld');
  });

  it('is af met alle bestanden en drie aannames', () => {
    expect(evaluateLevel(level1, snap(LEVEL1_DONE)).done).toBe(true);
  });

  it('madlibSentence maakt één zin', () => {
    expect(madlibSentence({ naam: 'Trapzorg', aanbod: 'bezorging per bakfiets', doelgroep: 'apotheken in Breda', probleem: 'medicijnen niet op tijd bezorgd krijgen', usp: 'vaste koeriers ' })).toBe(
      'Mijn bedrijf, Trapzorg, biedt bezorging per bakfiets voor apotheken in Breda die medicijnen niet op tijd bezorgd krijgen met vaste koeriers.',
    );
  });

  it('aannamesToMarkdown maakt een lijst en labelt ongelabelde regels', () => {
    expect(aannamesToMarkdown('[wens] Apotheken willen dit\n\n- Een bakfiets haalt 20 adressen\n')).toBe(
      '# Aannames\n\n- [wens] Apotheken willen dit\n- [ongelabeld] Een bakfiets haalt 20 adressen',
    );
  });
});

describe('level 2', () => {
  it('4 van de 5 transcripts is niet genoeg, 5 wel', () => {
    expect(evaluateLevel(level2, snap(level2Done(4))).done).toBe(false);
    expect(evaluateLevel(level2, snap(level2Done(5))).done).toBe(true);
  });

  it('een transcript met de markering telt niet', () => {
    const files = { ...level2Done(4), [`${INTERVIEWS_DIR}/05-apotheker.md`]: `${MARKER}\n# Interview 5\n\nInhoud` };
    expect(evaluateLevel(level2, snap(files)).done).toBe(false);
  });

  it('B2C vraagt 15 interviews', () => {
    expect(evaluateLevel(level2, snap(level2Done(5, 'B2C'))).done).toBe(false);
    expect(evaluateLevel(level2, snap(level2Done(15, 'B2C'))).done).toBe(true);
  });

  it('interviews_nodig overschrijft de standaard', () => {
    expect(evaluateLevel(level2, snap({ ...level2Done(3), [DOELGROEP_PATH]: doelgroep('B2B', 3) })).done).toBe(true);
  });

  it('requiredInterviews valt terug bij ongeldige waarden', () => {
    for (const value of [0, -2, 'vijf', 2.5]) {
      expect(requiredInterviews(snap({ [DOELGROEP_PATH]: doelgroep('B2B', value) })), String(value)).toBe(5);
    }
    expect(requiredInterviews(snap({ [DOELGROEP_PATH]: doelgroep('B2C') }))).toBe(15);
  });

  it('doelgroep-formulier gebruikt de standaard als het aantal leeg is', () => {
    const step = formStep(level2, 'l2-doelgroep');
    const values = { waarde: 'Patiënten', gebruiker: 'Assistenten', betaler: 'Apotheek', beslisser: 'Eigenaar', type: 'B2C', aantal: '' };
    expect(parseMarkdown(step.toFile(values, snap({})).content).frontmatter).toEqual({ type: 'B2C', interviews_nodig: 15 });
    expect(parseMarkdown(step.toFile({ ...values, aantal: '8' }, snap({})).content).frontmatter).toEqual({ type: 'B2C', interviews_nodig: 8 });
  });

  it('slugify maakt veilige namen', () => {
    expect(slugify('Apotheker (eigenaar)')).toBe('apotheker-eigenaar');
    expect(slugify('Café-eigenaar')).toBe('cafe-eigenaar');
    expect(slugify('')).toBe('interview');
    expect(slugify('!!!')).toBe('interview');
  });

  it('nextTranscriptPath neemt het hoogste nummer plus één', () => {
    expect(nextTranscriptPath(snap({}), 'Apotheker')).toBe(`${INTERVIEWS_DIR}/01-apotheker.md`);
    const files = { [`${INTERVIEWS_DIR}/01-a.md`]: '# 1\n\nx', [`${INTERVIEWS_DIR}/03-b.md`]: '# 3\n\nx' };
    expect(nextTranscriptPath(snap(files), 'assistent')).toBe(`${INTERVIEWS_DIR}/04-assistent.md`);
  });

  it('transcriptFromUpload weigert audio, Word en lege bestanden', () => {
    expect(transcriptFromUpload('gesprek.m4a', 'x', 'apotheker', snap({}))).toEqual({
      error: 'Alleen .md- of .txt-bestanden. Audio of Word? Zet het eerst om met skill transcriberen.',
    });
    expect('error' in transcriptFromUpload('gesprek.docx', 'x', 'apotheker', snap({}))).toBe(true);
    expect(transcriptFromUpload('leeg.txt', '  \n', 'apotheker', snap({}))).toEqual({ error: 'Dit bestand is leeg.' });
  });

  it('transcriptFromUpload pakt .txt in en laat .md zoals het is', () => {
    const txt = transcriptFromUpload('gesprek.TXT', 'Hallo, ik ben J.', 'Apotheker', snap({}));
    if ('error' in txt) throw new Error(txt.error);
    expect(txt.path).toBe(`${INTERVIEWS_DIR}/01-apotheker.md`);
    expect(parseMarkdown(txt.content).frontmatter).toEqual({ rol: 'Apotheker' });
    expect(txt.content).toContain('# Interview: Apotheker');
    const md = transcriptFromUpload('gesprek.md', '# Interview\n\nTekst', 'apotheker', snap({}));
    if ('error' in md) throw new Error(md.error);
    expect(md.content).toBe('# Interview\n\nTekst');
  });
});
```

- [ ] **Step 2: Test draaien, verwacht een fout**

Run: `cd platform && npx vitest run src/lib/levels/levels.test.ts`
Expected: FAIL, met "Failed to resolve import './evaluate'"

- [ ] **Step 3: Leveldefinities schrijven**

`platform/src/lib/levels/level0.ts`:

```ts
import { toMarkdown } from '../markdown';
import { fileFilled, minMergedPullRequests } from './checks';
import type { LevelDef } from './types';

export const SETUP_PATH = 'level-0-werkplek/setup.md';
export const WERKPLEK_PATH = 'level-0-werkplek/werkplek.md';

export const level0: LevelDef = {
  id: 0,
  name: 'Werkplek',
  summary: 'Richt je werkplek in: GitHub, je eigen repo, je AI-tool en git.',
  milestone: 'Je AI werkt in je eigen repo en je hebt je eerste pull request gemerged.',
  ready: true,
  steps: [
    {
      id: 'l0-setup',
      title: 'Kies je setup',
      kind: 'form',
      fields: [
        { kind: 'select', name: 'os', label: 'Mijn computer', options: [{ value: 'mac', label: 'Mac' }, { value: 'windows', label: 'Windows' }] },
        { kind: 'select', name: 'ai', label: 'Mijn AI-tool', options: [{ value: 'claude-code', label: 'Claude Code' }, { value: 'codex', label: 'Codex' }] },
      ],
      toFile: (v) => ({
        path: SETUP_PATH,
        message: 'Setup gekozen',
        content: toMarkdown(
          { os: v.os, ai: v.ai },
          `# Mijn setup\n\nComputer: ${v.os === 'windows' ? 'Windows' : 'Mac'}\nAI-tool: ${v.ai === 'codex' ? 'Codex' : 'Claude Code'}`,
        ),
      }),
    },
    { id: 'l0-account', title: 'Maak een GitHub-account', kind: 'action' },
    { id: 'l0-repo', title: 'Maak je repo', kind: 'action' },
    { id: 'l0-koppelen', title: 'Koppel het platform aan je repo', kind: 'action' },
    { id: 'l0-installeren', title: 'Installeer git en je AI-tool', kind: 'action' },
    {
      id: 'l0-clonen',
      title: 'Clone je repo en open hem in je AI',
      kind: 'action',
      aiPrompt: 'Lees AGENTS.md en vertel me in drie zinnen wat je in deze repo voor me gaat doen.',
    },
    {
      id: 'l0-git',
      title: 'Git-basics: je eerste pull request',
      kind: 'action',
      aiPrompt:
        'Maak een branch "werkplek". Vul level-0-werkplek/werkplek.md samen met mij in: vraag me per regel wat ik wil invullen, en haal daarna de markering bovenaan weg. Commit, push en open een pull request. Leg me daarna uit hoe ik hem op GitHub merge.',
    },
  ],
  checks: [
    fileFilled('setup', 'l0-setup', SETUP_PATH, 'Setup gekozen'),
    fileFilled('werkplek', 'l0-git', WERKPLEK_PATH, 'werkplek.md ingevuld'),
    minMergedPullRequests('pr', 'l0-git', 1, 'Eerste pull request gemerged'),
  ],
};
```

`platform/src/lib/levels/level1.ts`:

```ts
import { toMarkdown } from '../markdown';
import { fileFilled, minListItems } from './checks';
import type { FormValues, LevelDef } from './types';

export const IDEE_PATH = 'level-1-idee/idee.md';
export const VISIE_PATH = 'level-1-idee/visie.md';
export const MADLIB_PATH = 'level-1-idee/madlib.md';
export const AANNAMES_PATH = 'level-1-idee/aannames.md';

export function madlibSentence(v: FormValues): string {
  return `Mijn bedrijf, ${v.naam.trim()}, biedt ${v.aanbod.trim()} voor ${v.doelgroep.trim()} die ${v.probleem.trim()} met ${v.usp.trim()}.`;
}

export function aannamesToMarkdown(text: string): string {
  const lines = text
    .split('\n')
    .map((line) => line.trim().replace(/^[-*]\s*/, ''))
    .filter((line) => line.length > 0)
    .map((line) => (/^\[(wens|haalbaar|rendabel)\]/i.test(line) ? line : `[ongelabeld] ${line}`));
  return `# Aannames\n\n${lines.map((line) => `- ${line}`).join('\n')}`;
}

export const level1: LevelDef = {
  id: 1,
  name: 'Idee',
  summary: 'Zet je idee, je visie en een eerste waardepropositie neer, en markeer wat nog aanname is.',
  milestone: 'Start: jouw idee in één zin, met je aannames op een rij.',
  ready: true,
  steps: [
    {
      id: 'l1-idee',
      title: 'Zet je idee uiteen',
      kind: 'form',
      fields: [
        { kind: 'textarea', name: 'wat', label: 'Wat ga je doen?' },
        { kind: 'textarea', name: 'voorWie', label: 'Voor wie?' },
        { kind: 'textarea', name: 'waaromJij', label: 'Waarom ben jij degene die dit gaat doen?' },
      ],
      toFile: (v) => ({
        path: IDEE_PATH,
        message: 'Idee uiteengezet',
        content: toMarkdown(null, `# Idee\n\n## Wat ga ik doen?\n\n${v.wat.trim()}\n\n## Voor wie?\n\n${v.voorWie.trim()}\n\n## Waarom ik?\n\n${v.waaromJij.trim()}`),
      }),
    },
    {
      id: 'l1-visie',
      title: 'Formuleer je visie',
      kind: 'form',
      fields: [
        { kind: 'textarea', name: 'wereld', label: 'Hoe ziet de wereld eruit als jouw onderneming slaagt?' },
        { kind: 'textarea', name: 'bijdrage', label: 'Wat is jouw bijdrage daaraan?' },
      ],
      toFile: (v) => ({
        path: VISIE_PATH,
        message: 'Visie geformuleerd',
        content: toMarkdown(null, `# Visie\n\n## Hoe ziet de wereld eruit als mijn onderneming slaagt?\n\n${v.wereld.trim()}\n\n## Wat is mijn bijdrage daaraan?\n\n${v.bijdrage.trim()}`),
      }),
    },
    {
      id: 'l1-madlib',
      title: 'Je waardepropositie in één zin',
      kind: 'form',
      fields: [
        { kind: 'text', name: 'naam', label: 'Naam van je bedrijf' },
        { kind: 'text', name: 'aanbod', label: 'Aanbod: wat bied je aan?' },
        { kind: 'text', name: 'doelgroep', label: 'Doelgroep: voor wie precies?' },
        { kind: 'text', name: 'probleem', label: 'Probleem of behoefte van die doelgroep' },
        { kind: 'text', name: 'usp', label: 'USP: wat maakt jou anders?' },
      ],
      toFile: (v) => ({
        path: MADLIB_PATH,
        message: 'Waardepropositie als madlib',
        content: toMarkdown(null, `# Waardepropositie (madlib)\n\n${madlibSentence(v)}`),
      }),
    },
    {
      id: 'l1-aannames',
      title: 'Markeer je aannames',
      kind: 'form',
      fields: [
        {
          kind: 'textarea',
          name: 'aannames',
          label: 'Eén aanname per regel. Begin met [wens], [haalbaar] of [rendabel].',
          placeholder: '[wens] Apotheken willen bezorging uitbesteden',
        },
      ],
      toFile: (v) => ({ path: AANNAMES_PATH, message: 'Aannames gemarkeerd', content: toMarkdown(null, aannamesToMarkdown(v.aannames)) }),
    },
    {
      id: 'l1-toets',
      title: 'Laat je AI je propositie toetsen',
      kind: 'action',
      aiPrompt: 'Gebruik skill propositie-validator. Lees de bestanden in level-1-idee/ en toets mijn waardepropositie kritisch. Stel je vragen één voor één.',
    },
  ],
  checks: [
    fileFilled('idee', 'l1-idee', IDEE_PATH, 'Idee uiteengezet'),
    fileFilled('visie', 'l1-visie', VISIE_PATH, 'Visie geformuleerd'),
    fileFilled('madlib', 'l1-madlib', MADLIB_PATH, 'Waardepropositie in één zin'),
    minListItems('aannames', 'l1-aannames', AANNAMES_PATH, 3, 'Minstens 3 aannames'),
  ],
};
```

`platform/src/lib/levels/level2.ts`:

```ts
import { toMarkdown } from '../markdown';
import type { RepoSnapshot } from '../repo/types';
import { fileFilled, frontmatterOf, mdFilesIn, minFilledFiles } from './checks';
import type { FileWrite, LevelDef } from './types';

export const DOELGROEP_PATH = 'level-2-probleemvalidatie/doelgroep.md';
export const VRAGEN_PATH = 'level-2-probleemvalidatie/interviewvragen.md';
export const ANALYSE_PATH = 'level-2-probleemvalidatie/analyse.md';
export const INTERVIEWS_DIR = 'level-2-probleemvalidatie/interviews';

export function defaultInterviews(type: unknown): number {
  return type === 'B2C' ? 15 : 5;
}

export function requiredInterviews(s: RepoSnapshot): number {
  const fm = frontmatterOf(s, DOELGROEP_PATH);
  const n = fm.interviews_nodig;
  if (typeof n === 'number' && Number.isInteger(n) && n > 0) return n;
  return defaultInterviews(fm.type);
}

export function slugify(text: string): string {
  const slug = text
    .normalize('NFD')
    .replace(/[̀-ͯ]/g, '')
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '')
    .slice(0, 40);
  return slug || 'interview';
}

export function nextTranscriptPath(s: RepoSnapshot, rol: string): string {
  const numbers = mdFilesIn(s, INTERVIEWS_DIR)
    .map((path) => Number.parseInt(path.slice(INTERVIEWS_DIR.length + 1), 10))
    .filter((n) => !Number.isNaN(n));
  const next = (numbers.length > 0 ? Math.max(...numbers) : 0) + 1;
  return `${INTERVIEWS_DIR}/${String(next).padStart(2, '0')}-${slugify(rol)}.md`;
}

export function isTranscriptFileName(name: string): boolean {
  const lower = name.toLowerCase();
  return lower.endsWith('.md') || lower.endsWith('.txt');
}

export function transcriptFromUpload(fileName: string, text: string, rol: string, s: RepoSnapshot): FileWrite | { error: string } {
  if (!isTranscriptFileName(fileName)) {
    return { error: 'Alleen .md- of .txt-bestanden. Audio of Word? Zet het eerst om met skill transcriberen.' };
  }
  if (text.trim().length === 0) return { error: 'Dit bestand is leeg.' };
  const path = nextTranscriptPath(s, rol);
  const label = rol.trim() || 'onbekend';
  const content = fileName.toLowerCase().endsWith('.md') ? text : toMarkdown({ rol: label }, `# Interview: ${label}\n\n${text.trim()}`);
  return { path, content, message: `Transcript toegevoegd: ${path.split('/').pop()}` };
}

export const level2: LevelDef = {
  id: 2,
  name: 'Probleem-validatie',
  summary: 'Bepaal je doelgroep, interview ze echt, en ontdek of ze hetzelfde probleem ervaren.',
  milestone: '1. Een eerste doelgroep die allemaal hetzelfde probleem ervaart.',
  ready: true,
  steps: [
    {
      id: 'l2-doelgroep',
      title: 'Bepaal je doelgroep',
      kind: 'form',
      fields: [
        { kind: 'textarea', name: 'waarde', label: 'Voor wie creëer je waarde?' },
        { kind: 'textarea', name: 'gebruiker', label: 'Wie gebruikt uiteindelijk je oplossing?' },
        { kind: 'textarea', name: 'betaler', label: 'Wie betaalt jou voor je oplossing?' },
        { kind: 'textarea', name: 'beslisser', label: 'Wie beslist welke oplossing gebruikt wordt?' },
        { kind: 'select', name: 'type', label: 'Verkoop je aan bedrijven of consumenten?', options: [{ value: 'B2B', label: 'Bedrijven (B2B)' }, { value: 'B2C', label: 'Consumenten (B2C)' }] },
        { kind: 'number', name: 'aantal', label: 'Aantal interviews (leeg = 5 bij B2B, 15 bij B2C)', optional: true },
      ],
      toFile: (v) => {
        const type = v.type === 'B2C' ? 'B2C' : 'B2B';
        const n = Number.parseInt(v.aantal, 10);
        const nodig = Number.isInteger(n) && n > 0 ? n : defaultInterviews(type);
        return {
          path: DOELGROEP_PATH,
          message: 'Doelgroep bepaald',
          content: toMarkdown(
            { type, interviews_nodig: nodig },
            `# Doelgroep\n\n## Voor wie creëer je waarde?\n\n${v.waarde.trim()}\n\n## Wie gebruikt uiteindelijk je oplossing?\n\n${v.gebruiker.trim()}\n\n## Wie betaalt jou voor je oplossing?\n\n${v.betaler.trim()}\n\n## Wie beslist welke oplossing gebruikt wordt?\n\n${v.beslisser.trim()}`,
          ),
        };
      },
    },
    {
      id: 'l2-vragen',
      title: 'Formuleer je interviewvragen',
      kind: 'action',
      aiPrompt: 'Gebruik skill interviewhulp. Lees level-2-probleemvalidatie/doelgroep.md en help me vraag 5 tot en met 8 in interviewvragen.md te formuleren voor mijn doelgroep.',
    },
    { id: 'l2-interviewen', title: 'Interview je doelgroep', kind: 'action' },
    {
      id: 'l2-transcripts',
      title: 'Zet je transcripts in je repo',
      kind: 'uploads',
      folder: INTERVIEWS_DIR,
      required: requiredInterviews,
      aiPrompt: 'Gebruik skill transcriberen. Zet het transcript dat ik je geef om naar een interviewbestand in level-2-probleemvalidatie/interviews/.',
    },
    {
      id: 'l2-analyse',
      title: 'Analyseer je interviews',
      kind: 'action',
      aiPrompt: 'Gebruik skill interview-analyse. Lees alle interviews in level-2-probleemvalidatie/interviews/ en vul analyse.md met mij in.',
    },
  ],
  checks: [
    fileFilled('doelgroep', 'l2-doelgroep', DOELGROEP_PATH, 'Doelgroep bepaald'),
    fileFilled('vragen', 'l2-vragen', VRAGEN_PATH, 'Interviewvragen klaar'),
    minFilledFiles('transcripts', 'l2-transcripts', INTERVIEWS_DIR, requiredInterviews, 'Transcripts in je repo'),
    fileFilled('analyse', 'l2-analyse', ANALYSE_PATH, 'Analyse geschreven'),
  ],
};
```

`platform/src/lib/levels/lockedLevels.ts`:

```ts
import type { LevelDef } from './types';

const locked = (id: number, name: string, milestone: string, summary: string): LevelDef => ({
  id,
  name,
  milestone,
  summary,
  ready: false,
  steps: [],
  checks: [],
});

export const level3 = locked(3, 'Prototype', '2. Product/solution fit: de beste oplossing voor het probleem van je eerste doelgroep.', 'Ideeën genereren en een eerste demo of MVP maken om in de markt te testen.');
export const level4 = locked(4, 'Markt feedback', '3. Commitment: je doelgroep wil kopen, en voor dezelfde prijs.', 'Feedback van je doelgroep ophalen en je MVP aanpassen.');
export const level5 = locked(5, 'Product-validatie', '4. Product/market fit: een basisproduct waar je eerste klanten fan van zijn.', 'Je basisproduct ontwikkelen voor je eerste klanten en je businessmodel in kaart brengen.');
export const level6 = locked(6, 'Lancering', '5. Een herhaalbaar verkoopproces · 6. Business/market fit: zicht op een positieve cashflow.', 'Je eerste echte klanten, en zicht op je impact.');
```

`platform/src/lib/levels/index.ts`:

```ts
import { level0 } from './level0';
import { level1 } from './level1';
import { level2 } from './level2';
import { level3, level4, level5, level6 } from './lockedLevels';
import type { LevelDef } from './types';

export const LEVELS: LevelDef[] = [level0, level1, level2, level3, level4, level5, level6];
```

`platform/src/lib/levels/evaluate.ts`:

```ts
import type { RepoSnapshot } from '../repo/types';
import type { LevelDef, LevelEvaluation, LevelState } from './types';

export function evaluateLevel(level: LevelDef, s: RepoSnapshot): LevelEvaluation {
  const results = level.checks.map((check) => ({ id: check.id, stepId: check.stepId, label: check.label, ...check.run(s) }));
  return { levelId: level.id, done: level.ready && results.every((r) => r.ok), results };
}

/** Een level gaat pas open als alle levels ervoor af zijn. */
export function levelStatus(levels: LevelDef[], s: RepoSnapshot): Record<number, LevelState> {
  const status: Record<number, LevelState> = {};
  let blocked = false;
  for (const level of levels) {
    if (blocked) {
      status[level.id] = 'locked';
    } else if (evaluateLevel(level, s).done) {
      status[level.id] = 'done';
    } else {
      status[level.id] = 'active';
      blocked = true;
    }
  }
  return status;
}
```

- [ ] **Step 4: Tests en typecheck draaien**

Run: `cd platform && npx vitest run && npm run typecheck`
Expected: alle tests slagen, de typecheck is schoon.

- [ ] **Step 5: Commit**

```bash
git add platform/src/lib/levels
git commit -m "Levels 0-6 met checks en volgorde-unlock"
```

---

### Task 7: Uitleg per stap + varianten per setup

**Files:**
- Create: `content/levels/level-0/l0-setup.md`, `l0-account.md`, `l0-repo.md`, `l0-koppelen.md`, `l0-installeren.md`, `l0-clonen.md`, `l0-git.md`
- Create: `content/levels/level-1/l1-idee.md`, `l1-visie.md`, `l1-madlib.md`, `l1-aannames.md`, `l1-toets.md`
- Create: `content/levels/level-2/l2-doelgroep.md`, `l2-vragen.md`, `l2-interviewen.md`, `l2-transcripts.md`, `l2-analyse.md`
- Create: `platform/src/lib/content.ts`
- Test: `platform/src/lib/content.test.ts`

**Interfaces:**
- Consumes: `LEVELS` (Task 6), `SETUP_PATH` (Task 6), `frontmatterOf` (Task 5)
- Produces: `stepContent(levelId: number, stepId: string): string | undefined`, `type Setup = { os?: string; ai?: string }`, `filterVariants(md: string, setup: Setup): string`, `setupFrom(s: RepoSnapshot): Setup`
- Variantblokken in content: `<!-- alleen:mac -->`, `<!-- alleen:windows -->`, `<!-- alleen:claude-code -->` en `<!-- alleen:codex -->`, steeds gesloten met `<!-- /alleen -->`

- [ ] **Step 1: Falende test schrijven**

`platform/src/lib/content.test.ts`:

```ts
import { describe, expect, it } from 'vitest';
import { filterVariants, setupFrom, stepContent } from './content';
import { LEVELS } from './levels';
import { SETUP_PATH } from './levels/level0';

const md = 'Intro\n<!-- alleen:mac -->\nMac-tekst\n<!-- /alleen -->\n<!-- alleen:windows -->\nWindows-tekst\n<!-- /alleen -->\n<!-- alleen:codex -->\nCodex-tekst\n<!-- /alleen -->\nSlot';

describe('content', () => {
  it('elke stap van een uitgewerkt level heeft uitleg', () => {
    for (const level of LEVELS.filter((l) => l.ready)) {
      for (const step of level.steps) {
        expect(stepContent(level.id, step.id), `${level.id}/${step.id}`).toBeTruthy();
      }
    }
  });

  it('filterVariants houdt alleen de gekozen setup over', () => {
    expect(filterVariants(md, { os: 'mac', ai: 'claude-code' })).toBe('Intro\nMac-tekst\nSlot');
    expect(filterVariants(md, { os: 'windows', ai: 'codex' })).toBe('Intro\nWindows-tekst\nCodex-tekst\nSlot');
  });

  it('filterVariants toont alles zolang er geen setup is', () => {
    expect(filterVariants(md, {})).toBe('Intro\nMac-tekst\nWindows-tekst\nCodex-tekst\nSlot');
  });

  it('setupFrom leest setup.md', () => {
    expect(setupFrom({ files: { [SETUP_PATH]: '---\nos: windows\nai: codex\n---\n# Setup' }, mergedPullRequests: 0 })).toEqual({ os: 'windows', ai: 'codex' });
    expect(setupFrom({ files: {}, mergedPullRequests: 0 })).toEqual({});
  });
});
```

- [ ] **Step 2: Test draaien, verwacht een fout**

Run: `cd platform && npx vitest run src/lib/content.test.ts`
Expected: FAIL, met "Failed to resolve import './content'"

- [ ] **Step 3: Loader schrijven**

`platform/src/lib/content.ts`:

```ts
import { frontmatterOf } from './levels/checks';
import { SETUP_PATH } from './levels/level0';
import type { RepoSnapshot } from './repo/types';

const raw = import.meta.glob('../../../content/levels/**/*.md', {
  query: '?raw',
  import: 'default',
  eager: true,
}) as Record<string, string>;

const byKey: Record<string, string> = {};
for (const [path, text] of Object.entries(raw)) {
  const match = path.match(/content\/levels\/level-(\d+)\/([^/]+)\.md$/);
  if (match) byKey[`${match[1]}/${match[2]}`] = text;
}

export function stepContent(levelId: number, stepId: string): string | undefined {
  return byKey[`${levelId}/${stepId}`];
}

export type Setup = { os?: string; ai?: string };

/** Houdt alleen de blokken over die bij de gekozen computer en AI-tool horen. Zonder setup blijft alles staan. */
export function filterVariants(md: string, setup: Setup): string {
  return md.replace(/<!-- alleen:([a-z-]+) -->\n?([\s\S]*?)<!-- \/alleen -->\n?/g, (_match, tag: string, inner: string) => {
    if (!setup.os && !setup.ai) return inner;
    return tag === setup.os || tag === setup.ai ? inner : '';
  });
}

export function setupFrom(s: RepoSnapshot): Setup {
  const fm = frontmatterOf(s, SETUP_PATH);
  const setup: Setup = {};
  if (typeof fm.os === 'string') setup.os = fm.os;
  if (typeof fm.ai === 'string') setup.ai = fm.ai;
  return setup;
}
```

- [ ] **Step 4: Uitleg schrijven**

`content/levels/level-0/l0-setup.md`:

```markdown
Kies op welke computer je werkt en welke AI-tool je gebruikt. De uitleg in de volgende stappen past zich daarop aan.

- **Claude Code** hoort bij een betaald Claude-abonnement (Pro of hoger).
- **Codex** hoort bij een betaald ChatGPT-abonnement (Plus of hoger).

Twijfel je? Kies de tool waarvan je al een abonnement hebt.
```

`content/levels/level-0/l0-account.md`:

```markdown
Op GitHub komt je onderneming te wonen. Al je notities, interviews en analyses staan straks in één map die je AI kan lezen.

1. Ga naar github.com en kies **Sign up**.
2. Gebruik een e-mailadres dat je blijft gebruiken, ook na dit programma.
3. Kies een gebruikersnaam die je ook zakelijk zou laten zien.

Een gratis account is genoeg. Privé-repo's zijn gratis.
```

`content/levels/level-0/l0-repo.md`:

```markdown
Een repo (repository) is de map van je onderneming op GitHub. Je begint niet leeg: de starter-repo heeft al een map per level en instructies voor je AI.

1. Open de starter-repo die je van je trainer krijgt en kies **Use this template** › **Create a new repository**.
2. Geef hem de naam van je onderneming of initiatief, bijvoorbeeld `fietskoerier-apotheken`.
3. Zet hem op **Private**. Straks komen er interviews met echte mensen in, en die horen niet openbaar te staan.
```

`content/levels/level-0/l0-koppelen.md`:

```markdown
Het platform kijkt mee in je repo. Zo weet het welke stappen je hebt afgerond en welk level open mag.

In deze demo is je repo nagebootst in je browser. In de echte versie log je hier in met GitHub en kies je je repo. Het platform krijgt dan alleen toegang tot die ene repo.
```

`content/levels/level-0/l0-installeren.md`:

````markdown
Je hebt drie dingen nodig: **git** (houdt elke versie van je bestanden bij), de **GitHub CLI** (laat je computer veilig inloggen bij GitHub) en je **AI-tool**.

<!-- alleen:mac -->
**Op je Mac**

1. Open **Terminal** (Cmd+spatie, typ "Terminal").
2. Installeer Homebrew, de app-winkel voor ontwikkeltools. Plak dit en druk op Enter:

   ```
   /bin/bash -c "$(curl -fsSL https://raw.githubusercontent.com/Homebrew/install/HEAD/install.sh)"
   ```

   Lees wat Homebrew aan het eind zegt. Soms vraagt het je nog twee regels te plakken.
3. Installeer git en de GitHub CLI:

   ```
   brew install git gh
   ```
<!-- /alleen -->
<!-- alleen:windows -->
**Op je Windows-computer**

1. Open **PowerShell** (Start, typ "PowerShell").
2. Installeer git en de GitHub CLI:

   ```
   winget install --id Git.Git -e --source winget
   winget install --id GitHub.cli -e --source winget
   ```

3. Sluit PowerShell en open hem opnieuw, zodat de nieuwe programma's gevonden worden.
<!-- /alleen -->

Log daarna in bij GitHub met `gh auth login`. Kies **GitHub.com**, **HTTPS** en **Login with a web browser**.

<!-- alleen:claude-code -->
**Claude Code:** download de Claude-app via claude.ai/download, log in en open het tabblad **Code**.
<!-- /alleen -->
<!-- alleen:codex -->
**Codex:** installeer Codex volgens de instructies op developers.openai.com/codex en log in met je ChatGPT-account.
<!-- /alleen -->
````

`content/levels/level-0/l0-clonen.md`:

````markdown
Clonen betekent: een kopie van je repo op je eigen computer zetten. Daar werkt je AI in.

<!-- alleen:mac -->
In Terminal:

```
cd ~/Documents
gh repo clone JOUW-GEBRUIKERSNAAM/JOUW-REPO
```
<!-- /alleen -->
<!-- alleen:windows -->
In PowerShell:

```
cd $HOME\Documents
gh repo clone JOUW-GEBRUIKERSNAAM/JOUW-REPO
```
<!-- /alleen -->

<!-- alleen:claude-code -->
Open daarna in de Claude-app het tabblad **Code** en kies de map van je repo in Documenten.
<!-- /alleen -->
<!-- alleen:codex -->
Open daarna Codex in de map van je repo in Documenten.
<!-- /alleen -->

Je AI leest als eerste `AGENTS.md`. Daarin staat hoe je repo in elkaar zit en wat de AI wel en niet voor je doet. Test het met de vraag hieronder.
````

`content/levels/level-0/l0-git.md`:

```markdown
Git bewaart elke versie van je werk. Je werkt in vier stappen:

1. **Branch:** een zijspoor waarop je iets aanpast zonder je hoofdversie (main) te raken.
2. **Commit:** een opgeslagen versie, met een korte beschrijving.
3. **Pull request:** een voorstel om je zijspoor terug te zetten in main. Hier kijk je (of je trainer) nog één keer mee.
4. **Merge:** het voorstel goedkeuren. Je wijziging staat nu in main.

Je AI doet het typewerk. Jij snapt wat er gebeurt en merget zelf op GitHub. Dit level is af zodra `werkplek.md` is ingevuld en je eerste pull request gemerged is.
```

`content/levels/level-1/l1-idee.md`:

```markdown
Begin bij jezelf. Leg je idee uit alsof je het aan een vriend vertelt: wat ga je doen, voor wie, en waarom ben jij degene die het gaat doen? Het hoeft nog niet af of juist te zijn. Alles wat je nu opschrijft, is een aanname die je straks gaat toetsen.
```

`content/levels/level-1/l1-visie.md`:

```markdown
Je visie is het beeld van de wereld als jouw onderneming slaagt. Niet wat je verkoopt, maar wat er dan anders is. Een goede visie is groot genoeg om je jarenlang richting te geven, en concreet genoeg om er keuzes mee te maken.
```

`content/levels/level-1/l1-madlib.md`:

```markdown
Breng je idee terug tot één zin. Een madlib is een invulzin die je dwingt te kiezen: wat bied je aan, voor wie precies, welk probleem los je op, en wat maakt jou anders?

> Mijn bedrijf, **[naam]**, biedt **[aanbod]** voor **[doelgroep]** die **[probleem/behoefte]** met **[USP]**.

Maak je doelgroep zo klein en specifiek als je durft. "Iedereen die..." is geen doelgroep.
```

`content/levels/level-1/l1-aannames.md`:

```markdown
Je idee en je waardepropositie bestaan voor het grootste deel uit aannames. Dat is normaal. Gevaarlijk wordt het pas als je ze niet herkent.

Zet elke aanname op een eigen regel en geef hem een label:

- **[wens]**: willen klanten dit echt? (desirability)
- **[haalbaar]**: kun jij dit maken en leveren? (feasibility)
- **[rendabel]**: kun je hier geld mee verdienen? (viability)

Schrijf er minstens drie op. In level 2 toets je de belangrijkste [wens]-aannames bij je doelgroep.
```

`content/levels/level-1/l1-toets.md`:

```markdown
Laat je AI je propositie kritisch bekijken. De skill `propositie-validator` zet je antwoorden in één zin en toetst die op drie punten: idee/oplossing, probleem en klant. Je krijgt vragen terug, geen oordeel. Jij beslist wat je aanpast.
```

`content/levels/level-2/l2-doelgroep.md`:

```markdown
Je idee is nog grotendeels gebaseerd op aannames. Nu ga je ze toetsen. Daarvoor moet je eerst weten bij wie.

Een doelgroep is vaak meer dan één persoon. Beantwoord daarom vier vragen:

- Voor wie creëer je waarde?
- Wie gebruikt uiteindelijk je oplossing?
- Wie betaalt jou voor je oplossing?
- Wie beslist welke oplossing gebruikt wordt?

Verkoop je aan bedrijven (B2B), dan zijn dat vaak verschillende mensen. Interview er dan minstens 5. Verkoop je aan consumenten (B2C), dan heb je meer gesprekken nodig om patronen te zien: minstens 15.
```

`content/levels/level-2/l2-vragen.md`:

```markdown
Je gebruikt een gestructureerd interview van 8 vragen. Zo kun je de antwoorden van verschillende mensen naast elkaar leggen.

- **Vraag 1 tot en met 4** gaan over wie je spreekt: segment, locatie, rol en of iemand de beslisser is. Die vul je zelf in.
- **Vraag 5 tot en met 8** stel je in het gesprek: wat is hun kernactiviteit, welk alternatief gebruiken ze nu, waarom kozen ze daarvoor, en wat is hun grootste klacht?

Je AI helpt je vraag 5 tot en met 8 zo te formuleren dat ze bij jouw doelgroep passen.
```

`content/levels/level-2/l2-interviewen.md`:

```markdown
Nu doe je het echt: in gesprek met je doelgroep. Twee regels zijn heilig:

1. **Praat niet over je idee of oplossing.** Zodra je je idee noemt, krijg je beleefde antwoorden in plaats van eerlijke.
2. **Vraag niet naar de toekomst, alleen naar nu.** "Hoe zou je graag je tanden schoonhouden?" levert wensen op. "Wat vond je vanmorgen vervelend aan het poetsen?" levert echte problemen op.

Vraag aan het begin toestemming om het gesprek op te nemen of uit te schrijven, en vertel dat je geen namen gebruikt. Interview liefst op de plek waar iemand werkt of leeft: wat je ziet, vertelt vaak meer dan wat je hoort.
```

`content/levels/level-2/l2-transcripts.md`:

```markdown
Van elk interview komt een uitgeschreven versie in je repo. Zo kan je AI straks alle gesprekken tegelijk analyseren.

- **Heb je al een tekstversie**, bijvoorbeeld uit Teams, Zoom of een opname-app? Upload hem hier als .md of .txt, of laat je AI hem omzetten met skill `transcriberen`.
- **Namen eruit.** Gebruik een rol en initialen ("apotheker, J.") in plaats van iemands naam.
- **Audio blijft op je computer.** Opnames gaan nooit in je repo.

Een vakje krijgt een vinkje zodra het transcript in je repo staat.
```

`content/levels/level-2/l2-analyse.md`:

```markdown
Leg de antwoorden naast elkaar. Per interview zet je kernactiviteit (vraag 5), alternatief (vraag 6), overwegingen (vraag 7) en meest genoemde klachten (vraag 8) in een tabel. Daaruit schrijf je een inzicht:

> Onze target customer ervaart problemen met [kernactiviteit, vraag 5]. Als we hun belangrijkste overwegingen bekijken [overwegingen, vraag 7], lossen ze dat op dit moment op met [alternatieven, vraag 6]. De nadelen hiervan zijn [meest genoemde klachten, vraag 8].

Zie je een groep die allemaal hetzelfde probleem ervaart? Dan heb je je eerste doelgroep gevonden, en daarmee de mijlpaal van dit level.
```

- [ ] **Step 5: Tests en typecheck draaien**

Run: `cd platform && npx vitest run && npm run typecheck`
Expected: alle tests slagen.

- [ ] **Step 6: Commit**

```bash
git add content platform/src/lib/content.ts platform/src/lib/content.test.ts
git commit -m "Uitleg per stap met varianten voor Mac/Windows en Claude Code/Codex"
```

---

### Task 8: UI-schil: huisstijl, levelkaart, repo-paneel, demomodus

**Files:**
- Modify: `platform/src/styles.css`, `platform/src/main.tsx`
- Create: `platform/src/App.tsx`, `platform/src/ui/labels.ts`, `platform/src/ui/icons.tsx`, `platform/src/ui/tree.ts`, `platform/src/ui/useRepo.ts`, `platform/src/ui/LevelKaart.tsx`, `platform/src/ui/RepoPaneel.tsx`, `platform/src/ui/DemoBalk.tsx`
- Create: `platform/src/demo/voorbeelden.ts`, `platform/src/demo/simulations.ts`
- Test: `platform/src/ui/tree.test.ts`, `platform/src/demo/demo.test.ts`

**Interfaces:**
- Consumes: `MockRepoAdapter`, `Commit`, `buildSnapshot`, `starterFiles`, `LEVELS`, `levelStatus`, padconstanten en `nextTranscriptPath` (Task 2–6)
- Produces: `STATE_LABEL: Record<LevelState, string>`, `CheckIcon`, `LockIcon` en `CircleIcon` (`{ className?: string }`), `treeRows(paths: string[]): TreeRow[]`, `useRepo(repo)` met `{ snapshot, info, commits, status, lastWritten, error, write(w: FileWrite): Promise<boolean>, run(action: () => Promise<void>): Promise<void>, refresh() }`, `SIMULATIONS: Record<string, Simulation>` met `Simulation = { label: string; run(repo: MockRepoAdapter, s: RepoSnapshot): Promise<void> }`

- [ ] **Step 1: Falende tests schrijven**

`platform/src/ui/tree.test.ts`:

```ts
import { expect, it } from 'vitest';
import { treeRows } from './tree';

it('treeRows zet mappen boven hun bestanden', () => {
  expect(treeRows(['level-1-idee/idee.md', 'README.md', 'level-1-idee/sub/x.md'])).toEqual([
    { kind: 'file', name: 'README.md', depth: 0, path: 'README.md' },
    { kind: 'folder', name: 'level-1-idee', depth: 0, path: 'level-1-idee' },
    { kind: 'file', name: 'idee.md', depth: 1, path: 'level-1-idee/idee.md' },
    { kind: 'folder', name: 'sub', depth: 1, path: 'level-1-idee/sub' },
    { kind: 'file', name: 'x.md', depth: 2, path: 'level-1-idee/sub/x.md' },
  ]);
});
```

`platform/src/demo/demo.test.ts`:

```ts
import { expect, it } from 'vitest';
import { levelStatus } from '../lib/levels/evaluate';
import { LEVELS } from '../lib/levels';
import { level0 } from '../lib/levels/level0';
import { level1 } from '../lib/levels/level1';
import { level2 } from '../lib/levels/level2';
import type { FormStep, FormValues, LevelDef } from '../lib/levels/types';
import { MockRepoAdapter } from '../lib/repo/mockRepo';
import { buildSnapshot } from '../lib/repo/snapshot';
import { starterFiles } from '../lib/repo/starterFiles';
import { SIMULATIONS } from './simulations';

const formStep = (level: LevelDef, id: string): FormStep => {
  const step = level.steps.find((s) => s.id === id);
  if (!step || step.kind !== 'form') throw new Error(`geen formulierstap ${id}`);
  return step;
};

async function saveForm(repo: MockRepoAdapter, level: LevelDef, id: string, values: FormValues) {
  const write = formStep(level, id).toFile(values, await buildSnapshot(repo));
  await repo.writeFile(write.path, write.content, write.message);
}

async function simulate(repo: MockRepoAdapter, id: string) {
  await SIMULATIONS[id].run(repo, await buildSnapshot(repo));
}

it('de demo doorloopt level 0 tot en met 2 en opent level 3', async () => {
  const repo = new MockRepoAdapter(null, starterFiles);
  await saveForm(repo, level0, 'l0-setup', { os: 'mac', ai: 'claude-code' });
  await simulate(repo, 'l0-git');
  await saveForm(repo, level1, 'l1-idee', { wat: 'Medicijnen bezorgen per bakfiets', voorWie: 'Zelfstandige apotheken in Breda', waaromJij: 'Ik was vijf jaar koerier.' });
  await saveForm(repo, level1, 'l1-visie', { wereld: 'Een binnenstad zonder bestelbusjes.', bijdrage: 'Snelle, schone bezorging voor de zorg.' });
  await saveForm(repo, level1, 'l1-madlib', { naam: 'Trapzorg', aanbod: 'bezorging per bakfiets binnen twee uur', doelgroep: 'zelfstandige apotheken in Breda', probleem: 'medicijnen niet op tijd bij patiënten krijgen', usp: 'vaste koeriers die de patiënten kennen' });
  await saveForm(repo, level1, 'l1-aannames', { aannames: '[wens] Apotheken willen bezorging uitbesteden\n[haalbaar] Een bakfiets haalt 20 adressen per dag\n[rendabel] Apotheken betalen 6 euro per bezorging' });
  await saveForm(repo, level2, 'l2-doelgroep', { waarde: 'Patiënten', gebruiker: 'Apothekersassistenten', betaler: 'De apotheek', beslisser: 'De apotheker-eigenaar', type: 'B2B', aantal: '' });
  await simulate(repo, 'l2-vragen');
  for (let i = 0; i < 4; i++) await simulate(repo, 'l2-transcripts');
  expect(levelStatus(LEVELS, await buildSnapshot(repo))[2]).toBe('active');
  await simulate(repo, 'l2-transcripts');
  await simulate(repo, 'l2-analyse');
  expect(levelStatus(LEVELS, await buildSnapshot(repo))).toEqual({ 0: 'done', 1: 'done', 2: 'done', 3: 'active', 4: 'locked', 5: 'locked', 6: 'locked' });
});
```

- [ ] **Step 2: Tests draaien, verwacht een fout**

Run: `cd platform && npx vitest run src/ui src/demo`
Expected: FAIL, met "Failed to resolve import './tree'" en "Failed to resolve import './simulations'"

- [ ] **Step 3: tree, voorbeelden en simulaties schrijven**

`platform/src/ui/tree.ts`:

```ts
export type TreeRow = { kind: 'folder' | 'file'; name: string; depth: number; path: string };

export function treeRows(paths: string[]): TreeRow[] {
  const rows: TreeRow[] = [];
  const seen = new Set<string>();
  for (const path of [...paths].sort()) {
    const parts = path.split('/');
    for (let i = 0; i < parts.length - 1; i++) {
      const folder = parts.slice(0, i + 1).join('/');
      if (!seen.has(folder)) {
        seen.add(folder);
        rows.push({ kind: 'folder', name: parts[i], depth: i, path: folder });
      }
    }
    rows.push({ kind: 'file', name: parts[parts.length - 1], depth: parts.length - 1, path });
  }
  return rows;
}
```

`platform/src/demo/voorbeelden.ts`:

```ts
// Voorbeeldbestanden voor de demo: wat de AI van een deelnemer zou schrijven (case: Trapzorg, bakfietskoerier voor apotheken).

export const VOORBEELD_WERKPLEK = `# Mijn werkplek

- Mijn AI-tool: Claude Code
- Mijn computer: Mac
- Wat ik geleerd heb over branches en pull requests: ik werk op een zijspoor en zet het pas in main als ik het heb nagekeken.
`;

export const VOORBEELD_VRAGEN = `# Interviewvragen

## Over de geïnterviewde (vul je zelf in)

1. **Segment:** tot welke van onze doelgroepen behoort de geïnterviewde?
2. **Locatie:** waar (land, plaats) werkt de geïnterviewde?
3. **Rol:** wat is de rol van de geïnterviewde?
4. **DMU:** spreek je de beslisser? Ja of nee.

## In het gesprek

5. **Kernactiviteit:** hoe ziet een gewone dag eruit als het gaat om medicijnen bij patiënten krijgen?
6. **Alternatief:** hoe regelen jullie bezorging nu? Eigen bezorger, een koeriersdienst, of halen patiënten zelf?
7. **Overwegingen:** waarom is het zo geregeld?
8. **Meest genoemde klacht:** wat gaat er het vaakst mis bij de huidige manier?

## Regels

- Praat niet over je idee of oplossing.
- Vraag niet naar de toekomst, alleen naar wat iemand nu doet.
`;

export function voorbeeldTranscript(path: string): string {
  const nummer = path.split('/').pop()?.slice(0, 2) ?? '01';
  return `---
rol: apotheker
segment: zelfstandige apotheken
locatie: Breda
dmu: ja
---
# Interview ${nummer}: apotheker

## 5. Kernactiviteit

Ochtenden gaan op aan recepten klaarzetten. Rond twaalf uur moeten de spoedbezorgingen weg.

## 6. Alternatief

Een assistent rijdt in de middag zelf rond met de auto.

## 7. Overwegingen

Een koeriersdienst was te duur voor korte ritten en niet flexibel genoeg.

## 8. Meest genoemde klacht

Parkeren in de binnenstad kost veel tijd, en de assistent is dan niet in de apotheek.
`;
}

export const VOORBEELD_ANALYSE = `# Analyse van de interviews

| Doelgroep | Geïnterviewde | Kernactiviteit (5) | Alternatief (6) | Overwegingen (7) | Meest genoemde klachten (8) |
|---|---|---|---|---|---|
| Zelfstandige apotheken | apotheker (5×) | spoedbezorging rond het middaguur | assistent bezorgt met de auto | koerier te duur en te star | parkeren kost tijd, assistent mist in de apotheek |

## Inzicht

Onze target customer ervaart problemen met spoedbezorging rond het middaguur. Als we hun belangrijkste overwegingen bekijken (kosten en flexibiliteit), lossen ze dat op dit moment op met een eigen assistent in de auto. De nadelen hiervan zijn de tijd die parkeren kost en een assistent die dan niet in de apotheek is.

## Eerste doelgroep

Zelfstandige apotheken in de binnenstad van Breda ervaren allemaal hetzelfde probleem.
`;
```

`platform/src/demo/simulations.ts`:

```ts
import { WERKPLEK_PATH } from '../lib/levels/level0';
import { ANALYSE_PATH, VRAGEN_PATH, nextTranscriptPath } from '../lib/levels/level2';
import type { MockRepoAdapter } from '../lib/repo/mockRepo';
import type { RepoSnapshot } from '../lib/repo/types';
import { VOORBEELD_ANALYSE, VOORBEELD_VRAGEN, VOORBEELD_WERKPLEK, voorbeeldTranscript } from './voorbeelden';

export type Simulation = { label: string; run: (repo: MockRepoAdapter, s: RepoSnapshot) => Promise<void> };

/** Demo-knoppen voor wat normaal buiten het platform gebeurt (door de AI of op GitHub). */
export const SIMULATIONS: Record<string, Simulation> = {
  'l0-git': {
    label: 'doe alsof je AI de pull request maakte en jij hem mergde',
    run: async (repo) => {
      await repo.writeFile(WERKPLEK_PATH, VOORBEELD_WERKPLEK, 'werkplek.md ingevuld (branch werkplek)');
      await repo.mergePullRequest();
    },
  },
  'l2-vragen': {
    label: 'doe alsof je AI vraag 5 tot en met 8 invulde',
    run: (repo) => repo.writeFile(VRAGEN_PATH, VOORBEELD_VRAGEN, 'Interviewvragen 5-8 geformuleerd'),
  },
  'l2-transcripts': {
    label: 'doe alsof je AI een transcript toevoegde',
    run: async (repo, s) => {
      const path = nextTranscriptPath(s, 'apotheker');
      await repo.writeFile(path, voorbeeldTranscript(path), `Transcript toegevoegd: ${path.split('/').pop()}`);
    },
  },
  'l2-analyse': {
    label: 'doe alsof je AI de analyse schreef',
    run: (repo) => repo.writeFile(ANALYSE_PATH, VOORBEELD_ANALYSE, 'Analyse van de interviews'),
  },
};
```

- [ ] **Step 4: Tests draaien**

Run: `cd platform && npx vitest run`
Expected: alle tests slagen, ook de demo-doorloop.

- [ ] **Step 5: Huisstijl schrijven**

`platform/src/styles.css` (vervangt de hele inhoud):

```css
@import "tailwindcss";

:root {
  --purple: #5B2D8E;
  --purple-light: #9B6FCF;
  --purple-pale: rgba(91, 45, 142, 0.15);
  --accent: #D8FE56;
  --accent-soft: rgba(216, 254, 86, 0.2);
  --bg-dark: #0C0818;
  --white: #FFFFFF;
  --text-primary: #F0ECF5;
  --text-secondary: #D8CCEC;
  --text-muted: #7A6B8E;
  --glass-bg: rgba(255, 255, 255, 0.08);
  --glass-bg-strong: rgba(255, 255, 255, 0.12);
  --glass-border: rgba(255, 255, 255, 0.18);
  --glass-blur: blur(40px) saturate(200%);
  --card-bg: rgba(155, 111, 207, 0.22);
  --card-bg-strong: rgba(155, 111, 207, 0.30);
  --card-border: rgba(180, 145, 230, 0.45);
  --shadow: 0 4px 24px rgba(0, 0, 0, 0.4), 0 0 0 1px rgba(155, 111, 207, 0.15);
  --radius: 20px;
  --radius-lg: 28px;
  --transition: 0.3s cubic-bezier(0.4, 0, 0.2, 1);
}

html, body { margin: 0; }

body {
  font-family: 'Barlow', sans-serif;
  color: var(--text-primary);
  background: var(--bg-dark);
  line-height: 1.6;
  -webkit-font-smoothing: antialiased;
}

body::before {
  content: '';
  position: fixed;
  inset: 0;
  z-index: 0;
  pointer-events: none;
  background:
    radial-gradient(ellipse 70% 50% at 50% -10%, rgba(91, 45, 142, 0.55) 0%, transparent 60%),
    radial-gradient(ellipse 50% 40% at 85% 70%, rgba(123, 77, 174, 0.25) 0%, transparent 50%),
    radial-gradient(ellipse 45% 35% at 15% 65%, rgba(155, 111, 207, 0.15) 0%, transparent 50%),
    radial-gradient(ellipse 30% 30% at 70% 30%, rgba(216, 254, 86, 0.08) 0%, transparent 50%);
}

#root { position: relative; z-index: 1; }

@layer components {
  .logo { font-weight: 900; font-size: 1.6rem; letter-spacing: .01em; color: var(--white); }
  .logo em { color: var(--accent); font-style: normal; }

  .eyebrow {
    font-size: .75rem; font-weight: 600; letter-spacing: .14em; text-transform: uppercase;
    color: var(--accent); margin-bottom: .6rem;
  }

  .card {
    background: var(--card-bg-strong);
    backdrop-filter: var(--glass-blur);
    -webkit-backdrop-filter: var(--glass-blur);
    border: 1px solid var(--card-border);
    border-radius: var(--radius-lg);
    box-shadow: var(--shadow), inset 0 1px 0 rgba(255, 255, 255, .18);
    padding: 1.5rem;
  }

  .btn-p {
    font: 700 .95rem 'Barlow', sans-serif;
    display: inline-flex; align-items: center; gap: .5rem;
    background: linear-gradient(135deg, var(--accent), #b8e040);
    color: #1A1A2E; padding: .8rem 1.6rem; border: none; border-radius: var(--radius);
    cursor: pointer; transition: var(--transition);
    box-shadow: 0 4px 24px rgba(216, 254, 86, .35), inset 0 1px 0 rgba(255, 255, 255, .25);
  }
  .btn-p:hover:not(:disabled) { transform: translateY(-2px); box-shadow: 0 8px 36px rgba(216, 254, 86, .5); }
  .btn-p:disabled { opacity: .45; cursor: not-allowed; box-shadow: none; }

  .btn-o {
    font: 600 .92rem 'Barlow', sans-serif;
    display: inline-flex; align-items: center; gap: .4rem;
    color: var(--text-secondary); background: var(--glass-bg-strong);
    border: 1px solid var(--glass-border); border-radius: var(--radius);
    padding: .8rem 1.6rem; cursor: pointer; transition: var(--transition);
  }
  .btn-o:hover { color: var(--white); border-color: rgba(255, 255, 255, .35); }
  .btn-klein { padding: .5rem 1rem; font-size: .85rem; }

  .btn-demo {
    margin-top: 1rem; font: 600 .85rem 'Barlow', sans-serif; color: var(--accent);
    background: transparent; border: 1px dashed rgba(216, 254, 86, .5);
    border-radius: var(--radius); padding: .5rem 1rem; cursor: pointer;
  }

  .veld-label { display: block; font-weight: 600; font-size: .9rem; color: var(--text-secondary); margin-bottom: .35rem; }
  .veld {
    width: 100%; font: 400 1rem 'Barlow', sans-serif; color: var(--text-primary);
    background: rgba(255, 255, 255, .06); border: 1px solid var(--glass-border);
    border-radius: var(--radius); padding: .7rem 1rem;
  }
  .veld:focus { outline: 2px solid var(--accent); outline-offset: 1px; }
  .veld option { color: #1A1A2E; }

  .demo-balk {
    display: flex; flex-wrap: wrap; align-items: center; justify-content: space-between; gap: .75rem;
    padding: .75rem 1rem; border-radius: var(--radius); font-size: .9rem; color: var(--text-secondary);
    border: 1px dashed rgba(216, 254, 86, .45); background: rgba(216, 254, 86, .06);
  }

  .level-kaart ol { list-style: none; margin: 0; padding: 0; position: relative; }
  .level-kaart li { position: relative; z-index: 1; }
  .level-node {
    width: 100%; display: flex; flex-direction: column; align-items: center; gap: .35rem;
    padding: .75rem .25rem; border-radius: var(--radius); border: 1px solid transparent;
    background: transparent; color: var(--text-secondary); cursor: pointer; font: inherit;
    transition: var(--transition);
  }
  .level-node:hover { background: var(--glass-bg); }
  .level-node.is-selected { background: var(--glass-bg-strong); border-color: var(--glass-border); }
  .level-bol {
    display: grid; place-items: center; width: 3rem; height: 3rem; border-radius: 999px;
    font-weight: 900; font-size: 1.25rem; color: var(--white); background: var(--purple);
    box-shadow: 0 0 0 2px rgba(155, 111, 207, .4);
  }
  .level-done .level-bol { background: var(--accent); color: #1A1A2E; box-shadow: 0 0 18px rgba(216, 254, 86, .35); }
  .level-active .level-bol { box-shadow: 0 0 0 3px var(--accent), 0 0 24px rgba(216, 254, 86, .3); }
  .level-locked .level-bol { background: #1a1230; color: var(--text-muted); box-shadow: 0 0 0 1px var(--glass-border); }
  .level-naam { font-weight: 700; font-size: .85rem; text-align: center; line-height: 1.2; color: var(--white); }
  .level-locked .level-naam { color: var(--text-muted); }
  .level-status { font-size: .62rem; font-weight: 700; letter-spacing: .18em; text-transform: uppercase; color: var(--text-muted); }

  .level-titel { font-weight: 900; font-size: clamp(2.3rem, 4.8vw, 4.2rem); line-height: .95; letter-spacing: .01em; color: var(--white); }
  .mijlpaal { margin-top: .75rem; font-size: .9rem; color: var(--text-secondary); border-left: 3px solid var(--accent); padding-left: .75rem; }

  .stap-nr {
    flex: none; display: grid; place-items: center; width: 2rem; height: 2rem; border-radius: 999px;
    font-weight: 800; color: var(--white); background: var(--purple);
  }
  .stap-af .stap-nr { background: var(--accent); color: #1A1A2E; }
  .stap-titel { font-weight: 800; font-size: 1.15rem; color: var(--white); line-height: 1.3; padding-top: .2rem; }

  .checks { margin-top: 1rem; padding: 0; list-style: none; font-size: .9rem; }
  .checks li { display: flex; gap: .5rem; align-items: flex-start; color: var(--text-secondary); }
  .checks li.ok { color: var(--text-primary); }
  .checks li.ok svg { color: var(--accent); }

  .kopieer-blok { margin-top: 1rem; padding: 1rem; border-radius: var(--radius); background: rgba(12, 8, 24, .55); border: 1px solid var(--glass-border); }
  .kopieer-tekst { width: 100%; resize: vertical; background: transparent; border: 0; color: var(--text-primary); font: 500 .95rem/1.5 'Barlow', sans-serif; }

  .prose-morgen { color: var(--text-secondary); margin-top: .75rem; }
  .prose-morgen > * + * { margin-top: .75rem; }
  .prose-morgen strong { color: var(--white); }
  .prose-morgen ul { list-style: disc; padding-left: 1.25rem; }
  .prose-morgen ol { list-style: decimal; padding-left: 1.25rem; }
  .prose-morgen blockquote { border-left: 3px solid var(--purple-light); padding-left: .75rem; color: var(--text-primary); }
  .prose-morgen code { font-size: .9em; background: rgba(255, 255, 255, .08); padding: .1rem .35rem; border-radius: 6px; }
  .prose-morgen pre { background: rgba(12, 8, 24, .7); border: 1px solid var(--glass-border); border-radius: 14px; padding: .75rem 1rem; overflow-x: auto; }
  .prose-morgen pre code { background: none; padding: 0; }

  .repo-boom { list-style: none; margin: 1rem 0 0; padding: 0; font-size: .9rem; }
  .repo-map { color: var(--text-muted); font-weight: 600; padding: .15rem 0; }
  .repo-bestand { width: 100%; text-align: left; background: none; border: 0; color: var(--text-secondary); font: inherit; padding: .15rem .25rem; border-radius: 8px; cursor: pointer; }
  .repo-bestand:hover { color: var(--white); background: var(--glass-bg); }
  .repo-bestand.is-nieuw { color: var(--white); animation: oplichten 2.5s ease-out; }
  .repo-inhoud { margin: .25rem 0 .5rem; max-height: 16rem; overflow: auto; white-space: pre-wrap; font-size: .8rem; background: rgba(12, 8, 24, .7); border: 1px solid var(--glass-border); border-radius: 12px; padding: .6rem .8rem; }

  .upload-vakken { list-style: none; padding: 0; margin: .75rem 0; display: grid; gap: .4rem; grid-template-columns: repeat(auto-fill, minmax(12rem, 1fr)); }
  .upload-vakken li { display: flex; gap: .5rem; align-items: center; padding: .5rem .75rem; border-radius: 14px; border: 1px dashed var(--glass-border); font-size: .85rem; color: var(--text-muted); }
  .upload-vakken li.gevuld { border-style: solid; color: var(--text-primary); background: var(--glass-bg); }
  .upload-vakken li.gevuld svg { color: var(--accent); }
}

@media (min-width: 640px) {
  .level-kaart ol::before {
    content: ''; position: absolute; left: 7%; right: 7%; top: 2.25rem;
    border-top: 2px dotted rgba(155, 111, 207, .6);
  }
}

@keyframes oplichten {
  from { background: rgba(216, 254, 86, .35); }
  to { background: transparent; }
}
```

- [ ] **Step 6: UI-onderdelen schrijven**

`platform/src/ui/labels.ts`:

```ts
import type { LevelState } from '../lib/levels/types';

export const STATE_LABEL: Record<LevelState, string> = { done: 'Af', active: 'Nu bezig', locked: 'Op slot' };
```

`platform/src/ui/icons.tsx`:

```tsx
type Props = { className?: string };
const base = { width: 18, height: 18, viewBox: '0 0 24 24', fill: 'none', stroke: 'currentColor', strokeWidth: 2, strokeLinecap: 'round' as const, strokeLinejoin: 'round' as const, 'aria-hidden': true };

export function CheckIcon({ className }: Props) {
  return (
    <svg {...base} className={className}>
      <path d="M20 6 9 17l-5-5" />
    </svg>
  );
}

export function LockIcon({ className }: Props) {
  return (
    <svg {...base} className={className}>
      <rect width="18" height="11" x="3" y="11" rx="2" ry="2" />
      <path d="M7 11V7a5 5 0 0 1 10 0v4" />
    </svg>
  );
}

export function CircleIcon({ className }: Props) {
  return (
    <svg {...base} className={className}>
      <circle cx="12" cy="12" r="9" />
    </svg>
  );
}
```

`platform/src/ui/useRepo.ts`:

```ts
import { useCallback, useEffect, useMemo, useState } from 'react';
import { LEVELS } from '../lib/levels';
import { levelStatus } from '../lib/levels/evaluate';
import type { FileWrite } from '../lib/levels/types';
import type { Commit, MockRepoAdapter } from '../lib/repo/mockRepo';
import { buildSnapshot } from '../lib/repo/snapshot';
import type { RepoInfo, RepoSnapshot } from '../lib/repo/types';

export function useRepo(repo: MockRepoAdapter) {
  const [snapshot, setSnapshot] = useState<RepoSnapshot | null>(null);
  const [info, setInfo] = useState<RepoInfo | null>(null);
  const [commits, setCommits] = useState<Commit[]>([]);
  const [lastWritten, setLastWritten] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  const refresh = useCallback(async () => {
    const [nextSnapshot, nextInfo, nextCommits] = await Promise.all([buildSnapshot(repo), repo.getInfo(), repo.commits()]);
    setSnapshot(nextSnapshot);
    setInfo(nextInfo);
    setCommits(nextCommits);
  }, [repo]);

  useEffect(() => {
    void refresh();
  }, [refresh]);

  const write = useCallback(
    async (w: FileWrite): Promise<boolean> => {
      try {
        await repo.writeFile(w.path, w.content, w.message);
        setLastWritten(w.path);
        setError(null);
        await refresh();
        return true;
      } catch {
        setError(`Opslaan van ${w.path} is mislukt. Je invoer staat er nog; probeer het opnieuw.`);
        return false;
      }
    },
    [repo, refresh],
  );

  const run = useCallback(
    async (action: () => Promise<void>) => {
      try {
        await action();
        const log = await repo.commits();
        setLastWritten(log[0]?.path ?? null);
        setError(null);
        await refresh();
      } catch {
        setError('Deze demo-actie is mislukt. Probeer het opnieuw.');
      }
    },
    [repo, refresh],
  );

  const status = useMemo(() => (snapshot ? levelStatus(LEVELS, snapshot) : null), [snapshot]);

  return { snapshot, info, commits, status, lastWritten, error, write, run, refresh };
}
```

`platform/src/ui/LevelKaart.tsx`:

```tsx
import type { LevelDef, LevelState } from '../lib/levels/types';
import { CheckIcon, LockIcon } from './icons';
import { STATE_LABEL } from './labels';

type Props = { levels: LevelDef[]; status: Record<number, LevelState>; selected: number; onSelect: (id: number) => void };

export function LevelKaart({ levels, status, selected, onSelect }: Props) {
  return (
    <nav aria-label="Levels" className="level-kaart mt-6">
      <ol className="grid grid-cols-4 gap-2 sm:grid-cols-7">
        {levels.map((level) => {
          const state = status[level.id];
          const isSelected = level.id === selected;
          return (
            <li key={level.id}>
              <button
                type="button"
                onClick={() => onSelect(level.id)}
                aria-current={isSelected ? 'step' : undefined}
                className={`level-node level-${state}${isSelected ? ' is-selected' : ''}`}
              >
                <span className="level-bol">
                  {state === 'done' ? <CheckIcon /> : state === 'locked' ? <LockIcon /> : level.id}
                </span>
                <span className="level-naam">{level.name}</span>
                <span className="level-status">{STATE_LABEL[state]}</span>
              </button>
            </li>
          );
        })}
      </ol>
    </nav>
  );
}
```

`platform/src/ui/RepoPaneel.tsx`:

```tsx
import { useState } from 'react';
import type { Commit } from '../lib/repo/mockRepo';
import type { RepoInfo, RepoSnapshot } from '../lib/repo/types';
import { treeRows } from './tree';

type Props = { info: RepoInfo; snapshot: RepoSnapshot; commits: Commit[]; lastWritten: string | null };

export function RepoPaneel({ info, snapshot, commits, lastWritten }: Props) {
  const [open, setOpen] = useState<string | null>(null);
  const prs = info.mergedPullRequests;
  return (
    <aside className="card self-start" aria-label="Jouw repo">
      <p className="eyebrow">Jouw repo</p>
      <h2 className="text-xl font-extrabold text-white">
        {info.owner}/{info.name}
      </h2>
      <p className="mt-1 text-sm text-[var(--text-secondary)]">
        {info.isPrivate ? 'Privé' : 'Openbaar'} · {prs} gemergde pull request{prs === 1 ? '' : 's'}
      </p>
      <ul className="repo-boom">
        {treeRows(Object.keys(snapshot.files)).map((row) => (
          <li key={row.path} style={{ paddingLeft: `${row.depth * 0.9}rem` }}>
            {row.kind === 'folder' ? (
              <span className="repo-map">{row.name}/</span>
            ) : (
              <>
                <button
                  type="button"
                  className={`repo-bestand${row.path === lastWritten ? ' is-nieuw' : ''}`}
                  aria-expanded={open === row.path}
                  onClick={() => setOpen(open === row.path ? null : row.path)}
                >
                  {row.name}
                </button>
                {open === row.path && <pre className="repo-inhoud">{snapshot.files[row.path]}</pre>}
              </>
            )}
          </li>
        ))}
      </ul>
      {commits.length > 0 && (
        <div className="mt-4">
          <p className="eyebrow">Laatste commits</p>
          <ul className="space-y-1 text-sm text-[var(--text-secondary)]">
            {commits.slice(0, 3).map((c) => (
              <li key={`${c.at}-${c.path}`}>{c.message}</li>
            ))}
          </ul>
        </div>
      )}
    </aside>
  );
}
```

`platform/src/ui/DemoBalk.tsx`:

```tsx
type Props = { onReset: () => void | Promise<void> };

export function DemoBalk({ onReset }: Props) {
  return (
    <div className="demo-balk" role="note">
      <span>
        <strong className="text-white">Demomodus.</strong> Je repo is nagebootst in deze browser. Er gaat niets naar GitHub.
      </span>
      <button
        type="button"
        className="btn-o btn-klein"
        onClick={() => {
          if (window.confirm('Alles wissen en opnieuw beginnen?')) void onReset();
        }}
      >
        Opnieuw beginnen
      </button>
    </div>
  );
}
```

`platform/src/App.tsx` (tijdelijke middenkolom; Task 9 vervangt die door `LevelPagina`):

```tsx
import { useState } from 'react';
import { LEVELS } from './lib/levels';
import type { MockRepoAdapter } from './lib/repo/mockRepo';
import { DemoBalk } from './ui/DemoBalk';
import { LevelKaart } from './ui/LevelKaart';
import { RepoPaneel } from './ui/RepoPaneel';
import { useRepo } from './ui/useRepo';

export default function App({ repo }: { repo: MockRepoAdapter }) {
  const r = useRepo(repo);
  const [selected, setSelected] = useState<number | null>(null);
  const { snapshot, status, info } = r;
  if (!snapshot || !status || !info) return <p className="p-6">Laden…</p>;

  const activeId = LEVELS.find((l) => status[l.id] === 'active')?.id ?? LEVELS[LEVELS.length - 1].id;
  const current = LEVELS.find((l) => l.id === (selected ?? activeId)) ?? LEVELS[0];
  const reset = async () => {
    await repo.reset();
    setSelected(null);
    await r.refresh();
  };

  return (
    <div className="mx-auto max-w-6xl px-4 py-6">
      <header className="mb-6 flex flex-wrap items-center justify-between gap-3">
        <div className="logo">
          MORGEN<em>.</em>
        </div>
        <span className="eyebrow" style={{ marginBottom: 0 }}>Ondernemen met AI</span>
      </header>
      <DemoBalk onReset={reset} />
      <LevelKaart levels={LEVELS} status={status} selected={current.id} onSelect={setSelected} />
      {r.error && (
        <p role="alert" className="card mt-4 text-sm">
          {r.error}
        </p>
      )}
      <div className="mt-6 grid gap-6 lg:grid-cols-[1fr_340px]">
        <section className="card">
          <p className="eyebrow">Level {current.id}</p>
          <h1 className="level-titel">{current.name}</h1>
          <p className="mt-2">{current.summary}</p>
        </section>
        <RepoPaneel info={info} snapshot={snapshot} commits={r.commits} lastWritten={r.lastWritten} />
      </div>
    </div>
  );
}
```

`platform/src/main.tsx` (vervangt de hele inhoud):

```tsx
import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import App from './App';
import { MockRepoAdapter } from './lib/repo/mockRepo';
import { starterFiles } from './lib/repo/starterFiles';
import './styles.css';

function browserStorage(): Storage | null {
  try {
    return window.localStorage;
  } catch {
    return null;
  }
}

const repo = new MockRepoAdapter(browserStorage(), starterFiles);

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <App repo={repo} />
  </StrictMode>,
);
```

- [ ] **Step 7: Tests, typecheck en build draaien**

Run: `cd platform && npx vitest run && npm run typecheck && npx vite build`
Expected: alle tests slagen, de typecheck is schoon, en de build slaagt.

- [ ] **Step 8: Commit**

```bash
git add platform/src
git commit -m "UI-schil in Morgen-huisstijl met levelkaart, repo-paneel en demomodus"
```

---

### Task 9: Levelpagina's met stappen, formulieren, uploads en kopieerblokken

**Files:**
- Create: `platform/src/ui/Markdown.tsx`, `platform/src/ui/KopieerBlok.tsx`, `platform/src/ui/FormStap.tsx`, `platform/src/ui/UploadStap.tsx`, `platform/src/ui/StapKaart.tsx`, `platform/src/ui/LevelPagina.tsx`
- Modify: `platform/src/App.tsx`

**Interfaces:**
- Consumes: `stepContent`, `filterVariants`, `setupFrom`, `Setup` (Task 7); `evaluateLevel` (Task 6); `filledFilesIn`, `mdFilesIn` (Task 5); `isTranscriptFileName`, `transcriptFromUpload` (Task 6); `SIMULATIONS` (Task 8); `STATE_LABEL`, iconen (Task 8)

- [ ] **Step 1: `marked` installeren**

```bash
cd platform && npm install marked
```

- [ ] **Step 2: Componenten schrijven**

`platform/src/ui/Markdown.tsx`:

```tsx
import { marked } from 'marked';

/** Rendert uitleg uit content/levels. Die tekst komt uit deze repo en is dus vertrouwd. */
export function Markdown({ text }: { text: string }) {
  const html = marked.parse(text, { async: false }) as string;
  return <div className="prose-morgen" dangerouslySetInnerHTML={{ __html: html }} />;
}
```

`platform/src/ui/KopieerBlok.tsx`:

```tsx
import { useRef, useState } from 'react';

export function KopieerBlok({ prompt }: { prompt: string }) {
  const [state, setState] = useState<'idle' | 'ok' | 'fout'>('idle');
  const ref = useRef<HTMLTextAreaElement>(null);
  const copy = async () => {
    try {
      await navigator.clipboard.writeText(prompt);
      setState('ok');
    } catch {
      ref.current?.select();
      setState('fout');
    }
  };
  return (
    <div className="kopieer-blok">
      <p className="eyebrow">Vraag je AI</p>
      <textarea ref={ref} readOnly value={prompt} rows={3} className="kopieer-tekst" aria-label="Opdracht voor je AI" />
      <div className="mt-2 flex flex-wrap items-center gap-3">
        <button type="button" className="btn-o btn-klein" onClick={copy}>
          Kopieer
        </button>
        {state === 'ok' && <span className="text-sm">Gekopieerd. Plak het in je AI-tool.</span>}
        {state === 'fout' && <span className="text-sm">Kopiëren lukt hier niet. De tekst is geselecteerd: druk op Cmd+C of Ctrl+C.</span>}
      </div>
    </div>
  );
}
```

`platform/src/ui/FormStap.tsx`:

```tsx
import { useState, type FormEvent } from 'react';
import type { Field, FileWrite, FormStep, FormValues } from '../lib/levels/types';
import type { RepoSnapshot } from '../lib/repo/types';

type Props = { step: FormStep; snapshot: RepoSnapshot; alreadyDone: boolean; onSave: (w: FileWrite) => Promise<boolean> };

function initialValues(fields: Field[]): FormValues {
  return Object.fromEntries(fields.map((f) => [f.name, f.kind === 'select' ? f.options[0].value : '']));
}

function isRequired(field: Field): boolean {
  return (field.kind === 'text' || field.kind === 'textarea') && !field.optional;
}

export function FormStap({ step, snapshot, alreadyDone, onSave }: Props) {
  const [values, setValues] = useState<FormValues>(() => initialValues(step.fields));
  const [saving, setSaving] = useState(false);
  const missing = step.fields.some((f) => isRequired(f) && values[f.name].trim() === '');
  const set = (name: string, value: string) => setValues((prev) => ({ ...prev, [name]: value }));

  const submit = async (e: FormEvent) => {
    e.preventDefault();
    if (missing) return;
    setSaving(true);
    await onSave(step.toFile(values, snapshot));
    setSaving(false);
  };

  return (
    <form onSubmit={submit} className="mt-4 space-y-3">
      {step.fields.map((field) => {
        const id = `${step.id}-${field.name}`;
        return (
          <div key={field.name}>
            <label htmlFor={id} className="veld-label">
              {field.label}
            </label>
            {field.kind === 'select' ? (
              <select id={id} className="veld" value={values[field.name]} onChange={(e) => set(field.name, e.target.value)}>
                {field.options.map((o) => (
                  <option key={o.value} value={o.value}>
                    {o.label}
                  </option>
                ))}
              </select>
            ) : field.kind === 'textarea' ? (
              <textarea id={id} className="veld" rows={3} placeholder={field.placeholder} value={values[field.name]} onChange={(e) => set(field.name, e.target.value)} />
            ) : (
              <input
                id={id}
                className="veld"
                type={field.kind === 'number' ? 'number' : 'text'}
                min={field.kind === 'number' ? 1 : undefined}
                placeholder={field.placeholder}
                value={values[field.name]}
                onChange={(e) => set(field.name, e.target.value)}
              />
            )}
          </div>
        );
      })}
      <div className="flex flex-wrap items-center gap-3">
        <button type="submit" className="btn-p" disabled={saving || missing}>
          {saving ? 'Bezig…' : 'Zet in je repo'}
        </button>
        {alreadyDone && <span className="text-sm text-[var(--text-secondary)]">Staat al in je repo. Opnieuw opslaan overschrijft het.</span>}
      </div>
    </form>
  );
}
```

`platform/src/ui/UploadStap.tsx`:

```tsx
import { useState, type ChangeEvent } from 'react';
import { filledFilesIn, mdFilesIn } from '../lib/levels/checks';
import { isTranscriptFileName, transcriptFromUpload } from '../lib/levels/level2';
import type { FileWrite, UploadStep } from '../lib/levels/types';
import type { RepoSnapshot } from '../lib/repo/types';
import { CheckIcon, CircleIcon } from './icons';

type Props = { step: UploadStep; snapshot: RepoSnapshot; onSave: (w: FileWrite) => Promise<boolean> };

export function UploadStap({ step, snapshot, onSave }: Props) {
  const [rol, setRol] = useState('');
  const [melding, setMelding] = useState<string | null>(null);
  const need = step.required(snapshot);
  const files = mdFilesIn(snapshot, step.folder);
  const filled = new Set(filledFilesIn(snapshot, step.folder));
  const slots = Array.from({ length: Math.max(need, files.length) }, (_, i) => files[i] ?? null);

  const onFile = async (e: ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    e.target.value = '';
    if (!file) return;
    if (!isTranscriptFileName(file.name)) {
      setMelding('Alleen .md- of .txt-bestanden. Audio of Word? Zet het eerst om met skill transcriberen.');
      return;
    }
    const result = transcriptFromUpload(file.name, await file.text(), rol, snapshot);
    if ('error' in result) {
      setMelding(result.error);
      return;
    }
    if (await onSave(result)) {
      setMelding(`${result.path.split('/').pop()} staat in je repo.`);
      setRol('');
    }
  };

  return (
    <div className="mt-4">
      <p className="text-sm font-semibold text-white">
        {filled.size} van de {need} interviews in je repo
      </p>
      <ol className="upload-vakken">
        {slots.map((path, i) => (
          <li key={path ?? `leeg-${i}`} className={path && filled.has(path) ? 'gevuld' : ''}>
            {path && filled.has(path) ? <CheckIcon /> : <CircleIcon />}
            <span>
              {path ? path.split('/').pop() : `Interview ${i + 1}`}
              {path && !filled.has(path) ? ' (nog niet ingevuld)' : ''}
            </span>
          </li>
        ))}
      </ol>
      <div className="flex flex-wrap items-end gap-3">
        <div className="min-w-[12rem] flex-1">
          <label htmlFor={`${step.id}-rol`} className="veld-label">
            Rol van de geïnterviewde
          </label>
          <input id={`${step.id}-rol`} className="veld" placeholder="bijvoorbeeld apotheker" value={rol} onChange={(e) => setRol(e.target.value)} />
        </div>
        <label className="btn-o">
          Upload transcript (.md of .txt)
          <input type="file" accept=".md,.txt,text/plain,text/markdown" className="sr-only" onChange={onFile} />
        </label>
      </div>
      {melding && (
        <p role="status" className="mt-2 text-sm">
          {melding}
        </p>
      )}
    </div>
  );
}
```

`platform/src/ui/StapKaart.tsx`:

```tsx
import { filterVariants, stepContent, type Setup } from '../lib/content';
import type { FileWrite, LevelDef, LevelEvaluation, Step } from '../lib/levels/types';
import type { RepoSnapshot } from '../lib/repo/types';
import { FormStap } from './FormStap';
import { CheckIcon, CircleIcon } from './icons';
import { KopieerBlok } from './KopieerBlok';
import { Markdown } from './Markdown';
import { UploadStap } from './UploadStap';

type Props = {
  level: LevelDef;
  step: Step;
  index: number;
  snapshot: RepoSnapshot;
  evaluation: LevelEvaluation;
  setup: Setup;
  onSave: (w: FileWrite) => Promise<boolean>;
  simulation?: { label: string; onRun: () => void };
};

export function StapKaart({ level, step, index, snapshot, evaluation, setup, onSave, simulation }: Props) {
  const checks = evaluation.results.filter((r) => r.stepId === step.id);
  const done = checks.length > 0 && checks.every((c) => c.ok);
  const content = stepContent(level.id, step.id);
  return (
    <article className={`card${done ? ' stap-af' : ''}`}>
      <header className="flex items-start gap-3">
        <span className="stap-nr">{done ? <CheckIcon /> : index + 1}</span>
        <h3 className="stap-titel">{step.title}</h3>
      </header>
      {content && <Markdown text={filterVariants(content, setup)} />}
      {step.kind === 'form' && <FormStap step={step} snapshot={snapshot} alreadyDone={done} onSave={onSave} />}
      {step.kind === 'uploads' && <UploadStap step={step} snapshot={snapshot} onSave={onSave} />}
      {step.aiPrompt && <KopieerBlok prompt={step.aiPrompt} />}
      {checks.length > 0 && (
        <ul className="checks" aria-label="Checks op je repo">
          {checks.map((c) => (
            <li key={c.id} className={c.ok ? 'ok' : ''}>
              {c.ok ? <CheckIcon /> : <CircleIcon />}
              <span>
                {c.label}: {c.reason}
              </span>
            </li>
          ))}
        </ul>
      )}
      {simulation && (
        <button type="button" className="btn-demo" onClick={simulation.onRun}>
          Demo: {simulation.label}
        </button>
      )}
    </article>
  );
}
```

`platform/src/ui/LevelPagina.tsx`:

```tsx
import { SIMULATIONS } from '../demo/simulations';
import { setupFrom } from '../lib/content';
import { evaluateLevel } from '../lib/levels/evaluate';
import type { FileWrite, LevelDef, LevelState } from '../lib/levels/types';
import type { RepoSnapshot } from '../lib/repo/types';
import { STATE_LABEL } from './labels';
import { StapKaart } from './StapKaart';

type Props = {
  level: LevelDef;
  state: LevelState;
  snapshot: RepoSnapshot;
  onSave: (w: FileWrite) => Promise<boolean>;
  onSimulate: (stepId: string) => void;
  onNext?: () => void;
};

export function LevelPagina({ level, state, snapshot, onSave, onSimulate, onNext }: Props) {
  const header = (
    <header className="mb-6">
      <p className="eyebrow">
        Level {level.id} · {STATE_LABEL[state]}
      </p>
      <h1 className="level-titel">{level.name}</h1>
      <p className="mt-3">{level.summary}</p>
      <p className="mijlpaal">Mijlpaal: {level.milestone}</p>
    </header>
  );

  if (state === 'locked' || !level.ready) {
    return (
      <section className="card">
        {header}
        <p className="text-[var(--text-secondary)]">
          {state === 'locked'
            ? 'Dit level gaat open zodra je het vorige level hebt afgerond.'
            : 'Dit level komt in een volgende versie van het platform.'}
        </p>
      </section>
    );
  }

  const evaluation = evaluateLevel(level, snapshot);
  const setup = setupFrom(snapshot);
  return (
    <section>
      {header}
      {state === 'done' && (
        <div className="card mb-4 flex flex-wrap items-center justify-between gap-3">
          <p className="font-semibold text-white">Level af. Je repo laat zien dat je de mijlpaal hebt gehaald.</p>
          {onNext && (
            <button type="button" className="btn-p" onClick={onNext}>
              Naar het volgende level
            </button>
          )}
        </div>
      )}
      <div className="space-y-4">
        {level.steps.map((step, index) => {
          const sim = SIMULATIONS[step.id];
          return (
            <StapKaart
              key={step.id}
              level={level}
              step={step}
              index={index}
              snapshot={snapshot}
              evaluation={evaluation}
              setup={setup}
              onSave={onSave}
              simulation={sim ? { label: sim.label, onRun: () => onSimulate(step.id) } : undefined}
            />
          );
        })}
      </div>
    </section>
  );
}
```

- [ ] **Step 3: App aansluiten op LevelPagina**

In `platform/src/App.tsx`: voeg twee imports toe.

```tsx
import { SIMULATIONS } from './demo/simulations';
import { LevelPagina } from './ui/LevelPagina';
```

Voeg na de `reset`-functie toe:

```tsx
  const simulate = (stepId: string) => {
    const sim = SIMULATIONS[stepId];
    if (sim) void r.run(() => sim.run(repo, snapshot));
  };
  const nextLevel = LEVELS.find((l) => l.id === current.id + 1);
```

Vervang het hele blok `<section className="card">…</section>` door:

```tsx
        <LevelPagina
          level={current}
          state={status[current.id]}
          snapshot={snapshot}
          onSave={r.write}
          onSimulate={simulate}
          onNext={nextLevel ? () => setSelected(nextLevel.id) : undefined}
        />
```

- [ ] **Step 4: Tests, typecheck en build draaien**

Run: `cd platform && npx vitest run && npm run typecheck && npx vite build`
Expected: alle tests slagen, de typecheck is schoon, en de build slaagt.

- [ ] **Step 5: Commit**

```bash
git add platform/
git commit -m "Levelpagina's met formulieren, uploadvakken en kopieerblokken"
```

---

### Task 10: Doorlopen in de browser en branch klaarzetten

**Files:**
- Create: `.claude/launch.json`

- [ ] **Step 1: Launch-config schrijven**

`.claude/launch.json`:

```json
{
  "version": "0.0.1",
  "configurations": [
    {
      "name": "platform",
      "runtimeExecutable": "npm",
      "runtimeArgs": ["run", "dev", "--prefix", "platform", "--", "--port", "5173", "--strictPort"],
      "port": 5173
    }
  ]
}
```

- [ ] **Step 2: Dev-server starten en doorlopen**

Start met `preview_start` (naam `platform`) en loop in de ingebouwde browser na:

1. Bij de start is level 0 "Nu bezig" en zijn 1 t/m 6 "Op slot". Het repo-paneel toont `AGENTS.md`, `CLAUDE.md`, `README.md`, de levelmappen en `skills/`.
2. Level 0: kies Windows + Codex en klik "Zet in je repo". `setup.md` licht op in het repo-paneel, en stap 5 toont alleen de Windows- en Codex-uitleg. Klik daarna "Demo: doe alsof je AI de pull request maakte en jij hem mergde". Level 0 is af en "Naar het volgende level" verschijnt.
3. Level 1: vul de vier formulieren in. Bij twee aannames meldt de check "2 van de 3". Bij drie is level 1 af.
4. Level 2: kies B2B met een leeg aantal en controleer dat de check "0 van de 5" toont. Upload een `.m4a` en controleer de foutmelding. Upload een `.txt` met rol "apotheker" en controleer dat `01-apotheker.md` verschijnt. Vul de rest aan met de demo-knoppen. Level 2 is af, level 3 staat op "Nu bezig" en toont "komt in een volgende versie".
5. Klik een locked level aan: je ziet alleen de beschrijving en de mijlpaal.
6. Herlaad de pagina: de stand blijft staan. "Opnieuw beginnen" zet alles terug naar het begin.
7. `resize_window` op mobile: geen horizontale scroll, de levelkaart staat in 4 kolommen en het repo-paneel onder de stappen. Daarna weer `desktop`.
8. `read_console_messages` met onlyErrors: geen fouten.

- [ ] **Step 3: Starter-repo testen in de AI-tools**

Kopieer `starter-repo/` naar een lege map in de scratchpad en draai daar `git init`. Controleer per tool die lokaal aanwezig is (`which claude codex`):

- Claude Code: `claude -p "Welke skills staan er in deze repo en wanneer gebruik je propositie-validator?"`. Verwacht: het noemt de vier skills uit `AGENTS.md`. Dat bewijst dat de `@AGENTS.md`-import werkt.
- Codex: `codex exec "Welke skills staan er in deze repo en wanneer gebruik je propositie-validator?"`. Verwacht hetzelfde.

Ontbreekt een tool, schrijf dan in de overdracht dat die controle nog open staat voor Harmen. Werk met een `.claude/skills`- of `.agents/skills`-symlink pas als een tool `skills/` aantoonbaar niet vindt via `AGENTS.md`.

- [ ] **Step 4: Volledige check**

Run: `cd platform && npx vitest run && npm run typecheck && npx vite build`
Expected: alles groen.

- [ ] **Step 5: Commit en push**

```bash
git add .claude/launch.json
git commit -m "Launch-config voor de demo"
git push -u origin feat/klikbare-demo
```

Meld dat de branch klaarstaat en bied een PR aan (Morgen-werkwijze: alleen een PR op verzoek, en Harmen merget zelf). Deployen naar Netlify gebeurt alleen na een expliciet akkoord.
