import z from 'zod'

export const GAME_QUESTION_SCHEMA = z.object({
    type: z.enum(['single']),
    text: z.string(),
    options: z.array(z.object({
        text: z.string(),
        value: z.string()
    }))
})