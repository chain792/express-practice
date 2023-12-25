var express = require('express');
var router = express.Router();

const ps = require('@prisma/client');
const { check, validationResult } = require('express-validator');
const prisma = new ps.PrismaClient()

/* GET users listing. */
router.get('/', async function(req, res, next) {
  const users = await prisma.user.findMany({ 
    where: {
      OR: [
        {id: {gte: 2}},
        {id: {lte: 2}},
      ]
    },
    orderBy: [{id: 'asc'}]
  })
  const data = {
    content: users
  }
  res.render('users/index', data)
});

router.get('/add', (req, res, next) => {
  const data = {
    form: {}
  }
  res.render('users/add', data)
})

router.post('/add', [
  check('name', 'Nameに入力して').notEmpty(),
  check('mail', 'Mailに入力して').notEmpty(),
  check('age', 'ageは数値').isInt()
],async (req, res, next) => {
  const err = validationResult(req)
  if(!err.isEmpty()) {
    console.log(err.array())
    const data = {
      form: req.body
    }
    res.render('users/add', data)
  } else {
    await prisma.user.create({
      data: {
        name: req.body.name,
        pass: req.body.pass,
        mail: req.body.mail,
        age: +req.body.age
      }
    })
    res.redirect('/users')
  }
})

router.get('/login', (req, res, next) => {
  res.render('users/login')
})

router.post('/login', async (req, res, next) => {
  user = await prisma.user.findMany({
    where: {
      name: req.body.name,
      pass: req.body.pass,
    }
  })

  if(user != null && user[0] != null) {
    req.session.login = user[0]
    let back = req.session.back
    if (back == null) {
      back = '/'
    }
    res.redirect(back)
  } else {
    res.render('users/login')
  }
})

module.exports = router;
