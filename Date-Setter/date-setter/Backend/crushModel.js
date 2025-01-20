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
// [
//     {
//       name: 'Fun N Food Village (Polo Amusement Park)',
//       address: 'Fun N Food Village, Old D G Road, Kapashera Village, Kapashera, Delhi 110097, India',
//       city: 'Delhi',
//       state: 'Delhi',
//       postal_code: '110097',
//       country: 'India',
//       distance: 10122,
//       categories: [ 'Restaurant', 'Water Park', 'Bakery & Baked Goods Store' ],
//       position: { lat: 28.52413, long: 77.08361 },
//       imageURL: 'https://images.unsplash.com/photo-1611288870280-4a322b8ec7ec?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w2Nzg2OTN8MHwxfHJhbmRvbXx8fHx8fHx8fDE3MzM0NzE1MjB8&ixlib=rb-4.0.3&q=80&w=400',
//       phone: '+911125064500',
//       website: 'http://www.funnfood.com, http://www.funnfood.com/, https://www.facebook.com/343568369058139, https://www.facebook.com/FunNFoodVillage'
//     },
//     {
//       name: 'Alipore Zoological Garden (Zoo Cafe)',
//       address: 'Alipore Zoological Garden, Alipore Gargen-ST.Thomas School, Alipore, Kolkata 700027, India',
//       city: 'Kolkata',
//       state: 'West Bengal',
//       postal_code: '700027',
//       country: 'India',
//       distance: 1299827,
//       categories: [
//         'Tourist Attraction',
//         'Restaurant',
//         'Wildlife Refuge',
//         'Animal Park'
//       ],
//       position: { lat: 22.53992, long: 88.33028 },
//       imageURL: 'https://images.unsplash.com/photo-1452421822248-d4c2b47f0c81?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w2Nzg2OTN8MHwxfHJhbmRvbXx8fHx8fHx8fDE3MzM0NzE1MjB8&ixlib=rb-4.0.3&q=80&w=400',
//       phone: '+913324399391',
//       website: 'http://www.kolkatazoo.in, https://kolkatazoo.in/alipore/fee-zoo-hours.php'
//     }
//   ]
