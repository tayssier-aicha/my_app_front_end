'use client';
import "./profile.css";
import Navbar from "../navbar/pageN";

function Profile() {
    return(
        <div className="profile-container">
            <Navbar />
            <div className="content">
                <h1>Profile</h1>
            </div>
        </div>
    );
}

export default Profile;