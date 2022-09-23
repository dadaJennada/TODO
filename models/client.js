const mongoose = require('mongoose')
const Note = require('./notes')

const clientSchema = new mongoose.Schema({
    mail: {
        type: String,
        required: true
    },
    username: {
        type: String,
        required: true
    },
    password: {
        type: String,
        required: true
    },
    notes: {
        type: [mongoose.Schema.Types.ObjectId],
        ref: 'Note',
    },

})

module.exports = new mongoose.model('Client', clientSchema);