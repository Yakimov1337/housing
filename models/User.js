const { Schema, model } = require('mongoose');

const schema = new Schema ({
    //TODO adapt parameters to project requirements
    name: { type: String, required: true},
    username: { type: String, required: true},
    hashedPassword: { type: String, required: true}
})

module.exports = model('User',schema);