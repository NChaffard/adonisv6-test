import { test } from '@japa/runner'
import testUtils from '@adonisjs/core/services/test_utils'
import User from '#models/user'
import Post from '#models/post'

test.group('Post Model', (group) => {
  group.each.setup(() => testUtils.db().withGlobalTransaction())

  test('should create a post', async ({ assert }) => {
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

    assert.equal(post.title, 'Test Post')
    assert.equal(post.content, 'Test content')
    assert.equal(post.userId, user.id)
    assert.isNotNull(post.createdAt)
    assert.isNotNull(post.updatedAt)
  })

  test('should belong to user', async ({ assert }) => {
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

    await post.load('user')

    assert.equal(post.user.id, user.id)
    assert.equal(post.user.fullName, 'Test User')
    assert.equal(post.user.email, 'test@example.com')
  })

  test('should update post data', async ({ assert }) => {
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

    post.title = 'Updated Title'
    post.content = 'Updated content'
    await post.save()

    const updatedPost = await Post.findOrFail(post.id)
    assert.equal(updatedPost.title, 'Updated Title')
    assert.equal(updatedPost.content, 'Updated content')
  })

  test('should delete post', async ({ assert }) => {
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

    await post.delete()

    const deletedPost = await Post.find(post.id)
    assert.isNull(deletedPost)
  })

  test('should find post by title', async ({ assert }) => {
    const user = await User.create({
      fullName: 'Test User',
      email: 'test@example.com',
      password: 'password123',
    })

    const post = await Post.create({
      title: 'Unique Title',
      content: 'Test content',
      userId: user.id,
    })

    const foundPost = await Post.findByOrFail('title', 'Unique Title')
    assert.equal(foundPost.id, post.id)
    assert.equal(foundPost.content, 'Test content')
  })

  test('should query posts by user', async ({ assert }) => {
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

    await Post.create({
      title: 'Post 1',
      content: 'Content 1',
      userId: user1.id,
    })

    await Post.create({
      title: 'Post 2',
      content: 'Content 2',
      userId: user1.id,
    })

    await Post.create({
      title: 'Post 3',
      content: 'Content 3',
      userId: user2.id,
    })

    const user1Posts = await Post.query().where('userId', user1.id)
    const user2Posts = await Post.query().where('userId', user2.id)

    assert.lengthOf(user1Posts, 2)
    assert.lengthOf(user2Posts, 1)
  })

  test('should order posts by creation date', async ({ assert }) => {
    const user = await User.create({
      fullName: 'Test User',
      email: 'test@example.com',
      password: 'password123',
    })

    const post1 = await Post.create({
      title: 'First Post',
      content: 'First content',
      userId: user.id,
    })

    await new Promise((resolve) => setTimeout(resolve, 10))

    const post2 = await Post.create({
      title: 'Second Post',
      content: 'Second content',
      userId: user.id,
    })

    const posts = await Post.query().orderBy('createdAt', 'desc')

    assert.equal(posts[0].id, post2.id)
    assert.equal(posts[1].id, post1.id)
  })

  test('should validate required fields', async ({ assert }) => {
    const user = await User.create({
      fullName: 'Test User',
      email: 'test@example.com',
      password: 'password123',
    })

    const post = new Post()
    post.userId = user.id

    await assert.rejects(async () => {
      await post.save()
    })
  })

  test('should serialize post data', async ({ assert }) => {
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

    const serialized = post.serialize() as any

    assert.equal(serialized.title, 'Test Post')
    assert.equal(serialized.content, 'Test content')
    assert.equal(serialized.userId, user.id)
    assert.isNotNull(serialized.createdAt)
    assert.isNotNull(serialized.updatedAt)
    assert.property(serialized, 'contentHtml')
    assert.property(serialized, 'excerpt')
    assert.property(serialized, 'readingTime')
    assert.property(serialized, 'contentPlainText')
  })
})
