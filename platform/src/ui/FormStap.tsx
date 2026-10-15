import { useState, type FormEvent } from 'react';
import type { Field, FileWrite, FormStep, FormValues } from '../lib/levels/types';
import type { RepoSnapshot } from '../lib/repo/types';

type Props = { step: FormStep; snapshot: RepoSnapshot; alreadyDone: boolean; onSave: (w: FileWrite) => Promise<boolean> };

function initialValues(fields: Field[]): FormValues {
  return Object.fromEntries(fields.map((f) => [f.name, f.kind === 'select' ? f.options[0].value : '']));
}

function isRequired(field: Field): boolean {
  return (field.kind === 'text' || field.kind === 'textarea') && !field.optional;
}

export function FormStap({ step, snapshot, alreadyDone, onSave }: Props) {
  const [values, setValues] = useState<FormValues>(() => initialValues(step.fields));
  const [saving, setSaving] = useState(false);
  const missing = step.fields.some((f) => isRequired(f) && values[f.name].trim() === '');
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
                {field.options.map((o) => (
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
                placeholder={field.placeholder}
                value={values[field.name]}
                onChange={(e) => set(field.name, e.target.value)}
              />
            )}
          </div>
        );
      })}
      <div className="flex flex-wrap items-center gap-3">
        <button type="submit" className="btn-p" disabled={saving || missing}>
          {saving ? 'Bezig…' : 'Zet in je repo'}
        </button>
        {alreadyDone && <span className="text-sm text-[var(--text-secondary)]">Staat al in je repo. Opnieuw opslaan overschrijft het.</span>}
      </div>
    </form>
  );
}
