import { schema, CustomMessages, rules } from '@ioc:Adonis/Core/Validator'
import type { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'

export default class UpdateOptionValidator {
  constructor(protected ctx: HttpContextContract) {}

  public schema = schema.create({
    option: schema.string.optional(),
    isCorrect: schema.boolean.optional(),
    color: schema.string.optional({}, [rules.regex(new RegExp('^#([0-9A-Fa-f]{6})$'))]),
  })

  /**
   * Custom messages for validation failures. You can make use of dot notation `(.)`
   * for targeting nested fields and array expressions `(*)` for targeting all
   * children of an array. For example:
   *
   * {
   *   'profile.username.required': 'Username is required',
   *   'scores.*.number': 'Define scores as valid numbers'
   * }
   *
   */
  public messages: CustomMessages = {}
}
