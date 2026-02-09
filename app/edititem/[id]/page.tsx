"use client";

import { useEffect, useState, FormEvent } from "react";
import { useParams, useRouter } from "next/navigation";
import axios from "axios";
import Navbar from "../../navbar/pageN";
import "./edititem.css";
import { Loader2, X, ArrowLeft } from "lucide-react";

interface Item {
  _id: string;
  description?: string;
  category?: string;
  location?: string;
  date?: string;
  image?: string | File;
  type: "lost" | "found";
  user: any;
}

export default function EditItemPage() {
  const { id } = useParams();
  const router = useRouter();

  const [item, setItem] = useState<Item | null>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [newImage, setNewImage] = useState<File | null>(null);

  // Fetch item
  useEffect(() => {
    const fetchItem = async () => {
      try {
        setLoading(true);
        const res = await axios.get(
          `${process.env.NEXT_PUBLIC_API_URL}item/get/${id}`
        );
        const fetchedItem = res.data;
        setItem(fetchedItem);
        if (fetchedItem.image) {
          setImagePreview(
            `${process.env.NEXT_PUBLIC_API_URL}uploads/${fetchedItem.image}`
          );
        }
      } catch (err) {
        console.error(err);
        setError("Unable to load the item.");
      } finally {
        setLoading(false);
      }
    };
    fetchItem();
  }, [id]);

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setNewImage(file);
      const reader = new FileReader();
      reader.onloadend = () => setImagePreview(reader.result as string);
      reader.readAsDataURL(file);
    }
  };

  const removeNewImage = () => {
    setNewImage(null);
    if (item?.image && typeof item.image === "string") {
      setImagePreview(
        `${process.env.NEXT_PUBLIC_API_URL}uploads/${item.image}`
      );
    } else {
      setImagePreview(null);
    }
  };

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    if (!item) return;

    setError(null);
    setSaving(true);

    try {
      const formData = new FormData();
      formData.append("description", item.description?.trim() || "");
      formData.append("category", item.category || "");
      formData.append("location", item.location?.trim() || "");
      formData.append("date", item.date || "");
      formData.append("type", item.type);

      if (newImage) {
        formData.append("image", newImage);
      }

      await axios.put(
        `${process.env.NEXT_PUBLIC_API_URL}item/updateId/${id}`,
        formData,
        {
          headers: { "Content-Type": "multipart/form-data" },
        }
      );

      alert("Item updated successfully!");
      router.push(item.type === "lost" ? "/lost" : "/found");
    } catch (err: any) {
      console.error(err);
      setError(
        err.response?.data?.message || "Failed to update the item."
      );
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="edit-page">
        <Navbar />
        <div className="loading-state">
          <Loader2 className="animate-spin" size={40} />
          <p>Loading item details...</p>
        </div>
      </div>
    );
  }

  if (error || !item) {
    return (
      <div className="edit-page">
        <Navbar />
        <div className="error-state">
          <p>{error || "Item not found"}</p>
          <button onClick={() => router.back()}>Go Back</button>
        </div>
      </div>
    );
  }

  return (
    <div className="edit-page">
      <Navbar />

      <div className="edit-container">
        <div className="edit-header">
          <button className="back-btn" onClick={() => router.back()}>
            <ArrowLeft size={20} />
            Back
          </button>
          <h1>Edit Item</h1>
        </div>

        {error && <div className="form-error">{error}</div>}

        <form onSubmit={handleSubmit} className="edit-form">
          <div className="form-group">
            <label htmlFor="type">Type</label>
            <div className="type-display">
              {item.type === "lost" ? "Lost Item" : "Found Item"}
            </div>
          </div>

          <div className="form-group">
            <label htmlFor="description">Description *</label>
            <textarea
              id="description"
              value={item.description || ""}
              onChange={(e) =>
                setItem({ ...item, description: e.target.value })
              }
              rows={4}
              placeholder="Describe the item in detail..."
              required
            />
          </div>

          <div className="form-group">
            <label htmlFor="category">Category</label>
            <select
              id="category"
              value={item.category || ""}
              onChange={(e) =>
                setItem({ ...item, category: e.target.value })
              }
            >
              <option value="">Select category</option>
              <option value="electronics">Electronics</option>
              <option value="accessories">Accessories / Jewelry</option>
              <option value="clothing">Clothing / Bags</option>
              <option value="documents">Documents / Cards</option>
              <option value="keys">Keys</option>
              <option value="other">Other</option>
            </select>
          </div>

          <div className="form-row">
            <div className="form-group half">
              <label htmlFor="date">Date</label>
              <input
                id="date"
                type="date"
                value={
                  item.date
                    ? new Date(item.date).toISOString().split("T")[0]
                    : ""
                }
                onChange={(e) =>
                  setItem({ ...item, date: e.target.value })
                }
              />
            </div>

            <div className="form-group half">
              <label htmlFor="location">Location</label>
              <input
                id="location"
                type="text"
                value={item.location || ""}
                onChange={(e) =>
                  setItem({ ...item, location: e.target.value })
                }
                placeholder="City, street, landmark..."
              />
            </div>
          </div>

          <div className="form-group">
            <label>Current / New Image</label>
            <div className="image-section">
              {imagePreview ? (
                <div className="image-preview">
                  <img src={imagePreview} alt="Item preview" />
                  <button
                    type="button"
                    className="remove-image"
                    onClick={removeNewImage}
                  >
                    <X size={20} />
                  </button>
                </div>
              ) : (
                <div className="no-image">No image currently</div>
              )}

              <input
                type="file"
                accept="image/*"
                onChange={handleImageChange}
                id="image-upload"
                hidden
              />
              <label htmlFor="image-upload" className="change-image-btn">
                Change Image
              </label>
            </div>
          </div>

          <div className="form-actions">
            <button
              type="button"
              className="cancel-btn"
              onClick={() => router.back()}
              disabled={saving}
            >
              Cancel
            </button>
            <button type="submit" className="save-btn" disabled={saving}>
              {saving ? (
                <>
                  <Loader2 className="animate-spin" size={18} />
                  Saving...
                </>
              ) : (
                "Save Changes"
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}