const mongoose = require('mongoose')

const ConsultaSchema = new mongoose.Schema(
    {
        input: {
            type: String,
            trim: true,
            required: true
        },
        response: {
            type: Array,
            items: {
                type: Object,
                required: true,
                properties: {
                    text: {
                        type: String,
                        trim: true,
                        required:true
                    },
                    ref: {
                        type: String,
                        trim: true,
                        required:true
                    },
                    url: {
                        type: String,
                        trim: true,
                        required: true
                    }, 
                    cod: {
                        type: String,
                        trim: true,
                        required: true
                    }
                }
            }
        },
        ip: {
            type: String,
            trim: true,
            required: false
        }
    },
    {
        timestamps: true
    }
)

module.exports = mongoose.model("consulta", ConsultaSchema )