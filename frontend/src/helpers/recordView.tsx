import React from 'react';
import { humanize } from './humanize';

export function formatDate(value?: string | null) {
  if (!value) {
    return 'Not scheduled';
  }

  return new Intl.DateTimeFormat('en-US', {
    month: 'short',
    day: 'numeric',
    year: 'numeric',
  }).format(new Date(value));
}

export function formatDateTime(value?: string | null) {
  if (!value) {
    return 'Not available';
  }

  return new Intl.DateTimeFormat('en-US', {
    month: 'short',
    day: 'numeric',
    year: 'numeric',
    hour: 'numeric',
    minute: '2-digit',
  }).format(new Date(value));
}

export function formatCurrency(value?: number | string | null) {
  if (value === null || value === undefined || value === '') {
    return 'Not available';
  }

  const numericValue = Number(value);

  if (Number.isNaN(numericValue)) {
    return String(value);
  }

  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
    maximumFractionDigits: 0,
  }).format(numericValue);
}

export function formatBoolean(value?: boolean | null) {
  if (value === null || value === undefined) {
    return 'Not available';
  }

  return value ? 'Yes' : 'No';
}

export function renderText(value?: React.ReactNode, fallback = 'Not available') {
  if (value === null || value === undefined || value === '') {
    return fallback;
  }

  return value;
}

export function personName(person?: { firstName?: string | null; lastName?: string | null; name?: string | null }) {
  if (!person) {
    return 'Not available';
  }

  if (person.name) {
    return person.name;
  }

  const fullName = [person.firstName, person.lastName].filter(Boolean).join(' ');
  return fullName || 'Not available';
}

export function humanized(value?: string | null, fallback = 'Not available') {
  if (!value) {
    return fallback;
  }

  return humanize(value);
}
