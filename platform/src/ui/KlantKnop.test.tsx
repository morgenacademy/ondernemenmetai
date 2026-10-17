import { renderToStaticMarkup } from 'react-dom/server';
import { describe, expect, it } from 'vitest';
import { starterFiles } from '../lib/repo/starterFiles';
import { KlantKnop } from './KlantKnop';

describe('KlantKnop', () => {
  const html = renderToStaticMarkup(<KlantKnop snapshot={{ files: starterFiles, mergedPullRequests: 0 }} onSave={async () => true} />);

  it('opent een dialoog met het klantformulier', () => {
    const knop = html.match(/<button[^>]*aria-haspopup="dialog"[^>]*>([^<]*)<\/button>/);
    expect(knop?.[1]).toBe('Ik heb een klant');
    expect(html).toMatch(/<dialog[\s\S]*Rol van je klant[\s\S]*Zet in je repo[\s\S]*<\/dialog>/);
  });

  it('zegt dat level 6 dan opengaat, en heeft demo-content', () => {
    expect(html).toContain('level 6');
    expect(html).toMatch(/<dialog[\s\S]*Vul met demo content[\s\S]*<\/dialog>/);
  });
});
