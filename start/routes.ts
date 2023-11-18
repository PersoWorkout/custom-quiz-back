/*
|--------------------------------------------------------------------------
| Routes
|--------------------------------------------------------------------------
|
| This file is dedicated for defining HTTP routes. A single file is enough
| for majority of projects, however you can define routes in different
| files and just make sure to import them inside this file. For example
|
| Define routes in following two files
| ├── start/routes/cart.ts
| ├── start/routes/customer.ts
|
| and then import them inside `start/routes.ts` as follows
|
| import './routes/cart'
| import './routes/customer'
|
*/

import Route from '@ioc:Adonis/Core/Route'

Route.group(() => {
  Route.post('/register', 'AuthController.register')
  Route.post('/login', 'AuthController.login')
  Route.get('/me', 'AuthController.me')
  Route.post('/logout', 'AuthController.logout')
}).prefix('/auth')

Route.group(() => {
  Route.get('/', 'QuizzesController.index')
  Route.post('/', 'QuizzesController.store')
  Route.get('/:id', 'QuizzesController.show')
  Route.put('/:id', 'QuizzesController.edit')
  Route.group(() => {
    Route.get('/', 'QuestionsController.show')
    Route.post('/', 'QuestionsController.show')
    Route.get('/:id', 'QuestionsController.show')
    Route.put('/:id', 'QuestionsController.show')
  }).prefix('/:quizId/question')
}).prefix('/quiz')
