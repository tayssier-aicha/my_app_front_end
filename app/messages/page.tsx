'use client';

import { useEffect, useState, useRef } from 'react';
import { useSearchParams } from 'next/navigation';
import Navbar from '../navbar/pageN';
import './messages.css';
import axios from 'axios';
import io from 'socket.io-client';

const socket = io(process.env.NEXT_PUBLIC_API_URL!, {
  autoConnect: false,
});

function MessagesPage() {
  const searchParams = useSearchParams();
  const initialConvId = searchParams.get('conv');

  const [selectedConvId, setSelectedConvId] = useState<string | null>(initialConvId);
  const [conversations, setConversations] = useState<any[]>([]);
  const [currentUser, setCurrentUser] = useState<any>(null);
  const [messages, setMessages] = useState<any[]>([]);
  const [loadingMessages, setLoadingMessages] = useState(false);
  const [newMessage, setNewMessage] = useState('');

  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    socket.connect();
    return () => {
      socket.disconnect();
    };
  }, []);

  useEffect(() => {
    if (selectedConvId) {
      socket.emit('joinConversation', selectedConvId);
      fetchMessages(selectedConvId);
    }
  }, [selectedConvId]);

  useEffect(() => {
    socket.on('receiveMessage', (msg) => {
      if (msg.conversationId === selectedConvId) {
        setMessages((prev) => [...prev, msg]);
      }
    });

    return () => {
      socket.off('receiveMessage');
    };
  }, [selectedConvId]);

  useEffect(() => {
    const fetchConversations = async () => {
      try {
        const user = JSON.parse(localStorage.getItem('user') || '{}');
        if (!user?._id) return;

        setCurrentUser(user);

        const res = await axios.get(
          `${process.env.NEXT_PUBLIC_API_URL}conversation/user/${user._id}`
        );

        setConversations(res.data);

        if (initialConvId && res.data.some((c: any) => c._id === initialConvId)) {
          setSelectedConvId(initialConvId);
        }
      } catch (err) {
        console.error(err);
      }
    };

    fetchConversations();
  }, [initialConvId]);

  const fetchMessages = async (conversationId: string) => {
    try {
      setLoadingMessages(true);
      const res = await axios.get(
        `${process.env.NEXT_PUBLIC_API_URL}message/${conversationId}`
      );
      setMessages(res.data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoadingMessages(false);
    }
  };

  const handleSend = () => {
    if (!newMessage.trim() || !selectedConvId) return;

    socket.emit('sendMessage', {
      conversationId: selectedConvId,
      senderId: currentUser._id,
      text: newMessage.trim(),
    });

    setNewMessage('');
  };

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, selectedConvId]);

  const selectedConv = conversations.find((c) => c._id === selectedConvId);

  return (
    <div className="messages-page">
      <Navbar />

      <div className="messages-container">
        <div className="chat-layout">
          {/* Conversation List */}
          <div className="conversation-list">
            <div className="conversation-list-header">
              <h2>Conversations</h2>
            </div>

            {conversations.map((conv) => {
              const other = conv.participants.find(
                (p: any) => p._id !== currentUser?._id
              ) || conv.participants[0];

              const lastMsg = conv.lastMessage;
              const time = lastMsg?.createdAt
                ? new Date(lastMsg.createdAt).toLocaleTimeString([], {
                    hour: '2-digit',
                    minute: '2-digit',
                  })
                : '';

              const isActive = selectedConvId === conv._id;
              const hasUnread = lastMsg && !lastMsg.read && lastMsg.senderId?._id !== currentUser?._id;

              return (
                <div
                  key={conv._id}
                  className={`conversation-item ${isActive ? 'active' : ''}`}
                  onClick={() => setSelectedConvId(conv._id)}
                >
                  <div className="profile-header">
                    <div className="avatar-c">
                      {other?.name?.charAt(0).toUpperCase()}
                    </div>
                    {hasUnread && <span className="unread-indicator" />}
                  </div>

                  <div className="conversation-info">
                    <h3>{other?.name || 'Unknown'}</h3>
                    <p className="last-message">
                      {lastMsg?.senderId?._id === currentUser?._id ? 'You: ' : ''}
                      {lastMsg?.text || 'No messages yet'}
                    </p>
                  </div>

                  <span className="message-time">{time}</span>
                </div>
              );
            })}
          </div>

          {/* Chat Area */}
          <div className="chat-area">
            {selectedConv ? (
              <div className="chat-content">
                <div className="chat-header">
                  Chat with{' '}
                  {selectedConv.participants.find((p: any) => p._id !== currentUser?._id)?.name || 'User'}
                </div>

                <div className="chat-messages">
                  {loadingMessages ? (
                    <div className="loading">Loading messages...</div>
                  ) : messages.length === 0 ? (
                    <div className="empty">No messages yet</div>
                  ) : (
                    messages.map((msg) => {
                      const isMe = msg.senderId._id === currentUser?._id;

                      return (
                        <div
                          key={msg._id}
                          className={`message-bubble ${isMe ? 'me' : 'other'}`}
                        >
                          <p>{msg.text}</p>
                          <span className="message-time">
                            {new Date(msg.createdAt).toLocaleTimeString([], {
                              hour: '2-digit',
                              minute: '2-digit',
                            })}
                          </span>
                        </div>
                      );
                    })
                  )}
                  <div ref={messagesEndRef} />
                </div>

                <div className="chat-input">
                  <input
                    type="text"
                    placeholder="Type a message..."
                    value={newMessage}
                    onChange={(e) => setNewMessage(e.target.value)}
                    onKeyDown={(e) => e.key === 'Enter' && !e.shiftKey && (e.preventDefault(), handleSend())}
                  />
                  <button
                    onClick={handleSend}
                    disabled={!newMessage.trim() || !selectedConvId}
                    className={newMessage.trim() ? 'active' : ''}
                  >
                    Send
                  </button>
                </div>
              </div>
            ) : (
              <div className="chat-placeholder">
                <h2>Your Messages</h2>
                <p>Select a conversation to start chatting.</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

export default MessagesPage;