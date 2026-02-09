"use client";
import axios from "axios";
import Navbar from "../navbar/pageN";
import "./lost.css";
import { useEffect, useState } from "react";
import { X, MessageSquare, Edit, Trash2 } from "lucide-react";
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
  const [selectedItem, setSelectedItem] = useState<Item | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [creatingChat, setCreatingChat] = useState(false);
  const [currentUser, setCurrentUser] = useState<any>({});

  const router = useRouter();

  useEffect(() => {
    const userStr = localStorage.getItem("user");
    if (userStr) {
      setCurrentUser(JSON.parse(userStr));
    }
  }, []);

  const fetchItems = async () => {
    try {
      setLoading(true);
      setError(null);
      const res = await axios.get(
        `${process.env.NEXT_PUBLIC_API_URL}item/get?type=lost`
      );
      const data = Array.isArray(res.data) ? res.data : [];
      setItems(data);
    } catch (err) {
      console.error("Failed to fetch lost items:", err);
      setError("Unable to load lost items at the moment.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchItems();
  }, []);

  const handleMessageOwner = async () => {
    if (!selectedItem) return;
    if (!currentUser?._id) {
      alert("You must be logged in to send a message");
      return;
    }

    const ownerId = selectedItem.user?._id;
    if (!ownerId) {
      alert("Cannot contact the owner of this item.");
      return;
    }
    if (ownerId === currentUser._id) {
      alert("This is your own listing.");
      return;
    }

    setCreatingChat(true);
    try {
      const res = await axios.post(
        `${process.env.NEXT_PUBLIC_API_URL}conversation/create`,
        {
          senderId: currentUser._id,
          receiverId: ownerId,
        }
      );
      const convId = res.data._id;
      router.push(`/messages?conv=${convId}`);
    } catch (err) {
      console.error("Error creating conversation:", err);
      alert("Unable to start the conversation right now.");
    } finally {
      setCreatingChat(false);
    }
  };

  const handleDeleteItem = async (itemId: string) => {
    if (!confirm("Are you sure you want to delete this listing?")) return;
    if (!currentUser?._id) {
      alert("You must be logged in");
      return;
    }

    try {
      await axios.delete(
        `${process.env.NEXT_PUBLIC_API_URL}item/delete/${itemId}`,
        {
          data: { userId: currentUser._id },
        }
      );
      alert("Listing deleted successfully");
      setSelectedItem(null);
      fetchItems();
    } catch (err) {
      console.error(err);
      alert("Error while deleting the listing");
    }
  };

  return (
    <div className="lost-page">
      <Navbar />

      <div className="container-L">
        <h1>Lost Items</h1>

        {loading && <div className="status-message loading">Loading listings...</div>}

        {error && <div className="status-message error">{error}</div>}

        {!loading && !error && items.length === 0 && (
          <div className="status-message empty">
            No lost items have been reported yet
          </div>
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
                <div className="card-image-container">
                  {item.image ? (
                    <img
                      src={`${process.env.NEXT_PUBLIC_API_URL}uploads/${item.image}`}
                      alt={item.description || "Lost item"}
                      className="item-image"
                      onError={(e) => {
                        (e.target as HTMLImageElement).src = "/placeholder-image.jpg";
                        (e.target as HTMLImageElement).alt = "Image unavailable";
                      }}
                    />
                  ) : (
                    <div className="no-image-placeholder">
                      No image
                    </div>
                  )}
                </div>

                <div className="item-info">
                  <h3 className="item-title">
                    {item.description?.slice(0, 60) || "Item without description"}
                    {item.description && item.description.length > 60 ? "..." : ""}
                  </h3>
                  <div className="item-meta">
                    <span className="location">{item.location || "Location not specified"}</span>
                    <span className="date">
                      {item.date
                        ? new Date(item.date).toLocaleDateString("en-US", {
                            month: "short",
                            day: "numeric",
                            year: "numeric",
                          })
                        : "Date unknown"}
                    </span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {selectedItem && (
        <div className="modal-overlay" onClick={() => setSelectedItem(null)}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()}>
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
                  alt={selectedItem.description || "Lost item"}
                  className="modal-image"
                />
              ) : (
                <div className="no-image-placeholder large">
                  Image not available
                </div>
              )}
            </div>

            <div className="modal-body">
              <h2>{selectedItem.description || "Lost Item"}</h2>

              <div className="modal-info-grid">
                <div>
                  <strong>Location</strong>
                  <p>{selectedItem.location || "—"}</p>
                </div>
                <div>
                  <strong>Date</strong>
                  <p>
                    {selectedItem.date
                      ? new Date(selectedItem.date).toLocaleDateString("en-US", {
                          month: "long",
                          day: "numeric",
                          year: "numeric",
                        })
                      : "—"}
                  </p>
                </div>
                <div>
                  <strong>Category</strong>
                  <p>{selectedItem.category || "—"}</p>
                </div>
                <div>
                  <strong>Posted by</strong>
                  <p>{selectedItem.user?.name || "—"}</p>
                </div>
              </div>

              <div className="modal-description">
                <strong>Full Description</strong>
                <p>{selectedItem.description || "No description provided."}</p>
              </div>

              <div className="modal-actions">
                {selectedItem.user?._id === currentUser._id ? (
                  <>
                    <button
                      className="edit-btn"
                      onClick={() => router.push(`/edititem/${selectedItem._id}`)}
                    >
                      <Edit size={18} /> Edit
                    </button>
                    <button
                      className="delete-btn"
                      onClick={() => handleDeleteItem(selectedItem._id)}
                    >
                      <Trash2 size={18} /> Delete
                    </button>
                  </>
                ) : (
                  <button
                    className="message-btn"
                    onClick={handleMessageOwner}
                    disabled={creatingChat}
                  >
                    <MessageSquare size={18} />
                    {creatingChat ? "Opening..." : "Contact Owner"}
                  </button>
                )}
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default Lost;