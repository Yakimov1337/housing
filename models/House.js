const { Schema, model } = require('mongoose');

const schema = new Schema({
    //TODO adapt parameters to project requirements
    name: { type: String, required: [true, "Name is required"], minlength: [6, "Min name length must be at least 6 chars long!"] },
    type: { type: String, required: true, enum: ["Apartment", "Villa", "House"] },
    year: { type: Number, required: [true, "Year is required"], min: 1850, max: 2021 },
    city: { type: String, required: true, minlength: 4 },
    homeImage: { type: String, required: true, match: [/^https?:\/\//, 'Image must be a valid url!'] },
    propertyDescription: { type: String, required: true, maxlength: 60 },
    availablePieces: { type: Number, required: true, min: 0, max: 10 },
    rentedHome: [{ type: Schema.Types.ObjectId, ref: 'User', default: [] }],
    owner: { type: Schema.Types.ObjectId, required: true, ref: 'User' },
    createdAt: {type: Date, default: Date.now}
});


module.exports = model('House', schema);
