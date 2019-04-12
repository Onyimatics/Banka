import ValidationMessages from '../../helper/messages/validationMessages';
import response from '../../helper/response/index';
import RegularExpression from './regularExpressions';

class DoValidation {
  static email(req, res, next) {
    const { email } = req.body;
    if (!RegularExpression.email.test(email)) {
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

  static name(req, res, next) {
    const { firstName, lastName } = req.body;
    if (!firstName || !lastName) {
      return response(res, 400, ValidationMessages.firstLastName);
    }
    return next();
  }
}

export default DoValidation;
