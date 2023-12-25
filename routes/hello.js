const express = require('express')
const router = express.Router()

router.get('/', (req, res, next) => {
  const msg = req.session.message
  const data = {
    title: 'Hello',
    content: `あなたは${msg}と送信しました。`
  }
    res.render('hello', data)
  }
)

router.post('/post', (req, res, next) => {
  const msg = req.body['message']
  console.log(req.session)
  console.log(req.session.message)
  req.session.message = msg
  const data = {
    title: 'Hello',
    content: `あなたは${msg}と送信しました。`
  }
  console.log(req.body)
  res.render('hello', data)
})

module.exports = {router}
