const express = require('express')
session = require('express-session')
const mongoose = require('mongoose')
const bcrypt = require('bcryptjs');
const Handlebars = require('handlebars')
const handlebars = require('express-handlebars')
const User= require('./models/User')
const bodyParser = require("body-parser");
const { allowInsecurePrototypeAccess } = require('@handlebars/allow-prototype-access');

const urlencodedParser = bodyParser.urlencoded({extended: false});
const PORT = process.env.PORT || 3001
const app = express()

const mongo_DB_URI=`mongodb+srv://user:1111@cluster0.zod8h.mongodb.net/myFirstDatabase?retryWrites=true&w=majority`;
mongoose.set('useFindAndModify', false);

app.set("view engine", "hbs");

app.use(express.json())

const start = async () => {
  try {
    await mongoose.connect(mongo_DB_URI, {useNewUrlParser: true, useUnifiedTopology: true})
    app.listen(PORT, () => console.log(`server started on port ${PORT}`))
  } catch (e) {
    console.log(e)
  }
}

app.engine('hbs', handlebars({
  layoutsDir:`${__dirname}/views/layouts`,
  handlebars: allowInsecurePrototypeAccess(Handlebars)
}))

app.get("/login", function(request, response){
  if(session.login===true){
    response.redirect('/home')
    return
  }
  response.render("Login.hbs",{layout:'EmptySimpleBlue.hbs'});
});
app.get("/registration", function(request, response){
  response.render("Registration.hbs",{layout:'EmptySimpleBlue.hbs'});
});
app.get("/home", async function (request, response) {
  if (session.login !== true) {
    response.redirect('/login')
    return
  }
  const user = await User.findById(session.id)
  console.log("session _id: "+session.id)
  if (user.status==='blocked'){
    response.redirect('/login')
    return
  }
  await renderHome(request, response)
});
app.get("/", async function (request, response) {
  if (session.login !== true) {
    response.redirect('/login')
    return
  }
  const user = await User.findById(session.id)
  if (user.status === 'blocked') {
    response.redirect('/login')
    return
  }
  await renderHome(request, response)
});

app.post("/login", urlencodedParser, async function (request, response) {
  const {loginUsername, loginPassword} = request.body
  const user = await User.findOne({username: loginUsername})
  if (!user) {
    response.render("Login.hbs",{layout:'EmptySimpleBlue.hbs', invalidUsername: "Invalid username"})
    return
  }
  const validPassword = bcrypt.compareSync(loginPassword, user.password)
  if (!validPassword) {
    response.render("Login.hbs",{layout:'EmptySimpleBlue.hbs', invalidPassword: "Wrong password"})
    return
  }
  if (user.status === 'blocked') {
    response.render("Login.hbs",{layout:'EmptySimpleBlue.hbs', ifBlocked: "You are blocked"})
    return
  }
  await User.updateOne({username: user.username}, {$set: {lastLoginDate: (new Date()).toLocaleString()}})
  session.login=true
  session.username= user.username
  session.id= user._id
  response.redirect('/home')
})

app.post("/registration", urlencodedParser, async function (request, response) {
      const {registerUsername, registerEmail, registerPassword} = request.body;
      const isUsernameExist = await User.findOne({registerUsername})
      const isEmailExist = await User.findOne({registerEmail})

      if (isUsernameExist||isEmailExist) {
        if(isUsernameExist&&isEmailExist) {
          response.render("Registration.hbs", {
            layout: 'EmptySimpleBlue.hbs',
            UsernameExist: "username already exist", EmailExist: "email already exist"
          })
        }else{
          if(isUsernameExist){
            response.render("Registration.hbs", {
              layout: 'EmptySimpleBlue.hbs',
              UsernameExist: "username already exist"
            })
          }else{
            response.render("Registration.hbs", {
              layout: 'EmptySimpleBlue.hbs',
              EmailExist: "email already exist"
            })
          }
        }
        return
      }
      const hashPassword = bcrypt.hashSync(registerPassword, 6);
      const user = new User(
          {
            username:registerUsername,email: registerEmail, password: hashPassword, status: 'active',
            registrationDate: (new Date()).toLocaleString(), lastLoginDate: `haven't visited yet`
          })
      const id = user._id
      user.ID = (id).toString().slice(3, 11)
      await user.save()
      response.render('Registration.hbs',
          {layout:'EmptySimpleBlue.hbs', RegisterSuccess:"Success, now you can Log in"})
    }
);

app.post('/logout', async function (request, response){
  session.login=false
  response.redirect('/login')
})

app.get('/delete', async function (request, response){
  if(session.login!==true){
    response.redirect('/login')
    return
  }
  let Suicide
  const values= request.query.ids
  console.log(values.length)
  if(values.length===24&&!values[1].match(/^[0-9a-fA-F]{24}$/)){
    if(values==session.id){
      console.log('СРАБОТАЛО')
      session.login = false
      Suicide=true
      response.redirect('/registration')
    }
    if(!Suicide) {
      response.redirect('/')
    }
    await User.findByIdAndDelete(values)
    return
  }
  for(let i in values) {
    if (values[i] == session.id) {
      session.login = false
      Suicide = true
      response.redirect('/registration')
    }
  }
  for(let i in values) {
    await User.findByIdAndDelete(values[i])
  }
  if(!Suicide) {
    response.redirect('/')
  }
})

app.get('/block', async function (request, response){
  if(session.login!==true){
    response.redirect('/login')
    return
  }
  let Suicide
  const values = request.query.ids
  if(values.length===24&&!values[1].match(/^[0-9a-fA-F]{24}$/)){
    if(values==session.id){
      session.login = false
      Suicide=true
      response.redirect('/login')
    }
    await User.findByIdAndUpdate(values, {status: 'blocked'})
    if(!Suicide) {
      response.redirect('/')
    }
    return
  }
  for(let i in values) {
    if (values[i] == session.id) {
      session.login = false
      Suicide = true
      response.redirect('/registration')
    }
  }
  for(let i in values) {
    await User.findByIdAndUpdate(values[i], {status: 'blocked'})
  }
  if(!Suicide) {
    response.redirect('/')
  }
})

app.get('/unblock', async function (request, response){
  if(session.login!==true){
    response.redirect('/login')
    return
  }
  const values = request.query.ids
  if(values.length===24&&!values[1].match(/^[0-9a-fA-F]{24}$/)){
    await User.findByIdAndUpdate(values, {status: 'active'})
    response.redirect('/')
    return
  }
  for(let i in values) {
    await User.findByIdAndUpdate(values[i], {status: 'active'})
  }
  response.redirect('/')
})

async function renderHome(req, res){
  User.find({}, function (e, users) {
    res.render('Home.hbs', {
      layout: 'EmptySimpleBlue.hbs',
      users: users,
      CurrentUsername: session.username
    });
  })
}

start()

