import { BaseSeeder } from '@adonisjs/lucid/seeders'
import User from '#models/user'

export default class AdminSeeder extends BaseSeeder {
  async run() {
    // Vérifier si l'admin existe déjà
    const existingAdmin = await User.findBy('email', 'admin@example.com')

    if (!existingAdmin) {
      await User.create({
        fullName: 'Admin User',
        email: 'admin@example.com',
        password: 'admin123',
        role: 'admin',
      })

      console.log('Admin user created: admin@example.com / admin123')
    } else {
      console.log('Admin user already exists')
    }
  }
}
