import React, { useEffect, useState, useContext } from 'react';
import API from '../api/api';
import { AuthContext } from '../context/AuthContext';
import DefaultAvatar from '../components/DefaultAvatar';
import './Feed.css';
import { useNavigate } from 'react-router-dom';

const emojiList = ['😀','😂','😍','😎','😢','😡','��','🙏','🎉','🔥'];

const Feed = () => {
  const { user } = useContext(AuthContext);
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [content, setContent] = useState('');
  const [image, setImage] = useState('');
  const [error, setError] = useState('');
  const [commentContent, setCommentContent] = useState({});
  const [commentError, setCommentError] = useState({});
  const [showComments, setShowComments] = useState({});
  const [comments, setComments] = useState({});
  const reactionTypes = [
    { key: 'like', label: 'Like', emoji: '👍' },
    { key: 'love', label: 'Love', emoji: '❤️' },
    { key: 'cheer', label: 'Cheer', emoji: '🎉' },
    { key: 'wow', label: 'Wow', emoji: '😮' },
  ];
  const [reactions, setReactions] = useState({}); // { postId: { like: 0, love: 0, cheer: 0, wow: 0 } }
  const [search, setSearch] = useState('');
  const [memeReactions, setMemeReactions] = useState({}); // { memeIdx: { like: 0, love: 0, cheer: 0, wow: 0 } }

  const memes = [
    { url: 'https://i.imgflip.com/30b1gx.jpg', alt: 'Drake Hotline Bling' },
    { url: 'https://i.imgflip.com/26am.jpg', alt: 'Distracted Boyfriend' },
    { url: 'https://i.imgflip.com/1ur9b0.jpg', alt: 'One Does Not Simply' },
    { url: 'https://i.imgflip.com/3si4.jpg', alt: 'Batman Slapping Robin' },
    { url: 'https://i.imgflip.com/9ehk.jpg', alt: 'Matrix Morpheus' },
    { url: 'https://i.imgflip.com/39t1o.jpg', alt: 'Ancient Aliens' },
    { url: 'https://i.imgflip.com/2wifvo.jpg', alt: 'Expanding Brain' },
    { url: 'https://i.imgflip.com/1otk96.jpg', alt: 'Left Exit 12 Off Ramp' },
    { url: 'https://i.imgflip.com/4acd7j.png', alt: 'Woman Yelling at Cat' },
    { url: 'https://i.imgflip.com/2fm6x.jpg', alt: 'Gru’s Plan' },
    { url: 'https://i.imgflip.com/1g8my4.jpg', alt: 'Mocking SpongeBob' },
    { url: 'https://i.imgflip.com/4t0m5.jpg', alt: 'Change My Mind' }
  ];
  const suggestions = [
    { name: 'Shah Rukh Khan', avatar: 'https://upload.wikimedia.org/wikipedia/commons/2/2e/Shah_Rukh_Khan_grace_the_launch_of_the_new_Santro.jpg' },
    { name: 'Priyanka Chopra', avatar: 'https://upload.wikimedia.org/wikipedia/commons/3/3e/Priyanka_Chopra_2018.jpg' },
    { name: 'Tom Cruise', avatar: 'https://upload.wikimedia.org/wikipedia/commons/0/0c/Tom_Cruise_by_Gage_Skidmore_2.jpg' },
    { name: 'Taylor Swift', avatar: 'https://upload.wikimedia.org/wikipedia/commons/f/f2/Taylor_Swift_Red_Tour_5%2C_2013.jpg' },
    { name: 'NASA', avatar: 'https://upload.wikimedia.org/wikipedia/commons/e/e5/NASA_logo.svg' },
    { name: 'Virat Kohli', avatar: 'https://upload.wikimedia.org/wikipedia/commons/1/1e/Virat_Kohli_2018.jpg' },
    { name: 'Cristiano Ronaldo', avatar: 'https://upload.wikimedia.org/wikipedia/commons/8/8c/Cristiano_Ronaldo_2018.jpg' },
    { name: 'Selena Gomez', avatar: 'https://upload.wikimedia.org/wikipedia/commons/6/6d/Selena_Gomez_at_2019_American_Music_Awards.png' },
    { name: 'Amitabh Bachchan', avatar: 'https://upload.wikimedia.org/wikipedia/commons/6/6e/Amitabh_Bachchan_KBC_2017.jpg' },
    { name: 'Billie Eilish', avatar: 'https://upload.wikimedia.org/wikipedia/commons/6/6e/Billie_Eilish_2019.jpg' },
    { name: 'Marvel', avatar: 'https://upload.wikimedia.org/wikipedia/commons/0/0c/MarvelLogo.svg' },
    { name: 'FC Barcelona', avatar: 'https://upload.wikimedia.org/wikipedia/commons/4/47/FC_Barcelona_%28crest%29.svg' },
    { name: 'Oprah Winfrey', avatar: 'https://upload.wikimedia.org/wikipedia/commons/8/8f/Oprah_in_2014.jpg' },
    { name: 'Sachin Tendulkar', avatar: 'https://upload.wikimedia.org/wikipedia/commons/2/25/Sachin_Tendulkar_at_MRF_Promotion_Event.jpg' },
  ];
  const [following, setFollowing] = useState({}); // { name: true/false }
  const handleFollow = name => setFollowing(prev => ({ ...prev, [name]: !prev[name] }));
  const navigate = useNavigate();

  useEffect(() => {
    const fetchPosts = async () => {
      try {
        const res = await API.get('/posts');
        setPosts(res.data);
      } catch (err) {
        // handle error
      } finally {
        setLoading(false);
      }
    };
    fetchPosts();
  }, []);

  const handlePost = async (e) => {
    e.preventDefault();
    if (!content.trim()) return;
    try {
      const res = await API.post('/posts', { content, image });
      setPosts([res.data, ...posts]);
      setContent('');
      setImage('');
      setError('');
    } catch (err) {
      setError('Failed to create post');
    }
  };

  const handleComment = async (e, postId) => {
    e.preventDefault();
    if (!commentContent[postId]?.trim()) return;
    try {
      const res = await API.post(`/comments/${postId}`, { content: commentContent[postId] });
      setComments(prev => ({
        ...prev,
        [postId]: [...(prev[postId] || []), res.data]
      }));
      setCommentContent(prev => ({ ...prev, [postId]: '' }));
      setCommentError(prev => ({ ...prev, [postId]: '' }));
    } catch (err) {
      setCommentError(prev => ({ ...prev, [postId]: 'Failed to add comment' }));
    }
  };

  const fetchComments = async (postId) => {
    try {
      const res = await API.get(`/comments/${postId}`);
      setComments(prev => ({ ...prev, [postId]: res.data }));
    } catch (err) {
      setComments(prev => ({ ...prev, [postId]: [] }));
    }
  };

  const toggleComments = (postId) => {
    setShowComments(prev => ({ ...prev, [postId]: !prev[postId] }));
    if (!comments[postId]) fetchComments(postId);
  };

  const handleLike = async (postId, liked) => {
    try {
      if (liked) {
        const res = await API.post(`/posts/${postId}/unlike`);
        setPosts(posts => posts.map(p => p._id === postId ? { ...p, likes: p.likes.filter(uid => uid !== user.id) } : p));
      } else {
        const res = await API.post(`/posts/${postId}/like`);
        setPosts(posts => posts.map(p => p._id === postId ? { ...p, likes: [...(p.likes || []), user.id] } : p));
      }
    } catch {}
  };

  const handleReaction = (postId, type) => {
    setReactions(prev => ({
      ...prev,
      [postId]: {
        ...((prev[postId]) || {}),
        [type]: ((prev[postId]?.[type] || 0) + 1)
      }
    }));
  };

  const handleMemeReaction = (idx, type) => {
    setMemeReactions(prev => ({
      ...prev,
      [idx]: {
        ...((prev[idx]) || {}),
        [type]: ((prev[idx]?.[type] || 0) + 1)
      }
    }));
  };

  const stories = [
    { name: 'You', avatar: user?.avatar || '', isUser: true },
    { name: 'Shah Rukh', avatar: 'https://upload.wikimedia.org/wikipedia/commons/2/2e/Shah_Rukh_Khan_grace_the_launch_of_the_new_Santro.jpg' },
    { name: 'Priyanka', avatar: 'https://upload.wikimedia.org/wikipedia/commons/3/3e/Priyanka_Chopra_2018.jpg' },
    { name: 'Tom', avatar: 'https://upload.wikimedia.org/wikipedia/commons/0/0c/Tom_Cruise_by_Gage_Skidmore_2.jpg' },
    { name: 'Taylor', avatar: 'https://upload.wikimedia.org/wikipedia/commons/f/f2/Taylor_Swift_Red_Tour_5%2C_2013.jpg' },
    { name: 'NASA', avatar: 'https://upload.wikimedia.org/wikipedia/commons/e/e5/NASA_logo.svg' },
  ];

  // Demo Instagram-style posts for celebs
  const celebPosts = [
    { author: 'Shah Rukh Khan', avatar: 'https://upload.wikimedia.org/wikipedia/commons/2/2e/Shah_Rukh_Khan_grace_the_launch_of_the_new_Santro.jpg', content: 'On set for a new movie.', image: 'https://upload.wikimedia.org/wikipedia/commons/2/2e/Shah_Rukh_Khan_grace_the_launch_of_the_new_Santro.jpg', time: '2h ago' },
    { author: 'Priyanka Chopra', avatar: 'https://upload.wikimedia.org/wikipedia/commons/3/3e/Priyanka_Chopra_2018.jpg', content: 'At the awards night.', image: 'https://upload.wikimedia.org/wikipedia/commons/3/3e/Priyanka_Chopra_2018.jpg', time: '3h ago' },
    { author: 'Tom Cruise', avatar: 'https://upload.wikimedia.org/wikipedia/commons/0/0c/Tom_Cruise_by_Gage_Skidmore_2.jpg', content: 'Mission accomplished.', image: 'https://upload.wikimedia.org/wikipedia/commons/0/0c/Tom_Cruise_by_Gage_Skidmore_2.jpg', time: '1h ago' },
    { author: 'NASA', avatar: 'https://upload.wikimedia.org/wikipedia/commons/e/e5/NASA_logo.svg', content: 'James Webb Space Telescope captures new galaxy.', image: 'https://www.nasa.gov/sites/default/files/thumbnails/image/webb_first_deep_field.png', time: '5h ago' },
    { author: 'Marvel', avatar: 'https://upload.wikimedia.org/wikipedia/commons/0/0c/MarvelLogo.svg', content: 'New Avengers movie announced!', image: 'https://upload.wikimedia.org/wikipedia/commons/0/0c/MarvelLogo.svg', time: '6h ago' },
    { author: 'Virat Kohli', avatar: 'https://upload.wikimedia.org/wikipedia/commons/1/1e/Virat_Kohli_2018.jpg', content: 'Victory selfie after the match!', image: 'https://upload.wikimedia.org/wikipedia/commons/1/1e/Virat_Kohli_2018.jpg', time: '4h ago' },
    { author: 'Selena Gomez', avatar: 'https://upload.wikimedia.org/wikipedia/commons/6/6d/Selena_Gomez_at_2019_American_Music_Awards.png', content: 'Backstage at the AMAs.', image: 'https://upload.wikimedia.org/wikipedia/commons/6/6d/Selena_Gomez_at_2019_American_Music_Awards.png', time: '7h ago' },
    { author: 'Amitabh Bachchan', avatar: 'https://upload.wikimedia.org/wikipedia/commons/6/6e/Amitabh_Bachchan_KBC_2017.jpg', content: 'On the set of KBC.', image: 'https://upload.wikimedia.org/wikipedia/commons/6/6e/Amitabh_Bachchan_KBC_2017.jpg', time: '8h ago' },
    { author: 'Billie Eilish', avatar: 'https://upload.wikimedia.org/wikipedia/commons/6/6e/Billie_Eilish_2019.jpg', content: 'Live at the concert!', image: 'https://upload.wikimedia.org/wikipedia/commons/6/6e/Billie_Eilish_2019.jpg', time: '9h ago' },
    { author: 'FC Barcelona', avatar: 'https://upload.wikimedia.org/wikipedia/commons/4/47/FC_Barcelona_%28crest%29.svg', content: 'Celebrating the win!', image: 'https://upload.wikimedia.org/wikipedia/commons/4/47/FC_Barcelona_%28crest%29.svg', time: '10h ago' },
  ];

  const filteredSuggestions = suggestions.filter(s =>
    s.name.toLowerCase().includes(search.toLowerCase())
  );
  const filteredPosts = posts.filter(post =>
    post.content.toLowerCase().includes(search.toLowerCase()) ||
    post.author.username.toLowerCase().includes(search.toLowerCase())
  );

  if (loading) return (
    <div className="feed-skeleton" role="status" aria-live="polite">
      <div className="skeleton-post-form">
        <div className="skeleton skeleton-textarea"></div>
        <div className="skeleton skeleton-input"></div>
        <div className="skeleton skeleton-btn"></div>
      </div>
      {[...Array(3)].map((_, i) => (
        <div className="skeleton-post-card" key={i}>
          <div className="skeleton skeleton-avatar"></div>
          <div className="skeleton skeleton-line short"></div>
          <div className="skeleton skeleton-line"></div>
          <div className="skeleton skeleton-image"></div>
        </div>
      ))}
    </div>
  );

  return (
    <div className="feed-container">
      <div className="feed-search-bar">
        <input
          type="text"
          placeholder="Search celebrities, users, or posts..."
          value={search}
          onChange={e => setSearch(e.target.value)}
        />
      </div>
      <h2>Feed</h2>
      {/* Trending Memes Section */}
      <div className="trending-memes-section">
        <h3>🔥 Trending Memes</h3>
        <div className="trending-memes-list">
          {memes.map((meme, idx) => (
            <div key={meme.url} className="post-card meme-card">
              <div className="post-header">
                <DefaultAvatar size={40} />
                <div>
                  <b>Trending Meme</b>
                  <div className="post-time">Now</div>
                </div>
              </div>
              <div className="post-content">{meme.alt}</div>
              <img src={meme.url} alt={meme.alt} className="post-image" />
              <div className="post-actions">
                {reactionTypes.map(rt => (
                  <button
                    key={rt.key}
                    className={`reaction-btn reaction-${rt.key}`}
                    type="button"
                    onClick={() => handleMemeReaction(idx, rt.key)}
                    aria-label={rt.label}
                  >
                    {rt.emoji} {rt.label} {memeReactions[idx]?.[rt.key] ? memeReactions[idx][rt.key] : 0}
                  </button>
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>
      <div className="stories-bar">
        {stories.map(story => (
          <div key={story.name} className={`story-ring${story.isUser ? ' your-story' : ''}`}>
            <img src={story.avatar || 'https://ui-avatars.com/api/?name=' + encodeURIComponent(story.name)} alt={story.name} className="story-avatar" onError={e => { e.target.onerror = null; e.target.src = 'https://ui-avatars.com/api/?name=' + encodeURIComponent(story.name); }} />
            <div className="story-name">{story.name}</div>
          </div>
        ))}
      </div>
      <div className="memes-section">
        <h4>Trending Memes</h4>
        <div className="memes-scroll">
          {memes.map(meme => (
            <img key={meme.url} src={meme.url} alt={meme.alt} className="meme-img" />
          ))}
        </div>
      </div>
      <div className="suggested-section">
        <h4>Suggested for You</h4>
        <div className="suggested-list">
          {filteredSuggestions.map(s => (
            <div key={s.name} className="suggested-card" onClick={() => navigate(`/profile/${encodeURIComponent(s.name)}`)} style={{ cursor: 'pointer' }}>
              <img src={s.avatar} alt={s.name} className="suggested-avatar" onError={e => { e.target.onerror = null; e.target.src = 'https://ui-avatars.com/api/?name=' + encodeURIComponent(s.name); }} />
              <div className="suggested-info">
                <div className="suggested-name">{s.name.split(new RegExp(`(${search})`, 'gi')).map((part, i) => part.toLowerCase() === search.toLowerCase() && search ? <mark key={i}>{part}</mark> : part)}</div>
              </div>
              <button className="follow-btn" onClick={e => { e.stopPropagation(); handleFollow(s.name); }}>
                {following[s.name] ? 'Following' : 'Follow'}
              </button>
            </div>
          ))}
        </div>
      </div>
      {user && (
        <form className="post-form" onSubmit={handlePost}>
          <div className="post-form-textarea-wrapper">
            <textarea
              placeholder="What's on your mind?"
              value={content}
              onChange={e => setContent(e.target.value)}
              required
            />
            <button
              type="button"
              className="emoji-btn"
              tabIndex={0}
              aria-label="Add emoji"
              onClick={e => {
                e.preventDefault();
                const emoji = prompt('Pick an emoji to insert:\n' + emojiList.join(' '));
                if (emoji && emojiList.includes(emoji)) setContent(content + emoji);
              }}
            >😊</button>
          </div>
          <input
            type="text"
            placeholder="Image URL (optional)"
            value={image}
            onChange={e => setImage(e.target.value)}
          />
          {image && (
            <div className="image-preview">
              <img src={image} alt="Preview" onError={e => e.target.style.display='none'} />
            </div>
          )}
          <button type="submit">Post</button>
          {error && <span className="post-error">{error}</span>}
        </form>
      )}
      {search
        ? filteredPosts.map(post => (
            <div key={post._id} className="post-card">
              {post._id === posts[0]._id && (
                <div className="spotlight-badge" title="Spotlight Post">🌟 Spotlight</div>
              )}
              <div className="post-header">
                {post.author.avatar ? (
                  <img src={post.author.avatar} alt="avatar" className="post-avatar" />
                ) : (
                  <DefaultAvatar size={40} />
                )}
                <div>
                  <b>{post.author.username.split(new RegExp(`(${search})`, 'gi')).map((part, i) => part.toLowerCase() === search.toLowerCase() && search ? <mark key={i}>{part}</mark> : part)}</b>
                  <div className="post-time">{new Date(post.createdAt).toLocaleString()}</div>
                </div>
              </div>
              <div className="post-content">{post.content.split(new RegExp(`(${search})`, 'gi')).map((part, i) => part.toLowerCase() === search.toLowerCase() && search ? <mark key={i}>{part}</mark> : part)}</div>
              {post.image && <img src={post.image} alt="post" className="post-image" />}
              <div className="post-actions">
                {reactionTypes.map(rt => (
                  <button
                    key={rt.key}
                    className={`reaction-btn reaction-${rt.key}`}
                    type="button"
                    onClick={() => handleReaction(post._id, rt.key)}
                    aria-label={rt.label}
                  >
                    {rt.emoji} {rt.label} {reactions[post._id]?.[rt.key] ? reactions[post._id][rt.key] : 0}
                  </button>
                ))}
                <button className="comment-btn" onClick={() => toggleComments(post._id)}>
                  💬 {showComments[post._id] ? 'Hide' : 'Show'} Comments
                </button>
              </div>
              {showComments[post._id] && (
                <div className="comments-section">
                  {comments[post._id] ? (
                    comments[post._id].length === 0 ? (
                      <div className="no-comments">
                        <svg width="32" height="32" viewBox="0 0 32 32" aria-hidden="true" focusable="false" className="empty-icon"><circle cx="16" cy="16" r="15" fill="#f0f4fa"/><path d="M10 22c0-3.314 2.686-6 6-6s6 2.686 6 6" stroke="#2575fc" strokeWidth="1.5" fill="none"/><circle cx="13" cy="14" r="1.2" fill="#2575fc"/><circle cx="19" cy="14" r="1.2" fill="#2575fc"/></svg>
                        <span>No comments yet.</span>
                      </div>
                    ) : (
                      comments[post._id].map(comment => (
                        <div key={comment._id} className="comment">
                          {comment.author.avatar ? (
                            <img src={comment.author.avatar} alt="avatar" className="comment-avatar" />
                          ) : (
                            <DefaultAvatar size={28} />
                          )}
                          <div>
                            <b>{comment.author.username}</b> <span className="comment-time">{new Date(comment.createdAt).toLocaleString()}</span>
                            <div>{comment.content}</div>
                          </div>
                        </div>
                      ))
                    )
                  ) : (
                    <div>Loading comments...</div>
                  )}
                  {user && (
                    <form className="comment-form" onSubmit={e => handleComment(e, post._id)}>
                      <input
                        type="text"
                        placeholder="Add a comment..."
                        value={commentContent[post._id] || ''}
                        onChange={e => setCommentContent(prev => ({ ...prev, [post._id]: e.target.value }))}
                        required
                      />
                      <button type="submit">Comment</button>
                    </form>
                  )}
                  {commentError[post._id] && <div className="comment-error">{commentError[post._id]}</div>}
                </div>
              )}
            </div>
          ))
        : posts.map(post => (
            <div key={post._id} className="post-card">
              {post._id === posts[0]._id && (
                <div className="spotlight-badge" title="Spotlight Post">🌟 Spotlight</div>
              )}
              <div className="post-header">
                {post.author.avatar ? (
                  <img src={post.author.avatar} alt="avatar" className="post-avatar" />
                ) : (
                  <DefaultAvatar size={40} />
                )}
                <div>
                  <b>{post.author.username}</b>
                  <div className="post-time">{new Date(post.createdAt).toLocaleString()}</div>
                </div>
              </div>
              <div className="post-content">{post.content}</div>
              {post.image && <img src={post.image} alt="post" className="post-image" />}
              <div className="post-actions">
                {reactionTypes.map(rt => (
                  <button
                    key={rt.key}
                    className={`reaction-btn reaction-${rt.key}`}
                    type="button"
                    onClick={() => handleReaction(post._id, rt.key)}
                    aria-label={rt.label}
                  >
                    {rt.emoji} {rt.label} {reactions[post._id]?.[rt.key] ? reactions[post._id][rt.key] : 0}
                  </button>
                ))}
                <button className="comment-btn" onClick={() => toggleComments(post._id)}>
                  💬 {showComments[post._id] ? 'Hide' : 'Show'} Comments
                </button>
              </div>
              {showComments[post._id] && (
                <div className="comments-section">
                  {comments[post._id] ? (
                    comments[post._id].length === 0 ? (
                      <div className="no-comments">
                        <svg width="32" height="32" viewBox="0 0 32 32" aria-hidden="true" focusable="false" className="empty-icon"><circle cx="16" cy="16" r="15" fill="#f0f4fa"/><path d="M10 22c0-3.314 2.686-6 6-6s6 2.686 6 6" stroke="#2575fc" strokeWidth="1.5" fill="none"/><circle cx="13" cy="14" r="1.2" fill="#2575fc"/><circle cx="19" cy="14" r="1.2" fill="#2575fc"/></svg>
                      <span>No comments yet.</span>
                    </div>
                  ) : (
                    comments[post._id].map(comment => (
                      <div key={comment._id} className="comment">
                        {comment.author.avatar ? (
                          <img src={comment.author.avatar} alt="avatar" className="comment-avatar" />
                        ) : (
                          <DefaultAvatar size={28} />
                        )}
                        <div>
                          <b>{comment.author.username}</b> <span className="comment-time">{new Date(comment.createdAt).toLocaleString()}</span>
                          <div>{comment.content}</div>
                        </div>
                      </div>
                    ))
                  )
                ) : (
                  <div>Loading comments...</div>
                )}
                {user && (
                  <form className="comment-form" onSubmit={e => handleComment(e, post._id)}>
                    <input
                      type="text"
                      placeholder="Add a comment..."
                      value={commentContent[post._id] || ''}
                      onChange={e => setCommentContent(prev => ({ ...prev, [post._id]: e.target.value }))}
                      required
                    />
                    <button type="submit">Comment</button>
                  </form>
                )}
                {commentError[post._id] && <div className="comment-error">{commentError[post._id]}</div>}
              </div>
            )}
          </div>
        ))}
      {/* Show celeb posts if search matches */}
      {search && celebPosts.filter(p => p.author.toLowerCase().includes(search.toLowerCase())).map((post, idx) => (
        <div key={post.author + idx} className="post-card">
          <div className="post-header">
            <img src={post.avatar} alt={post.author} className="post-avatar" />
            <div>
              <b>{post.author}</b>
              <div className="post-time">{post.time}</div>
            </div>
          </div>
          <div className="post-content">{post.content}</div>
          {post.image && <img src={post.image} alt="post" className="post-image" />}
        </div>
      ))}
    </div>
  );
};

export default Feed; 