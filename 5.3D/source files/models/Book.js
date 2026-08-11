const mongoose = require("mongoose");

const bookSchema = new mongoose.Schema({
    id: { type: String, required: true },
    title: { type: String, required: true },
    author: { type: String, required: true },
    year: { type: Number, required: true },
    genre: { type: String, required: true },
    summary: { type: String, required: true },
    price: { type: mongoose.Types.Decimal128, required: true, get: v => v?.toString() }
}
    ,
    {
        toJSON: { getters: true, virtuals: false, transform(_doc, ret) { delete ret.__v; return ret; } },
        toObject: { getters: true, virtuals: false }
    });

module.exports = mongoose.model('Book', bookSchema);
