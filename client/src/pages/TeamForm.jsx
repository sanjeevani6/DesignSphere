import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import socket from '../socket';
import Canvas from './Canvas';
import Header from '../components/Layouts/Header';
import { useUser } from '../context/UserContext'; 



const TeamForm = () => {
    const navigate = useNavigate();
    const { currentUser} = useUser();

    const [teamCode, setTeamCode] = useState('');
    const [isJoined, setIsJoined] = useState(false);
    const [newTeamCode, setNewTeamCode] = useState('');
    const [isAuthenticated, setIsAuthenticated] = useState(false);
    const [loading, setLoading] = useState(true);
    const [showModal, setShowModal] = useState(false);
    const [teamName, setTeamName] = useState('');
    console.log(`current user: ${currentUser}`)
    const userId = currentUser?.userId || null;
     console.log(userId)
     useEffect(() => {
        console.log("🧠 TeamForm: loading =", loading);
        console.log("👤 TeamForm: currentUser =", currentUser);
      }, [currentUser]);
    useEffect(() => {
          console.log(`current user ${currentUser}`)
          if (currentUser === undefined) {
            // Still loading user from context — don't do anything yet
            return;
        }
               
        
        if (currentUser && currentUser.userId) {
            setIsAuthenticated(true);
        } else {
            navigate('/login', { replace: true });
            return;
        }
        setLoading(false);
    }, [navigate, currentUser]);

    

    const createTeam = async () => {
        if (!userId) {
            console.error("User not logged in or userId is missing");
            return;
        }
        try {
            const response = await axios.post('/api/v1/teams/create-team', { teamName, userId });
            const { teamCode } = response.data;
            setNewTeamCode(teamCode);
            setIsJoined(true);
            setShowModal(true);
            socket.emit('joinTeam', { teamCode, userId });
        } catch (error) {
            console.error('Error creating team:', error);
        }
    };

    const joinTeam = async () => {
        const userId = currentUser?.userId;
        if (!userId) {
            console.error("User not logged in or userId is missing");
            return;
        }
        try {
            const response = await axios.post('/api/v1/teams/join-team', { teamCode, userId });
            if (response.data) {
                setIsJoined(true);
                socket.emit('joinRoom', {
                    teamCode, callback: (response) => {
                        if (response.status === 'success') {
                            console.log(`Joined room successfully: ${response.room}`);
                        } else {
                            console.error(`Failed to join room: ${response.message}`);
                        }
                    }
                });
                navigate(`/design/team/${teamCode}`);
            } else {
                alert('Team not found');
            }
        } catch (error) {
            console.error('Error joining team:', error);
        }
    };

    const handleModalClose = () => {
        setShowModal(false);
        navigate(`/design/team/${newTeamCode}`);
    };

    socket.on(`design-updated-${teamCode}`, (updatedDesign) => {
        console.log('Design updated:', updatedDesign);
    });

    if (loading) return <p>Loading...</p>;

    return (
        <>
            <Header />
            <div style={{
                height: "91vh",
                display: 'flex',
                backgroundColor: '#fffdf0',
                fontFamily: 'Arial, sans-serif',
                alignItems: 'center',
                justifyContent: 'center'
            }}>
                <div style={{ float: 'left', width: '50%' }}>
                    <img
                        src="https://img.freepik.com/premium-photo/team-designing-scalable-ui-elements-that-adjust-different-screen-sizes_1314467-49185.jpg"
                        alt="Team Design Illustration"
                        style={{ height: "91vh", width: "100%", objectFit: 'cover', borderRadius: '8px', boxShadow: '0 4px 12px rgba(0, 0, 0, 0.1)' }}
                    />
                </div>

                {isAuthenticated && !isJoined ? (
                    <div style={{
                        height: "91vh",
                        maxWidth: "50%",
                        padding: '3rem',
                        textAlign: 'center',
                        background: '#fffdf0',
                        borderRadius: '8px',
                        boxShadow: '0 4px 12px rgba(0, 0, 0, 0.1)'
                    }}>
                        <h1 style={{ fontSize: "2.5rem", color: '#519bc5', fontWeight: 'bold' }}>Collaborate with Your Team</h1>
                        <div style={{ marginTop: '5vh' }}>
                            <h3 style={{ color: '#e46064' }}>Create a Team</h3>
                            <input
                                type="text"
                                placeholder="Team Name"
                                value={teamName}
                                onChange={(e) => setTeamName(e.target.value)}
                                style={{
                                    width: "70%",
                                    padding: "10px",
                                    margin: "10px 0",
                                    borderRadius: "8px",
                                    border: "1px solid #519bc5",
                                    backgroundColor: "#fffdf0",
                                    fontSize: '14px',
                                    color: '#333'
                                }}
                            />
                            <button
                                onClick={createTeam}
                                style={{
                                    backgroundColor: "#519bc5",
                                    color: "#fffdf0",
                                    border: "none",
                                    borderRadius: "8px",
                                    padding: "12px",
                                    width: '75%',
                                    fontWeight: 'bold',
                                    marginBottom: '2rem',
                                    cursor: 'pointer',
                                    transition: 'background-color 0.3s ease'
                                }}
                                onMouseOver={e => e.target.style.backgroundColor = "#004bbd"}
                                onMouseOut={e => e.target.style.backgroundColor = "#519bc5"}
                            >
                                Create a New Team
                            </button>

                            <div style={{ marginTop: '20px' }}>
                                <h3 style={{ color: '#e46064' }}>Or Join an Existing Team</h3>
                                <input
                                    type="text"
                                    placeholder="Enter Team Code"
                                    value={teamCode}
                                    onChange={(e) => setTeamCode(e.target.value)}
                                    style={{
                                        width: "70%",
                                        padding: "10px",
                                        margin: "10px 0",
                                        borderRadius: "8px",
                                        border: "1px solid #519bc5",
                                        backgroundColor: "#fffdf0",
                                        fontSize: '14px',
                                        color: '#333'
                                    }}
                                />
                                <button
                                    onClick={joinTeam}
                                    style={{
                                        backgroundColor: "#90b0e6",
                                        color: "#fffdf0",
                                        border: "none",
                                        borderRadius: "8px",
                                        padding: "12px",
                                        width: '75%',
                                        fontWeight: 'bold',
                                        cursor: 'pointer',
                                        transition: 'background-color 0.3s ease'
                                    }}
                                    onMouseOver={e => e.target.style.backgroundColor = "#004bbd"}
                                    onMouseOut={e => e.target.style.backgroundColor = "#90b0e6"}
                                >
                                    Join Team
                                </button>
                            </div>
                        </div>
                    </div>
                ) : (
                    <div style={{ padding: '2rem', color: '#519bc5' }}>
                        <h1>Welcome to Team <span style={{ color: '#e46064' }}>{teamCode || newTeamCode}</span></h1>
                        <Canvas teamCode={teamCode || newTeamCode} />
                    </div>
                )}

                {showModal && (
                    <div style={{
                        position: 'fixed',
                        top: 0,
                        left: 0,
                        right: 0,
                        bottom: 0,
                        background: 'rgba(0, 0, 0, 0.5)',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        zIndex: 1000
                    }}>
                        <div style={{
                            background: '#fffdf0',
                            padding: '30px',
                            width: '400px',
                            maxWidth: '90%',
                            borderRadius: '8px',
                            boxShadow: '0 4px 12px rgba(0, 0, 0, 0.3)',
                            textAlign: 'center'
                        }}>
                            <h2 style={{ color: '#333', marginBottom: '15px' }}>Your Team Code</h2>
                            <div style={{
                                fontSize: '24px',
                                color: '#0066ff',
                                fontWeight: 'bold',
                                background: '#f0f8ff',
                                padding: '10px',
                                borderRadius: '5px',
                                marginTop: '10px'
                            }}>
                                {newTeamCode}
                            </div>
                            <button
                                onClick={handleModalClose}
                                style={{
                                    marginTop: '20px',
                                    padding: '10px 20px',
                                    backgroundColor: '#0066ff',
                                    color: 'white',
                                    border: 'none',
                                    borderRadius: '5px',
                                    cursor: 'pointer',
                                    fontSize: '16px'
                                }}
                                onMouseOver={e => e.target.style.backgroundColor = "#004bbd"}
                                onMouseOut={e => e.target.style.backgroundColor = "#0066ff"}
                            >
                                Continue
                            </button>
                        </div>
                    </div>
                )}
            </div>
        </>
    );
};

export default TeamForm;
