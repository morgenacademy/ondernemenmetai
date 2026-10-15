import { Component, type ErrorInfo, type ReactNode } from 'react';

type Props = { children: ReactNode; onClear: () => void };
type State = { failed: boolean };

/** Vangt fouten in de app op. Meestal is dan de opgeslagen demo-stand beschadigd; de knop wist die. */
export class Foutgrens extends Component<Props, State> {
  state: State = { failed: false };

  static getDerivedStateFromError(): State {
    return { failed: true };
  }

  componentDidCatch(error: Error, info: ErrorInfo) {
    console.error('De demo liep vast', error, info.componentStack);
  }

  render() {
    if (!this.state.failed) return this.props.children;
    return (
      <div className="mx-auto max-w-xl px-4 py-12">
        <section role="alert" className="card">
          <p className="eyebrow">Er ging iets mis</p>
          <h1 className="text-2xl font-extrabold text-white">De demo loopt vast</h1>
          <p className="mt-3 text-[var(--text-secondary)]">
            Waarschijnlijk is de opgeslagen demo-stand in deze browser beschadigd. Wis hem om opnieuw te beginnen vanaf de starter-repo. Wat je in de demo hebt
            ingevuld, ben je dan kwijt.
          </p>
          <button type="button" className="btn-p mt-4" onClick={this.props.onClear}>
            Wis de demo-opslag en begin opnieuw
          </button>
        </section>
      </div>
    );
  }
}
