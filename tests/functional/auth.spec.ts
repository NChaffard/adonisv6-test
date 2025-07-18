import { test } from '@japa/runner'
import testUtils from '@adonisjs/core/services/test_utils'
import User from '#models/user'
import hash from '@adonisjs/core/services/hash'

test.group('Authentication', (group) => {
  group.each.setup(() => testUtils.db().withGlobalTransaction())

  test('should register a new user', async ({ client, assert }) => {
    const payload = {
      fullName: 'John Doe',
      email: 'john@example.com',
      password: 'password123',
    }

    const response = await client.post('/api/auth/register').json(payload)

    response.assertStatus(201)
    response.assertBodyContains({
      message: 'User registered successfully',
      user: {
        fullName: 'John Doe',
        email: 'john@example.com',
      },
    })
    response.assertBodyContains({
      token: {
        type: 'bearer',
      },
    })

    const user = await User.findByOrFail('email', 'john@example.com')
    assert.isTrue(await hash.verify(user.password, 'password123'))
  })

  test('should not register user with existing email', async ({ client }) => {
    await User.create({
      fullName: 'Existing User',
      email: 'existing@example.com',
      password: 'password123',
    })

    const payload = {
      fullName: 'New User',
      email: 'existing@example.com',
      password: 'password123',
    }

    const response = await client.post('/api/auth/register').json(payload)

    response.assertStatus(400)
    response.assertBodyContains({
      message: 'Email already exists',
    })
  })

  test('should login with valid credentials', async ({ client }) => {
    const user = await User.create({
      fullName: 'Test User',
      email: 'test@example.com',
      password: 'password123',
    })

    const payload = {
      email: 'test@example.com',
      password: 'password123',
    }

    const response = await client.post('/api/auth/login').json(payload)

    response.assertStatus(200)
    response.assertBodyContains({
      message: 'Login successful',
      user: {
        id: user.id,
        fullName: 'Test User',
        email: 'test@example.com',
      },
    })
    response.assertBodyContains({
      token: {
        type: 'bearer',
      },
    })
  })

  test('should not login with invalid credentials', async ({ client }) => {
    await User.create({
      fullName: 'Test User',
      email: 'test@example.com',
      password: 'password123',
    })

    const payload = {
      email: 'test@example.com',
      password: 'wrongpassword',
    }

    const response = await client.post('/api/auth/login').json(payload)

    response.assertStatus(400)
    response.assertBodyContains({
      message: 'Invalid credentials',
    })
  })

  test('should get current user info', async ({ client }) => {
    const user = await User.create({
      fullName: 'Test User',
      email: 'test@example.com',
      password: 'password123',
    })

    const response = await client.get('/api/auth/me').loginAs(user)

    response.assertStatus(200)
    response.assertBodyContains({
      id: user.id,
      fullName: 'Test User',
      email: 'test@example.com',
    })
  })

  test('should logout successfully', async ({ client }) => {
    const user = await User.create({
      fullName: 'Test User',
      email: 'test@example.com',
      password: 'password123',
    })

    const response = await client.post('/api/auth/logout').loginAs(user)

    response.assertStatus(200)
    response.assertBodyContains({
      message: 'Logout successful',
    })
  })

  test('should fail to access protected route without token', async ({ client }) => {
    const response = await client.get('/api/auth/me')

    response.assertStatus(401)
  })
})
