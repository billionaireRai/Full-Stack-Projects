const mongoose = require('mongoose');

const foodSchema = new mongoose.Schema({
    Name: { type: String, required: true, default: 'Food_Name' },
    Description: { type: String, required: true, default: 'FoodDescription' },
    Category: { type: String, required: true, default: 'Food-Category' },
    Price: { type: Number, required: true, default: 0 },
    Image_Url: { type: String, required: true, default: 'Food-image-url' },
    Preparation_time: { type: String, required: true, default: 'Food-prep-time' },
    Restaurant_name: { type: String, required: true, default: 'Restaurant_name' },
    Availability_status: { type: String, required: true, default: 'Unavailable' },
    Dietary_information: { type: String, required: true, default: 'Dietary_information' },
    Rating: { type: Number, required: true, default: 0.0, get: v => parseFloat(v) },
    Review: { type: String, required: true, default: 'default_review' },
    Discounts_offers: { type: String, required: true, default: 'current_offers' },
    Ingredients: { type: [String], required: true, default: [] },
    Nutritional_information: {
        Calories_per_serving: { type: mongoose.Schema.Types.Mixed, required: true, default: {} },
        fat_content: { type: mongoose.Schema.Types.Mixed, required: true, default: {} }
    },
    Spiciness_level: { type: String, required: true, default: 'Medium' } // Added default
});

const foodinfos = mongoose.model('foodinfos', foodSchema);
module.exports = foodinfos;
