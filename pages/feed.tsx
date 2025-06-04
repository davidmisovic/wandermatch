import { useState, useEffect } from 'react';
import { useAuthState } from 'react-firebase-hooks/auth';
import { auth, db } from '../lib/firebase';
import { useRouter } from 'next/router';
import { signOut } from 'firebase/auth';
import { collection, addDoc, serverTimestamp, query, orderBy, onSnapshot, doc, updateDoc, arrayUnion, arrayRemove, getDoc } from 'firebase/firestore';
import Image from 'next/image';

interface Post {
  id: string;
  userId: string;
  userName: string;
  userPhoto: string;
  content: string;
  imageUrl?: string;
  hashtags: string[];
  likes: string[];
  comments: Comment[];
  createdAt: any;
  location?: string;
}

interface Comment {
  id: string;
  userId: string;
  userName: string;
  content: string;
  createdAt: any;
}

export default function Feed() {
  const [user, loading] = useAuthState(auth);
  const router = useRouter();
  const [posts, setPosts] = useState<Post[]>([]);
  const [newPost, setNewPost] = useState('');
  const [showCreatePost, setShowCreatePost] = useState(false);

  useEffect(() => {
    if (!loading && !user) {
      router.push('/');
    }
  }, [user, loading, router]);

  useEffect(() => {
    if (!user) return;

    const q = query(collection(db, 'posts'), orderBy('createdAt', 'desc'));
    const unsubscribe = onSnapshot(q, (snapshot) => {
      const postsData = snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      })) as Post[];
      setPosts(postsData);
    });

    return () => unsubscribe();
  }, [user]);

  const handleCreatePost = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newPost.trim() || !user) return;

    // Extract hashtags
    const hashtags = newPost.match(/#\w+/g) || [];
    
    try {
      await addDoc(collection(db, 'posts'), {
        userId: user.uid,
        userName: user.displayName || user.email?.split('@')[0] || 'Anonymous',
        userPhoto: user.photoURL || '',
        content: newPost,
        hashtags: hashtags,
        likes: [],
        comments: [],
        createdAt: serverTimestamp(),
        location: '', // Could be filled from geolocation
      });

      setNewPost('');
      setShowCreatePost(false);
    } catch (error) {
      console.error('Error creating post:', error);
    }
  };

  const handleLike = async (postId: string, currentLikes: string[]) => {
    if (!user) return;

    const postRef = doc(db, 'posts', postId);
    const isLiked = currentLikes.includes(user.uid);

    try {
      if (isLiked) {
        await updateDoc(postRef, {
          likes: arrayRemove(user.uid)
        });
      } else {
        await updateDoc(postRef, {
          likes: arrayUnion(user.uid)
        });
      }
    } catch (error) {
      console.error('Error updating like:', error);
    }
  };

  const handleLogout = async () => {
    try {
      await signOut(auth);
      router.push('/');
    } catch (error) {
      console.error('Error signing out:', error);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  if (!user) return null;

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow-sm border-b">
        <div className="max-w-2xl mx-auto px-4 py-3 flex items-center justify-between">
          <h1 className="text-xl font-bold text-[#1F1F1F]">WanderMatch</h1>
          <div className="flex items-center gap-4">
            <button
              onClick={() => router.push('/match')}
              className="text-blue-600 hover:text-blue-800 font-medium"
            >
              Find Matches
            </button>
            <button
              onClick={() => router.push('/profile')}
              className="w-8 h-8 rounded-full overflow-hidden"
            >
              {user.photoURL ? (
                <Image
                  src={user.photoURL}
                  alt="Profile"
                  width={32}
                  height={32}
                  className="w-full h-full object-cover"
                />
              ) : (
                <div className="w-full h-full bg-gradient-to-br from-blue-400 to-purple-500 flex items-center justify-center text-white text-sm">
                  {(user.displayName || user.email || 'U')[0].toUpperCase()}
                </div>
              )}
            </button>
            <button
              onClick={handleLogout}
              className="text-red-600 hover:text-red-800 text-sm"
            >
              Logout
            </button>
          </div>
        </div>
      </header>

      <div className="max-w-2xl mx-auto px-4 py-6">
        {/* Create Post Button */}
        {!showCreatePost && (
          <div className="bg-white rounded-xl shadow-sm p-4 mb-6">
            <button
              onClick={() => setShowCreatePost(true)}
              className="w-full text-left text-gray-500 bg-gray-100 rounded-lg px-4 py-3 hover:bg-gray-200 transition-colors"
            >
              Share your travel story... ✈️
            </button>
          </div>
        )}

        {/* Create Post Form */}
        {showCreatePost && (
          <div className="bg-white rounded-xl shadow-sm p-4 mb-6">
            <form onSubmit={handleCreatePost}>
              <textarea
                value={newPost}
                onChange={(e) => setNewPost(e.target.value)}
                placeholder="What's your next adventure? Use #hashtags to connect with fellow travelers!"
                className="w-full p-3 border border-gray-200 rounded-lg resize-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                rows={4}
                maxLength={500}
              />
              <div className="flex justify-between items-center mt-3">
                <span className="text-sm text-gray-500">
                  {newPost.length}/500 characters
                </span>
                <div className="flex gap-2">
                  <button
                    type="button"
                    onClick={() => {
                      setShowCreatePost(false);
                      setNewPost('');
                    }}
                    className="px-4 py-2 text-gray-600 hover:text-gray-800"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    disabled={!newPost.trim()}
                    className="px-6 py-2 bg-gradient-to-r from-[#7B61FF] to-[#5D9FFF] text-white rounded-lg font-medium disabled:opacity-50 disabled:cursor-not-allowed hover:shadow-md transition-shadow"
                  >
                    Post
                  </button>
                </div>
              </div>
            </form>
          </div>
        )}

        {/* Posts Feed */}
        <div className="space-y-6">
          {posts.length === 0 ? (
            <div className="text-center py-12">
              <div className="text-6xl mb-4">🌍</div>
              <h2 className="text-xl font-semibold text-gray-700 mb-2">No posts yet!</h2>
              <p className="text-gray-500">Be the first to share your travel story.</p>
            </div>
          ) : (
            posts.map((post) => (
              <PostCard
                key={post.id}
                post={post}
                currentUserId={user.uid}
                onLike={handleLike}
              />
            ))
          )}
        </div>
      </div>
    </div>
  );
}

