const whitelist = ['https://notelyfe.select', 'https://admin.notelyfe.select']

const corsOptions = {
    origin: (origin, callback) => {
        if (whitelist.indexOf(origin) !== -1) {
            callback(null, origin)
        } else {
            callback(new Error("Not Allowed By Cors"));
        }
    },
    optionsSuccessStatus: 200
}

module.exports = corsOptions;