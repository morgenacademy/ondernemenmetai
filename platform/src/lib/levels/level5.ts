import { parseMarkdown, toMarkdown, upsertSection } from '../markdown';
import { fileFilled, frontmatterFilled, frontmatterIs, sectionFilled } from './checks';
import { RESULTATEN_DIR } from './level4';
import type { LevelDef } from './types';

export const PRODUCT_PATH = 'level-5-productvalidatie/product.md';
export const BMC_PATH = 'level-5-productvalidatie/bmc.md';
export const AGENTS_PATH = 'AGENTS.md';
export const OVER_MIJN_ONDERNEMING = 'Over mijn onderneming';

export const level5: LevelDef = {
  id: 5,
  name: 'Product-validatie',
  summary: 'Ontwikkel door op de redenen van nee, ga terug naar de markt, en kies of je ervoor gaat.',
  milestone: '3. Commitment en 4. Product/market fit: een basisproduct waar je eerste klanten fan van zijn.',
  doel: 'Je hebt een product waar je voor gaat.',
  vraag: 'Wat moet er beter, tot ik er echt voor ga?',
  begrip: 'AGENTS.md',
  kern: [PRODUCT_PATH, BMC_PATH],
  ready: true,
  steps: [
    {
      id: 'l5-doorontwikkelen',
      title: 'Ontwikkel door op de feedback',
      kind: 'action',
      waar: ['ai-app', 'github-desktop', 'github'],
      aiPrompt:
        'Gebruik skill verbeteren. Zet de redenen van nee uit mijn feedback op een rij, stel per reden drie aanpassingen voor, en leg wat ik kies vast in mijn MVP en in level-5-productvalidatie/product.md, op een nieuwe branch.',
    },
    {
      id: 'l5-terug',
      title: 'Ga terug naar de markt',
      kind: 'action',
      waar: ['buiten', 'platform'],
      paneel: 'rondes',
      aiPrompt: 'Gebruik skill testkaart en daarna skill terugbellen. Maak de testkaart voor de volgende ronde en zet bij mijn mensen wat er sinds de vorige ronde veranderde.',
    },
    {
      id: 'l5-besluit',
      title: 'Kies: ga je ervoor?',
      kind: 'form',
      waar: ['platform'],
      fields: [
        {
          kind: 'select',
          name: 'besluit',
          label: 'Ga je ervoor?',
          options: [
            { value: 'ik ga ervoor', label: 'Ik ga ervoor' },
            { value: 'nog niet', label: 'Nog niet' },
          ],
        },
        {
          kind: 'select',
          name: 'volgende_stap',
          label: 'Wat doe je nu?',
          options: [
            { value: 'echt verkopen', label: 'Ik ga nu echt verkopen' },
            { value: 'meer bestellen', label: 'Ik bestel meer' },
            { value: 'laten produceren', label: 'Ik laat produceren' },
            { value: 'nog een ronde', label: 'Ik doe nog een ronde' },
          ],
        },
        { kind: 'textarea', name: 'onderbouwing', label: 'Welk bewijs uit je rondes trok je over de streep?' },
      ],
      toFile: (v, s) => {
        const { frontmatter, body } = parseMarkdown(s.files[PRODUCT_PATH] ?? '# Mijn product\n');
        return {
          path: PRODUCT_PATH,
          message: `Besluit: ${v.besluit}`,
          content: toMarkdown({ ...frontmatter, besluit: v.besluit, volgende_stap: v.volgende_stap }, upsertSection(body, 'Onderbouwing', v.onderbouwing)),
        };
      },
    },
    {
      id: 'l5-bmc',
      title: 'Breng je businessmodel in kaart',
      kind: 'action',
      waar: ['ai-app'],
      aiPrompt: 'Gebruik skill bmc. Vul met mij de negen bouwstenen in level-5-productvalidatie/bmc.md en haal op wat al in mijn repo staat.',
    },
    {
      id: 'l5-agents',
      title: 'Vertel je AI wie je onderneming is',
      kind: 'action',
      waar: ['ai-app', 'github-desktop', 'github'],
      aiPrompt:
        'Schrijf met mij de sectie "Over mijn onderneming" in AGENTS.md: wie mijn klanten zijn, wat ik verkoop en voor welke prijs. Haal het uit mijn repo en stel het voor op een nieuwe branch.',
      popup: { label: 'Waarom staat dit in AGENTS.md?', title: 'AGENTS.md is waar elke sessie begint', contentId: 'l5-waarom-agents' },
    },
  ],
  checks: [
    fileFilled('product', 'l5-doorontwikkelen', PRODUCT_PATH, 'Product beschreven'),
    frontmatterFilled('rondes', 'l5-terug', { folder: RESULTATEN_DIR, min: () => 2 }, ['besluit'], 'Resultaatkaarten'),
    frontmatterIs('besluit', 'l5-besluit', PRODUCT_PATH, 'besluit', 'ik ga ervoor', 'Je gaat ervoor'),
    sectionFilled('onderbouwing', 'l5-besluit', PRODUCT_PATH, 'Onderbouwing', 'Onderbouwing uit je rondes'),
    fileFilled('bmc', 'l5-bmc', BMC_PATH, 'Business Model Canvas ingevuld'),
    sectionFilled('agents', 'l5-agents', AGENTS_PATH, OVER_MIJN_ONDERNEMING, 'Over mijn onderneming in AGENTS.md'),
  ],
};
