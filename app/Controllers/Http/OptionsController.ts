import type { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'
import Option from 'App/Models/Option'
import Question from 'App/Models/Question'
import Quiz from 'App/Models/Quiz'
import CreateOptionValidator from 'App/Validators/CreateOptionValidator'
import UpdateOptionValidator from 'App/Validators/UpdateOptionValidator'

export default class OptionsController {
  public async show({ request, response, auth }: HttpContextContract) {
    await auth.authenticate()
    if (!auth.user) {
      throw new Error('You are not logged')
    }

    const questionId = request.param('question-id')
    const options = await Option.query().where('question-id', questionId)
    return response.ok({ data: options })
  }

  public async store({ request, response, auth }: HttpContextContract) {
    await auth.authenticate()
    if (!auth.user) {
      throw new Error('You are not logged')
    }

    const quizId: string = request.param('quiz-id')
    const quiz = await Quiz.findOrFail(quizId)
    if (quiz.userId !== auth.user.id) {
      throw new Error('You are not allowed')
    }

    const questionId = request.param('question-id')
    if (!(await Question.findOrFail(questionId))) {
      throw new Error('Question not found')
    }

    const payload = await request.validate(CreateOptionValidator)
    const option = await Option.create({ ...payload, questionId })
    return response.created({ data: option })
  }

  public async index({ request, response, auth }: HttpContextContract) {
    await auth.authenticate()
    if (!auth.user) {
      throw new Error('You are not logged')
    }

    const id = request.param('id')
    const option = await Option.findOrFail(id)
    return response.ok({ data: option })
  }

  public async edit({ request, response, auth }: HttpContextContract) {
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
    const option = await Option.findOrFail(id)

    const payload = await request.validate(UpdateOptionValidator)

    await option
      .merge({
        ...payload,
      })
      .save()

    return response.ok({ data: option })
  }
}
