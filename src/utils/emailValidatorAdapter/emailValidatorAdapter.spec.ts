import { EmailValidatorAdapter } from '.'
import validator from 'validator'

const makeSut = (): EmailValidatorAdapter => {
  return new EmailValidatorAdapter()
}

describe('EmailValidatorAdapter', () => {
  test('should return true if email is valid', () => {
    const sut = makeSut()
    const isValid = sut.isValid('valid_email@mail.com')
    expect(isValid).toBe(true)
  })

  test('should return false if email is not valid', () => {
    const sut = makeSut()
    jest.spyOn(validator, 'isEmail').mockReturnValueOnce(false)
    const isValid = sut.isValid('invalid_email@mail.com')
    expect(isValid).toBe(false)
  })

  test('should call EmailValidator with right data', () => {
    const sut = makeSut()
    const spyData = jest.spyOn(validator, 'isEmail')
    sut.isValid('any_mail@mail.com')
    expect(spyData).toBeCalledWith('any_mail@mail.com')
  })
})
