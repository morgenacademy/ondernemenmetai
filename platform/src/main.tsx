import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import App from './App';
import { MockRepoAdapter, clearDemoStorage } from './lib/repo/mockRepo';
import { starterFiles } from './lib/repo/starterFiles';
import { Foutgrens } from './ui/Foutgrens';
import './styles.css';

function browserStorage(): Storage | null {
  try {
    return window.localStorage;
  } catch {
    return null;
  }
}

const storage = browserStorage();
const repo = new MockRepoAdapter(storage, starterFiles);

const clearAndReload = () => {
  clearDemoStorage(storage);
  window.location.reload();
};

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <Foutgrens onClear={clearAndReload}>
      <App repo={repo} />
    </Foutgrens>
  </StrictMode>,
);
