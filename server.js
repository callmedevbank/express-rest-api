const express = require ('express')
const database = require('./data.json')
const fs = require("fs")
const port =2525

const app = express()
app.use(express.json())

//send a welcome message
app.get('/', (req, res)=>{
    res.json({message: 'Welcome to Expressroad'})
})


//read all student
//request mtd: GET
//route: '/studentInfo'
app.get('/database', (req, res)=>{
    try{
        //check if there is any data in the array
        if(database.length<1){
            res.json({message: "No data here"})
        }else{
            res.status(200).json({message: "All student in Codelab", data: database})
        }
    }catch(error){
        console.log(error.message)
    }

})

//get a student
// request mtd: GET
//route = '/studentInfo/:id'
app.get('/database/:id', (req, res)=>{
    try{
        //get the id 
        const id = parseInt(req.params.id)
        //get object of the id
        const student = database.find((e)=>e.id === id)
        //validate the id
        if(!student){
            res.json({message: `This student id: ${req.params.id} is not in database`})
        }else{
            res.status(200).json({message: "Student is present", data: student})
        }
    }catch(error){
        console.log(error.message)
    }
})

//add or create new student
//request mtd= POST
app.post('/database', (req, res)=>{
    try{
        //create new object
        const newStudent = {
            id: database.length + 1,
            name: req.body.name,
            course: req.body.course,
            duration: req.body.duration
        }
        //add new student to the array or database
        database.push(newStudent)
        fs.writeFileSync("./data.json", JSON.stringify(database), "utf-8", (error) => {
            if(error){
                console.log(error.message)
            }
        })
        //send response
        res.status(201).json({message: "Successfully Registered", data: newStudent})
    }catch(error){
        console.log(error.message)
    }
})
// update a data in our database
app.patch('/database/:id', (req, res)=>{
    try{
        //get the id passed to the url
        const id = parseInt(req.params.id)
        //get object of the id
        const studentId = database.find((e)=>e.id === id)
        // update the fields of student with the id found in the array
        studentId.name = req.body.name,
        studentId.course = req.body.course,
        studentId.duration= req.body.duration
        fs.writeFileSync("./data.json", JSON.stringify(database), "utf-8", (error) => {
            if(error){
                console.log(error.message)
            }
        })
        //send a respond to your client
        res.status(200).json({message: "Updated successfully", data: studentId})
    }catch(error){
        console.log(error.message)
    }
})

//delete a data from our database
//request mtd: DELETE

app.delete('/database/:id', (req, res)=>{
    try{
    //get the id you wanna delete
    const id = parseInt(req.params.id)
    //get the object of the id passed to the 
    const studentId = database.find((e)=>e.id === id)
    //validate the id
    if(!id){
        res.json({message: `invalid id: ${req.params.id}`})
    }else{
        // get the index of the id
        const index = database.indexOf(studentId)
        //remove the object of the index found
        database.splice(index, 1)
        //response to your client
        res.status(200).json({message: `id ${req.params.id} is deleted successfully`})
    }
    fs.writeFileSync("./data.json", JSON.stringify(database), "utf-8", (error) => {
        if(error){
            console.log(error.message)
        }
    })
}catch(error){
    console.log(error.mesage)
}


})

app.listen(port, ()=>{
    console.log(`listen to port: ${port}`)
}) 