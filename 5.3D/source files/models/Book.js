const mongoose = require("mongoose");

const CURRENT_YEAR = new Date().getFullYear();

const bookSchema = new mongoose.Schema({
    id: { type: String, required: true, unique: true, minlength: 1},
    title: { type: String, required: true,
        minlength: 1
     },
    author: { type: String, required: true, minlength: 1 },
    year: { type: Number, required: true, max:  CURRENT_YEAR+1 },
    genre: { type: String, required: true, minlength: 1 },
    summary: { type: String, required: true, minlength: 1, maxlength: 1000 },
    price: { type: mongoose.Types.Decimal128, required: true, get: v => v?.toString(),
        validate: {
            validator: function (value) {
                if (!value) {
                    return false;
                }
                const num = parseFloat(value.toString());
                return !isNaN(num) && num > 0;
            },
            message: props => 'Price must be a valid positive number'
        }
     }
}
    ,
    {
        toJSON: { getters: true, virtuals: false, transform(_doc, ret) { delete ret.__v; return ret; } },
        toObject: { getters: true, virtuals: false },
        strict: 'throw'
    });

module.exports = mongoose.model('Book', bookSchema);
