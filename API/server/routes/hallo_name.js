
exports.plugin = {
    name: 'hallo name',
    version: '1.0.0',
    register: async (server, options) => {
        server.route({
            method: 'GET',
            path: '/{name}',
            config: { auth: false },
            handler: (request, h) => {

                return 'Hello, ' + encodeURIComponent(request.params.name) + '!';
            }
        });
    }
};
