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
                socket.emit('joinTeam', { teamCode, userId });
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
        <div className="team-form-container">
            {isAuthenticated && !isJoined ? (
                <div className="form-content">
                    <h1>Collaborate with Your Team</h1>
                    <h3>Create a Team</h3>
                    <input
                    type="text"
                    placeholder="Team Name"
                    value={teamName}
                    onChange={(e) => setTeamName(e.target.value)}
                />
                    <button className="create-team-btn" onClick={createTeam}>Create a New Team</button>
                    <div className="join-section">
                        <h3>Or Join an Existing Team</h3>
                        <input
                            type="text"
                            placeholder="Enter Team Code"
                            value={teamCode}
                            onChange={(e) => setTeamCode(e.target.value)}
                            className="team-input"
                        />
                        <button className="join-team-btn" onClick={joinTeam}>Join Team</button>
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
