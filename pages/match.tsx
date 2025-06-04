import { useState, useEffect } from 'react';
import { useAuthState } from 'react-firebase-hooks/auth';
import { auth, db } from '../lib/firebase';
import { useRouter } from 'next/router';
import { collection, getDocs, doc, getDoc, updateDoc, arrayUnion } from 'firebase/firestore';
import Image from 'next/image';

interface UserProfile {
  id: string;
  name: string;
  email: string;
  photoURL: string;
  bio: string;
  interests: string[];
  travelStyle: string;
  dreamDestinations: string[];
  age: number;
  location: string;
  matchScore?: number;
}

const TRAVEL_INTERESTS = [
  'Adventure', 'Backpacking', 'Luxury Travel', 'Cultural Tours', 'Food Tourism',
  'Beach Vacations', 'Mountain Hiking', 'City Exploration', 'Wildlife Safari',
  'Photography', 'History', 'Art & Museums', 'Nightlife', 'Wellness Retreats'
];

const TRAVEL_STYLES = [
  'Budget Traveler', 'Luxury Traveler', 'Digital Nomad', 'Weekend Warrior',
  'Long-term Explorer', 'Group Traveler', 'Solo Adventurer', 'Family Oriented'
];

export default function Match() {
  const [user, loading] = useAuthState(auth);
  const router = useRouter();
  const [currentUser, setCurrentUser] = useState<UserProfile | null>(null);
  const [matches, setMatches] = useState<UserProfile[]>([]);
  const [loadingMatches, setLoadingMatches] = useState(true);
  const [currentMatchIndex, setCurrentMatchIndex] = useState(0);
  const [showProfileSetup, setShowProfileSetup] = useState(false);

  useEffect(() => {
    if (!loading && !user) {
      router.push('/');
    }
  }, [user, loading, router]);

  useEffect(() => {
    if (user) {
      fetchCurrentUserProfile();
    }
  }, [user]);

  const fetchCurrentUserProfile = async () => {
    if (!user) return;

    try {
      const userDoc = await getDoc(doc(db, 'users', user.uid));
      if (userDoc.exists()) {
        const userData = { id: userDoc.id, ...userDoc.data() } as UserProfile;
        setCurrentUser(userData);
        
        // Check if profile is complete
        if (!userData.interests?.length || !userData.travelStyle) {
          setShowProfileSetup(true);
        } else {
          fetchMatches(userData);
        }
      }
    } catch (error) {
      console.error('Error fetching user profile:', error);
    }
  };

  const fetchMatches = async (userProfile: UserProfile) => {
    setLoadingMatches(true);
    try {
      const usersSnapshot = await getDocs(collection(db, 'users'));
      const allUsers = usersSnapshot.docs
        .map(doc => ({ id: doc.id, ...doc.data() } as UserProfile))
        .filter(u => u.id !== user?.uid); // Exclude current user

      // Calculate match scores using mock AI logic
      const matchedUsers = allUsers
        .map(otherUser => ({
          ...otherUser,
          matchScore: calculateMatchScore(userProfile, otherUser)
        }))
        .filter(u => u.matchScore > 30) // Only show matches above 30%
        .sort((a, b) => (b.matchScore || 0) - (a.matchScore || 0))
        .slice(0, 10); // Top 10 matches

      setMatches(matchedUsers);
    } catch (error) {
      console.error('Error fetching matches:', error);
    } finally {
      setLoadingMatches(false);
    }
  };

  // Mock AI matching algorithm
  const calculateMatchScore = (user1: UserProfile, user2: UserProfile): number => {
    let score = 0;
    
    // Interest overlap (40% weight)
    const commonInterests = user1.interests?.filter(interest => 
      user2.interests?.includes(interest)
    ).length || 0;
    const totalInterests = Math.max(user1.interests?.length || 0, user2.interests?.length || 0);
    if (totalInterests > 0) {
      score += (commonInterests / totalInterests) * 40;
    }

    // Travel style compatibility (30% weight)
    if (user1.travelStyle === user2.travelStyle) {
      score += 30;
    } else {
      // Partial compatibility for similar styles
      const compatibleStyles: { [key: string]: string[] } = {
        'Budget Traveler': ['Digital Nomad', 'Backpacking', 'Solo Adventurer'],
        'Luxury Traveler': ['Weekend Warrior', 'Group Traveler'],
        'Digital Nomad': ['Budget Traveler', 'Solo Adventurer', 'Long-term Explorer'],
        'Solo Adventurer': ['Digital Nomad', 'Budget Traveler'],
        'Group Traveler': ['Luxury Traveler', 'Family Oriented'],
      };
      
      if (compatibleStyles[user1.travelStyle]?.includes(user2.travelStyle)) {
        score += 15;
      }
    }

    // Destination overlap (20% weight)
    const commonDestinations = user1.dreamDestinations?.filter(dest => 
      user2.dreamDestinations?.includes(dest)
    ).length || 0;
    const totalDestinations = Math.max(user1.dreamDestinations?.length || 0, user2.dreamDestinations?.length || 0);
    if (totalDestinations > 0) {
      score += (commonDestinations / totalDestinations) * 20;
    }

    // Age compatibility (10% weight)
    if (user1.age && user2.age) {
      const ageDiff = Math.abs(user1.age - user2.age);
      if (ageDiff <= 5) {
        score += 10;
      } else if (ageDiff <= 10) {
        score += 5;
      }
    }

    return Math.round(score);
  };

  const handleUpdateProfile = async (profileData: Partial<UserProfile>) => {
    if (!user) return;

    try {
      await updateDoc(doc(db, 'users', user.uid), profileData);
      const updatedProfile = { ...currentUser, ...profileData } as UserProfile;
      setCurrentUser(updatedProfile);
      setShowProfileSetup(false);
      fetchMatches(updatedProfile);
    } catch (error) {
      console.error('Error updating profile:', error);
    }
  };

  const handlePass = () => {
    if (currentMatchIndex < matches.length - 1) {
      setCurrentMatchIndex(currentMatchIndex + 1);
    } else {
      // No more matches
      setCurrentMatchIndex(0);
    }
  };

  const handleLike = async () => {
    const currentMatch = matches[currentMatchIndex];
    if (!currentMatch || !user) return;

    try {
      // Add to liked users (for potential chat feature)
      await updateDoc(doc(db, 'users', user.uid), {
        likedUsers: arrayUnion(currentMatch.id)
      });

      // Move to next match
      handlePass();
    } catch (error) {
      console.error('Error liking user:', error);
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
          <button
            onClick={() => router.push('/feed')}
            className="text-blue-600 hover:text-blue-800 font-medium"
          >
            ← Back to Feed
          </button>
          <h1 className="text-xl font-bold text-[#1F1F1F]">Find Matches</h1>
          <button
            onClick={() => setShowProfileSetup(true)}
            className="text-blue-600 hover:text-blue-800 font-medium"
          >
            Edit Profile
          </button>
        </div>
      </header>

      <div className="max-w-lg mx-auto px-4 py-6">
        {showProfileSetup ? (
          <ProfileSetup
            currentUser={currentUser}
            onSave={handleUpdateProfile}
            onCancel={() => setShowProfileSetup(false)}
          />
        ) : loadingMatches ? (
          <div className="text-center py-12">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500 mx-auto mb-4"></div>
            <p className="text-gray-600">Finding your perfect travel matches...</p>
          </div>
        ) : matches.length === 0 ? (
          <div className="text-center py-12">
            <div className="text-6xl mb-4">🔍</div>
            <h2 className="text-xl font-semibold text-gray-700 mb-2">No matches found</h2>
            <p className="text-gray-500 mb-4">Try updating your profile to find more compatible travelers.</p>
            <button
              onClick={() => setShowProfileSetup(true)}
              className="px-6 py-2 bg-gradient-to-r from-[#7B61FF] to-[#5D9FFF] text-white rounded-lg font-medium"
            >
              Update Profile
            </button>
          </div>
        ) : (
          <MatchCard
            user={matches[currentMatchIndex]}
            onPass={handlePass}
            onLike={handleLike}
            isLast={currentMatchIndex === matches.length - 1}
          />
        )}
      </div>
    </div>
  );
}

// Match Card Component
function MatchCard({ 
  user, 
  onPass, 
  onLike, 
  isLast 
}: { 
  user: UserProfile; 
  onPass: () => void; 
  onLike: () => void;
  isLast: boolean;
}) {
  return (
    <div className="bg-white rounded-2xl shadow-lg overflow-hidden max-w-sm mx-auto">
      {/* Profile Image */}
      <div className="relative h-80 bg-gradient-to-br from-blue-400 to-purple-500">
        {user.photoURL ? (
          <Image
            src={user.photoURL}
            alt={user.name}
            fill
            className="object-cover"
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center text-white text-6xl font-bold">
            {user.name[0].toUpperCase()}
          </div>
        )}
        
        {/* Match Score Badge */}
        <div className="absolute top-4 left-4 bg-white/90 backdrop-blur-sm rounded-full px-3 py-1">
          <span className="text-sm font-bold text-green-600">{user.matchScore}% Match</span>
        </div>
      </div>

      {/* Profile Info */}
      <div className="p-6">
        <div className="flex items-center justify-between mb-3">
          <h2 className="text-2xl font-bold text-[#1F1F1F]">{user.name}</h2>
          {user.age && (
            <span className="text-lg text-gray-600">{user.age}</span>
          )}
        </div>

        {user.location && (
          <p className="text-gray-600 mb-3 flex items-center gap-1">
            📍 {user.location}
          </p>
        )}

        {user.bio && (
          <p className="text-gray-700 mb-4 leading-relaxed">{user.bio}</p>
        )}

        {/* Travel Style */}
        {user.travelStyle && (
          <div className="mb-4">
            <h3 className="text-sm font-semibold text-gray-800 mb-2">Travel Style</h3>
            <span className="bg-blue-100 text-blue-800 px-3 py-1 rounded-full text-sm font-medium">
              {user.travelStyle}
            </span>
          </div>
        )}

        {/* Interests */}
        {user.interests && user.interests.length > 0 && (
          <div className="mb-4">
            <h3 className="text-sm font-semibold text-gray-800 mb-2">Interests</h3>
            <div className="flex flex-wrap gap-2">
              {user.interests.slice(0, 6).map((interest, index) => (
                <span
                  key={index}
                  className="bg-purple-100 text-purple-800 px-2 py-1 rounded-full text-xs"
                >
                  {interest}
                </span>
              ))}
              {user.interests.length > 6 && (
                <span className="text-xs text-gray-500 px-2 py-1">
                  +{user.interests.length - 6} more
                </span>
              )}
            </div>
          </div>
        )}

        {/* Dream Destinations */}
        {user.dreamDestinations && user.dreamDestinations.length > 0 && (
          <div className="mb-6">
            <h3 className="text-sm font-semibold text-gray-800 mb-2">Dream Destinations</h3>
            <div className="flex flex-wrap gap-2">
              {user.dreamDestinations.slice(0, 4).map((destination, index) => (
                <span
                  key={index}
                  className="bg-green-100 text-green-800 px-2 py-1 rounded-full text-xs"
                >
                  🌍 {destination}
                </span>
              ))}
            </div>
          </div>
        )}

        {/* Action Buttons */}
        <div className="flex gap-4 justify-center">
          <button
            onClick={onPass}
            className="w-14 h-14 rounded-full bg-gray-100 hover:bg-gray-200 flex items-center justify-center transition-colors"
          >
            <span className="text-2xl">✕</span>
          </button>
          <button
            onClick={onLike}
            className="w-14 h-14 rounded-full bg-gradient-to-r from-pink-400 to-red-400 hover:from-pink-500 hover:to-red-500 flex items-center justify-center transition-all shadow-md hover:shadow-lg"
          >
            <span className="text-2xl">💖</span>
          </button>
        </div>

        {isLast && (
          <p className="text-center text-sm text-gray-500 mt-4">
            Last match! Check back later for more.
          </p>
        )}
      </div>
    </div>
  );
}

// Profile Setup Component
function ProfileSetup({ 
  currentUser, 
  onSave, 
  onCancel 
}: { 
  currentUser: UserProfile | null;
  onSave: (data: Partial<UserProfile>) => void;
  onCancel: () => void;
}) {
  const [formData, setFormData] = useState({
    bio: currentUser?.bio || '',
    interests: currentUser?.interests || [],
    travelStyle: currentUser?.travelStyle || '',
    dreamDestinations: currentUser?.dreamDestinations || [],
    age: currentUser?.age || '',
    location: currentUser?.location || ''
  });

  const handleInterestToggle = (interest: string) => {
    if (formData.interests.includes(interest)) {
      setFormData({
        ...formData,
        interests: formData.interests.filter(i => i !== interest)
      });
    } else {
      setFormData({
        ...formData,
        interests: [...formData.interests, interest]
      });
    }
  };

  const handleDestinationAdd = (destination: string) => {
    if (destination.trim() && !formData.dreamDestinations.includes(destination.trim())) {
      setFormData({
        ...formData,
        dreamDestinations: [...formData.dreamDestinations, destination.trim()]
      });
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSave({
      ...formData,
      age: formData.age ? parseInt(formData.age.toString()) : null
    });
  };

  return (
    <div className="bg-white rounded-xl shadow-sm p-6">
      <h2 className="text-xl font-bold text-[#1F1F1F] mb-6">Complete Your Profile</h2>
      
      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Bio */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Bio
          </label>
          <textarea
            value={formData.bio}
            onChange={(e) => setFormData({ ...formData, bio: e.target.value })}
            placeholder="Tell others about yourself and your travel dreams..."
            className="w-full p-3 border border-gray-300 rounded-lg resize-none focus:ring-2 focus:ring-blue-500"
            rows={3}
            maxLength={200}
          />
        </div>

        {/* Age and Location */}
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Age
            </label>
            <input
              type="number"
              value={formData.age}
              onChange={(e) => setFormData({ ...formData, age: e.target.value })}
              placeholder="25"
              className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
              min="18"
              max="100"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Location
            </label>
            <input
              type="text"
              value={formData.location}
              onChange={(e) => setFormData({ ...formData, location: e.target.value })}
              placeholder="New York, NY"
              className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
            />
          </div>
        </div>

        {/* Travel Style */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Travel Style
          </label>
          <select
            value={formData.travelStyle}
            onChange={(e) => setFormData({ ...formData, travelStyle: e.target.value })}
            className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
            required
          >
            <option value="">Select your travel style</option>
            {TRAVEL_STYLES.map(style => (
              <option key={style} value={style}>{style}</option>
            ))}
          </select>
        </div>

        {/* Interests */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Travel Interests (Select at least 3)
          </label>
          <div className="grid grid-cols-2 gap-2">
            {TRAVEL_INTERESTS.map(interest => (
              <button
                key={interest}
                type="button"
                onClick={() => handleInterestToggle(interest)}
                className={`p-2 text-sm rounded-lg border transition-colors ${
                  formData.interests.includes(interest)
                    ? 'bg-blue-100 border-blue-300 text-blue-800'
                    : 'bg-gray-50 border-gray-300 text-gray-700 hover:bg-gray-100'
                }`}
              >
                {interest}
              </button>
            ))}
          </div>
        </div>

        {/* Dream Destinations */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Dream Destinations
          </label>
          <div className="flex flex-wrap gap-2 mb-2">
            {formData.dreamDestinations.map((dest, index) => (
              <span
                key={index}
                className="bg-green-100 text-green-800 px-2 py-1 rounded-full text-sm flex items-center gap-1"
              >
                {dest}
                <button
                  type="button"
                  onClick={() => setFormData({
                    ...formData,
                    dreamDestinations: formData.dreamDestinations.filter((_, i) => i !== index)
                  })}
                  className="text-green-600 hover:text-green-800"
                >
                  ×
                </button>
              </span>
            ))}
          </div>
          <input
            type="text"
            placeholder="Add a destination (press Enter)"
            className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
            onKeyPress={(e) => {
              if (e.key === 'Enter') {
                e.preventDefault();
                handleDestinationAdd(e.currentTarget.value);
                e.currentTarget.value = '';
              }
            }}
          />
        </div>

        {/* Submit Buttons */}
        <div className="flex gap-3 pt-4">
          <button
            type="button"
            onClick={onCancel}
            className="flex-1 px-4 py-3 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50"
          >
            Cancel
          </button>
          <button
            type="submit"
            disabled={formData.interests.length < 3 || !formData.travelStyle}
            className="flex-1 px-4 py-3 bg-gradient-to-r from-[#7B61FF] to-[#5D9FFF] text-white rounded-lg font-medium disabled:opacity-50 disabled:cursor-not-allowed"
          >
            Save Profile
          </button>
        </div>
      </form>
    </div>
  );
}