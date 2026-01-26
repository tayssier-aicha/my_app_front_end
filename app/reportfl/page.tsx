'use client';
import "./reportf.css";
import Navbar from "../navbar/pageN";
import { useState } from "react";
import axios from "axios";
import { Loader2 } from "lucide-react";

function Report_Found() {
  const [type, setType] = useState('');
  const [description, setDescription] = useState('');
  const [location, setLocation] = useState('');
  const [category,setCategory]=useState('');
  const [date, setDate] = useState('');
  const [image, setImage] = useState<File | null>(null);
  const [loading, setLoading] = useState(false);

  const handleReport = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    const userId = localStorage.getItem('userId'); 

    if (!userId) {
      alert("You must be logged in to report an item.");
      setLoading(false);
      return;
    }

   
    const formData = new FormData();
    formData.append("type", type);
    formData.append("description", description);
    formData.append("category",category);
    formData.append("location", location);
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
            'Content-Type': 'multipart/form-data',
          },
        }
      );
      console.log("Item reported successfully:", response.data);
      setType('');
      setDescription('');
      setCategory('');
      setLocation('');
      setDate('');
      setImage(null);

    } catch (err) {
      console.error("Error reporting item:", err);
      alert("Failed to report item. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="Report-F-container">
      <Navbar />
      <div className="content-l-s">
        <h1>Report Found/Lost</h1>
        <form className="form-box" onSubmit={handleReport}>
          <div className="form-group">
            <label htmlFor="type">Type</label>
            <input
              id="type"
              type="text"
              placeholder="lost or found"
              value={type}
              onChange={(e) => setType(e.target.value.trim())}
              required
              autoComplete="type"
              autoFocus
            />
          </div>

          <div className="form-group">
            <label htmlFor="description">Description</label>
            <input
              id="description"
              type="text"
              placeholder="Item Description"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              required
            />
          </div>
          <div className="form-group">
          <label htmlFor="category">Category</label>
          <select
            id="category"
            value={category}
            onChange={(e) => setCategory(e.target.value)}
            required
          >
            <option value="">Select category</option>
            <option value="mobile">Electronics</option>
            <option value="accessories">Accessories</option>
            <option value="clothing">Clothing</option>
          </select>
        </div>

          <div className="form-group">
            <label htmlFor="date">Date</label>
            <input
              id="date"
              type="date"
              value={date}
              onChange={(e) => setDate(e.target.value)}
              required
            />
          </div>

          <div className="form-group">
            <label htmlFor="location">Location</label>
            <input
              id="location"
              type="text"
              placeholder="location of found"
              value={location}
              onChange={(e) => setLocation(e.target.value)}
              required
            />
          </div>

          <div className="form-group">
            <label>Image</label>
            <input
              type="file"
              accept="image/*"
              onChange={(e) => e.target.files && setImage(e.target.files[0])}
              required
            />
          </div>

          <button type="submit" className="signup-btn" disabled={loading}>
            {loading ? (
              <>
                <Loader2 className="animate-spin" size={20} />
                reporting...
              </>
            ) : (
              'Report Found'
            )}
          </button>
        </form>
      </div>
    </div>
  );
}

export default Report_Found;