// Post Card Component
function PostCard({ 
  post, 
  currentUserId, 
  onLike 
}: { 
  post: Post; 
  currentUserId: string; 
  onLike: (postId: string, currentLikes: string[]) => void;
}) {
  const isLiked = post.likes.includes(currentUserId);
  const [showComments, setShowComments] = useState(false);

  const formatDate = (timestamp: any) => {
    if (!timestamp) return '';
    const date = timestamp.toDate ? timestamp.toDate() : new Date(timestamp);
    return date.toLocaleDateString('en-US', { 
      month: 'short', 
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  return (
    <div className="bg-white rounded-xl shadow-sm overflow-hidden">
      {/* Post Header */}
      <div className="p-4 flex items-center gap-3">
        <div className="w-10 h-10 rounded-full overflow-hidden">
          {post.userPhoto ? (
            <Image
              src={post.userPhoto}
              alt={post.userName}
              width={40}
              height={40}
              className="w-full h-full object-cover"
            />
          ) : (
            <div className="w-full h-full bg-gradient-to-br from-green-400 to-blue-500 flex items-center justify-center text-white font-semibold">
              {post.userName[0].toUpperCase()}
            </div>
          )}
        </div>
        <div className="flex-1">
          <h3 className="font-semibold text-[#1F1F1F]">{post.userName}</h3>
          <p className="text-sm text-gray-500">{formatDate(post.createdAt)}</p>
        </div>
      </div>

      {/* Post Content */}
      <div className="px-4 pb-3">
        <p className="text-[#1F1F1F] leading-relaxed whitespace-pre-wrap">
          {post.content.split(/(\s+)/).map((word, index) => {
            if (word.startsWith('#')) {
              return (
                <span key={index} className="text-blue-600 font-medium">
                  {word}
                </span>
              );
            }
            return word;
          })}
        </p>

        {post.hashtags.length > 0 && (
          <div className="flex flex-wrap gap-2 mt-3">
            {post.hashtags.map((tag, index) => (
              <span
                key={index}
                className="bg-blue-100 text-blue-800 px-2 py-1 rounded-full text-xs font-medium"
              >
                {tag}
              </span>
            ))}
          </div>
        )}
      </div>

      {/* Post Actions */}
      <div className="px-4 py-3 border-t border-gray-100">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4">
            <button
              onClick={() => onLike(post.id, post.likes)}
              className={`flex items-center gap-2 px-3 py-1 rounded-full transition-colors ${
                isLiked 
                  ? 'bg-red-100 text-red-600' 
                  : 'hover:bg-gray-100 text-gray-600'
              }`}
            >
              <span className="text-lg">{isLiked ? '❤️' : '🤍'}</span>
              <span className="text-sm font-medium">{post.likes.length}</span>
            </button>

            <button
              onClick={() => setShowComments(!showComments)}
              className="flex items-center gap-2 px-3 py-1 rounded-full hover:bg-gray-100 text-gray-600 transition-colors"
            >
              <span className="text-lg">💬</span>
              <span className="text-sm font-medium">{post.comments.length}</span>
            </button>
          </div>

          <button className="text-gray-400 hover:text-gray-600">
            <span className="text-lg">📤</span>
          </button>
        </div>

        {/* Comments Section */}
        {showComments && (
          <div className="mt-4 pt-4 border-t border-gray-100">
            <p className="text-sm text-gray-500 text-center">
              Comments feature coming soon! 💬
            </p>
          </div>
        )}
      </div>
    </div>
  );
}