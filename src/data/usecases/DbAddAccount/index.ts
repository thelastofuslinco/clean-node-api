import type { AccountModel } from '../../../domain/models'
import type { AddAccount, AddAccountModel } from '../../../domain/usecases'
import type { Encrypter, AddAccountRepository } from '../../protocols'

export class DbAddAccount implements AddAccount {
  private readonly encrypter: Encrypter
  private readonly addAccountRepository: AddAccountRepository

  constructor(
    encrypter: Encrypter,
    addAccountRepository: AddAccountRepository
  ) {
    this.encrypter = encrypter
    this.addAccountRepository = addAccountRepository
  }

  async add(accountData: AddAccountModel): Promise<AccountModel> {
    const hashedPassword = await this.encrypter.encrypt(accountData.password)
    const account = await this.addAccountRepository.add(accountData)
    return await Promise.resolve({ ...account, password: hashedPassword })
  }
}
