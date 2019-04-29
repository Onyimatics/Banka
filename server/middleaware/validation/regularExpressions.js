
class RegularExpression {
  /**
 * @class
 * @RegularExpression This class contains regular expression for the app.
 */
  static validate() {
    return {
      name: /^[a-zA-Z_ ]+$/,
      // eslint-disable-next-line no-useless-escape
      email: /[a-z0-9\._%+!$&*=^|~#%'`?{}/\-]+@([a-z0-9\-]+\.){1,}([a-z]{2,16})/,
      accountNumber: /^[0-9]*$/,
      userName: /^[a-zA-Z]{3,25}$/,
      password: /[a-zA-Z0-9]{8,}/,
      status: /(active|dormant|draft)$/i,
      accountType: /(current|savings)$/i,
      isAdmin: /(true|false)$/i,
      openingBalance: /^\d+$/,
    };
  }
}
export default RegularExpression;
