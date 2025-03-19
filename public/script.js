//Client script for the blog project


//Registers a new user
function Register(username, password){
    const regReq = new XMLHttpRequest()
    regReq.open("post", "/register")
    regReq.setRequestHeader("Content-Type", "Application/json")
    regReq.send(JSON.stringify({
        regUsername: username,
        regPassword: password
    }))
    regReq.onreadystatechange = () => {
        if(regReq.readyState == 4 && regReq.status == 200){
            const result = JSON.parse(regReq.response)
            console.log(result.message)
            window.location.reload()
        }
    }
}

//Logs in an existing user
function Login(username, password){
    const logReq = new XMLHttpRequest()
    logReq.open("post", "/login")
    logReq.setRequestHeader("Content-Type", "Application/json")
    logReq.send(JSON.stringify({
        logUsername: username,
        logPassword: password
    }))
    logReq.onreadystatechange = () => {
        if(logReq.readyState == 4){
            const result = JSON.parse(logReq.response)
            console.log(result.message)
            if(logReq.status == 200){
                sessionStorage.setItem("token", result.token)
                sessionStorage.setItem("username", result.username)
                console.log("Token saved successfully")
                window.location.reload()
            }
        }
    }
}

//Makes a new post
function CreatePost(content){
    const postReq = new XMLHttpRequest()
    postReq.open("post", "/addpost")
    postReq.setRequestHeader("Authorization", "Bearer " + sessionStorage.getItem("token"))
    postReq.setRequestHeader("Content-Type", "Application/json")
    postReq.send(JSON.stringify({
        postContent: content
    }))
    postReq.onreadystatechange = () => {
        if(postReq.readyState == 4 && postReq.status == 200){
            const result = JSON.parse(postReq.response)
            console.log(result.message)
            GetPosts()
        }
    }
}

//Deletes a post
function DeletePost(postId){
    const delReq = new XMLHttpRequest()
    delReq.open("delete", "/deletepost")
    delReq.setRequestHeader("Authorization", "Bearer " + sessionStorage.getItem("token"))
    delReq.setRequestHeader("Content-Type", "Application/json")
    delReq.send(JSON.stringify({
        postId: postId
    }))
    delReq.onreadystatechange = () => {
        if(delReq.readyState == 4 && delReq.status == 200){
            const result = JSON.parse(delReq.response)
            console.log(result.message)
            GetPosts()
        }
    }
}

//Adds a comment to the currnet post
function AddComment(postId, content){
    const comReq = new XMLHttpRequest()
    comReq.open("post", "/addcomment")
    comReq.setRequestHeader("Authorization", "Bearer " + sessionStorage.getItem("token"))
    comReq.setRequestHeader("Content-Type", "Application/json")
    comReq.send(JSON.stringify({
        postId: postId,
        comContent: content
    }))
    comReq.onreadystatechange = () => {
        if(comReq.readyState == 4 && comReq.status == 200){
            const result = JSON.parse(comReq.response)
            console.log(result.message)
            GetComments(postId)
        }
    }
}

//Deletes a comment
function DeleteComment(commentId, postId){
    const delReq = new XMLHttpRequest()
    delReq.open("delete", "/deletecomment")
    delReq.setRequestHeader("Authorization", "Bearer " + sessionStorage.getItem("token"))
    delReq.setRequestHeader("Content-Type", "Application/json")
    delReq.send(JSON.stringify({
        commentId: commentId
    }))
    delReq.onreadystatechange = () => {
        if(delReq.readyState == 4 && delReq.status == 200){
            const result = JSON.parse(delReq.response)
            console.log(result.message)
            GetComments(postId)
        }
    }
}

//Adds a report to the currnet post
function AddReport(postId){
    const repReq = new XMLHttpRequest()
    repReq.open("post", "/addreport")
    repReq.setRequestHeader("Authorization", "Bearer " + sessionStorage.getItem("token"))
    repReq.setRequestHeader("Content-Type", "Application/json")
    repReq.send(JSON.stringify({
        postId: postId,
        repContent: reportInput.value
    }))
    repReq.onreadystatechange = () => {
        if(repReq.readyState == 4 && repReq.status == 200){
            const result = JSON.parse(repReq.response)
            console.log(result.message)
        }
    }
}

