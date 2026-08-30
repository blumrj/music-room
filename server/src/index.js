require('dotenv').config()
const app = require('./app')

const port = process.env.PORT || 8888

app.listen(port, () => {
  console.log(`music-room server listening on http://localhost:${port}`)
})
