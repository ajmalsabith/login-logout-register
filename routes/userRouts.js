const express= require('express')
const user_route = express()
const session=require('express-session')

const config=require('../config/config')

user_route.use(session({
    secret:config.sessionSecret,
    saveUninitialized:true,
    resave:false
}))

const auth= require('../middleware/auth')


user_route.set('view engine','ejs');
user_route.set('views','./views/users')

const bodyparser=require('body-parser')
user_route.use(bodyparser.json())
user_route.use(bodyparser.urlencoded({extended:true}))

const userController = require('../controllers/userController')

user_route.get('/register',auth.islogout,userController.loadregister)

user_route.post('/register',userController.insertuser)

user_route.get('/',auth.islogout,userController.loginload)
user_route.get('/login',userController.loginload)

user_route.post('/login',userController.verifylogin)

user_route.get('/home',auth.islogin,userController.loadHome)

user_route.get('/logout',auth.islogin,userController.userlogout)



module.exports = user_route;


