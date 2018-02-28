import mongoose from 'mongoose';

const mongoDB = 'mongodb://127.0.0.1/sfmovies';

mongoose.connect(mongoDB);
mongoose.Promise = global.Promise;

const db = mongoose.connection;

db.on('error', console.error.bind(console, 'MongoDB connection error:'));

export default db;
