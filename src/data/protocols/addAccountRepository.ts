import type { AccountModel } from '../../domain/models'
import type { AddAccountModel } from '../../domain/usecases'

export interface AddAccountRepository {
  add: (account: AddAccountModel) => Promise<AccountModel>
}
