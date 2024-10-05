import * as z from "zod"
import { CompleteUser, RelatedUserModel } from "./index"

export const RoomModel = z.object({
  id: z.number().int(),
  roomId: z.string(),
  createdAt: z.date(),
  updatedAt: z.date(),
})

export interface CompleteRoom extends z.infer<typeof RoomModel> {
  users: CompleteUser[]
}

/**
 * RelatedRoomModel contains all relations on your model in addition to the scalars
 *
 * NOTE: Lazy required in case of potential circular dependencies within schema
 */
export const RelatedRoomModel: z.ZodSchema<CompleteRoom> = z.lazy(() => RoomModel.extend({
  users: RelatedUserModel.array(),
}))
