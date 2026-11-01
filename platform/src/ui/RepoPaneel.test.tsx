import { renderToStaticMarkup } from 'react-dom/server';
import { describe, expect, it } from 'vitest';
import { RepoPaneel } from './RepoPaneel';

const render = (showPullRequests: boolean, mergedPullRequests = 0) =>
  renderToStaticMarkup(
    <RepoPaneel
      info={{ name: 'mijn-onderneming', owner: 'demo', isPrivate: true, mergedPullRequests }}
      snapshot={{ files: { 'README.md': '# Mijn onderneming' }, mergedPullRequests }}
      commits={[]}
      lastWritten={null}
      showPullRequests={showPullRequests}
    />,
  );

describe('RepoPaneel', () => {
  it('noemt pull requests nog niet voor level 2', () => {
    const html = render(false);
    expect(html).toContain('Privé');
    expect(html).not.toMatch(/pull request/i);
  });

  it('toont het aantal gemergde pull requests vanaf level 2', () => {
    expect(render(true, 0)).toContain('Privé · 0 gemergde pull requests');
    expect(render(true, 1)).toContain('Privé · 1 gemergde pull request<');
  });

  it('toont Bekijk op GitHub en de auteur bij url en auteur', () => {
    const html = renderToStaticMarkup(
      <RepoPaneel
        info={{ name: 'mijn-onderneming', owner: 'harmen', isPrivate: true, mergedPullRequests: 0, url: 'https://github.com/harmen/mijn-onderneming' }}
        snapshot={{ files: {}, mergedPullRequests: 0 }}
        commits={[{ message: 'Mijn idee', at: '2026-10-20T10:00:00Z', auteur: 'Harmen' }]}
        lastWritten={null}
        showPullRequests={false}
      />,
    );
    expect(html).toContain('href="https://github.com/harmen/mijn-onderneming"');
    expect(html).toContain('target="_blank"');
    expect(html).toContain('rel="noreferrer"');
    expect(html).toContain('Bekijk op GitHub');
    expect(html).toContain('Mijn idee · Harmen');
  });

  it('toont geen link zonder url', () => {
    expect(render(false)).not.toContain('Bekijk op GitHub');
  });
});
