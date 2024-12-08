const mongoose = require("mongoose");
const Chat = require("./models/chat.js");

main().then( res => {
    console.log("Connection is successful")
}).catch(err => 
    console.log(err)
);

async function main() {
  await mongoose.connect('mongodb://127.0.0.1:27017/fakewhatsapp');
}

let allChats = [
    {
        from: "rohit",
        to: "salman",
        msg: "hey, can you speate hindi",
        created_at: new Date()
    },
    {
        from: "afroze",
      to: "sajid",
      msg: "we can do anythig together",
      created_at: new Date()
    },
    {
        from: "amaaz",
      to: "mustali",
      msg: "today i win debate competetion",
      created_at: new Date()
    },
    {
        from: "tauheed",
      to: "aheed",
      msg: "send me your class notes for maths",
      created_at: new Date()
    },
    {
        from: "vedant",
      to: "azeem",
      msg: "we are selected in SIH",
      created_at: new Date()
    }
];

Chat.insertMany(allChats);