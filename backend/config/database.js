const mongoose = require("mongoose");

const connectDatabase = () => {
    mongoose.connect(process.env.MONGO_URI)
            .then((data) => {
                console.log(`Mongodb connected with server: ${data.connection.host}`)
            })
            // .catch((err) => {
            //     console.log(err)
            // })
            //catch block is removed because that exception is handled using unhandledProise Exception in server.js. Catch block is removed to make the error 'unhandled' else it has been handled using a catch block
}

module.exports = connectDatabase;