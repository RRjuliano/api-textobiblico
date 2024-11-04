const mongoose = require('mongoose')

const connectDB = async ()=> {
    try {
        const conn = await mongoose.connect(process.env.MONGO_URI)
        console.log(`MongoDB connected: ${conn.connection.host}`)
    } catch (error) {
        console.log(`Error: ${error.message}`);
        process.exit(1); //1 code means exit with failure, 0 code means success
    }
}

module.exports = connectDB

/*
//connection database

main(process.env.MONGO_URI)
    .then(()=>{console.log('Connected to database')})
    .catch(()=>{console.log("Connection Failed!")})

async function main(url) {
    await mongoose.connect(url)
}
*/    
