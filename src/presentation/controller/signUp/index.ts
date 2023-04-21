import type { AddAccount } from '../../../domain/usecases/AddAccount'
import { InvalidParamError, MissingParamError } from '../../errors'
import { badRequest, serverError, ok } from '../../helpers'
import type {
  Controller,
  EmailValidator,
  HttpRequest,
  HttpResponse
} from '../../protocols'

interface SignUpControllerConstructor {
  emailValidator: EmailValidator
  addAccount: AddAccount
}

export class SignUpController implements Controller {
  private readonly emailValidator: EmailValidator
  private readonly addAccount: AddAccount

  constructor({ emailValidator, addAccount }: SignUpControllerConstructor) {
    this.emailValidator = emailValidator
    this.addAccount = addAccount
  }

  handle(httpRequest: HttpRequest): HttpResponse {
    try {
      const requiredFields = [
        'name',
        'email',
        'password',
        'passwordConfirmation'
      ]

      for (const field of requiredFields) {
        if (httpRequest.body?.[field] === undefined) {
          return badRequest(new MissingParamError(field))
        }
      }

      const { name, email, password, passwordConfirmation } = httpRequest.body

      const isValid = this.emailValidator.isValid(email)
      if (!isValid) {
        return badRequest(new InvalidParamError('email'))
      }

      if (password !== passwordConfirmation) {
        return badRequest(new InvalidParamError('passwordConfirmation'))
      }

      const account = this.addAccount.add({ name, email, password })

      return ok(account)
    } catch (error) {
      return serverError()
    }
  }
}
