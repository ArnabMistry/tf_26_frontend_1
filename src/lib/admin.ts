import { authRequest } from './auth';

export type Row = Record<string, unknown>;
export type EventSummary = { id: string; name: string; club: string; isTeamEvent: boolean; _count: { registrations: number; teams: number; rounds: number } };
export type Dashboard = { totals: Record<string, number>; perEventStats: EventSummary[]; recentRegistrations: Row[] };
export const record = (value: unknown): Row => value && typeof value === 'object' && !Array.isArray(value) ? value as Row : {};
export const rows = (value: unknown): Row[] => Array.isArray(value) ? value.map(record) : [];
export const text = (value: unknown): string => value == null ? '—' : String(value);
export const person = (value: unknown): string => { const user = record(value); return user.email ? text(user.email) : [user.firstName, user.lastName].filter(Boolean).join(' ') || '—'; };
export const enc = (value: unknown) => encodeURIComponent(String(value));
export async function adminRequest(path: string, body?: unknown, method?: string) {
  return (await authRequest(path, body, localStorage.getItem('tf_auth_token') || '', method)).data;
}
export function downloadCsv(filename: string, values: unknown[][]) {
  const escaped = values.map(row => row.map(value => {
    let valueText = value == null ? '' : String(value);
    if (/^[=+@\-\t\r]/.test(valueText)) valueText = `'${valueText}`;
    return `"${valueText.replace(/"/g, '""')}"`;
  }).join(',')).join('\r\n');
  const url = URL.createObjectURL(new Blob(['\uFEFF', escaped], { type: 'text/csv;charset=utf-8' }));
  const link = document.createElement('a'); link.href = url; link.download = filename; link.click();
  setTimeout(() => URL.revokeObjectURL(url), 1000);
}
