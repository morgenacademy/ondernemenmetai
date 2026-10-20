import { renderToStaticMarkup } from 'react-dom/server';
import { describe, expect, it } from 'vitest';
import { lijktStarterRepo, TEMPLATE_URL } from '../lib/repo/starter';
import { starterFiles } from '../lib/repo/starterFiles';
import type { RepoSnapshot } from '../lib/repo/types';
import type { SessieStand } from '../lib/sessie';
import { KoppelenEcht } from './KoppelenEcht';
import { ECHT_VOORBEELD, StandContext } from './stand';

const snapshot: RepoSnapshot = { files: starterFiles, mergedPullRequests: 0 };

const render = (sessie: SessieStand, af = false, snap: RepoSnapshot = snapshot) =>
  renderToStaticMarkup(
    <StandContext.Provider value={{ ...ECHT_VOORBEELD, sessie, terug: '#/level/0' } as typeof ECHT_VOORBEELD}>
      <KoppelenEcht af={af} snapshot={snap} />
    </StandContext.Provider>,
  );

describe('KoppelenEcht', () => {
  it('bij uit toont Koppel met GitHub naar /api/koppel?terug=%23%2Flevel%2F0', () => {
    const html = render({ stand: 'uit' });
    expect(html).toContain('href="/api/koppel?terug=%23%2Flevel%2F0"');
    expect(html).toContain('Koppel met GitHub');
    expect(html).toContain('<b>Only select repositories</b>');
    expect(html).toContain('<b>Install</b>');
    expect(html).toContain('Dan krijgt deze stap vanzelf een vinkje.');
  });

  it('bij kies-repo zonder repo\'s toont ook Koppel met GitHub', () => {
    expect(render({ stand: 'kies-repo', login: 'harmen', repos: [] })).toContain('Koppel met GitHub');
  });

  it('bij kies-repo met twee repo\'s toont een knop per repo', () => {
    const html = render({ stand: 'kies-repo', login: 'harmen', repos: ['harmen/een', 'harmen/twee'] });
    expect(html).toContain('Welke repo is van je onderneming?');
    expect(html).toContain('harmen/een');
    expect(html).toContain('harmen/twee');
    expect(html.match(/<button/g)).toHaveLength(2);
    expect(html).not.toContain('Koppel met GitHub');
  });

  it('bij gekoppeld toont de repo, en de waarschuwing alleen zonder AGENTS.md', () => {
    const goed = render({ stand: 'gekoppeld', login: 'harmen', repo: 'harmen/mijn-onderneming' }, true);
    expect(goed).toContain('✓ Gekoppeld met harmen/mijn-onderneming');
    expect(goed).not.toContain('lijkt niet gemaakt');
    const leeg = render({ stand: 'gekoppeld', login: 'harmen', repo: 'harmen/leeg' }, false, { files: {}, mergedPullRequests: 0 });
    expect(leeg).toContain('Deze repo lijkt niet gemaakt met de starter-repo.');
    expect(leeg).toContain('Maak een repo met de starter-repo');
    expect(leeg).toContain(`href="${TEMPLATE_URL.replace('&', '&amp;')}"`);
  });
});

describe('lijktStarterRepo', () => {
  it('is true voor de starter-bestanden', () => {
    expect(lijktStarterRepo({ files: starterFiles, mergedPullRequests: 0 })).toBe(true);
  });
  it('is false voor een lege repo en voor een repo met alleen een README', () => {
    expect(lijktStarterRepo({ files: {}, mergedPullRequests: 0 })).toBe(false);
    expect(lijktStarterRepo({ files: { 'README.md': 'x' }, mergedPullRequests: 0 })).toBe(false);
  });
});
