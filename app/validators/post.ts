import vine from '@vinejs/vine'

export const createPostValidator = vine.compile(
  vine.object({
    title: vine.string().trim().minLength(5).maxLength(200),

    content: vine.string().trim().minLength(50).maxLength(10000),
  })
)

export const updatePostValidator = vine.compile(
  vine.object({
    title: vine.string().trim().minLength(5).maxLength(200).optional(),

    content: vine.string().trim().minLength(50).maxLength(10000).optional(),
  })
)
