import React, { useEffect, useState } from 'react';
import { useNavigate} from 'react-router-dom'; // Import useHistory for navigation
import Layout from '../components/Layouts/Layout';
import axios from 'axios';
import { FiUsers } from 'react-icons/fi'; // Import an icon for collaboration



const Homepage = () => {
    const [userDesigns, setUserDesigns] = useState([]);
    const [teamDesigns, setTeamDesigns] = useState([]);
    const navigate = useNavigate(); // Initialize navigate for navigation
    // Get the user data from localStorage
const user = JSON.parse(localStorage.getItem('user'));


// Check if the user exists and get the userId
const userId = user ? user._id : null; // Replace 'id' with the actual key for user ID in your user object

    
  
    useEffect(() => {
        const fetchDesigns = async () => {
          try{
          
           if (userId) {
            // Otherwise, fetch user-specific designs
           
          const userResponse = await axios.get(`/designs/user/${userId}`);
          setUserDesigns(userResponse.data.designs);
          setTeamDesigns(userResponse.data.TeamDesigns);
          }
  
          
        } catch (error) {
          console.error('Error fetching designs:', error);
        }
    
     };

        if (userId) {
            fetchDesigns();
        } else {
            console.error('No userId or teamcode provided');
        }
    }, [userId]);
  
    const handleDesignClick = (designId, isTeamDesign = false) => {
      // Navigate to different paths based on design type
      if (isTeamDesign) {
        navigate(`/design/team/${designId}`);
      } else {
        navigate(`/design/${designId}`);
      }
    };

    const handleCollaborateClick = () => {
      navigate('/teams');
    };

  
    return (
      <Layout>
        <div className="homepage-container">
          <div className="options">
            <h1>Options</h1>
            
            <div className="collaborate-card" onClick={handleCollaborateClick}>
                        <FiUsers size={20} className="collaborate-icon" />
                        <h3>Collaborate with Friends</h3>
                        <p>Invite friends to work together on projects in real time.</p>
                    </div>
          </div>
          <div className="mainarea">
            <h2> YOUR DESIGNS</h2>
            <div className="design-cards">
              {userDesigns.map((design) => (
                <div
                  key={design._id}
                  className="design-card"
                  onClick={() => handleDesignClick(design._id)} // Click handler for navigation
                >
                  <h3>{design.title}</h3>
                  <p>Created at: {new Date(design.createdAt).toLocaleDateString()}</p>
                </div>
              ))}
            </div>
            {/* Section for Team Designs */}
          {teamDesigns.length > 0 && (
            <>
              <h2>TEAM PROJECTS</h2>
              <div className="design-cards team-design-cards">
                {teamDesigns.map((design) => (
                  <div
                    key={design._id}
                    className="design-card team-design-card"
                    onClick={() => handleDesignClick(design.teamCode, true)}
                  >
                    <h3>{design.teamName}</h3>
                    <p>Team Project</p>
                    <p>Created at: {new Date(design.createdAt).toLocaleDateString()}</p>
                  </div>
                ))}
              </div>
            </>
          )}

          </div>
        </div>
      </Layout>
    );
  };
  
  export default Homepage;
  

