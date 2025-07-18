import { test } from '@japa/runner'
import testUtils from '@adonisjs/core/services/test_utils'
import User from '#models/user'
import Post from '#models/post'

test.group('Users CRUD', (group) => {
  group.each.setup(() => testUtils.db().withGlobalTransaction())

  test('should get list of all users', async ({ client }) => {
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

    const authUser = await User.create({
      fullName: 'Auth User',
      email: 'auth@example.com',
      password: 'password123',
    })

    const response = await client.get('/api/users').loginAs(authUser)

    response.assertStatus(200)
    response.assertBodyContains([
      {
        id: user1.id,
        fullName: 'User One',
        email: 'user1@example.com',
      },
      {
        id: user2.id,
        fullName: 'User Two',
        email: 'user2@example.com',
      },
      {
        id: authUser.id,
        fullName: 'Auth User',
        email: 'auth@example.com',
      },
    ])
  })

  test('should get specific user with posts', async ({ client }) => {
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

    const response = await client.get(`/api/users/${user.id}`).loginAs(authUser)

    response.assertStatus(200)
    response.assertBodyContains({
      id: user.id,
      fullName: 'Test User',
      email: 'test@example.com',
      posts: [
        {
          id: post.id,
          title: 'Test Post',
          content: 'Test content',
          userId: user.id,
        },
      ],
    })
  })

  test('should update own user profile', async ({ client }) => {
    const user = await User.create({
      fullName: 'Original Name',
      email: 'original@example.com',
      password: 'password123',
    })

    const updatePayload = {
      fullName: 'Updated Name',
      email: 'updated@example.com',
    }

    const response = await client.put(`/api/users/${user.id}`).json(updatePayload).loginAs(user)

    response.assertStatus(200)
    response.assertBodyContains({
      message: 'User updated successfully',
      user: {
        id: user.id,
        fullName: 'Updated Name',
        email: 'updated@example.com',
      },
    })

    await user.refresh()
    // assert.equal(user.fullName, 'Updated Name')
    // assert.equal(user.email, 'updated@example.com')
  })

  test('should not update another user profile', async ({ client }) => {
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

    const updatePayload = {
      fullName: 'Hacked Name',
      email: 'hacked@example.com',
    }

    const response = await client.put(`/api/users/${user2.id}`).json(updatePayload).loginAs(user1)

    response.assertStatus(403)
    response.assertBodyContains({
      message: 'You can only update your own profile',
    })

    await user2.refresh()
    // assert.equal(user2.fullName, 'User Two')
    // assert.equal(user2.email, 'user2@example.com')
  })

  test('should delete own user profile', async ({ client }) => {
    const user = await User.create({
      fullName: 'To Delete',
      email: 'delete@example.com',
      password: 'password123',
    })

    const response = await client.delete(`/api/users/${user.id}`).loginAs(user)

    response.assertStatus(200)
    response.assertBodyContains({
      message: 'User deleted successfully',
    })

    // const deletedUser = await User.find(user.id)
    // assert.isNull(deletedUser)
  })

  test('should not delete another user profile', async ({ client }) => {
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

    const response = await client.delete(`/api/users/${user2.id}`).loginAs(user1)

    response.assertStatus(403)
    response.assertBodyContains({
      message: 'You can only delete your own profile',
    })

    // const stillExists = await User.find(user2.id)
    // assert.isNotNull(stillExists)
  })

  test('should fail to access users without authentication', async ({ client }) => {
    const response = await client.get('/api/users')

    response.assertStatus(401)
  })

  test('should return 404 for non-existent user', async ({ client }) => {
    const authUser = await User.create({
      fullName: 'Auth User',
      email: 'auth@example.com',
      password: 'password123',
    })

    const response = await client.get('/api/users/99999').loginAs(authUser)

    response.assertStatus(404)
  })
})
