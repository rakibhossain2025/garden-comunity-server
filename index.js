const express = require("express");
const app = express();
const cors = require('cors')
const port = process.env.PORT || 4710;
app.use(cors())
app.get('/', (req, res) => {
  res.send("iam backend")
})
const user = {
  name: 'rakib'
  , sdf: 'rakib'
  , ame: 'rakib'
}
app.get('/user', (req, res) => {
  res.send(user)
})
app.listen(port, () => {
  console.log(`backend server is running on port is ${port}`)
})
