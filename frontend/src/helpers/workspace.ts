import axios from 'axios';

export async function fetchCount(path: string, params?: Record<string, string>) {
  const { data } = await axios.get(path, { params });
  return Number(data?.count || 0);
}

export function formatWorkspaceDate(
  value?: string | null,
  emptyLabel = 'No recent update',
) {
  if (!value) {
    return emptyLabel;
  }

  return new Intl.DateTimeFormat('en-US', {
    month: 'short',
    day: 'numeric',
    hour: 'numeric',
    minute: '2-digit',
  }).format(new Date(value));
}
