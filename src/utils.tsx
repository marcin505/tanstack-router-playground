import * as React from 'react'

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

export interface OptionType {
  value: string;
  label: string;
}

export const baseURL = 'https://hn.algolia.com/api/v1/search';

export interface Article {
  id: string;
  title: string;
  points: number;
  url: string;
}

export interface FetchedArticles {
  hits: {
    objectID: string;
    title: string;
    points: number;
    url: string
  }[];
}

export const fetchArticles = (query: string, count: number = 5): Promise<FetchedArticles> => {
  return fetch(`${baseURL}?query=${query}&hitsPerPage=${count}`)
    .then(response => response.json());
};

export const getArticles = (title: string): Promise<Article[]> => fetchArticles(title).then(({ hits }) => {
  const articles = hits.map(article => ({ ...article, id: article.objectID }))
  return articles;
});