//Loads every post on the home page
function GetPosts(){
    const req = new XMLHttpRequest()
    req.open("get", "/getposts")
    req.setRequestHeader("Content-Type", "Application/json")
    req.send()
    req.onreadystatechange = () => {
        if(req.readyState == 4 && req.status == 200){
            const result = JSON.parse(req.response)

            content.innerHTML = ""
            comments.innerHTML = ""

            if(loginB){
                header.removeChild(loginRegisterP)
                header.removeChild(usernameInput)
                header.removeChild(passwordInput)
                header.removeChild(confirmLoginButton)
                header.removeChild(cancelLoginButton)
                loginButton.innerText = "Login"
                loginB = false
            }


            const newPostButton = document.createElement("button")

            newPostButton.innerText = "Make new post"

            newPostButton.addEventListener("click", function(){
                content.innerHTML = ""

                const backButton = document.createElement("button")
                const postContent = document.createElement("textarea")
                const postButton = document.createElement("button")

                backButton.innerText = "Back"
                postContent.spellcheck = false
                postContent.style.backgroundColor = "#202020"
                postContent.style.color = "white"
                postContent.style.borderColor= "#101010"
                postContent.style.display = "block"
                postContent.style.height = "94%"
                postContent.style.width = "98%"
                
                postButton.innerText = "Post"

                backButton.addEventListener("click", function(){
                    GetPosts()
                })

                postButton.addEventListener("click", function(){
                    CreatePost(postContent.value)
                })

                content.appendChild(backButton)
                content.appendChild(postButton)
                content.appendChild(postContent)
            })

            if(!loggenIn){
                newPostButton.disabled = true
            }

            content.appendChild(newPostButton)


            result.slice().reverse().forEach(post => {
                if(!userPosts || (userPosts && post.uploader == sessionStorage.getItem("username"))){
                    const onePost = document.createElement("div")

                    onePost.innerText = post.content
                    onePost.style.backgroundColor = "#202020"
                    onePost.style.margin = "5px"
                    onePost.style.padding = "10px"
                    onePost.style.borderRadius = "10px"
                    onePost.addEventListener("mouseover", function(){
                        onePost.style.backgroundColor = "#272727"
                    })
                    onePost.addEventListener("mouseleave", function(){
                        onePost.style.backgroundColor = "#202020"
                    })

                    onePost.addEventListener("click", function(){
                        GetComments(post.postId)
                        LoadPost(post.content, post.postId, post.uploader)
                    })
                    content.appendChild(onePost)
                }
            })
            userPosts = false
        }
    }
}

var userPosts = false
function GetUserPosts(){
    userPosts = true
    GetPosts()
}

//Loads the comments for the clicked post
function GetComments(postId){
    const req = new XMLHttpRequest()
    req.open("post", "/getcomments")
    req.setRequestHeader("Content-Type", "Application/json")
    req.send(JSON.stringify({
        postId: postId
    }))
    req.onreadystatechange = () => {
        if(req.readyState == 4 && req.status == 200){
            const result = JSON.parse(req.response)

            comments.innerHTML = ""

            const commentInput = document.createElement("input")
            const commentButton = document.createElement("button")

            commentInput.id = "commentInput"
            commentInput.placeholder = "Comment"
            commentButton.id = "commentInput"
            commentButton.innerText = "Add comment"

            if(!loggenIn){
                commentInput.disabled = true
                commentInput.title = "You need to be logged in to do that"
                commentButton.disabled = true
                commentButton.title = "You need to be logged in to do that"
            }

            commentButton.addEventListener("click", function(){
                AddComment(postId, commentInput.value)
            })

            comments.appendChild(commentInput)
            comments.appendChild(commentButton)

            result.slice().reverse().forEach(comment => {
                const oneComment = document.createElement("div")

                oneComment.innerText = comment.content
                oneComment.style.backgroundColor = "#202020"
                oneComment.style.margin = "5px"
                oneComment.style.padding = "10px"
                oneComment.style.borderRadius = "10px"

                if(sessionStorage.getItem("username") == comment.uploader){
                    const deleteCommentButton = document.createElement("button")
                    deleteCommentButton.innerText = "Delete"
                    deleteCommentButton.style.backgroundColor = "#303030"
                    deleteCommentButton.addEventListener("mouseleave", function(){
                        deleteCommentButton.style.backgroundColor = "#303030"
                    })
                    deleteCommentButton.addEventListener("mouseover", function(){
                        deleteCommentButton.style.backgroundColor = "#272727"
                    })


                    deleteCommentButton.addEventListener("click", function(){
                        deleteCommentButton.style.backgroundColor = "#3d3d3d"
                        DeleteComment(comment.commentId, postId)
                    })

                    oneComment.appendChild(deleteCommentButton)
                }

                comments.appendChild(oneComment)
            })
        }
    }
}

