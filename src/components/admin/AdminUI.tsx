'use client';
import { useEffect, useRef, useState, type ReactNode } from 'react';
import { adminRequest, record, text, type Row } from '@/lib/admin';
import { ApiError } from '@/lib/auth';
import { saveAuthTokens } from '@/lib/supabase';
import { useRouter } from 'next/navigation';

export function useAdminData(path: string | null) {
  const [snapshot, setSnapshot] = useState<{ key: string; data: unknown; error: string } | null>(null);
  const [version, setVersion] = useState(0);
  const router = useRouter();
  const requestKey = `${path}:${version}`;
  useEffect(() => {
    let active = true;
    if (!path) return;
    adminRequest(path).then(value => { if (active) setSnapshot({ key: requestKey, data: value, error: '' }); }).catch(err => {
      if (!active) return;
      if (err instanceof ApiError && err.status === 401) { saveAuthTokens({ accessToken: null, refreshToken: null }); router.replace('/login'); }
      setSnapshot({ key: requestKey, data: null, error: err instanceof Error ? err.message : 'Unable to load data.' });
    });
    return () => { active = false; };
  }, [path, requestKey, router]);
  const current = snapshot?.key === requestKey ? snapshot : null;
  return { data: current?.data ?? null, error: current?.error || '', loading: !!path && !current, reload: () => setVersion(v => v + 1) };
}

export function LoadState({ loading, error }: { loading: boolean; error: string }) {
  return error ? <p role="alert" className="admin-error">{error}</p> : loading ? <p role="status">Loading…</p> : null;
}

export function Table({ headings, children, empty }: { headings: string[]; children: ReactNode; empty: boolean }) {
  return <div className="admin-table"><table><thead><tr>{headings.map(h => <th key={h}>{h}</th>)}</tr></thead><tbody>{empty ? <tr><td colSpan={headings.length}>No records found.</td></tr> : children}</tbody></table></div>;
}

export type Field = { name: string; label: string; type?: string; required?: boolean; options?: { value: string; label: string }[]; min?: number; value?: unknown };
export type Editor = { title: string; path: string; method?: string; fields: Field[]; initial?: Row; transform?: (data: Row) => Row; warning?: string };
export function EditorDialog({ editor, close, saved }: { editor: Editor; close: () => void; saved: () => void }) {
  const ref = useRef<HTMLDialogElement>(null);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState('');
  useEffect(() => { const dialog = ref.current; dialog?.showModal(); return () => dialog?.close(); }, []);
  return <dialog ref={ref} className="admin-dialog" onCancel={e => { if (busy) e.preventDefault(); else close(); }}>
    <form onSubmit={async e => {
      e.preventDefault(); setBusy(true); setError('');
      try {
        const form = new FormData(e.currentTarget); const payload: Row = {};
        for (const field of editor.fields) {
          const value = form.get(field.name);
          payload[field.name] = field.type === 'checkbox' ? value === 'on' : field.type === 'number' ? (value === '' ? null : Number(value)) : field.type === 'datetime-local' ? new Date(String(value)).toISOString() : value;
        }
        await adminRequest(editor.path, editor.transform ? editor.transform(payload) : payload, editor.method || 'POST');
        saved(); close();
      } catch (err) { setError(err instanceof Error ? err.message : 'Unable to save.'); }
      finally { setBusy(false); }
    }}>
      <h2>{editor.title}</h2>{editor.warning && <p>{editor.warning}</p>}
      <fieldset disabled={busy} className="admin-fields">
        {editor.fields.map(field => {
          let value = editor.initial?.[field.name] ?? field.value ?? '';
          if (field.type === 'datetime-local' && value) { const date = new Date(String(value)); if (!Number.isNaN(date.getTime())) value = new Date(date.getTime() - date.getTimezoneOffset() * 60000).toISOString().slice(0, 16); }
          return <label key={field.name}>{field.label}{field.required ? ' *' : ''}
            {field.options ? <select name={field.name} defaultValue={String(value)} required={field.required}>{field.options.map(o => <option key={o.value} value={o.value}>{o.label}</option>)}</select>
              : field.type === 'textarea' ? <textarea name={field.name} defaultValue={String(value)} required={field.required} />
              : field.type === 'checkbox' ? <input type="checkbox" name={field.name} defaultChecked={Boolean(value)} />
              : <input name={field.name} type={field.type || 'text'} defaultValue={String(value)} min={field.min} required={field.required} />}
          </label>;
        })}
      </fieldset>
      {error && <p role="alert" className="admin-error">{error}</p>}
      <div className="admin-actions"><button type="button" disabled={busy} onClick={close}>Cancel</button><button className="primary" disabled={busy}>{busy ? 'Saving…' : 'Save'}</button></div>
    </form>
  </dialog>;
}

export function Details({ value }: { value: unknown }) {
  const data = record(value);
  return <dl className="admin-details">{Object.entries(data).map(([key, item]) => <div key={key}><dt>{key}</dt><dd>{item !== null && typeof item === 'object' ? <Details value={Array.isArray(item) ? Object.fromEntries(item.map((v, i) => [String(i + 1), v])) : item} /> : text(item)}</dd></div>)}</dl>;
}
