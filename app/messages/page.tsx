import { Suspense } from 'react';
import Navbar from '../navbar/pageN'; // assuming this is ok as server or adjust
import MessagesContent from './MessagesContent'; // new file – we'll create it
import './messages.css';

export default function MessagesPage() {
  return (
    <div className="messages-page">
      <Navbar />

      <div className="messages-container">
        <div className="chat-layout">
          {/* Wrap only the dynamic/chat part */}
          <Suspense fallback={
            <div className="chat-placeholder">
              <h2>Loading conversations...</h2>
              <p>Please wait while we fetch your messages.</p>
            </div>
          }>
            <MessagesContent />
          </Suspense>
        </div>
      </div>
    </div>
  );
}