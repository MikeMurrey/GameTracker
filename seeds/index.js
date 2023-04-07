const mongoose = require('mongoose');
const Game = require('../models/game');

mongoose.set('strictQuery', true);
mongoose.connect('mongodb://localhost:27017/game-tracker');

const db = mongoose.connection;
db.on('error', console.error.bind(console, 'connection error:'));
db.once('open', () => {
  console.log('Database connected');
});


const seedDB = async () => {
  await Game.deleteMany({});
  for (let i = 0; i < 30; i++) {
    const favorite = Math.random() < 0.5;
    const game = new Game({
      title: 'A Game Title: Addendum',
      image: 'https://images.unsplash.com/photo-1539716947714-3295e1074d33?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=870&q=80',
      platform: 'PlayStation 4',
      year: 2020,
      favorite,
      note: 'Lorem ipsum dolor, sit amet consectetur adipisicing elit. Ad vero nihil cupiditate suscipit dicta culpa placeat dolor! Unde earum dolorum illo necessitatibus ipsa, veritatis nisi officiis animi laborum architecto. Soluta!'
    })
    await game.save();
  }
}

seedDB().then(() => {
  mongoose.connection.close();
});