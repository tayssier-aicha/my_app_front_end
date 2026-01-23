"use client";
import axios from "axios";
import Navbar from "../navbar/pageN";
import "./lost.css";
import { useEffect, useState } from "react";
function Lost() {
  const [items, setItems] = useState<any[]>([]);
  const fetchItems = async (type: string) => {
    try {
      const res = await axios.get(
        `${process.env.NEXT_PUBLIC_API_URL}item/get?type=${type}`,
      );
      setItems(res.data);
    } catch (err) {
      console.log(err);
    }
  };
  useEffect(() => {
    fetchItems("lost");
  }, []);
  return (
    <div className="lost-page">
      <Navbar />
      <div className="container-L">
        <h1>Lost Items</h1>
        {items.length === 0 && <p>No lost items found</p>}
        <div className="items-grid">
          {items.map((item) => (
            <div className="item-card" key={item._id}>
              <img
                src={`${process.env.NEXT_PUBLIC_API_URL}uploads/${item.image}`}
                alt={item.description || "lost"}
              />
              <h3>{item.description}</h3>
              <p>{item.location}</p>
              <span>
                {" "}
                {item.date ? new Date(item.date).toLocaleDateString() : ""}
              </span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
export default Lost;
