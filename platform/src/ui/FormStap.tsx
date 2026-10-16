import { useState, type FormEvent } from 'react';
import type { Field, FileWrite, FormStep, FormValues, Option } from '../lib/levels/types';
import type { RepoSnapshot } from '../lib/repo/types';

/** demoWaarden: in de demo vult een knop het formulier, zodat je daarna zelf op "Zet in je repo" klikt. */
type Props = { step: FormStep; snapshot: RepoSnapshot; alreadyDone: boolean; onSave: (w: FileWrite) => Promise<boolean>; demoWaarden?: FormValues };

function optionsOf(field: Field, snapshot: RepoSnapshot): Option[] {
  return field.kind === 'select' ? (field.optionsFrom?.(snapshot) ?? field.options) : [];
}

function initialValues(fields: Field[]): FormValues {
  return Object.fromEntries(fields.map((f) => [f.name, f.kind === 'select' ? (f.options[0]?.value ?? '') : '']));
}

function isRequired(field: Field): boolean {
  return (field.kind === 'text' || field.kind === 'textarea') && !field.optional;
}

/** Een keuzelijst die zijn keuzes uit de repo haalt, kiest de eerste als de huidige waarde er niet (meer) tussen staat. */
function resolve(fields: Field[], values: FormValues, snapshot: RepoSnapshot): FormValues {
  const resolved = { ...values };
  for (const field of fields) {
    if (field.kind !== 'select') continue;
    const options = optionsOf(field, snapshot);
    if (!options.some((o) => o.value === values[field.name])) resolved[field.name] = options[0]?.value ?? '';
  }
  return resolved;
}

/** Uitleg bij een uitgeschakelde knop: het eerste lege veld, plus hoeveel er nog meer leeg zijn. */
export function missingFieldsHint(labels: string[]): string | null {
  if (labels.length === 0) return null;
  const rest = labels.length - 1;
  return rest === 0 ? `Nog leeg: ${labels[0]}` : `Nog leeg: ${labels[0]} en nog ${rest} ${rest === 1 ? 'veld' : 'velden'}`;
}

export function FormStap({ step, snapshot, alreadyDone, onSave, demoWaarden }: Props) {
  const [raw, setValues] = useState<FormValues>(() => initialValues(step.fields));
  const [saving, setSaving] = useState(false);
  const values = resolve(step.fields, raw, snapshot);
  const empty = step.fields.filter((f) => (isRequired(f) && values[f.name].trim() === '') || (f.kind === 'select' && optionsOf(f, snapshot).length === 0));
  const hint = missingFieldsHint(empty.map((f) => f.label));
  const missing = hint !== null;
  const hintId = `${step.id}-leeg`;
  const set = (name: string, value: string) => setValues((prev) => ({ ...prev, [name]: value }));

  const submit = async (e: FormEvent) => {
    e.preventDefault();
    if (missing) return;
    setSaving(true);
    await onSave(step.toFile(values, snapshot));
    setSaving(false);
  };

  return (
    <form onSubmit={submit} className="mt-4 space-y-3">
      {step.fields.map((field) => {
        const id = `${step.id}-${field.name}`;
        return (
          <div key={field.name}>
            <label htmlFor={id} className="veld-label">
              {field.label}
            </label>
            {field.kind === 'select' ? (
              <select id={id} className="veld" value={values[field.name]} onChange={(e) => set(field.name, e.target.value)}>
                {optionsOf(field, snapshot).map((o) => (
                  <option key={o.value} value={o.value}>
                    {o.label}
                  </option>
                ))}
              </select>
            ) : field.kind === 'textarea' ? (
              <textarea id={id} className="veld" rows={3} placeholder={field.placeholder} value={values[field.name]} onChange={(e) => set(field.name, e.target.value)} />
            ) : (
              <input
                id={id}
                className="veld"
                type={field.kind === 'number' ? 'number' : 'text'}
                min={field.kind === 'number' ? 1 : undefined}
                max={field.kind === 'number' ? field.max : undefined}
                placeholder={field.placeholder}
                value={values[field.name]}
                onChange={(e) => set(field.name, e.target.value)}
              />
            )}
          </div>
        );
      })}
      <div className="flex flex-wrap items-center gap-3">
        <button type="submit" className="btn-p" disabled={saving || missing} aria-describedby={hint ? hintId : undefined}>
          {saving ? 'Bezig…' : 'Zet in je repo'}
        </button>
        {hint && (
          <span id={hintId} className="text-sm text-[var(--text-secondary)]">
            {hint}
          </span>
        )}
        {alreadyDone && <span className="text-sm text-[var(--text-secondary)]">Staat al in je repo. Opnieuw opslaan overschrijft het.</span>}
      </div>
      {demoWaarden && (
        <button type="button" className="btn-demo" onClick={() => setValues((prev) => ({ ...prev, ...demoWaarden }))}>
          Vul met demo content
        </button>
      )}
    </form>
  );
}
