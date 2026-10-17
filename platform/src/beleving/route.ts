import { LEVELS } from '../lib/levels';

/** De schermen van het platform. De route staat in de hash, zodat terug en herladen werken. */
export type Route = { scherm: 'welkom' } | { scherm: 'route'; van: number | null } | { scherm: 'level'; level: number };

const ROUTE: Route = { scherm: 'route', van: null };

export function parseRoute(hash: string, introGezien: boolean): Route {
  const [pad, query = ''] = hash.replace(/^#/, '').split('?');
  if (pad === '' || pad === '/') return introGezien ? ROUTE : { scherm: 'welkom' };
  if (pad === '/welkom') return { scherm: 'welkom' };
  if (pad === '/route') {
    const van = Number(new URLSearchParams(query).get('van'));
    return { scherm: 'route', van: query.includes('van=') && LEVELS.some((l) => l.id === van) ? van : null };
  }
  const level = Number(pad.match(/^\/level\/(\d+)$/)?.[1]);
  return LEVELS.some((l) => l.id === level) ? { scherm: 'level', level } : ROUTE;
}

export function routeHash(r: Route): string {
  if (r.scherm === 'welkom') return '#/welkom';
  if (r.scherm === 'level') return `#/level/${r.level}`;
  return r.van === null ? '#/route' : `#/route?van=${r.van}`;
}
