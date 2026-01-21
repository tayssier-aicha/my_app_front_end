'use client';
import { useRouter } from "next/navigation";
import "./accueil.css";
import Navbar from "../navbar/pageN";
import { useEffect,useState } from "react";

function Accueil() {
    /*const router=useRouter();
    const [checked, setChecked] = useState(false);
    useEffect(()=>{
        const token=localStorage.getItem('token');
        if(!token){
            router.replace('/login')
        }
        else{
            setChecked(true)
        }
    },[])
    if(!checked){
        return null;
    }*/
    return(
        <div className="accueil-container">
            <Navbar />
            <div className="content">
                <h1>Lost & Found application</h1>
                <p>is a platform where users can report lost items or declare found ones.
                Together, we help each other recover what matters.</p>
            </div>
            <div className="lost">
                Lost
            </div>
            <div className="found">
                Found
            </div>
        </div>
    );
}
export default Accueil;