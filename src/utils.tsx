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

export interface OptionType {
  value: string;
  label: string;
}


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

const baseURL = 'https://moviesdatabase.p.rapidapi.com/titles';
const options = {
  method: 'GET',
  headers: {
    'X-RapidAPI-Key': '18f3d531ddmsh23b545b8f03153dp1db305jsn5903b0518f86',
    'X-RapidAPI-Host': 'moviesdatabase.p.rapidapi.com'
  }
}

type ShittyType = string | number[];

const getSearchParams = ({ startYear, endYear }: { startYear?: number; endYear?: number }) => {
  console.log({ startYear, endYear })
  return ([['startYear', startYear], ['endYear', endYear]] as ShittyType[]).reduce((cur, acc) => {
    if (!acc && cur[1]) return `?${cur[0]}=${cur[1]}`;
    if (acc && cur[1]) return `${acc}&${cur[0]}=${cur[1]}`;
    return acc;
  }, '');
};

export const fetchMovies = ({ keyword, startYear, endYear, signal }: {
  keyword: string;
  startYear?: number;
  endYear?: number;
  signal?: AbortSignal;
}): Promise<{ results: Movie[] }> => {
  return fetch(`${baseURL}/search/keyword/${keyword}`, { ...options, signal })
    .then(response => response.json())
};

export const fetchMovie = ({ id }: { id: string }): Promise<{ results: Movie }> => {
  return fetch(`${baseURL}/${id}`, options)
    .then(response => response.json())
};


enum ParamNames {
  TTITLE = 'title',
  START_YEAR = 'startYear',
  END_YEAR = 'endYear',
}

type Dupa = Record<ParamNames, string | number>;

export const getParams = (params: Dupa): Dupa => {
  return Object.entries(params).reduce(([key, value], acc) => {
    return { ...acc, ...(value && { [key]: value }) }
  }, {});
}
