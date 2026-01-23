'use client';

import axios from 'axios';
import Navbar from '../navbar/pageN';
import './found.css';
import { useEffect, useState } from 'react';
import { X } from 'lucide-react';

interface Item {
  user: any;
  _id: string;
  description?: string;
  location?: string;
  date?: string | Date;
  image?: string;
  type: string;
}

export default function Found() {
  const [items, setItems] = useState<Item[]>([]);
  const [selectedItem, setSelectedItem] = useState<Item | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchItems = async () => {
    try {
      setLoading(true);
      setError(null);

      const res = await axios.get(
        `${process.env.NEXT_PUBLIC_API_URL}item/get?type=found`
      );

      const data = Array.isArray(res.data) ? res.data : [];
      setItems(data);
    } catch (err: any) {
      console.error('Failed to fetch found items:', err);
      setError('Could not load found items. Please try again later.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchItems();
  }, []);

  return (
    <div className="found-page">
      <Navbar />

      <div className="container-F">
        <h1>Found Items</h1>

        {loading && <p className="status-message">Loading found items...</p>}

        {error && <p className="status-message error">{error}</p>}

        {!loading && !error && items.length === 0 && (
          <p className="status-message">No found items reported yet.</p>
        )}

        {!loading && items.length > 0 && (
          <div className="items-grid-F">
            {items.map((item) => (
              <div
                key={item._id}
                className="item-card-F"
                onClick={() => setSelectedItem(item)}
                role="button"
                tabIndex={0}
              >
                {item.image ? (
                  <img
                    src={`${process.env.NEXT_PUBLIC_API_URL}uploads/${item.image}`}
                    alt={item.description || 'Found item'}
                    className="item-image"
                    onError={(e) => {
                      e.currentTarget.src = '/placeholder-image.jpg'; // fallback
                      e.currentTarget.alt = 'Image not available';
                    }}
                  />
                ) : (
                  <div className="no-image-placeholder">No image</div>
                )}

                <div className="item-info">
                  <h3>{item.description || 'No description'}</h3>
                  <p className="location">{item.location || '—'}</p>
                  <span className="date">
                    {item.date
                      ? new Date(item.date).toLocaleDateString()
                      : '—'}
                  </span>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Modal */}
      {selectedItem && (
        <div className="modal-overlay" onClick={() => setSelectedItem(null)}>
          <div
            className="modal-content"
            onClick={(e) => e.stopPropagation()}
          >
            <button
              className="modal-close"
              onClick={() => setSelectedItem(null)}
              aria-label="Close"
            >
              <X size={28} />
            </button>

            <div className="modal-image-wrapper">
              {selectedItem.image ? (
                <img
                  src={`${process.env.NEXT_PUBLIC_API_URL}uploads/${selectedItem.image}`}
                  alt={selectedItem.description || 'Found item'}
                  className="modal-image"
                />
              ) : (
                <div className="no-image-placeholder large">No image available</div>
              )}
            </div>

            <div className="modal-body">
              <h2>{selectedItem.description || 'Found Item'}</h2>
              <p><strong>Location:</strong> {selectedItem.location || 'Not specified'}</p>
              <p>
                <strong>Date:</strong>{' '}
                {selectedItem.date
                  ? new Date(selectedItem.date).toLocaleDateString()
                  : 'Not specified'}
              </p> 
              <p>
                <strong>Founded By:</strong>{' '}
                {selectedItem.user?.name
                  ? selectedItem.user?.name
                  : 'Not specified'}
              </p>
              <p>
                <strong>Description:</strong>{' '}
                {selectedItem.description
                  ? selectedItem.description
                  : 'Not specified'}
              </p>

            </div>
          </div>
        </div>
      )}
    </div>
  );
}