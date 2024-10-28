const mongoose = require('mongoose')

const bibliaAcfSchema = new mongoose.Schema(
    {
        cod: {
            type: String,
            required: true
        },
        value: {
            type: String,
            required: true
        },
    },
    {
        timestamps: false
    }
)

module.exports = mongoose.model("bibliaAcf", bibliaAcfSchema)