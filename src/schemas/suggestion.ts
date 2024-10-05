import * as z from "zod"

export const SuggestionModel = z.object({
  id: z.number().int(),
  url: z.string(),
  name: z.string(),
})
