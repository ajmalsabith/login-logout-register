const Users= require('../models/userModel')
const bcrypt= require('bcrypt')


const securepassword=async(password)=>{
    try{
       const passwordHash=await bcrypt.hash(password,10)
       return passwordHash

    }catch(error){
        console.log(error.message)
    }

}

const loadregister = async(req,res)=>{
    try{
        
        res.render('registration')

    }catch (error){
        console.log(error.message)
    }
}

const insertuser = async (req,res)=>{
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
        res.render('registration',{message:'your registration has been successfully completed'})
       }else{
        res.render('registration',{message:'registration has been faild'})
       }

    }catch(error){
        console.log(error.message)
    }
}

//login user methods started...

const loginload= async(req,res)=>{
    try{

        res.render('login')

    }catch(error){
        console.log(error.message)
    }

}

const verifylogin = async(req,res)=>{

    try{

        const email= req.body.email
        const password= req.body.password

      const userData=  await Users.findOne({email:email})

      if(userData){
       const passwordMatch=await bcrypt.compare(password,userData.password)
       if(passwordMatch){

          req.session.user_id = userData._id;
          res.redirect('/home')
       }else{
        res.render('login',{message:'email and password is incorrect'})
       }
      }else{
        res.render('login',{message:'email and password is incorrect'})
      }

    }catch (error){
        console.log(error.message)
    }

}

const loadHome=async(req,res)=>{
    try{
        res.render('home')

    }catch(error){
        console.log(error.message)
    }
}

const userlogout=async(req,res)=>{
    try{
        req.session.destroy()
        res.redirect('/')


    }catch(error){
        console.log(error.message)
    }
}



module.exports={
    loadregister,
    insertuser,
    loginload,
    verifylogin,
    loadHome,
    userlogout
    
}  