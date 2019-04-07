/**
 * @class
 * @RegularExpression This class contains regular expression for the app.
 */
class RegularExpression { }

RegularExpression.email = /[a-z0-9\._%+!$&*=^|~#%'`?{}/\-]+@([a-z0-9\-]+\.){1,}([a-z]{2,16})/
RegularExpression.password = /[a-zA-Z0-9]{8,}/
RegularExpression.userName = /[a-zA-Z0-9]{3,}/

export default RegularExpression;