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
    const game = new Game({
      author: '643f122e07204a7877f2e0b2',
      title: 'A Game Title: Addendum',
      images: [
        {
          url: 'https://res.cloudinary.com/dkyxbnxxo/image/upload/v1682115488/GameTracker/koxqbv34wtrbty3ghdp7.jpg',
          filename: 'GameTracker/koxqbv34wtrbty3ghdp7'
        }
      ],
      platform: 'PlayStation 4',
      year: 2020,
      note: 'Lorem ipsum dolor, sit amet consectetur adipisicing elit. Ad vero nihil cupiditate suscipit dicta culpa placeat dolor! Unde earum dolorum illo necessitatibus ipsa, veritatis nisi officiis animi laborum architecto. Soluta!'
    })
    await game.save();
  }
}

seedDB().then(() => {
  mongoose.connection.close();
});