import * as z from "zod"
import { CompleteUser, RelatedUserModel, CompleteGame, RelatedGameModel } from "./index"

export const AnswerModel = z.object({
  id: z.number().int(),
  answer: z.string(),
  userId: z.number().int(),
  gameId: z.number().int(),
  createdAt: z.date(),
})

export interface CompleteAnswer extends z.infer<typeof AnswerModel> {
  user: CompleteUser
  game: CompleteGame
}

/**
 * RelatedAnswerModel contains all relations on your model in addition to the scalars
 *
 * NOTE: Lazy required in case of potential circular dependencies within schema
 */
export const RelatedAnswerModel: z.ZodSchema<CompleteAnswer> = z.lazy(() => AnswerModel.extend({
  user: RelatedUserModel,
  game: RelatedGameModel,
}))
