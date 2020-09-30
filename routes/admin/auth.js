const express = require('express');
const { check,validationResult } = require ('express-validator');

const usersRepo = require('../../repositores/user');
const signupTemplate = require('../../views/admin/auth/signup');
const signinTemplate = require('../../views/admin/auth/signin'); 
const { requireEmail, requirePassword, requirePasswordConfirmation } = require('./validator')
const router = express.Router();

router.get('/signup', (req,res) => {
    res.send (signupTemplate({ req }));
});

router.post(
  '/signup',
  [ requireEmail, requirePassword,requirePasswordConfirmation  ] 
 ,async  (req,res) =>{
   const errors = validationResult(req);
  
   if(!errors.isEmpty()){
     return res.send(signupTemplate({ req, errors }));
  }
  
  const { email, password, passwordConfirmation } =req.body;
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
