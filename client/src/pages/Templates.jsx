// src/components/TemplatesPage.js
import React, { useEffect, useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import axios from 'axios';
import Header from '../components/Layouts/Header';
import { Typography,Box,Button } from '@mui/material';
import { fetchTemplatesFromUnsplash } from '../services/unsplashService.js'; 

const Templates = ({user}) => {
  const [templates, setTemplates] = useState([]);
  const navigate = useNavigate();
  const location = useLocation();
  const teamCode = location.state?.teamCode || '';
  const [originalTemplates, setOriginalTemplates] = useState([]);
  useEffect(() => {
    axios.get('/api/v1/templates/get-templates')
      .then(async (response) => {
        console.log("response", response.data);
         const apiTemplates = await  fetchTemplatesFromUnsplash('background');
         console.log('🟢 Unsplash templates:', apiTemplates);
        if (apiTemplates.length > 0) {
          setTemplates(apiTemplates);}
        setTemplates(response.data.templates);
         const allTemplates = [...response.data.templates, ...apiTemplates];
         setOriginalTemplates(allTemplates); // save origina
        if (apiTemplates.length > 0) {
          setTemplates(prev => [...prev, ...apiTemplates]);}
      })
      .catch(error => console.error('Error fetching templates:', error));
    console.log(teamCode);
  }, [teamCode]);

  const handleTemplateClick = (templateUrl) => {
    if (teamCode) {
      navigate(`/design/team/${teamCode}`, { state: { templateUrl } });
    } else {
      navigate('/design', { state: { templateUrl } });
    }
  };



const [inputValue, setInputValue] = useState('');
const handleSearch = async () => {
  try {
    const keyword = inputValue.trim() || 'background';
    
   
    const searchResults = await fetchTemplatesFromUnsplash(keyword, 1);
    setTemplates(searchResults); // Replace old ones
     setInputValue(''); // ⬅️ This clears the input box
  } catch (error) {
    console.error('Error during keyword search:', error);
  }
};

const handleResetTemplates = () => {
  setTemplates(originalTemplates);
  setSearchKeyword('background');
  setSearchPage(1);
};




  return (
    <>
      <Header user={user} />
      <div className="templates-page">
      <Box 
  sx={{
    background: 'linear-gradient(135deg, #c3d4f0,#90b0e6)',
    padding: { xs: '10px', sm: '20px' },
    borderRadius: '12px',
    boxShadow: '0 4px 12px rgba(0, 0, 0, 0.2)',
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    margin: '20px auto',
    width: { xs: '90%', sm: 'auto' }
  }}
>
  <Typography 
    variant="h4" 
    className="templates-header"
    sx={{ 
      fontWeight: "bold",
      fontFamily: "'Chewy', cursive",
      letterSpacing: "2px",
      color: "#fff",
      textShadow: "2px 2px 5px rgba(0,0,0,0.3)",
      fontSize: { xs: '1.5rem', sm: '2rem' },
      textAlign: 'center',
      overflowWrap: 'break-word',
      wordBreak: 'break-word',
      whiteSpace: 'normal',
      maxWidth: '100%'
    }}
  >
    BACKGROUND TEMPLATES
  </Typography>
</Box>
      <Box display="flex" justifyContent="center" alignItems="center" gap={2} mt={3}>
  <input 
    type="text" 
    placeholder="Search templates (e.g., nature, tech, campus)" 
    value={inputValue} 
    onChange={(e) => setInputValue(e.target.value)} 
    style={{ padding: '8px', borderRadius: '5px', width: '250px' }}
  />
  <Button variant="contained" onClick={handleSearch}>Search</Button>
</Box>

        <div className="template-grid">
          {templates.map((template, index) => (
            <div 
              key={index} 
              className="template-card animated-card"
              onClick={() => handleTemplateClick(template.url)}
            >
              <img src={template.url} alt={`Template ${index + 1}`} className="template-image" />
              <div className="template-info">
                <Typography 
                  variant="h6" 
                  sx={{ 
                    fontFamily: "'Chewy', cursive",
                    letterSpacing: "2px",
                    color: "black",
                    textShadow: "2px 2px 5px rgba(0,0,0,0.3)",
                  }}
                >
                  {template.fileName}
                </Typography>
                <p>Click to edit this template</p>
              </div>
            </div>
          ))}
        </div>
        <Button onClick={handleResetTemplates} variant="contained" color="secondary">
    Back
  </Button>
      </div>
    </>
  );
};

export default Templates;
