"use client";

import { useEffect, useState, FormEvent } from "react";
import { useParams, useRouter } from "next/navigation";
import axios from "axios";
import Navbar from "../../navbar/pageN";
import "./edititem.css";

interface Item {
  _id: string;
  description?: string;
  category?: string;
  location?: string;
  date?: string;
  image?: string | File;
  type: string;
  user: any;
}

export default function EditItemPage() {
  const { id } = useParams();
  const router = useRouter();

  const [item, setItem] = useState<Item | null>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Charger l'item
  useEffect(() => {
    const fetchItem = async () => {
      try {
        setLoading(true);
        const res = await axios.get(
          `${process.env.NEXT_PUBLIC_API_URL}item/get/${id}`
        );
        setItem(res.data);
      } catch (err) {
        console.error(err);
        setError("Impossible de charger l'item.");
      } finally {
        setLoading(false);
      }
    };
    fetchItem();
  }, [id]);

  // Mettre à jour l'item
  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    if (!item) return;

    try {
      setSaving(true);
      const formData = new FormData();
      formData.append("description", item.description || "");
      formData.append("category", item.category || "");
      formData.append("location", item.location || "");
      formData.append("date", item.date || "");
      formData.append("type", item.type || "lost");

      if (item.image instanceof File) {
        formData.append("image", item.image);
      }

      await axios.put(
        `${process.env.NEXT_PUBLIC_API_URL}item/updateId/${id}`,
        formData,
        { headers: { "Content-Type": "multipart/form-data" } }
      );

      alert("Item mis à jour !");
      router.push("/lost");
    } catch (err) {
      console.error(err);
      alert("Impossible de mettre à jour l'item.");
    } finally {
      setSaving(false);
    }
  };

  if (loading) return <p className="status-message">Chargement...</p>;
  if (error) return <p className="status-message error">{error}</p>;
  if (!item) return <p className="status-message">Item introuvable</p>;

  return (
    <div className="EditItem-container">
      <Navbar />
      <div className="edit-content">
        <h1>Modifier l’Item</h1>
        <form onSubmit={handleSubmit} className="edit-form">
          <div className="form-group">
            <label>Description</label>
            <input
              type="text"
              value={item.description || ""}
              onChange={(e) => setItem({ ...item, description: e.target.value })}
              required
            />
          </div>

          <div className="form-group">
            <label>Category</label>
            <input
              type="text"
              value={item.category || ""}
              onChange={(e) => setItem({ ...item, category: e.target.value })}
            />
          </div>

          <div className="form-group">
            <label>Location</label>
            <input
              type="text"
              value={item.location || ""}
              onChange={(e) => setItem({ ...item, location: e.target.value })}
            />
          </div>

          <div className="form-group">
            <label>Date</label>
            <input
              type="date"
              value={
                item.date ? new Date(item.date).toISOString().split("T")[0] : ""
              }
              onChange={(e) => setItem({ ...item, date: e.target.value })}
            />
          </div>

          <div className="form-group">
            <label>Image</label>
            <input
              type="file"
              accept="image/*"
              onChange={(e) => {
                if (e.target.files && e.target.files[0]) {
                  setItem({ ...item, image: e.target.files[0] });
                }
              }}
            />
            {item.image && typeof item.image === "string" && (
              <img
                src={`${process.env.NEXT_PUBLIC_API_URL}uploads/${item.image}`}
                alt="Current item"
                className="preview-image"
              />
            )}
          </div>

          <button type="submit" className="save-btn" disabled={saving}>
            {saving ? "Enregistrement..." : "Enregistrer"}
          </button>
        </form>
      </div>
    </div>
  );
}
