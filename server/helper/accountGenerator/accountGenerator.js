import accounts from '../../model/accounts';
// Unique Banka Account generator function
class AccountGenerator {
  static accountGenerator() {
    const accountDetail = accounts[accounts.length - 1];
    const accountNumber = accountDetail.accountNumber + 1;
    return accountNumber;
  }
}

export default AccountGenerator;
