const Users = require('../models/userModel')
const bcrypt = require('bcrypt')
const session = require('express-session')

const loadlogin = async (req, res) => {

    try {

        res.render('login')

    } catch (error) {
        console.log(error.message)
    }

}



const verifylogin = async (req,res)=>{
    try {
        const email = req.body.email
        const password = req.body.password

        const userData = await Users.findOne({ email:email })
        if (userData) {
            const passwordMatch = await bcrypt.compare(password, userData.password)
            if (passwordMatch) {
                if (userData.is_admin === 0) {
                    res.render('login', { message: 'email or password is incorrect' })
                } else {
                    req.session.user_id = userData._id;
                    res.redirect('/admin/home')
                }
            }
             else {
                   res.render('login', { message: 'email or password is incorrect' })
             }
        }else
               {
                    res.render('login', { message: 'email or password is incorrect' })
               }

    }catch(error) {
    console.log(error.message)
    }
}

const loadDashboard= async(req,res)=>{
    try{
        res.render('home')

    }catch(error){
        console.log(error.message)    
    }
}

const logout=async(req,res)=>{
    try{
        req.session.destroy()
        res.redirect('/admin')

    }catch(error){
         console.log(error.message)
    }
}

const showUser=async(req,res)=>{

    try{

        const userData=await Users.find({is_admin:0})
        res.render('showUser',{users:userData})

    }catch(error){
        console.log(error.message)
    }

}

const addnewuser=async(req,res)=>{
    try{

        res.render('adduser')

    }catch(error){
        console.log(error.message)
    }
}


const securepassword=async(password)=>{
    try{
       const passwordHash=await bcrypt.hash(password,10)
       return passwordHash

    }catch(error){
        console.log(error.message)
    }

}

const adduser= async(req,res)=>{
    try{
        const spassword= await securepassword(req.body.password)
        const user= new Users({

        name:req.body.name,
        email:req.body.email,
        mobile:req.body.mobile,
        password:spassword,
        is_admin:0
       })

       const userData = await user.save()
       
       if(userData){
        res.render('adduser',{message:'your add has been successfully completed'})
       }else{
        res.render('adduser',{message:'add has been faild'})
       }


    }catch(error){
        console.log(error.message)
    }
}
const edituser=async(req,res)=>{
    try{
        const id = req.query.id;
        const userData= await Users.findById({ _id:id })
        if(userData){
            res.render('edituser',{users:userData})
        }else{
             res.redirect('/admin/user')
        }   
    }catch(error){
        console.log(error.message)
    }
}    
const updateuser=async(req,res)=>{
    try{  
      const userdata=await Users.findByIdAndUpdate({_id:req.body.id},{$set:{name:req.body.name,email:req.body.email,mobile:req.body.mobile}})
        res.redirect('/admin/user')
    }catch(error){
        console.log(error.message)
    }
}


const deleteuser=async (req,res)=>{
    try{  
     const id = req.query.id;
   await Users.deleteOne({_id:id})
     res.redirect('/admin/user')
    }catch(error){
        console.log(error.message)
    }
}

const searchUser= async (req,res)=>
 {
    try{
        const searchValue=req.body.search
      
        const search=searchValue.trim()

        if(search!="")
        {
            let users=await Users.find({$and:[{name:{$regex:`^${search}`,$options:"i"}},{is_admin:0}]})
        
             res.render("showUser",{users:users})
        }

    
    }

    catch(error)
    {
        console.log(error.message)
    }
 }



module.exports = {
    loadlogin,
    verifylogin,
    loadDashboard,
    logout,
    showUser,
    addnewuser,
    adduser,
    edituser,
    updateuser,
    deleteuser,
    searchUser,
    logout
}