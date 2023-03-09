import * as React from 'react'
import { Movie } from './types'

export async function loaderDelayFn<T>(fn: (...args: any[]) => Promise<T> | T) {
  const delay = Number(sessionStorage.getItem('loaderDelay') ?? 0)
  const delayPromise = new Promise((r) => setTimeout(r, delay))

  const [res] = await Promise.all([fn(), delayPromise])

  return res
}

export async function actionDelayFn<T>(fn: (...args: any[]) => Promise<T> | T) {
  const delay = Number(sessionStorage.getItem('actionDelay') ?? 0)
  await new Promise((r) => setTimeout(r, delay))
  return fn()
}

export function shuffle<T>(arr: T[]): T[] {
  var i = arr.length
  if (i == 0) return arr
  const copy = [...arr]
  while (--i) {
    var j = Math.floor(Math.random() * (i + 1))
    var a = copy[i]
    var b = copy[j]
    copy[i] = b!
    copy[j] = a!
  }
  return copy
}

export function useSessionStorage<T>(key: string, initialValue: T) {
  const state = React.useState<T>(() => {
    const stored = sessionStorage.getItem(key)
    return stored ? JSON.parse(stored) : initialValue
  })

  React.useEffect(() => {
    sessionStorage.setItem(key, JSON.stringify(state[0]))
  }, [state[0]])

  return state;
}


export const countOptions: { value: number; label: string }[] = [
  { value: 3, label: `3` },
  { value: 6, label: `6` },
  { value: 20, label: `20` },
];

enum ParamNames {
  TTITLE = 'title',
  START_YEAR = 'startYear',
  END_YEAR = 'endYear',
}

type Dupa = Record<ParamNames, string | number>;
