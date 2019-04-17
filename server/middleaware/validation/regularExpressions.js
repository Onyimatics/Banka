
// RegularExpression.email = /[a-z0-9\._%+!$&*=^|~#%'`?{}/\-]+@([a-z0-9\-]+\.){1,}([a-z]{2,16})/;
// RegularExpression.password = /[a-zA-Z0-9]{8,}/;
// RegularExpression.userName = /[a-zA-Z0-9]{3,}/;
class RegularExpression {
  /**
 * @class
 * @RegularExpression This class contains regular expression for the app.
 */

  static validate() {
    return {
      name: /^[a-zA-Z_ ]+$/,
      email: /[a-z0-9\._%+!$&*=^|~#%'`?{}/\-]+@([a-z0-9\-]+\.){1,}([a-z]{2,16})/,
      phoneNumber: /^[+\d\-\s]+$/,
      userName: /[a-zA-Z0-9]{3,}/,
      password: /[a-zA-Z0-9]{8,}/,
      status: /(active|dormant|draft)$/i,
      accountType: /(current|savings)$/i,
    };
  }
}
export default RegularExpression;
