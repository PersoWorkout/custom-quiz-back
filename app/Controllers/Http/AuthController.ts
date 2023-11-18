import type { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'
import User from 'App/Models/User'
import LoginValidator from 'App/Validators/LoginValidator'
import RegisterValidator from 'App/Validators/RegisterValidator'

export default class AuthController {
  public async me({ auth }: HttpContextContract) {
    await auth.authenticate()
    return auth.user
  }

  public async login({ auth, request, response }: HttpContextContract) {
    const payload = await request.validate(LoginValidator)
    try {
      const token = await auth.use('web').attempt(payload.email, payload.password)
      return response.status(201).json(token)
    } catch {
      return response.unauthorized('Invalid credentials')
    }
  }

  public async register({ auth, request, response }: HttpContextContract) {
    const payload = await request.validate(RegisterValidator)
    const user = await User.create({ ...payload })
    return response.status(201).json(await auth.login(user, true))
  }

  public async logout({ auth, response }: HttpContextContract) {
    await auth.logout()
    return response.status(204)
  }
}
