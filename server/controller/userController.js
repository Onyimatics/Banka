import response from '../helper/response/index';
import users from '../model/users';
import DoValidation from '../../server/middleaware/validation/dovalidation';
import TokenManager from '../helper/tokenManager';
import PasswordManager from '../helper/passwordManager';

class UserController {

    static async register(req, res) {
        const { firstName, lastName, email, password } = req.body;
        const hashPassword = await PasswordManager.hashPassword(password);
        const userDetailArr = users.filter(user => {
            return user.email === email
        });
        if (userDetailArr.length > 0) {
            response(res, 400, 'Email already in use')
        }
        const newUser = {
            id: users.length + 1,
            firstName,
            lastName,
            email,
            password: hashPassword,
            type: 'client',
            isAdmin: false,
        }
        const token = TokenManager.sign(newUser)
        newUser['token'] = token;
        users.push(newUser)
        const { id } = newUser;
        response(res, 200, 'Successfully created a new user account', { id, token, firstName, email, lastName })
    }
    // login controller
static login(req, res) {
    const { email, password } = req.body;

    const userDetailArr = users.filter(user => {
        return user.email === email
    });
    if (userDetailArr.length === 0) {
        response(res, 400, 'Invalid Password or Email')
    }
    const userDetails = userDetailArr[0];
    const { id, firstName, lastName, password: hashPassword } = userDetails;

    const isPasswordValid = PasswordManager.verifyPassword(password, hashPassword);

    if (isPasswordValid) {
        const token = TokenManager.sign(userDetails)
        userDetails['token'] = token;
        response(res, 200, 'Successfully logged in', { id, token, firstName, email, lastName })
    };
    response(res, 400, 'Invalid Password or Email')
}

    

}

export default UserController;