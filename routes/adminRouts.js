const express=require('express')
const admin_route= express()

const session= require('express-session')
const config=require('../config/config')
admin_route.use(session({
    secret:config.sessionSecret,
    saveUninitialized:true,
    resave:false
}))



const bodyparser= require('body-parser')
admin_route.use(bodyparser.json())
admin_route.use(bodyparser.urlencoded({extended:true}))

admin_route.set('view engine','ejs')
admin_route.set('views','./views/admin')

const auth=require('../middleware/adminAuth')

const adminController=require('../controllers/adminController')

admin_route.get('/',auth.islogout,adminController.loadlogin)


admin_route.post('/',adminController.verifylogin)
admin_route.get('/home',auth.islogin,adminController.loadDashboard)

admin_route.get('/logout',auth.islogin,adminController.logout)

admin_route.get('/user',auth.islogin,adminController.showUser)

admin_route.get('/new-user',auth.islogin,adminController.addnewuser)
admin_route.post('/new-user',adminController.adduser)

admin_route.get('/edit-user',auth.islogin,adminController.edituser)

admin_route.post('/edit-user',adminController.updateuser)

admin_route.get('/delete-user',adminController.deleteuser)

admin_route.post('/user',adminController.searchUser)

admin_route.get('*',function(req,res){

    res.redirect('/admin')
})

module.exports= admin_route;