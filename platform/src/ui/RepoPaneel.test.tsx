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
});
