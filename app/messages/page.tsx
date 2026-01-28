'use client';

import { useEffect, useState } from 'react';
import Navbar from '../navbar/pageN';
import './messages.css';
import axios from 'axios';

export default function MessagesPage() {
  const [selectedConvId, setSelectedConvId] = useState<string | null>(null);
  const [conversations, setConversations] = useState<any[]>([]);
  const [currentUser, setCurrentUser] = useState<any>(null);
  const [messages, setMessages] = useState<any[]>([]);
  const [loadingMessages, setLoadingMessages] = useState(false);

  // ================= LOAD CONVERSATIONS =================
  useEffect(() => {
    const fetchConversations = async () => {
      try {
        const user = JSON.parse(localStorage.getItem('user') || '{}');
        setCurrentUser(user);

        const res = await axios.get(
          `${process.env.NEXT_PUBLIC_API_URL}conversation/user/${user._id}`
        );

        setConversations(res.data);
      } catch (err) {
        console.error(err);
      }
    };

    fetchConversations();
  }, []);

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

  const selectedConv = conversations.find(
    (c) => c._id === selectedConvId
  );

    const handleClick = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await axios.post(`${process.env.NEXT_PUBLIC_API_URL}send`, {
        senderId: currentUser?._id,
        receiverId:
          selectedConv?.participants.find(
            (p: any) => p._id !== currentUser?._id
          )?._id || null,
      });

    } catch (err) {
      console.error(err);
    };}

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
              const other =
                conv.participants.find(
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
                    fetchMessages(conv._id);
                  }}
                >
                  <div className="profile-header">
                    <div className="avatar-c">
                      {other?.name?.charAt(0).toUpperCase()}
                    </div>
                    {!lastMsg?.read && (
                      <span className="unread-badge">•</span>
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
                  Discussion with {' '}
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
                </div>

                <div className="chat-input">
                  <input
                    type="text"
                    placeholder="tape a messsages..."
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
