import Boom from 'boom';
import { path } from "ramda";

const failAction = async (request, h, err) => {
    if (err) {
        console.error('ValidationError:', err);

        throw Boom.badRequest(`ValidationError: ${err.message}`);
    }
};

const getLowDB = (request) => path(['server', 'plugins', 'lowdb'], request);

export {
    failAction,
    getLowDB
}