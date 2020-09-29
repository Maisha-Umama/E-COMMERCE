const express = require('express');
const { check } = require ('express-validator');

const usersRepo = require('../../repositores/user');
const signupTemplate = require('../../views/admin/auth/signup');
const signinTemplate = require('../../views/admin/auth/signin'); 

const router = express.Router();

router.get('/signup', (req,res) => {
    res.send (signupTemplate({ req }));
});



router.post('/signup',[
   check('email'),
   check('password'),
   check('passwordConfermation')
] ,async  (req,res) =>{
  const { email, password, passwordConfirmation } =req.body;

  const existingUser = await usersRepo.getOneBy({ email });
  if(existingUser){
    return res.send('Email in use');
  }

  if(password !== passwordConfirmation){
    return res.send("Passwords Must Match ")
  }

  const user = await usersRepo.create( { email, password });

  req.session.userId = user.id;

  res.send('Account created');
});

router.get('/signout', (req, res) => {
  req.session = null;
  res.send('YOU ARE LOGGED OUT')
  
});

router.get('/signin', (req,res) => {
   res.send(signinTemplate() );
});

router.post('/signin', async(req,res) =>{
  const { email, password } = req.body;

  const user = await usersRepo.getOneBy({email });

  if(!user){
    return res.send('EMAIL NOT FOUND');
  }

  const validPassword = await usersRepo.comparePasswords(
    user.password,
    password
  );
  if(!validPassword){
    return res.send('INVALID PASSWORD');
  }

  req.session.userId = user.id;

  res.send('YOU ARE SIGNED IN!!!!')
});

module.exports = router ;
