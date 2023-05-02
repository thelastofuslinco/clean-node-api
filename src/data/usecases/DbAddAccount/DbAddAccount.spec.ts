import { DbAddAccount } from '.'
import type { Encrypter } from '../../protocols'

interface SutTypes {
  sut: DbAddAccount
  encrypterStub: Encrypter
}

const makeSut = (): SutTypes => {
  class EncrypterStub implements Encrypter {
    async encrypt(value: string): Promise<string> {
      return await Promise.resolve('hashed_password')
    }
  }
  const encrypterStub = new EncrypterStub()
  const sut = new DbAddAccount(encrypterStub)
  return { sut, encrypterStub }
}
describe('DbAddAccount usecases', () => {
  test('Should be call with right password', async () => {
    const { sut, encrypterStub } = makeSut()
    const encrypterSpy = jest.spyOn(encrypterStub, 'encrypt')
    const account = {
      name: 'valid_name',
      email: 'valid_email@mail.com',
      password: 'valid_password'
    }

    await sut.add(account)
    expect(encrypterSpy).toHaveBeenCalledWith('valid_password')
  })

  test('Should throw a error', async () => {
    const { sut, encrypterStub } = makeSut()
    jest
      .spyOn(encrypterStub, 'encrypt')
      .mockResolvedValueOnce(Promise.reject(new Error()))
    const account = {
      name: 'valid_name',
      email: 'valid_email@mail.com',
      password: 'valid_password'
    }

    const promise = sut.add(account)
    await expect(promise).rejects.toThrow()
  })
})
