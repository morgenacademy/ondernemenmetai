import { renderToStaticMarkup } from 'react-dom/server';
import { describe, expect, it } from 'vitest';
import { level2 } from '../lib/levels/level2';
import type { UploadStep } from '../lib/levels/types';
import { starterFiles } from '../lib/repo/starterFiles';
import { UploadStap } from './UploadStap';

const step = level2.steps.find((s): s is UploadStep => s.kind === 'uploads')!;
const html = renderToStaticMarkup(
  <UploadStap step={step} snapshot={{ files: starterFiles, mergedPullRequests: 0 }} onSave={async () => true} />,
);

describe('UploadStap', () => {
  it('laat .vtt-bestanden kiezen', () => {
    expect(html).toMatch(/accept="[^"]*\.vtt/);
  });

  it('herinnert bij de uploadknop aan namen eruit halen', () => {
    const id = html.match(/aria-describedby="([^"]+)"/)?.[1];
    expect(id).toBeTruthy();
    expect(html).toMatch(new RegExp(`id="${id}"[^>]*>[^<]*[Nn]amen eruit`));
  });
});
