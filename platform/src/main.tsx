import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import App from './App';
import { MockRepoAdapter } from './lib/repo/mockRepo';
import { starterFiles } from './lib/repo/starterFiles';
import './styles.css';

function browserStorage(): Storage | null {
  try {
    return window.localStorage;
  } catch {
    return null;
  }
}

const repo = new MockRepoAdapter(browserStorage(), starterFiles);

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <App repo={repo} />
  </StrictMode>,
);
