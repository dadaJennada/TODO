const mongoose = require('mongoose')

const noteSchema = new mongoose.Schema({
    heading: {
        type: String,
        required: true,
    },
    text: {
        type: String,
    },
    time: {
        type: String,
        required: true,
    },
    date: {
        type: String,
        required: true,
    }
})

module.exports = new mongoose.model('Note', noteSchema);