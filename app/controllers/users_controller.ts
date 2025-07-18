import type { HttpContext } from '@adonisjs/core/http'
import User from '#models/user'
import { updateUserValidator } from '#validators/user'
import UserPolicy from '#policies/user_policy'

export default class UsersController {
  async index({ response }: HttpContext) {
    const users = await User.query().select('id', 'fullName', 'email', 'createdAt')

    return response.ok(users)
  }

  async show({ params, response }: HttpContext) {
    const user = await User.query()
      .where('id', params.id)
      .select('id', 'fullName', 'email', 'createdAt')
      .preload('posts')
      .firstOrFail()

    return response.ok(user)
  }

  async update({ params, request, response, auth, bouncer }: HttpContext) {
    auth.getUserOrFail()
    const user = await User.findOrFail(params.id)

    // Vérifier l'autorisation avec la policy
    if (await bouncer.with(UserPolicy).denies('edit', user)) {
      return response.forbidden({ message: 'You can only update your own profile' })
    }

    const payload = await request.validateUsing(updateUserValidator)
    user.merge(payload)
    await user.save()

    return response.ok({
      message: 'User updated successfully',
      user: {
        id: user.id,
        fullName: user.fullName,
        email: user.email,
      },
    })
  }

  async destroy({ params, response, auth, bouncer }: HttpContext) {
    auth.getUserOrFail()
    const user = await User.findOrFail(params.id)

    // Vérifier l'autorisation avec la policy
    if (await bouncer.with(UserPolicy).denies('delete', user)) {
      return response.forbidden({ message: 'You can only delete your own profile' })
    }

    await user.delete()

    return response.ok({ message: 'User deleted successfully' })
  }
}
