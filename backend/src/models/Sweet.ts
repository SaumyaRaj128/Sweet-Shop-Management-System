import { Schema, model } from 'mongoose';

const sweetSchema = new Schema({
    name: { type: String, required: true },
    category: { type: String, required: true },
    price: { type: Number, required: true },
    quantity: { type: Number, required: true, default: 0 },
});

export const Sweet = model('Sweet', sweetSchema);
