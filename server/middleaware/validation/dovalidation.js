import ValidationMessages from '../../helper/messages/validationMessages';
import response from '../../helper/response/index';
import RegularExpression from './regularExpressions';

class DoValidation {
  static email(req, res, next) {
    let { email } = req.body;
    // eslint-disable-next-line prefer-destructuring
    if (!email) { email = req.params.email; }
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
    if (!validate.userName.test(firstName.trim())) {
      return response(res, 400, ValidationMessages.firstName);
    }
    if (!validate.userName.test(lastName.trim())) {
      return response(res, 400, ValidationMessages.lastName);
    }
    return next();
  }

  static accountNumber(req, res, next) {
    const { accountNumber } = req.params;
    const validate = RegularExpression.validate();
    if (!validate.accountNumber.test(accountNumber.trim())) {
      return response(res, 400, ValidationMessages.accountNumber);
    }
    return next();
  }

  static id(req, res, next) {
    const { id } = req.params;
    const validate = RegularExpression.validate();
    if (!validate.accountNumber.test(id)) {
      return response(res, 400, ValidationMessages.id);
    }
    return next();
  }

  static isAdmin(req, res, next) {
    const { isAdmin } = req.body;
    const validate = RegularExpression.validate();
    if (!validate.isAdmin.test(isAdmin)) {
      return response(res, 400, ValidationMessages.isAdmin);
    }
    return next();
  }
}

export default DoValidation;
