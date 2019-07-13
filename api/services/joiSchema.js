const Joi = require('@hapi/joi');

const handleError = (errors) => {
    errors.forEach(err => {

        let label = '';
        switch (err.context.label) {
            case 'name': label = 'Name'; break;
            case 'password': label = 'Password'; break;
            case 'clientId': label = 'ClientId'; break;
            case 'email': label = 'Email'; break;
            case 'mobileNo': label = 'Mobile No'; break;
            case 'shopNo': label = 'Shop No'; break;
            case 'address': label = 'Address'; break;
            default: break;
        }

        switch (err.type) {
            case 'any.required':
                err.message = `${label} is required*`;
                break;
            case 'string.base':
                err.message = `${label} should not be number!`;
                break;
            case 'any.empty':
                err.message = `${label} should not be empty!`;
                break;
            case 'string.min':
                err.message = `${label} must be less than or equal to ${err.context.limit} characters long`;
                break;
            case 'string.max':
                err.message = `${label} must be at least ${err.context.limit} characters long`;
                break;
            default: break;
        }
    });
    return errors;
};

const joiSchema = Joi.object().keys({
    clientId: Joi.string().min(3).max(50).required().error(handleError),
    name: Joi.string().min(3).max(50).required().error(handleError),
    email: Joi.string().min(3).max(50).required().error(handleError),
    mobileNo: Joi.string().min(3).max(50).required().error(handleError),
    password: Joi.string().min(3).max(50).required().error(handleError),
    shopNo: Joi.string().min(3).max(50).required().error(handleError),
    address: Joi.string().min(3).max(50).required().error(handleError),
});

const validateClient = client => {
    const { error } = Joi.validate(client, joiSchema);
    return error ? error.details[0].message : '';;
}

module.exports = validateClient;
