const mongoose = require('mongoose')

const capterAcfSchema = new mongoose.Schema(
    {
        cod: {
            type: String,
            required: true
        },
        name: {
            type: String,
            required: true
        },
    },
    {
        timestamps: false
    }
)

module.exports = mongoose.model("capterAcf", capterAcfSchema)