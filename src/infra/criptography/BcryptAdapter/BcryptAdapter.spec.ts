import { BcryptAdapter } from '.'
import bcrypt from 'bcrypt'

interface SutTypes {
  sut: BcryptAdapter
  salt: number
}

jest.mock('bcrypt', () => ({ hash: async () => 'hash' }))

const makeSut = (): SutTypes => {
  const salt = 12
  const sut = new BcryptAdapter(salt)

  return { sut, salt }
}

describe('BcryptAdapter ', () => {
  test('Should call bcrypt with right values', async () => {
    const { sut, salt } = makeSut()
    const hashSpy = jest.spyOn(bcrypt, 'hash')
    await sut.encrypt('any_value')
    expect(hashSpy).toBeCalledWith('any_value', salt)
  })

  test('Should return hash when success', async () => {
    const { sut } = makeSut()
    const hash = await sut.encrypt('any_value')
    expect(hash).toBe('hash')
  })

  test('Should throw when throws', async () => {
    const { sut } = makeSut()
    jest.spyOn(bcrypt, 'hash').mockImplementationOnce((): never => {
      throw new Error()
    })
    const promise = sut.encrypt('any_value')
    await expect(promise).rejects.toThrow()
  })
})
