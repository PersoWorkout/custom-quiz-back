import type { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'
import Quiz from 'App/Models/Quiz'
import QuizCreationValidator from 'App/Validators/QuizCreationValidator'
import UpdateQuizValidator from 'App/Validators/UpdateQuizValidator'

export default class QuizzesController {
  public async index({ response }: HttpContextContract) {
    const quizzes = await Quiz.all()
    return response.ok({ data: quizzes })
  }

  public async store({ request, auth, response }: HttpContextContract) {
    await auth.authenticate()
    if (!auth.user) {
      return response.created({ error: 'You are not logged' })
    }
    const payload = await request.validate(QuizCreationValidator)
    const quiz = await Quiz.create({ ...payload, userId: auth.user.id })
    return response.created({ data: quiz })
  }

  public async show({ request, response }: HttpContextContract) {
    const id = request.param('id')
    const quiz = await Quiz.findByOrFail('id', id)
    return response.ok({ data: quiz })
  }

  public async edit({ request, auth, response }: HttpContextContract) {
    await auth.authenticate()
    if (!auth.user) {
      return response.ok({ error: 'You are not logged' })
    }

    const id = request.param('id')
    const quiz = await Quiz.findOrFail(id)

    if (quiz.userId !== auth.user.id) {
      throw new Error('You are not allowed')
    }

    const payload = await request.validate(UpdateQuizValidator)

    await quiz.merge({ ...payload }).save()
    return response.ok({ data: quiz })
  }
}
