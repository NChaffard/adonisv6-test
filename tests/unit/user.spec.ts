import { test } from '@japa/runner'
import testUtils from '@adonisjs/core/services/test_utils'
import User from '#models/user'
import Post from '#models/post'
import hash from '@adonisjs/core/services/hash'

test.group('User Model', (group) => {
  group.each.setup(() => testUtils.db().withGlobalTransaction())

  test('should create a user with hashed password', async ({ assert }) => {
    const user = new User()
    user.fullName = 'Test User'
    user.email = 'test@example.com'
    user.password = 'plainpassword'

    await user.save()

    assert.isTrue(hash.isValidHash(user.password))
    assert.isTrue(await hash.verify(user.password, 'plainpassword'))
  })

  test('should have posts relationship', async ({ assert }) => {
    const user = await User.create({
      fullName: 'Test User',
      email: 'test@example.com',
      password: 'password123',
    })

    await Post.create({
      title: 'Post 1',
      content: 'Content 1',
      userId: user.id,
    })

    await Post.create({
      title: 'Post 2',
      content: 'Content 2',
      userId: user.id,
    })

    await user.load('posts')

    assert.lengthOf(user.posts, 2)
    assert.equal(user.posts[0].title, 'Post 1')
    assert.equal(user.posts[1].title, 'Post 2')
  })

  test('should verify credentials correctly', async ({ assert }) => {
    const user = await User.create({
      fullName: 'Test User',
      email: 'test@example.com',
      password: 'password123',
    })

    const verifiedUser = await User.verifyCredentials('test@example.com', 'password123')
    assert.equal(verifiedUser.id, user.id)
    assert.equal(verifiedUser.email, user.email)
  })

  test('should throw error for invalid credentials', async ({ assert }) => {
    await User.create({
      fullName: 'Test User',
      email: 'test@example.com',
      password: 'password123',
    })

    await assert.rejects(
      async () => await User.verifyCredentials('test@example.com', 'wrongpassword')
    )
  })

  test('should create access token', async ({ assert }) => {
    const user = await User.create({
      fullName: 'Test User',
      email: 'test@example.com',
      password: 'password123',
    })

    const token = await User.accessTokens.create(user)

    assert.isNotNull(token)
    assert.isString(token.value!.release())
    assert.equal(token.tokenableId, user.id)
  })

  test('should find user by email', async ({ assert }) => {
    const user = await User.create({
      fullName: 'Test User',
      email: 'test@example.com',
      password: 'password123',
    })

    const foundUser = await User.findByOrFail('email', 'test@example.com')
    assert.equal(foundUser.id, user.id)
    assert.equal(foundUser.email, user.email)
  })

  test('should update user data', async ({ assert }) => {
    const user = await User.create({
      fullName: 'Original Name',
      email: 'original@example.com',
      password: 'password123',
    })

    user.fullName = 'Updated Name'
    user.email = 'updated@example.com'
    await user.save()

    const updatedUser = await User.findOrFail(user.id)
    assert.equal(updatedUser.fullName, 'Updated Name')
    assert.equal(updatedUser.email, 'updated@example.com')
  })

  test('should delete user', async ({ assert }) => {
    const user = await User.create({
      fullName: 'To Delete',
      email: 'delete@example.com',
      password: 'password123',
    })

    await user.delete()

    const deletedUser = await User.find(user.id)
    assert.isNull(deletedUser)
  })

  test('should not serialize password', async ({ assert }) => {
    const user = await User.create({
      fullName: 'Test User',
      email: 'test@example.com',
      password: 'password123',
    })

    const serialized = user.serialize()
    assert.isUndefined(serialized.password)
  })
})
