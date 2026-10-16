type Props = { onReset: () => void | Promise<void> };

export function DemoBalk({ onReset }: Props) {
  return (
    <div className="demo-balk" role="note">
      <span>
        <strong className="text-white">Demomodus.</strong> Je repo is nagebootst in deze browser. Er gaat niets naar GitHub.
      </span>
      <button
        type="button"
        className="btn-o btn-klein"
        onClick={() => {
          if (window.confirm('Alles wissen en opnieuw beginnen?')) void onReset();
        }}
      >
        Opnieuw beginnen
      </button>
    </div>
  );
}
