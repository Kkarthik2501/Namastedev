 const express=require('express')
const app=express()
const {AuthCheck}=require('./middleware/Authenticate')
app.get('/test/:name/:age',(req,res)=>{
    console.log(req.query)
    console.log(req.params)
    res.send("Hello from test")
})
app.use('/admin',AuthCheck)
app.get('/admin/getDetails',(req,res)=>{
    res.send("Get details")
})
app.use('/',(req,res)=>{
    res.send({firstName:"karthik",lastName:"Katakam"})
})

app.listen(4000,()=>{
    console.log("Server started.....")
})
