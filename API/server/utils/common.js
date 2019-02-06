import Boom from 'boom';

const failAction = async (request, h, err) => {
    if (err) {
        console.error('ValidationError:', err);

        throw Boom.badRequest(`ValidationError: ${err.message}`);
    }
};

export {
    failAction
}