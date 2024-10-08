import type { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'
import Question from 'App/Models/Question'
import Quiz from 'App/Models/Quiz'
import CreateQuestionValidator from 'App/Validators/CreateQuestionValidator'
import UpdateQuestaionValidator from 'App/Validators/UpdateQuestaionValidator'

export default class QuestionsController {
  public async show({ request, response }: HttpContextContract) {
    const quizId = request.param('quiz-id')
    const questions = await Question.query().where('quizId', quizId).select()
    return response.ok({ data: questions })
  }

  public async store({ request, response, auth }: HttpContextContract) {
    await auth.authenticate()
    if (!auth.user) {
      throw new Error('You are not logged')
    }
    const quizId = request.param('quiz-id')
    const payload = await request.validate(CreateQuestionValidator)
    const question = await Question.create({ ...payload, quizId: quizId })
    return response.created({ data: question })
  }

  public async index({ request, response }: HttpContextContract) {
    const id = request.param('id')
    const question = await Question.findOrFail(id)
    return response.ok({ data: question })
  }

  public async edit({ request, auth, response }: HttpContextContract) {
    await auth.authenticate()
    if (!auth.user) {
      throw new Error('You are not logged')
    }

    const quizId = request.param('quiz-id')
    const quiz = await Quiz.findOrFail(quizId)
    if (quiz.userId !== auth.user.id) {
      throw new Error('You are not allowed')
    }

    const id = request.param('id')
    const question = await Question.findOrFail(id)

    const payload = await request.validate(UpdateQuestaionValidator)

    await question.merge({ ...payload }).save()
    return response.ok({ data: { question } })
  }
}
