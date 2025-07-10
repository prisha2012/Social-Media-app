import React from 'react';
import { useParams } from 'react-router-dom';
import './Profile.css';

const profiles = {
  'NASA': {
    avatar: 'https://upload.wikimedia.org/wikipedia/commons/e/e5/NASA_logo.svg',
    name: 'NASA',
    bio: 'Exploring the universe and sharing the journey.',
    followers: 10000000,
    following: 50,
    posts: 2,
    memes: [
      { image: 'https://i.imgflip.com/30b1gx.jpg', caption: 'Drake on Mars' },
      { image: 'https://i.imgflip.com/1ur9b0.jpg', caption: 'One does not simply land on Mars' },
    ]
  },
  'Marvel': {
    avatar: 'https://upload.wikimedia.org/wikipedia/commons/0/0c/MarvelLogo.svg',
    name: 'Marvel',
    bio: 'Official Marvel memes and more.',
    followers: 8000000,
    following: 30,
    posts: 2,
    memes: [
      { image: 'https://i.imgflip.com/3si4.jpg', caption: 'Batman slaps Thanos' },
      { image: 'https://i.imgflip.com/26am.jpg', caption: 'Distracted by superheroes' },
    ]
  },
  'FC Barcelona': {
    avatar: 'https://upload.wikimedia.org/wikipedia/commons/4/47/FC_Barcelona_%28crest%29.svg',
    name: 'FC Barcelona',
    bio: 'Football memes and club moments.',
    followers: 5000000,
    following: 100,
    posts: 1,
    memes: [
      { image: 'https://i.imgflip.com/9ehk.jpg', caption: 'Matrix Morpheus: Believe in Barca' },
    ]
  },
  'Shah Rukh Khan': {
    avatar: 'https://upload.wikimedia.org/wikipedia/commons/2/2e/Shah_Rukh_Khan_grace_the_launch_of_the_new_Santro.jpg',
    name: 'Shah Rukh Khan',
    bio: 'Actor. Dreamer. King of Bollywood.',
    followers: 30000000,
    following: 200,
    posts: 2,
    memes: [
      { image: 'https://upload.wikimedia.org/wikipedia/commons/2/2e/Shah_Rukh_Khan_grace_the_launch_of_the_new_Santro.jpg', caption: 'On set for a new movie.' },
      { image: 'https://i.imgur.com/8Km9tLL.jpg', caption: 'Throwback to my first film.' },
    ]
  },
  'Priyanka Chopra': {
    avatar: 'https://upload.wikimedia.org/wikipedia/commons/3/3e/Priyanka_Chopra_2018.jpg',
    name: 'Priyanka Chopra',
    bio: 'Actor, singer, producer, philanthropist.',
    followers: 25000000,
    following: 180,
    posts: 2,
    memes: [
      { image: 'https://upload.wikimedia.org/wikipedia/commons/3/3e/Priyanka_Chopra_2018.jpg', caption: 'At the awards night.' },
      { image: 'https://i.imgur.com/4M34hi2.jpg', caption: 'Behind the scenes.' },
    ]
  },
  'Tom Cruise': {
    avatar: 'https://upload.wikimedia.org/wikipedia/commons/0/0c/Tom_Cruise_by_Gage_Skidmore_2.jpg',
    name: 'Tom Cruise',
    bio: 'Actor. Producer. Adventurer.',
    followers: 20000000,
    following: 120,
    posts: 2,
    memes: [
      { image: 'https://upload.wikimedia.org/wikipedia/commons/0/0c/Tom_Cruise_by_Gage_Skidmore_2.jpg', caption: 'Mission accomplished.' },
      { image: 'https://i.imgur.com/5tj6S7Ol.jpg', caption: 'On the set of Top Gun.' },
    ]
  },
};

const PublicProfile = () => {
  const { name } = useParams();
  const profile = profiles[decodeURIComponent(name)] || {
    avatar: 'https://ui-avatars.com/api/?name=' + encodeURIComponent(name),
    name: decodeURIComponent(name),
    bio: 'No bio available.',
    memes: []
  };
  return (
    <div className="profile-container" role="main" aria-label="Public Profile Page">
      <div className="profile-card">
        <img src={profile.avatar} alt={profile.name} className="profile-avatar" />
        <div className="profile-info">
          <div className="profile-username">{profile.name}</div>
          <div className="profile-bio">{profile.bio}</div>
          <div className="profile-stats">
            <span><b>{profile.posts}</b> posts</span>
            <span><b>{profile.followers.toLocaleString()}</b> followers</span>
            <span><b>{profile.following}</b> following</span>
          </div>
        </div>
      </div>
      {profile.memes.length > 0 && (
        <div className="profile-posts">
          <h3>Posts</h3>
          <div className="profile-posts-grid">
            {profile.memes.map((meme, i) => (
              <div key={i} className="profile-post-card">
                <img src={meme.image} alt={meme.caption} className="profile-post-image" />
                <div className="profile-post-content">{meme.caption}</div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default PublicProfile; 