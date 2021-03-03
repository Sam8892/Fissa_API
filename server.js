 //import mongoose
const mongoose = require('mongoose');

//establish connection to database
mongoose.connect(
    'mongodb+srv://<username>:<password>@cluster0.eetsx.mongodb.net/<dbname>',
    { useFindAndModify: false, useUnifiedTopology: true, useNewUrlParser: true, useCreateIndex: true},
    (err) => {
        if (err) return console.log("Error: ", err);
        console.log("MongoDB Connection -- Ready state is:", mongoose.connection.readyState);
    }
);