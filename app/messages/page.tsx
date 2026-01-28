'use client';

import { use, useEffect, useState } from 'react';
import Navbar from '../navbar/pageN';
import './messages.css';
import axios from 'axios';
import io from 'socket.io-client';
const socket = io(process.env.NEXT_PUBLIC_API_URL!);


export default function MessagesPage() {
  const [selectedConvId, setSelectedConvId] = useState<string | null>(null);
  const [conversations, setConversations] = useState<any[]>([]);
  const [currentUser, setCurrentUser] = useState<any>(null);
  const [messages, setMessages] = useState<any[]>([]);
  const [loadingMessages, setLoadingMessages] = useState(false);
  const [newMessage, setNewMessage] = useState('');

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

  useEffect(() => {
    if (selectedConvId) {
      fetchMessages(selectedConvId);
    }
  }, [selectedConvId]);



  const handleClick = async (e: React.FormEvent) => {
  e.preventDefault();

  if (!newMessage.trim() || !selectedConvId) return;

  const messageData = {
    conversationId: selectedConvId,
    senderId: currentUser._id,
    text: newMessage.trim(),
    createdAt: new Date(),
  };

  try {
    // envoyer en temps réel
    socket.emit('sendMessage', messageData);

    // sauvegarder en DB
    const res = await axios.post(
      `${process.env.NEXT_PUBLIC_API_URL}message/send`,
      messageData
    );
    

    setMessages((prev) => [...prev, res.data]);
  } catch (err) {
    console.error(err);
  }
};


  useEffect(() => {
  if (selectedConvId) {
    socket.emit('joinRoom', selectedConvId);
    fetchMessages(selectedConvId);
  }
}, [selectedConvId]);





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
