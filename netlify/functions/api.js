const serverless = require('serverless-http')
const app = require('../../server/src/app')

exports.handler = serverless(app)
