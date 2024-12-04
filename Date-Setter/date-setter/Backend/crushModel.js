const mongoose = require('mongoose');

const crushSchema = new mongoose.Schema({
    nameOfCrush: { type: String, required: true  }, // Changed to a single string
    Email: { type: String, required: true ,index:true }, // Changed to a single string
    PhoneNumber: { type: String, required: true , index:true },
    Password: { type: String, required: true, index:true },
    Location:{type:Object , default:'Some where from Earth...'},
    Insta_ID:{type:String , default:'crush@123...'},
    FaceBook_ID:{type:String , default:'crush@456...'},
    Twitter_ID:{type:String , default:'crush@789...'},
    crush_DOB:{type:Date , default:Date.now()}

},{timestamps:true});

const crushinfo = new mongoose.model('crushinfo', crushSchema);
module.exports = crushinfo ;

// final structure of returned entity...
// {
//   "message": "Hangout details successfully fetched",
//   "infoArray": [
//     {
//       "name": "Hangout Place Name 1",
//       "address": {
//         "formatted_address": "123 Example St, City, Country",
//         "cross_street": "Near Example Cross Street",
//         "postal_code": "12345",
//         "city": "City",
//         "state": "State",
//         "country": "Country"
//       },
//       "rating": 4.5,
//       "distance": 1200,
//       "category": [
//         {
//           "id": "category_id",
//           "name": "Category Name"
//         }
//       ],
//       "urls": [
//         "https://example.com/photo1.jpg",
//         "https://example.com/photo2.jpg",
//         "https://example.com/photo3.jpg",
//         "https://example.com/photo4.jpg",
//         "https://example.com/photo5.jpg"
//       ]
//     }
//     // More hangout places can follow...
//   ]
// }
