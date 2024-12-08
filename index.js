const express = require("express");
const app = express();
const mongoose = require("mongoose");
const path = require("path");
const Chat = require("./models/chat.js");
const methodOverride = require("method-override");
const ExpressError = require("./ExpressError")

app.set("views", path.join(__dirname, "views"));
app.set("view engine", "ejs");
app.use(express.static(path.join(__dirname, "public")));
app.use(express.urlencoded({extended: true}));
app.use(methodOverride("_method"));

main().then( res => {
    console.log("Connection is successful")
}).catch(err => 
    console.log(err)
);

async function main() {
  await mongoose.connect('mongodb://127.0.0.1:27017/fakewhatsapp');
}

// const chat1 = new Chat({
//     from: "maaz",
//     to: "abdullah",
//     msg: "Send me your phone number",
//     created_at: new Date()
// });

// chat1.save().then( res => {
//     console.log(res);
// }).catch( err => {
//     console.log(err);
// })

//index Route
app.get("/chats", asyncWrap(async (req, res, next) => {
    
        let chats = await Chat.find();
        // console.log(chats);
        res.render("index.ejs", {chats});
}));

//New Route
app.get("/chats/new", (req, res) => {
    // throw new ExpressError(404, "page not found");
    res.render("new.ejs");
})

//Create Route
app.post("/chats", asyncWrap(async (req, res, next) => {
    
        let {from, msg, to} = req.body;
        let newChat = new Chat({
        from: from,
        to: to,
        msg: msg,
        created_at: new Date()
        });
        await newChat.save();
        res.redirect("/chats");
   
}));

//To hadle all the error
function asyncWrap(fn) {
    return function(req, res, next) {
        fn(req, res, next).catch( err => {
            next(err);
        })
    }
}

//NEW - show Route
app.get("/chats/:id", asyncWrap(async (req, res, next) => {
    
        let {id} = req.params;
        let chat = await Chat.findById(id);
        if(!chat) {
           next(new ExpressError(404, "Chat not found"));
        }
        res.render("edit.ejs", {chat});
    
}));

//edit Route
app.get("/chats/:id/edit", asyncWrap(async (req, res, next) => {
    
        let{id} = req.params;
        let chat = await Chat.findById(id);
        res.render("edit.ejs", {chat});
   
}));

//update Route
app.put("/chats/:id", asyncWrap(async (req, res, next) => {
   
        let{id} = req.params;
        let{msg: newMsg} = req.body;
        let updatedChat = await Chat.findByIdAndUpdate(id, {msg: newMsg}, {runValidators: true, new: true});
        // console.log(updatedChat);
        res.redirect("/chats");
   
}));

//Delete Route
app.delete("/chats/:id", asyncWrap(async (req, res, next) => {
   
        let{id} = req.params;
        let deleteChat = await Chat.findByIdAndDelete(id);
        console.log(deleteChat);
        res.redirect("/chats");
}));

app.get("/", (req, res) => {
    res.send("working");
})

const handleValidationErr = (err) => {
    console.log("This was a validation error. Please follow rules");
    console.dir(err.message);
    return err;
}

//To print the name 
app.use((err, req, res, next) => {
    console.log(err.name);
    if (err.name === "ValidationError") {
        err = handleValidationErr(err);
    }
    next(err);
});

//Error handling middleware
app.use((err, req, res, next) => {
    let {status = 500, message = "Some error Occured"} = err;
    res.status(status).send(message);
})

app.listen(8080, () => {
    console.log("server is listening on port 8080");
});