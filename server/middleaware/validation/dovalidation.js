import ValidationMessages from '../../helper/messages/validationMessages';
import response from '../../helper/response/index';
import RegularExpression from './regularExpressions';

class DoValidation {
    static email(req, res, next) {
        const { email } = req.body;
        if (!RegularExpression.email.test(email)) {
            return response(res, 400, ValidationMessages.email)
        }
        next()
    }
    static password(req, res, next) {
        const { password } = req.body;
        if (!RegularExpression.password.test(password)) {
            return response(res, 400, ValidationMessages.password)
        }
        next()
    }
    static name(req, res, next) {
        const { firstName, lastName } = req.body;
        if (!RegularExpression.userName.test(firstName) || !RegularExpression.userName.test(lastName)) {
            return response(res, 400, ValidationMessages.userName)
        }
        next()
    }
}

export default DoValidation;