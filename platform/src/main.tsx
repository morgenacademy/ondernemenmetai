import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import App, { type AppStand } from './App';
import { kiesStand } from './lib/stand';
import { MockRepoAdapter, clearDemoStorage } from './lib/repo/mockRepo';
import { GitHubRepoAdapter } from './lib/repo/githubRepo';
import { starterFiles } from './lib/repo/starterFiles';
import { Foutgrens } from './ui/Foutgrens';
import './styles.css';
import './beleving/beleving.css';

function browserStorage(): Storage | null {
  try {
    return window.localStorage;
  } catch {
    return null;
  }
}

const storage = browserStorage();
const soort = kiesStand(window.location.pathname, import.meta.env.VITE_STAND);

// Demo: mock-repo in localStorage. Echt: de repo van de deelnemer via GitHub, met de gedeelde api (één /api-verzoek tegelijk).
const stand: AppStand = soort === 'demo' ? { soort: 'demo', repo: new MockRepoAdapter(storage, starterFiles) } : { soort: 'echt', github: new GitHubRepoAdapter() };

// Alleen de demo bewaart iets in de browser dat beschadigd kan raken.
const clearAndReload = () => {
  if (soort === 'demo') clearDemoStorage(storage);
  window.location.reload();
};

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <Foutgrens onClear={clearAndReload} soort={soort}>
      <App stand={stand} storage={storage} />
    </Foutgrens>
  </StrictMode>,
);
