import type { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'
import Quiz from 'App/Models/Quiz'
import QuizCreationValidator from 'App/Validators/QuizCreationValidator'

export default class QuizzesController {
  public async index({ response }: HttpContextContract) {
    const quizzes = await Quiz.all()
    return response.json(quizzes)
  }

  public async store({ request, auth, response }: HttpContextContract) {
    const token = request.cookie('Authorization')
    if (!token) {
      return response.json({ error: 'You are not logged' })
    }

    console.log(await auth.use('api').authenticate())

    // const payload = await request.validate(QuizCreationValidator)

    // const quiz = await Quiz.create(payload)
    // return response.json(quiz)
  }

  public async show({ request, response }: HttpContextContract) {
    const id = request.input('id')
    if (!id) {
      return response.json({ error: 'quiz not found' })
    }

    const quiz = await Quiz.findBy('id', id)
    return response.json(quiz)
  }

  public async edit({ request, response }: HttpContextContract) {
    const id = request.param('id')
    if (!id) {
      return response.json({ error: 'quiz not found' })
    }
    const payload = await request.validate(QuizCreationValidator)

    const quiz = await Quiz.create(payload)
    return response.json(quiz)
  }
}
