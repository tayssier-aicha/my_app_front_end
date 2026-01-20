'use client';
import "./found.css";
import { useRouter } from "next/navigation";
import Navbar from "../navbar/pageN";

function Found() {
    const router=useRouter();
    return(
        <div className="found-container">
            <Navbar />
            <div className="content">
                <h1>Found</h1>
            </div>
        </div>
        
        
    );
}

export default Found;