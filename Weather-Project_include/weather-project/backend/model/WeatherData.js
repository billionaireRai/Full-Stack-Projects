const mongoose = require('mongoose');

const DataSchema = new mongoose.Schema({
    city:{type:String , required:true},
    date:{type:String , required:true},    
    avgTemperature: { type: Number, required: true },
    minTemperature: { type: Number, required: true },
    maxTemperature: { type: Number, required: true },
    cloud: { type: mongoose.Schema.Types.Decimal128, required: true },
    windDegree: { type: Number, required: true },
    feelsLike: { type: Number, required: true },
    humidity: { type: Number, required: true },
    windDirection: { type: String, required: true },
    windSpeed: { type: mongoose.Schema.Types.Decimal128, required: true },
    precipitation: { type: mongoose.Schema.Types.Decimal128, required: true },
    cloudiness: { type: String, required: true }
});

const WeatherData = mongoose.model('weatherdatas', DataSchema);

module.exports = WeatherData;
