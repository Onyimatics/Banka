import ValidationMessages from '../../helper/messages/validationMessages';
import response from '../../helper/response/index';
import RegularExpression from './regularExpressions';

class DoValidation {
  static email(req, res, next) {
    const { email } = req.body;
    const validate = RegularExpression.validate();
    if (!validate.email.test(email)) {
      return response(res, 400, ValidationMessages.email);
    }
    return next();
  }

  static password(req, res, next) {
    const { password } = req.body;
    if (!password) {
      return response(res, 400, ValidationMessages.password);
    }
    return next();
  }

  static userName(req, res, next) {
    const { firstName, lastName } = req.body;
    const validate = RegularExpression.validate();
    if (!validate.userName.test(firstName)) {
      return response(res, 400, ValidationMessages.firstName);
    }
    if (!validate.userName.test(lastName)) {
      return response(res, 400, ValidationMessages.lastName);
    }
    return next();
  }

  // static accountNumber(req, res, next) {
  //   const { accountNumber } = req.body;
  //   const validate = RegularExpression.validate();
  //   if (!validate.accountNumber.test(accountNumber)) {
  //     return response(res, 400, ValidationMessages.accountNumber);
  //   }
  //   return next();
  // }
}

export default DoValidation;
