import type { HttpContext } from '@adonisjs/core/http'
import User from '#models/user'
import Post from '#models/post'
import { createUserValidator, updateUserValidator } from '#validators/user'

export default class AdminController {
  /**
   * Récupérer tous les utilisateurs (admin only)
   */
  async getUsers({ response, bouncer }: HttpContext) {
    // Utiliser Bouncer pour vérifier les permissions admin
    if (await bouncer.denies('viewAdmin')) {
      return response.forbidden({ message: 'Access denied. Admin privileges required.' })
    }

    const users = await User.query()
      .select('id', 'fullName', 'email', 'role', 'createdAt', 'updatedAt')
      .orderBy('createdAt', 'desc')

    return response.ok({
      users,
      total: users.length,
    })
  }

  /**
   * Récupérer les statistiques admin
   */
  async getStats({ response, bouncer }: HttpContext) {
    if (await bouncer.denies('viewAdmin')) {
      return response.forbidden({ message: 'Access denied. Admin privileges required.' })
    }

    const totalUsers = await User.query().count('id as total').first()
    const adminUsers = await User.query().where('role', 'admin').count('id as total').first()
    const regularUsers = await User.query().where('role', 'user').count('id as total').first()
    const recentUsers = await User.query()
      .where('createdAt', '>=', new Date(Date.now() - 7 * 24 * 60 * 60 * 1000))
      .count('id as total')
      .first()

    return response.ok({
      totalUsers: Number(totalUsers?.$extras.total || 0),
      adminUsers: Number(adminUsers?.$extras.total || 0),
      regularUsers: Number(regularUsers?.$extras.total || 0),
      recentUsers: Number(recentUsers?.$extras.total || 0),
    })
  }

  /**
   * Créer un nouvel utilisateur (admin only)
   */
  async createUser({ request, response, bouncer }: HttpContext) {
    if (await bouncer.denies('manageUsers')) {
      return response.forbidden({ message: 'Access denied. Admin privileges required.' })
    }

    const payload = await request.validateUsing(createUserValidator)

    // Vérifier si l'utilisateur existe déjà
    const existingUser = await User.query().where('email', payload.email).first()
    if (existingUser) {
      return response.conflict({ message: 'User with this email already exists' })
    }

    const user = await User.create({
      ...payload,
      role: payload.role || 'user',
    })

    return response.created({
      message: 'User created successfully',
      user: {
        id: user.id,
        fullName: user.fullName,
        email: user.email,
        role: user.role,
        createdAt: user.createdAt,
      },
    })
  }

  /**
   * Mettre à jour un utilisateur (admin only)
   */
  async updateUser({ params, request, response, auth, bouncer }: HttpContext) {
    const currentUser = auth.getUserOrFail()

    if (await bouncer.denies('manageUsers')) {
      return response.forbidden({ message: 'Access denied. Admin privileges required.' })
    }

    const user = await User.findOrFail(params.id)
    const payload = await request.validateUsing(updateUserValidator)

    // Empêcher qu'un admin se retire ses propres privilèges
    if (user.id === currentUser.id && payload.role && payload.role !== 'admin') {
      return response.forbidden({
        message: 'You cannot remove your own admin privileges',
      })
    }

    user.merge(payload)
    await user.save()

    return response.ok({
      message: 'User updated successfully',
      user: {
        id: user.id,
        fullName: user.fullName,
        email: user.email,
        role: user.role,
        updatedAt: user.updatedAt,
      },
    })
  }

  /**
   * Supprimer un utilisateur (admin only)
   */
  async deleteUser({ params, response, auth, bouncer }: HttpContext) {
    const currentUser = auth.getUserOrFail()

    if (await bouncer.denies('manageUsers')) {
      return response.forbidden({ message: 'Access denied. Admin privileges required.' })
    }

    const user = await User.findOrFail(params.id)

    // Empêcher qu'un admin se supprime lui-même
    if (user.id === currentUser.id) {
      return response.forbidden({
        message: 'You cannot delete your own account',
      })
    }

    await user.delete()

    return response.ok({ message: 'User deleted successfully' })
  }

  /**
   * Changer le rôle d'un utilisateur (admin only)
   */
  async changeUserRole({ params, request, response, auth, bouncer }: HttpContext) {
    const currentUser = auth.getUserOrFail()

    if (await bouncer.denies('manageUsers')) {
      return response.forbidden({ message: 'Access denied. Admin privileges required.' })
    }

    const user = await User.findOrFail(params.id)
    const { role } = request.only(['role'])

    if (!role || !['user', 'admin'].includes(role)) {
      return response.badRequest({ message: 'Invalid role. Must be "user" or "admin"' })
    }

    // Empêcher qu'un admin se retire ses propres privilèges
    if (user.id === currentUser.id && role !== 'admin') {
      return response.forbidden({
        message: 'You cannot remove your own admin privileges',
      })
    }

    user.role = role
    await user.save()

    return response.ok({
      message: `User role updated to ${role} successfully`,
      user: {
        id: user.id,
        fullName: user.fullName,
        email: user.email,
        role: user.role,
        updatedAt: user.updatedAt,
      },
    })
  }

  /**
   * Récupérer tous les posts (admin only)
   */
  async getPosts({ response, bouncer }: HttpContext) {
    if (await bouncer.denies('viewAdmin')) {
      return response.forbidden({ message: 'Accès refusé: privilèges admin requis' })
    }

    const posts = await Post.query().preload('user').orderBy('createdAt', 'desc')

    return response.ok(posts)
  }
}
