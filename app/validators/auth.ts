import vine from '@vinejs/vine'

export const registerValidator = vine.compile(
  vine.object({
    fullName: vine.string().minLength(2).maxLength(50),
    email: vine.string().email().normalizeEmail(),
    password: vine.string().minLength(8).maxLength(128),
  })
)

export const loginValidator = vine.compile(
  vine.object({
    email: vine.string().email(),

    password: vine.string().minLength(1).maxLength(128),
  })
)
