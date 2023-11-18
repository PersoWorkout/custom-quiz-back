import type { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'
import Quiz from 'App/Models/Quiz'
import QuizCreationValidator from 'App/Validators/QuizCreationValidator'
import UpdateQuizValidator from 'App/Validators/UpdateQuizValidator'

export default class QuizzesController {
  public async index({ response }: HttpContextContract) {
    const quizzes = await Quiz.all()
    return response.json({ data: quizzes })
  }

  public async store({ request, auth, response }: HttpContextContract) {
    await auth.authenticate()
    if (!auth.user) {
      return response.status(201).json({ error: 'You are not logged' })
    }
    const payload = await request.validate(QuizCreationValidator)
    const quiz = await Quiz.create({ ...payload, userId: auth.user.id })
    return response.json({ data: quiz })
  }

  public async show({ request, response }: HttpContextContract) {
    const id = request.input('id')
    const quiz = await Quiz.findByOrFail('id', id)
    return response.json({ data: quiz })
  }

  public async edit({ request, auth, response }: HttpContextContract) {
    await auth.authenticate()
    if (!auth.user) {
      return response.json({ error: 'You are not logged' })
    }

    const id = request.param('id')
    const quiz = await Quiz.findOrFail(id)

    if (quiz.userId !== auth.user.id) {
      throw new Error('You are not allowed')
    }

    const payload = await request.validate(UpdateQuizValidator)

    quiz.title = payload.title || quiz.title
    quiz.description = payload.description || quiz.description
    await quiz.save()
    return response.json({ data: quiz })
  }
}
