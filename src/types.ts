import { z } from 'zod';

export const MovieObject = z.object({
  id: z.string(),
  primaryImage: z
    .object({
      id: z.string(),
      width: z.number(),
      height: z.number(),
      url: z.string(),
      caption: z.object({ plainText: z.string(), __typename: z.string() }),
      __typename: z.string(),
    })
    .nullable(),
  titleType: z
    .object({
      text: z.string(),
      id: z.string(),
      isSeries: z.boolean(),
      isEpisode: z.boolean(),
      __typename: z.string(),
    })
    .nullable(),
  titleText: z.object({ text: z.string(), __typename: z.string() }),
  releaseYear: z
    .object({
      year: z.number(),
      endYear: z.null(),
      __typename: z.string(),
    })
    .nullable(),
  releaseDate: z
    .object({
      day: z.number().nullable(),
      month: z.number().nullable(),
      year: z.number().nullable(),
      __typename: z.string(),
    })
    .nullable(),
});

export type Movie = z.infer<typeof MovieObject>;
