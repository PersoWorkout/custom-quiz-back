import { DateTime } from 'luxon'
import { BaseModel, column } from '@ioc:Adonis/Lucid/Orm'

export default class Option extends BaseModel {
  @column({ isPrimary: true })
  public id: string

  @column()
  public option: string

  @column()
  public isCorrect: boolean

  @column()
  public color: string

  @column()
  public questionId: string

  @column.dateTime({ autoCreate: true })
  public createdAt: DateTime

  @column.dateTime({ autoCreate: true, autoUpdate: true })
  public updatedAt: DateTime
}
