const mongoose= require('mongoose')
mongoose.connect('mongodb://127.0.0.1:27017/user_manage')

const express=require('express')
const app=express();

app.use((req, res, next) => {
    res.header(
      "Cache-Control",
      "no-cache,  no-store, must-revalidate"
    );
    next();
})

// for user route
const userRoute= require('./routes/userRouts')
app.use('/',userRoute)


// for admin route
const adminRoute= require('./routes/adminRouts')
app.use('/admin',adminRoute)

app.listen(3000,()=>{
    console.log('server started...!')
})