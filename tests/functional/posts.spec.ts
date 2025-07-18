import { test } from '@japa/runner'
import testUtils from '@adonisjs/core/services/test_utils'
import User from '#models/user'
import Post from '#models/post'

test.group('Posts CRUD', (group) => {
  group.each.setup(() => testUtils.db().withGlobalTransaction())

  test('should get list of all posts', async ({ client }) => {
    const user1 = await User.create({
      fullName: 'User One',
      email: 'user1@example.com',
      password: 'password123',
    })

    const user2 = await User.create({
      fullName: 'User Two',
      email: 'user2@example.com',
      password: 'password123',
    })

    const post1 = await Post.create({
      title: 'Post One',
      content: 'Content one',
      userId: user1.id,
    })

    const post2 = await Post.create({
      title: 'Post Two',
      content: 'Content two',
      userId: user2.id,
    })

    const authUser = await User.create({
      fullName: 'Auth User',
      email: 'auth@example.com',
      password: 'password123',
    })

    const response = await client.get('/api/posts').loginAs(authUser)

    response.assertStatus(200)
    response.assertBodyContains([
      {
        id: post2.id,
        title: 'Post Two',
        content: 'Content two',
        userId: user2.id,
        user: {
          id: user2.id,
          fullName: 'User Two',
          email: 'user2@example.com',
        },
      },
      {
        id: post1.id,
        title: 'Post One',
        content: 'Content one',
        userId: user1.id,
        user: {
          id: user1.id,
          fullName: 'User One',
          email: 'user1@example.com',
        },
      },
    ])
  })

  test('should get specific post with user', async ({ client }) => {
    const user = await User.create({
      fullName: 'Test User',
      email: 'test@example.com',
      password: 'password123',
    })

    const post = await Post.create({
      title: 'Test Post',
      content: 'Test content',
      userId: user.id,
    })

    const authUser = await User.create({
      fullName: 'Auth User',
      email: 'auth@example.com',
      password: 'password123',
    })

    const response = await client.get(`/api/posts/${post.id}`).loginAs(authUser)

    response.assertStatus(200)
    response.assertBodyContains({
      id: post.id,
      title: 'Test Post',
      content: 'Test content',
      userId: user.id,
      user: {
        id: user.id,
        fullName: 'Test User',
        email: 'test@example.com',
      },
    })
  })

  test('should create a new post', async ({ client }) => {
    const user = await User.create({
      fullName: 'Test User',
      email: 'test@example.com',
      password: 'password123',
    })

    const postPayload = {
      title: 'New Post',
      content: 'New content',
    }

    const response = await client.post('/api/posts').json(postPayload).loginAs(user)

    response.assertStatus(201)
    response.assertBodyContains({
      message: 'Post created successfully',
      post: {
        title: 'New Post',
        content: 'New content',
        userId: user.id,
        user: {
          id: user.id,
          fullName: 'Test User',
          email: 'test@example.com',
        },
      },
    })

    // const createdPost = await Post.findByOrFail('title', 'New Post')
    // assert.equal(createdPost.content, 'New content')
    // assert.equal(createdPost.userId, user.id)
  })

  test('should update own post', async ({ client }) => {
    const user = await User.create({
      fullName: 'Test User',
      email: 'test@example.com',
      password: 'password123',
    })

    const post = await Post.create({
      title: 'Original Title',
      content: 'Original content',
      userId: user.id,
    })

    const updatePayload = {
      title: 'Updated Title',
      content: 'Updated content',
    }

    const response = await client.put(`/api/posts/${post.id}`).json(updatePayload).loginAs(user)

    response.assertStatus(200)
    response.assertBodyContains({
      message: 'Post updated successfully',
      post: {
        id: post.id,
        title: 'Updated Title',
        content: 'Updated content',
        userId: user.id,
        user: {
          id: user.id,
          fullName: 'Test User',
          email: 'test@example.com',
        },
      },
    })

    await post.refresh()
    // assert.equal(post.title, 'Updated Title')
    // assert.equal(post.content, 'Updated content')
  })

  test('should not update another user post', async ({ client }) => {
    const user1 = await User.create({
      fullName: 'User One',
      email: 'user1@example.com',
      password: 'password123',
    })

    const user2 = await User.create({
      fullName: 'User Two',
      email: 'user2@example.com',
      password: 'password123',
    })

    const post = await Post.create({
      title: 'Original Title',
      content: 'Original content',
      userId: user2.id,
    })

    const updatePayload = {
      title: 'Hacked Title',
      content: 'Hacked content',
    }

    const response = await client.put(`/api/posts/${post.id}`).json(updatePayload).loginAs(user1)

    response.assertStatus(403)
    response.assertBodyContains({
      message: 'You can only update your own posts',
    })

    await post.refresh()
    // assert.equal(post.title, 'Original Title')
    // assert.equal(post.content, 'Original content')
  })

  test('should delete own post', async ({ client }) => {
    const user = await User.create({
      fullName: 'Test User',
      email: 'test@example.com',
      password: 'password123',
    })

    const post = await Post.create({
      title: 'To Delete',
      content: 'Delete content',
      userId: user.id,
    })

    const response = await client.delete(`/api/posts/${post.id}`).loginAs(user)

    response.assertStatus(200)
    response.assertBodyContains({
      message: 'Post deleted successfully',
    })

    // const deletedPost = await Post.find(post.id)
    // assert.isNull(deletedPost)
  })

  test('should not delete another user post', async ({ client }) => {
    const user1 = await User.create({
      fullName: 'User One',
      email: 'user1@example.com',
      password: 'password123',
    })

    const user2 = await User.create({
      fullName: 'User Two',
      email: 'user2@example.com',
      password: 'password123',
    })

    const post = await Post.create({
      title: 'Protected Post',
      content: 'Protected content',
      userId: user2.id,
    })

    const response = await client.delete(`/api/posts/${post.id}`).loginAs(user1)

    response.assertStatus(403)
    response.assertBodyContains({
      message: 'You can only delete your own posts',
    })

    // const stillExists = await Post.find(post.id)
    // assert.isNotNull(stillExists)
  })

  test('should fail to create post without authentication', async ({ client }) => {
    const postPayload = {
      title: 'Unauthorized Post',
      content: 'Unauthorized content',
    }

    const response = await client.post('/api/posts').json(postPayload)

    response.assertStatus(401)
  })

  test('should fail to create post with invalid data', async ({ client }) => {
    const user = await User.create({
      fullName: 'Test User',
      email: 'test@example.com',
      password: 'password123',
    })

    const invalidPayload = {
      title: '', // Empty title should fail validation
      content: 'Valid content',
    }

    const response = await client.post('/api/posts').json(invalidPayload).loginAs(user)

    response.assertStatus(400)
  })

  test('should return 404 for non-existent post', async ({ client }) => {
    const authUser = await User.create({
      fullName: 'Auth User',
      email: 'auth@example.com',
      password: 'password123',
    })

    const response = await client.get('/api/posts/99999').loginAs(authUser)

    response.assertStatus(404)
  })
})
