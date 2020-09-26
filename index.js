const express = require('express');
const bodyParser = require('body-parser');
const cookieSession = require('cookie-session');
const usersRepo = require('./repositores/user');

const app = express();

app.use(bodyParser.urlencoded({ extended: true })); 
app.use(
  cookieSession({
    keys: ['lkasld235j']
  })
);

app.get('/signup', (req,res) => {
    res.send (`
    <div>
    YOUR ID IS : ${req.session.userId}
      <form method="POST">
        <input name="email" placeholder="email"/>
        <input name="password" placeholder = "password" />
        <input name= "passwordConfirmation" placeholder = "password confirmation"/>
        <button>Sign Up</button>
      </form>
    </div>
    `);
});



app.post('/signup',async  (req,res) =>{
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

app.get('/signout', (req, res) => {
  req.session = null;
  res.send('YOU ARE LOGGED OUT')
  
});

app.get('/signin', (req,res) => {
   res.send(`
   <div>
     <form method="POST">
       <input name="email" placeholder="email"/>
       <input name="password" placeholder = "password" />
       <button>Sign In</button>
     </form>
   </div>
   `)
});

app.post('/signin', async(req,res) =>{
  const { email, password } = req.body;

  const user = await usersRepo.getOneBy({email });

  if(!user){
    return res.send('EMAIL NOT FOUND');
  }

  if(user.password!== password){
    return res.send('INVALID PASSWORD');
  }

  req.session.userId = user.id;

  res.send('YOU ARE SIGNED IN!!!!')
});

app.listen(3000, () => {
    console.log('listening');
});  