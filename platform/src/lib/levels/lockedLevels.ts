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
export const level6 = locked(6, 'Lancering', 'Proof of Concept: je eerste betalende klant.', 'Je eerste echte klanten, en zicht op je impact.');
