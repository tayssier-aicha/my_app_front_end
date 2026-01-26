"use client";
import axios from "axios";
import Navbar from "../navbar/pageN";
import "./lost.css";
import { useEffect, useState } from "react";
import { X } from "lucide-react";
import { useRouter } from "next/navigation";

interface Item {
  category: string;
  user: any;
  _id: string;
  description?: string;
  location?: string;
  date?: string | Date;
  image?: string;
  type: string;
}

function Lost() {
  const [items, setItems] = useState<Item[]>([]);
  const [selectedItem,setSelectedItem]=useState<Item | null>(null);
  const [loading,setLoading]=useState(true);
  const[error,setError]=useState<string | null>(null);

  const router = useRouter();

  const fetchItems = async () => {
    try {
      const res = await axios.get(
        `${process.env.NEXT_PUBLIC_API_URL}item/get?type=lost`,
      );
      const data= Array.isArray(res.data)? res.data : [];
      setItems(data);
    } catch (err) {
      console.error('Failed to fetch lost items:', err);
      setError('Could not load lost items. Please try again later.');
    }
    finally {
      setLoading(false);
    }
  };
  useEffect(() => {
    fetchItems();
  }, []);
  return (
    <div className="lost-page">
      <Navbar />
      <div className="container-L">
        <h1>Lost Items</h1>

        {loading && <p className="status-message">Loading found items...</p>}

        {error && <p className="status-message error">{error}</p>}

        {!loading && !error && items.length === 0 && (
          <p className="status-message">No Lost items reported yet</p>
        )}

        {!loading && items.length > 0 && (
          <div className="items-grid-L">
            {items.map((item) => (
              <div
                key={item._id}
                className="item-card-L"
                onClick={() => setSelectedItem(item)}
                role="button"
                tabIndex={0}
              >
                {item.image ? (
                  <img
                    src={`${process.env.NEXT_PUBLIC_API_URL}uploads/${item.image}`}
                    alt={item.description || 'Lost item'}
                    className="item-image"
                    onError={(e) => {
                      e.currentTarget.src = '/placeholder-image.jpg'; 
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
              <X size={30} />
            </button>

            <div className="modal-image-wrapper">
              {selectedItem.image ? (
                <img
                  src={`${process.env.NEXT_PUBLIC_API_URL}uploads/${selectedItem.image}`}
                  alt={selectedItem.description || 'Lost item'}
                  className="modal-image"
                />
              ) : (
                <div className="no-image-placeholder large">No image available</div>
              )}
            </div>

            <div className="modal-body">
              <h2>{selectedItem.description || 'Lost Item'}</h2>
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
                <strong>Category:</strong>{' '}
                {selectedItem.category
                  ? selectedItem.category
                  : 'Not specified'}
              </p>
              <p>
                <strong>Description:</strong>{' '}
                {selectedItem.description
                  ? selectedItem.description
                  : 'Not specified'}
              </p>
              <div className="modal-actions">
                <button
                  className="message-btn"
                  onClick={() =>
                    router.push(`/messages`)
                  }
                >
                  Message
                </button>
              </div>

            </div>
          </div>
        </div>
      )}
    </div>
  );
}
export default Lost;
