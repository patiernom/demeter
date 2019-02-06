
exports.plugin = {
    name: 'status',
    version: '1.0.0',
    register: async (server, options) => {
        server.route({
            method: 'GET',
            path: '/{whatever}',
            config: { auth: false },
            handler: (request, h) => h.response('Hello, ' + encodeURIComponent(request.params.whatever) + '!\nStatus OK!!'),
        });
    }
};
