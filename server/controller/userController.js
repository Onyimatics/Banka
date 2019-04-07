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

    

}

export default UserController;