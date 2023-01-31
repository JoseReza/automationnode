"use strict";
let configuration = {
    server: { port: 0, production: false, showBrowser: false },
    ngrok: { url: undefined },
    devices: [
        {
            name: undefined,
            type: undefined,
            protocol: undefined,
            port: 0,
            direction: undefined,
            template: undefined,
        },
    ],
    templates: [{ name: undefined, endpoint: undefined }],
    users: [
        {
            name: undefined,
            password: undefined,
            templates: [
                {
                    name: undefined,
                    schedule: {
                        start: { hours: 0, minutes: 0, seconds: 0 },
                        end: { hours: 0, minutes: 0, seconds: 0 },
                    },
                },
            ],
            admin: false,
        },
    ],
};
module.exports = configuration;
