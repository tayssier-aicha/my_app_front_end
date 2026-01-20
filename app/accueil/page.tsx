'use client';
import { useRouter } from "next/navigation";
import "./accueil.css";
import Navbar from "../navbar/pageN";

function Accueil() {
    const router=useRouter();
    return(
        <div className="accueil-container">
            <Navbar />
            <div className="content">
                <h1>Losr & Found</h1>
                <p>Welcome to the main application</p>
            </div>
        </div>
    );
}
export default Accueil;