//Loads the clicked post
function LoadPost(postContent, postId, uploader){
    content.innerHTML = ""

    if(loginB){
        header.removeChild(loginRegisterP)
        header.removeChild(usernameInput)
        header.removeChild(passwordInput)
        header.removeChild(confirmLoginButton)
        header.removeChild(cancelLoginButton)
        loginButton.innerText = "Login"
        loginB = false
    }

    const backButton = document.createElement("button")
    backButton.innerText = "Back"
    backButton.style.margin = "20px"
    
    const pContent = document.createElement("p")
    pContent.innerText = postContent
    pContent.style.backgroundColor = "#202020"
    pContent.style.display = "block"
    pContent.style.margin = "20px"
    pContent.style.padding = "10px"
    pContent.style.borderRadius = "10px"

    const reportButton = document.createElement("button")
    reportButton.id = "reportButton"
    reportButton.innerText = "Report"
    reportButton.style.margin = "20px"

    if(!loggenIn){
        reportButton.disabled = true
        reportButton.title = "You need to be logged in to do that"
    }

    content.appendChild(backButton)


    var username = sessionStorage.getItem("username")
    if(username == uploader){
        const deleteButton = document.createElement("button")
        deleteButton.innerText = "Delete Post"

        deleteButton.addEventListener("click", function(){
            DeletePost(postId)
        })

        content.appendChild(deleteButton)
    }

    GetReports(postId, username)

    reportButton.addEventListener("click", function(){
        reportButton.disabled = true

        const reportInput = document.createElement("input")
        const addReportButton = document.createElement("button")
        const cancelReportButton = document.createElement("button")

        reportInput.id = "reportInput"
        reportInput.placeholder = "Report"

        addReportButton.innerText = "Add report"

        cancelReportButton.innerText = "Cancel"


        addReportButton.addEventListener("click", function(){
            AddReport(postId)
        })

        cancelReportButton.addEventListener("click", function(){
            content.removeChild(reportInput)
            content.removeChild(addReportButton)
            content.removeChild(cancelReportButton)
            reportButton.disabled = false
        })


        content.appendChild(reportInput)
        content.appendChild(addReportButton)
        content.appendChild(cancelReportButton)
    })

    backButton.addEventListener("click", function(){
        GetPosts()
    })


    content.appendChild(pContent)
    content.appendChild(reportButton)
}

//Gets all reports and checks if a user has already reported a post
function GetReports(postId, username){
    const req = new XMLHttpRequest()
    req.open("get", "/getreports")
    req.setRequestHeader("Content-Type", "Application/json")
    req.send()
    req.onreadystatechange = () => {
        if(req.readyState == 4 && req.status == 200){
            const result = JSON.parse(req.response)
            result.forEach(report => {
                if(report.postId == postId && report.reporter == username){
                    reportButton.disabled = true
                    reportButton.title = "Already reported"
                }
            })
        }
    }
}

//Handles login and registration stuff
var loginB = false
function LoginF(){
    if(!loggenIn){
        if(!loginB){
            loginB = true
    
            const confirmLoginButton = document.createElement("button")
            const cancelLoginButton = document.createElement("button")
            const loginRegisterP = document.createElement("p")
            const usernameInput = document.createElement("input")
            const passwordInput = document.createElement("input")
    
            loginButton.innerText = "Register"
            confirmLoginButton.id = "confirmLoginButton"
            confirmLoginButton.innerText = "Login"
            cancelLoginButton.id = "cancelLoginButton"
            cancelLoginButton.innerText = "Cancel"
            loginRegisterP.id = "loginRegisterP"
            loginRegisterP.innerText = "Login: "
            loginRegisterP.style.display = "inline"
            usernameInput.id = "usernameInput"
            usernameInput.placeholder = "Username"
            passwordInput.id = "passwordInput"
            passwordInput.placeholder = "Password"
            passwordInput.type = "password"
    
            confirmLoginButton.addEventListener("click", function(){
                if(confirmLoginButton.innerText == "Login"){
                    Login(usernameInput.value, passwordInput.value)
                }
                else{
                    Register(usernameInput.value, passwordInput.value)
                }
            })
    
            cancelLoginButton.addEventListener("click", function(){
                header.removeChild(loginRegisterP)
                header.removeChild(usernameInput)
                header.removeChild(passwordInput)
                header.removeChild(confirmLoginButton)
                header.removeChild(cancelLoginButton)
                loginButton.innerText = "Login"
                loginB = false
            })
    
            header.appendChild(loginRegisterP)
            header.appendChild(usernameInput)
            header.appendChild(passwordInput)
            header.appendChild(confirmLoginButton)
            header.appendChild(cancelLoginButton)
        }
        else{
            if(loginButton.innerText == "Register"){
                loginButton.innerText = "Login"
                loginRegisterP.innerText = "Register: "
                confirmLoginButton.innerText = "Register"
            }
            else{
                loginButton.innerText = "Register"
                loginRegisterP.innerText = "Login: "
                confirmLoginButton.innerText = "Login"
            }
        }
    }
    else{
        Logout()
    }
}

//Checks if a user is logged in
var loggenIn = false
function CheckLogin(){
    token = sessionStorage.getItem("token")
    if(token){
        loggenIn = true
        loginButton.innerText = "Logout"
    }
    else{
        loggenIn = false
        userPostsButton.disabled = true
        userPostsButton.title = "You need to be logged in to do that"
    }
}

//Clears previous token from session storage and reloads the page
function Logout(){
    sessionStorage.clear()
    window.location.reload()
}

//Checks if a user is logged in and loads the posts on page load
window.onload = () => {
    CheckLogin()
    GetPosts()
}
