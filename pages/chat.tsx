import { useState, useEffect, useRef } from 'react';
import { useAuthState } from 'react-firebase-hooks/auth';
import { auth, db } from '../../lib/firebase';
import { useRouter } from 'next/router';
import { 
  collection, 
  addDoc, 
  serverTimestamp, 
  query, 
  orderBy, 
  onSnapshot, 
  doc, 
  getDoc,
  where,
  getDocs
} from 'firebase/firestore';
import Image from 'next/image';

interface Message {
  id: string;
  text: string;
  senderId: string;
  senderName: string;
  timestamp: any;
  type: 'text' | 'image';
  imageUrl?: string;
}

interface ChatUser {
  id: string;
  name: string;
  photoURL: string;
  lastSeen?: any;
}

export default function Chat() {
  const [user, loading] = useAuthState(auth);
  const router = useRouter();
  const { id: chatUserId } = router.query;
  const [messages, setMessages] = useState<Message[]>([]);
  const [newMessage, setNewMessage] = useState('');
  const [chatUser, setChatUser] = useState<ChatUser | null>(null);
  const [sending, setSending] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!loading && !user) {
      router.push('/');
    }
  }, [user, loading, router]);

  useEffect(() => {
    if (user && chatUserId) {
      fetchChatUser();
      setupMessagesListener();
    }
  }, [user, chatUserId]);

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const fetchChatUser = async () => {
    if (!chatUserId || typeof chatUserId !== 'string') return;

    try {
      const userDoc = await getDoc(doc(db, 'users', chatUserId));
      if (userDoc.exists()) {
        const userData = userDoc.data();
        setChatUser({
          id: userDoc.id,
          name: userData.name || 'Unknown User',
          photoURL: userData.photoURL || '',
          lastSeen: userData.lastActive
        });
      }
    } catch (error) {
      console.error('Error fetching chat user:', error);
    }
  };

  const setupMessagesListener = () => {
    if (!user || !chatUserId || typeof chatUserId !== 'string') return;

    // Create a unique chat ID based on user IDs (sorted to ensure consistency)
    const chatId = [user.uid, chatUserId].sort().join('_');

    const q = query(
      collection(db, 'chats', chatId, 'messages'),
      orderBy('timestamp', 'asc')
    );

    const unsubscribe = onSnapshot(q, (snapshot) => {
      const messagesData = snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      })) as Message[];
      setMessages(messagesData);
    });

    return () => unsubscribe();
  };

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  const handleSendMessage = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newMessage.trim() || !user || !chatUserId || sending) return;

    setSending(true);
    const messageText = newMessage.trim();
    setNewMessage('');

    try {
      // Create a unique chat ID based on user IDs (sorted to ensure consistency)
      const chatId = [user.uid, chatUserId].sort().join('_');

      await addDoc(collection(db, 'chats', chatId, 'messages'), {
        text: messageText,
        senderId: user.uid,
        senderName: user.displayName || user.email?.split('@')[0] || 'You',
        timestamp: serverTimestamp(),
        type: 'text'
      });

      // Update chat metadata (for chat list in the future)
      await addDoc(collection(db, 'chatRooms'), {
        participants: [user.uid, chatUserId],
        lastMessage: messageText,
        lastMessageTime: serverTimestamp(),
        lastMessageSender: user.uid
      });

    } catch (error) {
      console.error('Error sending message:', error);
      setNewMessage(messageText); // Restore message on error
    } finally {
      setSending(false);
    }
  };

  const formatMessageTime = (timestamp: any) => {
    if (!timestamp) return '';
    const date = timestamp.toDate ? timestamp.toDate() : new Date(timestamp);
    return date.toLocaleTimeString('en-US', { 
      hour: '2-digit', 
      minute: '2-digit',
      hour12: true 
    });
  };

  const formatLastSeen = (timestamp: any) => {
    if (!timestamp) return 'Last seen recently';
    const date = timestamp.toDate ? timestamp.toDate() : new Date(timestamp);
    const now = new Date();
    const diffInMinutes = Math.floor((now.getTime() - date.getTime()) / (1000 * 60));
    
    if (diffInMinutes < 1) return 'Active now';
    if (diffInMinutes < 60) return `Active ${diffInMinutes} minutes ago`;
    if (diffInMinutes < 1440) return `Active ${Math.floor(diffInMinutes / 60)} hours ago`;
    return `Active ${Math.floor(diffInMinutes / 1440)} days ago`;
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  if (!user || !chatUserId) return null;

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      {/* Chat Header */}
      <header className="bg-white shadow-sm border-b px-4 py-3">
        <div className="flex items-center gap-3">
          <button
            onClick={() => router.back()}
            className="text-blue-600 hover:text-blue-800 p-1"
          >
            ← Back
          </button>
          
          {chatUser && (
            <>
              <div className="w-10 h-10 rounded-full overflow-hidden">
                {chatUser.photoURL ? (
                  <Image
                    src={chatUser.photoURL}
                    alt={chatUser.name}
                    width={40}
                    height={40}
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <div className="w-full h-full bg-gradient-to-br from-blue-400 to-purple-500 flex items-center justify-center text-white font-semibold">
                    {chatUser.name[0].toUpperCase()}
                  </div>
                )}
              </div>
              <div className="flex-1">
                <h1 className="font-semibold text-[#1F1F1F]">{chatUser.name}</h1>
                <p className="text-xs text-gray-500">{formatLastSeen(chatUser.lastSeen)}</p>
              </div>
            </>
          )}

          <button className="text-gray-400 hover:text-gray-600">
            <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24">
              <path d="M12 8c1.1 0 2-.9 2-2s-.9-2-2-2-2 .9-2 2 .9 2 2 2zm0 2c-1.1 0-2 .9-2 2s.9 2 2 2 2-.9 2-2-.9-2-2-2zm0 6c-1.1 0-2 .9-2 2s.9 2 2 2 2-.9 2-2-.9-2-2-2z"/>
            </svg>
          </button>
        </div>
      </header>

      {/* Messages Area */}
      <div className="flex-1 overflow-y-auto px-4 py-4 space-y-4">
        {messages.length === 0 ? (
          <div className="text-center py-12">
            <div className="text-4xl mb-4">💬</div>
            <h2 className="text-lg font-semibold text-gray-700 mb-2">Start the conversation!</h2>
            <p className="text-gray-500">
              Say hello and start planning your next adventure together.
            </p>
          </div>
        ) : (
          messages.map((message, index) => {
            const isCurrentUser = message.senderId === user.uid;
            const showTimestamp = index === 0 || 
              (messages[index - 1] && 
               Math.abs(message.timestamp?.toDate?.()?.getTime() - messages[index - 1].timestamp?.toDate?.()?.getTime()) > 5 * 60 * 1000);

            return (
              <div key={message.id}>
                {showTimestamp && (
                  <div className="text-center text-xs text-gray-500 mb-4">
                    {formatMessageTime(message.timestamp)}
                  </div>
                )}
                <div className={`flex ${isCurrentUser ? 'justify-end' : 'justify-start'}`}>
                  <div className={`max-w-xs lg:max-w-md px-4 py-2 rounded-2xl ${
                    isCurrentUser 
                      ? 'bg-gradient-to-r from-[#7B61FF] to-[#5D9FFF] text-white' 
                      : 'bg-white text-gray-800 shadow-sm'
                  }`}>
                    <p className="text-sm leading-relaxed">{message.text}</p>
                  </div>
                </div>
              </div>
            );
          })
        )}
        <div ref={messagesEndRef} />
      </div>

      {/* Message Input */}
      <div className="bg-white border-t px-4 py-3">
        <form onSubmit={handleSendMessage} className="flex items-center gap-3">
          <button
            type="button"
            className="text-gray-400 hover:text-gray-600 p-2"
            disabled
          >
            <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24">
              <path d="M19 7v2.99s-1.99.01-2 0V7h-3s.01-1.99 0-2h3V2h2v3h3v2h-3zm-3 4V9h-3V7H5c-1.1 0-2 .9-2 2v12c0 1.1.9 2 2 2h12c1.1 0 2-.9 2-2v-8h-3zM5 19l3-4 2 3 3-4 4 5H5z"/>
            </svg>
          </button>
          
          <input
            type="text"
            value={newMessage}
            onChange={(e) => setNewMessage(e.target.value)}
            placeholder="Type a message..."
            className="flex-1 px-4 py-2 bg-gray-100 rounded-full focus:outline-none focus:ring-2 focus:ring-blue-500 focus:bg-white"
            disabled={sending}
          />
          
          <button
            type="submit"
            disabled={!newMessage.trim() || sending}
            className="p-2 bg-gradient-to-r from-[#7B61FF] to-[#5D9FFF] text-white rounded-full disabled:opacity-50 disabled:cursor-not-allowed hover:shadow-md transition-shadow"
          >
            {sending ? (
              <div className="w-6 h-6 animate-spin rounded-full border-2 border-white border-t-transparent"></div>
            ) : (
              <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24">
                <path d="M2.01 21L23 12 2.01 3 2 10l15 2-15 2z"/>
              </svg>
            )}
          </button>
        </form>
      </div>
    </div>
  );
}