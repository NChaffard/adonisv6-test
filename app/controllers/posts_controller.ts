import type { HttpContext } from '@adonisjs/core/http'
import Post from '#models/post'
import { createPostValidator, updatePostValidator } from '#validators/post'
import PostPolicy from '#policies/post_policy'

export default class PostsController {
  async index({ response, auth, bouncer }: HttpContext) {
    const currentUser = auth.getUserOrFail()

    // Si l'utilisateur est admin, il peut voir tous les posts
    // Sinon, il ne voit que ses propres posts
    const postsQuery = Post.query().preload('user').orderBy('createdAt', 'desc')

    if (await bouncer.denies('viewAdmin')) {
      postsQuery.where('userId', currentUser.id)
    }

    const posts = await postsQuery

    return response.ok(posts)
  }

  async show({ params, response, bouncer }: HttpContext) {
    const post = await Post.query().where('id', params.id).preload('user').firstOrFail()

    // Vérifier l'autorisation avec la policy
    if (await bouncer.with(PostPolicy).denies('view', post)) {
      return response.forbidden({ message: 'You can only view your own posts or admin posts' })
    }

    return response.ok(post)
  }

  async store({ request, response, auth, bouncer }: HttpContext) {
    const user = auth.getUserOrFail()

    // Vérifier l'autorisation avec la policy
    if (await bouncer.with(PostPolicy).denies('create')) {
      return response.forbidden({ message: 'Cannot create a post' })
    }

    const payload = await request.validateUsing(createPostValidator)

    const post = await Post.create({
      ...payload,
      userId: user.id,
    })

    await post.load('user')

    return response.created({
      message: 'Post created successfully',
      data: post,
    })
  }

  async update({ params, request, response, auth, bouncer }: HttpContext) {
    auth.getUserOrFail()
    const post = await Post.findOrFail(params.id)

    // Vérifier l'autorisation avec la policy
    if (await bouncer.with(PostPolicy).denies('edit', post)) {
      return response.forbidden({ message: 'You can only update your own posts' })
    }

    const payload = await request.validateUsing(updatePostValidator)
    post.merge(payload)
    await post.save()
    await post.load('user')

    return response.ok({
      message: 'Post updated successfully',
      data: post,
    })
  }

  async destroy({ params, response, auth, bouncer }: HttpContext) {
    auth.getUserOrFail()
    const post = await Post.findOrFail(params.id)

    // Vérifier l'autorisation avec la policy
    if (await bouncer.with(PostPolicy).denies('delete', post)) {
      return response.forbidden({ message: 'You can only delete your own posts' })
    }

    await post.delete()

    return response.ok({ message: 'Post deleted successfully' })
  }
}
