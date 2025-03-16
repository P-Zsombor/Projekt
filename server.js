const express = require("express")
const dbHandler = require("./dbHandler")
require("dotenv").config()

const server = express()
server.use(express.json())
server.use(express.static("public"))

const PORT = process.env.PORT

const JWT = require("jsonwebtoken")

dbHandler.handler.sync({ alter: true })

function Auth(){
    return(req, res, next) => {
        const auth = req.headers.authorization
        if(auth.split(" ")[0] != "Bearer"){
            return res.json({"message":"Token is wrong or does not exist"})
        }
        else{
            const encToken = auth.split(" ")[1]
            try {
                const token = JWT.verify(encToken, process.env.SECRETKEY)
                req.username = token.username,
                req.password = token.password,
                req.admin = token.admin
                next()
            } catch (error) {
                res.json({"message":error})
                res.end();
            }
        }
    }
}

server.post("/register", async (req, res) => {
    const user = await dbHandler.tables.Users.findOne({
        where:{
            username: req.body.regUsername
        }
    })
    if(user){
        await res.json({"message":"A user with this username already exists"})
    }
    else{
        await dbHandler.tables.Users.create({
            username: req.body.regUsername,
            password: req.body.regPassword
        })
        await res.json({"message":"Successful registration"})
    }
    res.end()
})

server.post("/login", async (req, res) => {
    console.log(req.body)
    const user = await dbHandler.tables.Users.findOne({
        where:{
            username: req.body.logUsername,
            password: req.body.logPassword
        }
    })
    if(user){
        const token = JWT.sign({"username": user.username, "password": user.password, "admin": user.admin}, process.env.SECRETKEY, {expiresIn: "6h"})
        res.json({"token": token, "username": user.username, "message":"Successful login"}).end()
    }
    else{
        res.status(400).json({"message":"Wrong username or password"}).end()
    }
})

server.post("/addpost", Auth(), async (req, res) => {
    await dbHandler.tables.Posts.create({
        uploader: req.username,
        content: req.body.postContent
    })
    res.json({"message":"Post created successfully"}).end()
})

server.get("/getposts", async (req, res) => {
    res.json(await dbHandler.tables.Posts.findAll()).end()
})
server.get("/getreports", async (req, res) => {
    res.json(await dbHandler.tables.Reports.findAll()).end()
})

server.post("/getcomments", async (req, res) => {
    res.json(await dbHandler.tables.Comments.findAll({
        where:{
            postId: req.body.postId
        }
    })).end()
})

server.delete("/deletepost", Auth(), async (req, res) => {
    const post = await dbHandler.tables.Posts.findOne({
        where:{
            postId: req.body.postId
        }
    })
    if(post){
        await dbHandler.tables.Posts.destroy({
            where:{
                postId: req.body.postId
            }
        })
        res.json({"message":"Post deleted successfully"})
    }
    else{
        res.status(400).json({"message":"Post not found"})
    }
    res.end()
})

server.post("/addcomment", Auth(), async (req, res) => {
    const post = await dbHandler.tables.Posts.findOne({
        where:{
            postId: req.body.postId
        }
    })
    if(post){
        await dbHandler.tables.Comments.create({
            uploader: req.username,
            postId: req.body.postId,
            content: req.body.comContent
        })
        res.json({"message":"Comment added successfully"})
    }
    else{
        res.status(400).json({"message":"Post not found"})
    }
	res.end()
})

server.delete("/deletecomment", Auth(), async (req, res) => {
    const comment = await dbHandler.tables.Comments.findOne({
        where:{
            commentId: req.body.commentId
        }
    })
    if(comment){
        await comment.destroy()
        res.json({"message":"Comment deleted successfully"})
    }
    else{
        res.status(400).json({"message":"Comment not found"})
    }
	res.end()
})

server.post("/addreport", Auth(), async (req, res) => {
    const post = await dbHandler.tables.Posts.findOne({
        where:{
            postId: req.body.postId
        }
    })
    if(post){
        dbHandler.tables.Reports.create({
            reporter: req.username,
            postId: req.body.postId,
            content: req.body.repContent
        })
        res.json({"message":"Report added successfully"})
    }
    else{
        res.status(400).json({"message":"Post not found"})
    }
    res.end()
})

server.delete("/deletereport", Auth(), async (req, res) =>{
    const report = await dbHandler.tables.Reports.findOne({
        where:{
            postId: req.body.postId
        }
    })
    if(report){
        dbHandler.tables.Reports.destroy({
            where:{
                postId: req.body.postId
            }
        })
        res.json({"message":"Reports successfully deleted"})
        Console.WriteLine("Raw JSON Response: " + result);
    }
    else{
        res.status(400).json({"message":"No reports for that post were found"})
    }
    res.end()
})

server.get("/users", async (req, res) => {
    res.json(await dbHandler.tables.Users.findAll())
})

server.listen(PORT, () => {console.log("The server is listening on port " + PORT)})
