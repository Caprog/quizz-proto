import z from 'zod'

export const ACTIONS_SCHEMA = z.object({
  type: z.string(),
  label: z.string().optional(),
  payload: z.object().optional()
})