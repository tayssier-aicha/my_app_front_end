'use client';

import "./reportf.css";
import Navbar from "../navbar/pageN";
import { useState } from "react";
import axios from "axios";
import { Loader2, Upload, X } from "lucide-react";

function ReportItem() {
  const [type, setType] = useState<"lost" | "found" | "">("");
  const [description, setDescription] = useState("");
  const [location, setLocation] = useState("");
  const [category, setCategory] = useState("");
  const [date, setDate] = useState("");
  const [image, setImage] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setImage(file);
      const reader = new FileReader();
      reader.onloadend = () => {
        setImagePreview(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const removeImage = () => {
    setImage(null);
    setImagePreview(null);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setLoading(true);

    const userStr = localStorage.getItem("user");
    if (!userStr) {
      setError("You must be logged in to report an item.");
      setLoading(false);
      return;
    }

    let userId;
    try {
      const user = JSON.parse(userStr);
      userId = user._id;
    } catch {
      setError("Session error. Please log in again.");
      setLoading(false);
      return;
    }

    if (!userId) {
      setError("You must be logged in to report an item.");
      setLoading(false);
      return;
    }

    const formData = new FormData();
    formData.append("type", type);
    formData.append("description", description.trim());
    formData.append("category", category);
    formData.append("location", location.trim());
    formData.append("date", date);
    formData.append("user", userId);
    if (image) {
      formData.append("image", image);
    }

    try {
      const response = await axios.post(
        `${process.env.NEXT_PUBLIC_API_URL}item/add`,
        formData,
        {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        }
      );

      alert("Item reported successfully!");
      
      // Reset form
      setType("");
      setDescription("");
      setCategory("");
      setLocation("");
      setDate("");
      setImage(null);
      setImagePreview(null);
    } catch (err: any) {
      console.error("Error reporting item:", err);
      setError(
        err.response?.data?.message ||
        "Failed to report item. Please try again."
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="report-page">
      <Navbar />

      <div className="report-container">
        <h1>Report a Lost or Found Item</h1>
        <p className="subtitle">
          Help reunite items with their owners — thank you for contributing!
        </p>

        {error && <div className="form-error">{error}</div>}

        <form className="report-form" onSubmit={handleSubmit}>
          <div className="form-group">
            <label htmlFor="type">Type *</label>
            <div className="radio-group">
              <label className={`radio-label ${type === "lost" ? "selected" : ""}`}>
                <input
                  type="radio"
                  id="lost"
                  name="type"
                  value="lost"
                  checked={type === "lost"}
                  onChange={(e) => setType(e.target.value as "lost" | "found")}
                  required
                />
                Lost Item
              </label>

              <label className={`radio-label ${type === "found" ? "selected" : ""}`}>
                <input
                  type="radio"
                  id="found"
                  name="type"
                  value="found"
                  checked={type === "found"}
                  onChange={(e) => setType(e.target.value as "lost" | "found")}
                />
                Found Item
              </label>
            </div>
          </div>

          <div className="form-group">
            <label htmlFor="category">Category *</label>
            <select
              id="category"
              value={category}
              onChange={(e) => setCategory(e.target.value)}
              required
            >
              <option value="">Select a category</option>
              <option value="electronics">Electronics</option>
              <option value="accessories">Accessories / Jewelry</option>
              <option value="clothing">Clothing / Bags</option>
              <option value="documents">Documents / Cards</option>
              <option value="keys">Keys</option>
              <option value="other">Other</option>
            </select>
          </div>

          <div className="form-group">
            <label htmlFor="description">Description *</label>
            <textarea
              id="description"
              placeholder="Describe the item in detail (color, brand, features, condition...)"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              rows={4}
              required
            />
          </div>

          <div className="form-row">
            <div className="form-group half">
              <label htmlFor="date">Date *</label>
              <input
                id="date"
                type="date"
                value={date}
                onChange={(e) => setDate(e.target.value)}
                required
              />
            </div>

            <div className="form-group half">
              <label htmlFor="location">Location *</label>
              <input
                id="location"
                type="text"
                placeholder="Where was it lost / found? (city, street, landmark...)"
                value={location}
                onChange={(e) => setLocation(e.target.value)}
                required
              />
            </div>
          </div>

          <div className="form-group">
            <label>Photo of the item (recommended) *</label>
            <div className="image-upload-area">
              <input
                type="file"
                accept="image/*"
                onChange={handleImageChange}
                id="image-upload"
                hidden
                required={!imagePreview}
              />
              <label htmlFor="image-upload" className="upload-label">
                <Upload size={28} />
                <span>Choose Image</span>
              </label>

              {imagePreview && (
                <div className="image-preview">
                  <img src={imagePreview} alt="Preview" />
                  <button
                    type="button"
                    className="remove-image"
                    onClick={removeImage}
                  >
                    <X size={20} />
                  </button>
                </div>
              )}
            </div>
          </div>

          <button
            type="submit"
            className="submit-button"
            disabled={loading || !type || !category || !description.trim() || !date || !location.trim()}
          >
            {loading ? (
              <>
                <Loader2 className="animate-spin" size={20} />
                Submitting...
              </>
            ) : (
              "Submit Report"
            )}
          </button>
        </form>
      </div>
    </div>
  );
}

export default ReportItem;