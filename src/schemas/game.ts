import * as z from "zod"
import { CompleteRoom, RelatedRoomModel, CompleteAnswer, RelatedAnswerModel } from "./index"

export const GameModel = z.object({
  id: z.number().int(),
  roomId: z.number().int(),
  correctAnswer: z.string(),
  pictureUrl: z.string(),
  createdAt: z.date(),
  updatedAt: z.date(),
})

export interface CompleteGame extends z.infer<typeof GameModel> {
  room: CompleteRoom
  answers: CompleteAnswer[]
}

/**
 * RelatedGameModel contains all relations on your model in addition to the scalars
 *
 * NOTE: Lazy required in case of potential circular dependencies within schema
 */
export const RelatedGameModel: z.ZodSchema<CompleteGame> = z.lazy(() => GameModel.extend({
  room: RelatedRoomModel,
  answers: RelatedAnswerModel.array(),
}))
