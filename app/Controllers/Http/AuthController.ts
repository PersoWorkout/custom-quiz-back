import type { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'
import User from 'App/Models/User'
import LoginValidator from 'App/Validators/LoginValidator'
import RegisterValidator from 'App/Validators/RegisterValidator'

export default class AuthController {
  public async me({ auth }: HttpContextContract) {
    const user = await auth.isAuthenticated
    return user
  }

  public async login({ auth, request, response }: HttpContextContract) {
    const payload = await request.validate(LoginValidator)
    try {
      const token = await auth
        .use('api')
        .attempt(payload.usermail, payload.password, { expiresIn: '1 day' })
      response.cookie('Authorization', token.token)
      return token
    } catch {
      return response.unauthorized('Invalid credentials')
    }
  }

  public async register({ auth, request }: HttpContextContract) {
    const payload = await request.validate(RegisterValidator)
    const user = await User.create({ ...payload })
    return auth.login(user)
  }
}
