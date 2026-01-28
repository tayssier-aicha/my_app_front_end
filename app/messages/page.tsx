'use client';

import { useEffect, useState, useRef } from 'react';
import { useSearchParams } from 'next/navigation';
import Navbar from '../navbar/pageN';
import './messages.css';
import axios from 'axios';
import io from 'socket.io-client';

// Socket outside component (singleton)
const socket = io(process.env.NEXT_PUBLIC_API_URL!, {
  autoConnect: false,
});

export default function MessagesPage() {
  const searchParams = useSearchParams();
  const initialConvId = searchParams.get('conv');

  const [selectedConvId, setSelectedConvId] = useState<string | null>(initialConvId);
  const [conversations, setConversations] = useState<any[]>([]);
  const [currentUser, setCurrentUser] = useState<any>(null);
  const [messages, setMessages] = useState<any[]>([]);
  const [loadingMessages, setLoadingMessages] = useState(false);
  const [newMessage, setNewMessage] = useState('');

  // ─── Ref for auto-scroll ───────────────────────────────────────────────
  const messagesEndRef = useRef<HTMLDivElement>(null);

  // Connect / disconnect socket
  useEffect(() => {
    socket.connect();

    return () => {
      socket.disconnect();
    };
  }, []);

  // Join room when conversation changes
  useEffect(() => {
    if (selectedConvId) {
      socket.emit('joinConversation', selectedConvId);
      fetchMessages(selectedConvId);
    }
  }, [selectedConvId]);

  // Receive real-time messages
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

  // Load user conversations
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

        // Auto-select conversation from URL if it exists
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

  const handleClick = async () => {
    if (!newMessage.trim() || !selectedConvId) return;

    const messageData = {
      conversationId: selectedConvId,
      senderId: currentUser._id,
      text: newMessage.trim(),
    };

    try {
      // Send via socket for instant feel
      socket.emit('sendMessage', messageData);

      // Save to DB
      const res = await axios.post(
        `${process.env.NEXT_PUBLIC_API_URL}message/send`,
        messageData
      );

      setMessages((prev) => [...prev, res.data]);
      setNewMessage('');
    } catch (err) {
      console.error(err);
    }
  };

  // ─── AUTO-SCROLL ───────────────────────────────────────────────────────
  useEffect(() => {
    // Scroll to bottom when messages change or conversation is selected
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, selectedConvId]);

  const selectedConv = conversations.find((c) => c._id === selectedConvId);

  return (
    <div className="messages-page">
      <Navbar />

      <div className="messages-container">
        <div className="chat-layout">

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

              return (
                <div
                  key={conv._id}
                  className={`conversation-item ${isActive ? 'active' : ''}`}
                  onClick={() => {
                    setSelectedConvId(conv._id);
                  }}
                >
                  <div className="profile-header">
                    <div className="avatar-c">
                      {other?.name?.charAt(0).toUpperCase()}
                    </div>
                    {!lastMsg?.read && (
                      <span className="unread-indicator"></span>
                    )}
                  </div>

                  <div className="conversation-info">
                    <h3>{other?.name}</h3>
                    <p className="last-message">
                      {lastMsg?.senderId?._id === currentUser?._id
                        ? 'Vous : '
                        : ''}
                      {lastMsg?.text || 'No messages yet'}
                    </p>
                  </div>

                  <span className="message-time">{time}</span>
                </div>
              );
            })}
          </div>

          <div className="chat-area">
            {selectedConv ? (
              <div className="chat-content">

                <div className="chat-header">
                  Discussion with{' '}
                  {
                    selectedConv.participants.find(
                      (p: any) => p._id !== currentUser?._id
                    )?.name
                  }
                </div>

                <div className="chat-messages">
                  {loadingMessages ? (
                    <p className="loading">loading...</p>
                  ) : messages.length === 0 ? (
                    <p className="empty">no messages yet</p>
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

                  {/* This empty div is used for auto-scroll */}
                  <div ref={messagesEndRef} />
                </div>

                <div className="chat-input">
                  <input
                    type="text"
                    placeholder="tape a messsages..."
                    value={newMessage}
                    onChange={(e) => setNewMessage(e.target.value)}
                  />
                  <button onClick={handleClick}>send</button>
                </div>

              </div>
            ) : (
              <div className="chat-placeholder">
                <h2>your messages</h2>
                <p>Select a conversation to start chatting.</p>
              </div>
            )}
          </div>

        </div>
      </div>
    </div>
  );
}