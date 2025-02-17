import * as z from "zod"
import { CompleteRoom, RelatedRoomModel, CompleteAnswer, RelatedAnswerModel } from "./index"

export const UserModel = z.object({
  id: z.number().int(),
  username: z.string(),
  roomId: z.number().int().nullish(),
  createdAt: z.date(),
  updatedAt: z.date(),
  score: z.number().int(),
})

export interface CompleteUser extends z.infer<typeof UserModel> {
  room?: CompleteRoom | null
  answers: CompleteAnswer[]
}

/**
 * RelatedUserModel contains all relations on your model in addition to the scalars
 *
 * NOTE: Lazy required in case of potential circular dependencies within schema
 */
export const RelatedUserModel: z.ZodSchema<CompleteUser> = z.lazy(() => UserModel.extend({
  room: RelatedRoomModel.nullish(),
  answers: RelatedAnswerModel.array(),
}))
