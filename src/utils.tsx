import * as React from 'react'
import { queryClient } from './main'
import { Movie } from './types'

export async function loaderDelayFn<T>(fn: (...args: any[]) => Promise<T> | T) {
  const delay = Number(sessionStorage.getItem('loaderDelay') ?? 0)
  const delayPromise = new Promise((r) => setTimeout(r, delay))

  const [res] = await Promise.all([fn(), delayPromise])

  return res
}

export const countOptions: { value: number; label: string }[] = [
  { value: 3, label: `3` },
  { value: 6, label: `6` },
  { value: 15, label: `15` },
];

export const getCurrenSearchCachedResult: ({
  keyword, limit
}: {
  readonly keyword?: string;
  readonly limit?: number;
}) => Movie[] | undefined = ({ keyword, limit }) => queryClient.getQueryData([keyword, limit]);
