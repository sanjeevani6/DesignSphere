// src/components/TeamForm.js

import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import socket from '../socket';
import Canvas from './Canvas';
import './TeamForm.css';
import Header from '../components/Layouts/Header';

const TeamForm = () => {
    const navigate = useNavigate();
   const [teamCode, setTeamCode] = useState('');
    const [isJoined, setIsJoined] = useState(false);
    const [newTeamCode, setNewTeamCode] = useState('');
    const [isAuthenticated, setIsAuthenticated] = useState(false);
    const [loading, setLoading] = useState(true);
    const [showModal, setShowModal] = useState(false); // State for the modal

    const [teamName, setTeamName] = useState('');
    

    useEffect(() => {
        const user = JSON.parse(localStorage.getItem('user'));
        if (user && user._id) {
            setIsAuthenticated(true);
        } else {
            navigate('/login', { replace: true });
            return;
        }
        setLoading(false);
    }, [navigate]);

    const user = JSON.parse(localStorage.getItem('user'));
    const userId = user ? user._id : null;

    const createTeam = async () => {
        if (!userId) {
            console.error("User not logged in or userId is missing");
            return;
        }
        try {
            const response = await axios.post('/teams/create-team', { teamName,userId });
            const { teamCode } = response.data;
           setNewTeamCode(teamCode);
            setIsJoined(true);
            setShowModal(true); // Show modal on team creation
            //navigate(`/design/${teamCode}`)
            socket.emit('joinTeam', { teamCode, userId });
        } catch (error) {
            console.error('Error creating team:', error);
        }
    };

    const joinTeam = async () => {
        if (!userId) {
            console.error("User not logged in or userId is missing");
            return;
        }
        try {
            console.log("a")
            const response = await axios.post('/teams/join-team', { teamCode, userId });
            if (response.data) {
                setIsJoined(true);
                socket.emit('joinRoom', {teamCode, callback:(response) => {
                    if (response.status === 'success') {
                        console.log(`Joined room successfully: ${response.room}`);
                    } else {
                        console.error(`Failed to join room: ${response.message}`);
                    }
            }});
                console.log(`blah blah blah ${teamCode}` );
                navigate(`/design/team/${teamCode}`);
            } else {
                alert('Team not found');
            }
        } catch (error) {
            console.error('Error joining team:', error);
        }
    };

    const handleModalClose = () => {
        setShowModal(false); // Close the modal
        navigate(`/design/team/${newTeamCode}`); // Navigate to design page
    };

    // Listen for real-time design updates
    socket.on(`design-updated-${teamCode}`, (updatedDesign) => {
        // Handle real-time design updates, such as updating the design in state
        console.log('Design updated:', updatedDesign);
        // Possibly implement further updates to the local state
    });

    if (loading) return <p>Loading...</p>;

    return (
        <>
        <Header/>
        <div style={{height:"91vh", display:'flex'}}className=" mw-1/2 team-form-container">
    
            <div style={{float:'left' , width: '50% '}} className="w-1/2  justify-center bg-white">
                <img 
                    src="https://img.freepik.com/premium-photo/team-designing-scalable-ui-elements-that-adjust-different-screen-sizes_1314467-49185.jpg"
                    alt="Team Design Illustration"
                     style={{height:"91vh", width:"100%"}} 
                    className="w-3/4 rounded-lg shadow-lg"
                />
            </div>
            {isAuthenticated && !isJoined ? (
                <div style={{height:"91vh", maxWidth:"50%"}}className="form-content">
                    <h1 style={{ fontFamily:"", fontSize:"300%"}}>Collaborate with Your Team</h1>
                    <div style={{marginTop:'10vh'}}>
                    <h3>Create a Team</h3>
                    <input
                    style={{width:"50%"}}
                    type="text"
                    placeholder="Team Name"
                    value={teamName}
                    onChange={(e) => setTeamName(e.target.value)}
                    className="team-input"
                />
                    <button style={{backgroundColor:"#684B74", width:'70%'}}className="create-team-btn " onClick={createTeam}>Create a New Team</button>
                    <div className="join-section">
                        <h3>Or Join an Existing Team</h3>
                        <input
                        style={{width:"50%"}}
                            type="text"
                            placeholder="Enter Team Code"
                            value={teamCode}
                            onChange={(e) => setTeamCode(e.target.value)}
                            className="team-input"
                        />
                        <button style={{backgroundColor:"#684B74", width:'70%'}} className="join-team-btn" onClick={joinTeam}>Join Team</button>
                    </div>
                    </div>
                </div>
            ) : (
                <div className="canvas-section">
                    <h1>Welcome to Team {teamCode || newTeamCode}</h1>
                    <Canvas teamCode={teamCode || newTeamCode} />
                </div>
            )}
        
            
            {showModal && (
                <div className="modal-overlay">
                    <div className="modal-content">
                        <h2>Team Created Successfully!</h2>
                        <p>Your team code is:</p>
                        <div className="team-code-box">{newTeamCode}</div>
                        <p>Share this code with your friends to collaborate.</p>
                        <button className="continue-btn" onClick={handleModalClose}>Continue</button>
                    </div>
                </div>
            )}
        </div>
        </>
    );
};

export default TeamForm;




