import { Component, type ErrorInfo, type ReactNode } from 'react';

type Props = { children: ReactNode; onClear: () => void; soort?: 'demo' | 'echt' };
type State = { failed: boolean };

/**
 * Vangt fouten in de app op. In de demo is meestal de opgeslagen demo-stand beschadigd; de knop wist die.
 * In de echte stand is er niets lokaals om te wissen: de knop herlaadt de pagina.
 */
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
    if (this.props.soort === 'echt') {
      return (
        <div className="mx-auto max-w-xl px-4 py-12">
          <section role="alert" className="card">
            <p className="eyebrow">Er ging iets mis</p>
            <h1 className="text-2xl font-extrabold text-white">Deze pagina is vastgelopen</h1>
            <p className="mt-3 text-[var(--text-secondary)]">
              Je repo op GitHub is niet veranderd. Herlaad de pagina: dan haalt dit platform je repo opnieuw op.
            </p>
            <button type="button" className="btn-p mt-4" onClick={() => window.location.reload()}>
              Herlaad de pagina
            </button>
          </section>
        </div>
      );
    }
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
