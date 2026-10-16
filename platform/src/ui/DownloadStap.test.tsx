import { renderToStaticMarkup } from 'react-dom/server';
import { describe, expect, it } from 'vitest';
import { evaluateLevel } from '../lib/levels/evaluate';
import { level0 } from '../lib/levels/level0';
import { starterFiles } from '../lib/repo/starterFiles';
import { DownloadStap } from './DownloadStap';
import { StapKaart } from './StapKaart';

const CLAUDE = 'https://claude.com/product/claude-code';
const CODEX = 'https://openai.com/codex';

describe('DownloadStap', () => {
  it('toont één grote kaart voor de gekozen AI-tool', () => {
    const html = renderToStaticMarkup(<DownloadStap setup={{ os: 'mac', ai: 'claude-code' }} />);
    expect(html).toContain(`href="${CLAUDE}"`);
    expect(html).not.toContain(CODEX);
    expect(html).toContain('Log in met je Claude-account.');
    expect(html).toContain('Open het tabblad Code.');
  });

  it('toont Codex bij een ChatGPT-abonnement', () => {
    const html = renderToStaticMarkup(<DownloadStap setup={{ ai: 'codex' }} />);
    expect(html).toContain(`href="${CODEX}"`);
    expect(html).not.toContain(CLAUDE);
    expect(html).toContain('Log in met je ChatGPT-account.');
  });

  it('toont beide kaarten zolang er geen (geldige) keuze is', () => {
    for (const setup of [{}, { ai: 'gemini' }]) {
      const html = renderToStaticMarkup(<DownloadStap setup={setup} />);
      expect(html, JSON.stringify(setup)).toContain(CLAUDE);
      expect(html, JSON.stringify(setup)).toContain(CODEX);
    }
  });

  it('opent de downloadlinks veilig in een nieuw tabblad', () => {
    const html = renderToStaticMarkup(<DownloadStap setup={{}} />);
    const links = html.match(/<a [^>]*>/g) ?? [];
    expect(links).toHaveLength(2);
    for (const a of links) {
      expect(a).toContain('target="_blank"');
      expect(a).toMatch(/rel="[^"]*noopener/);
    }
  });

  it('StapKaart toont de downloadpagina bij de downloadstap', () => {
    const snapshot = { files: starterFiles, mergedPullRequests: 0 };
    const step = level0.steps.find((s) => s.id === 'l0-download')!;
    const html = renderToStaticMarkup(
      <StapKaart level={level0} step={step} index={1} snapshot={snapshot} evaluation={evaluateLevel(level0, snapshot)} setup={{ ai: 'codex' }} onSave={async () => true} />,
    );
    expect(html).toContain(`href="${CODEX}"`);
  });
});
