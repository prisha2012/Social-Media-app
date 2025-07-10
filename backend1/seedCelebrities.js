const mongoose = require('mongoose');
const User = require('./models/User');
const Post = require('./models/Post');
require('dotenv').config();

const celebrities = [
  {
    username: 'elonmusk',
    email: 'elon@tesla.com',
    password: 'starlink123',
    avatar: 'https://pbs.twimg.com/profile_images/1590968738358079488/IY9Gx6Ok_400x400.jpg',
    posts: [
      {
        content: 'To the moon! 🚀',
        image: 'https://media.giphy.com/media/3o7TKtnuHOHHUjR38Y/giphy.gif',
      },
      {
        content: 'Dogecoin to the stars!',
        image: 'https://cryptologos.cc/logos/dogecoin-doge-logo.png',
      },
    ],
  },
  {
    username: 'taylorswift',
    email: 'taylor@swift.com',
    password: 'eras2023',
    avatar: 'https://pbs.twimg.com/profile_images/1643364112349952000/6QK4Qw3A_400x400.jpg',
    posts: [
      {
        content: 'Loving the #ErasTour! 💖',
        image: 'https://media.giphy.com/media/3o6Zt6ML6BklcajjsA/giphy.gif',
      },
      {
        content: 'New album out now! 🎶',
        image: 'https://upload.wikimedia.org/wikipedia/en/f/f6/Taylor_Swift_-_Midnights.png',
      },
    ],
  },
  {
    username: 'cristiano',
    email: 'cr7@football.com',
    password: 'ronaldo7',
    avatar: 'https://pbs.twimg.com/profile_images/1678392041878839296/2QwQwQwQ_400x400.jpg',
    posts: [
      {
        content: 'Siiiiuuuu! ⚽️🏆',
        image: 'https://media.giphy.com/media/3o6Zt8zb1PpQ1wQWlK/giphy.gif',
      },
      {
        content: 'Training hard every day.',
        image: 'https://images.unsplash.com/photo-1517649763962-0c623066013b',
      },
    ],
  },
];

async function seed() {
  await mongoose.connect(process.env.MONGO_URI, { useNewUrlParser: true, useUnifiedTopology: true });
  for (const celeb of celebrities) {
    let user = await User.findOne({ email: celeb.email });
    if (!user) {
      user = new User({
        username: celeb.username,
        email: celeb.email,
        password: celeb.password,
        avatar: celeb.avatar,
      });
      await user.save();
    }
    for (const post of celeb.posts) {
      const exists = await Post.findOne({ author: user._id, content: post.content });
      if (!exists) {
        await new Post({
          author: user._id,
          content: post.content,
          image: post.image,
        }).save();
      }
    }
  }
  console.log('Celebrities and posts seeded!');
  process.exit();
}

seed(); 