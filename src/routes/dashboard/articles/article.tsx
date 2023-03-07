import * as React from 'react';
import { router } from '../../../router'
import { useQuery } from '@tanstack/react-query';
import { articlesRoute } from '.';
import { z } from 'zod';
import { queryClient } from '../../../main';
import { Article } from '../../../utils';



export const articleRoute = articlesRoute.createRoute({
  path: ':articleId',
  parseParams: (params) => ({
    articleId: z.string().parse(params.articleId),
  }),
  stringifyParams: ({ articleId }) => ({ articleId: `${articleId}` }),
  element: <ArticleView />,
  loader: async ({ params: { articleId } }) => {
    const article = (queryClient.getQueryData(['articles']) as Article[]);
    console.log(queryClient.getQueryCache())
    if (!article) {
      throw new Error('article not found')
    }

    return {
      article,
    }
  }
})

function ArticleView() {
  const { loaderData: { article }, search: { articleId } } = router.useMatch(articleRoute.id);
  console.log(article);
  return <span>{articleId}</span>;
}