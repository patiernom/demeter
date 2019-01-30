
exports.plugin = {
    name: 'hallo name',
    version: '1.0.0',
    register: async function (server, options) {
        server.route({
            method: 'GET',
            path: '/{name}',
            handler: (request, h) => {

                return 'Hello, ' + encodeURIComponent(request.params.name) + '!';
            }
        });
    }
};
