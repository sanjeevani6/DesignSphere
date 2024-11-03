import React, { useEffect, useState } from 'react';
import { useNavigate} from 'react-router-dom'; // Import useHistory for navigation
import Layout from '../components/Layouts/Layout';
import axios from 'axios';


const Homepage = () => {
    const [designs, setDesigns] = useState([]);
    const navigate = useNavigate(); // Initialize navigate for navigation
    // Get the user data from localStorage
const user = JSON.parse(localStorage.getItem('user'));

// Check if the user exists and get the userId
const userId = user ? user._id : null; // Replace 'id' with the actual key for user ID in your user object

    
  
    useEffect(() => {
        const fetchDesigns = async () => {
            try {
                const response = await axios.get(`/designs/${userId}`);
                setDesigns(response.data);
            } catch (error) {
                console.error('Error fetching designs:', error);
            }
        };

        if (userId) {
            fetchDesigns();
        } else {
            console.error('No userId provided');
        }
    }, [userId]);
  
    const handleDesignClick = (designId) => {
      // Navigate to the canvas area with the design ID
      navigate(`/canvas/${designId}`); // Use navigate instead of history.push
    };
  
    return (
      <Layout>
        <div className="homepage-container">
          <div className="options">
            <h2>Options</h2>
            <p>This is the options content.</p>
          </div>
          <div className="mainarea">
            <h2> YOUR DESIGNS</h2>
            <div className="design-cards">
              {designs.map((design) => (
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
          </div>
        </div>
      </Layout>
    );
  };
  
  export default Homepage;
  

