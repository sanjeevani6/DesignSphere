// src/components/TemplatesPage.js
import React, { useEffect, useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import axios from 'axios';
import Header from '../components/Layouts/Header';
import { Typography,Box } from '@mui/material';

const Templates = () => {
  const [templates, setTemplates] = useState([]);
  const navigate = useNavigate();
  const location = useLocation();
  const teamCode = location.state?.teamCode || '';
  
  useEffect(() => {
    axios.get('/api/v1/templates/get-templates')
      .then((response) => {
        console.log("response", response.data);
        setTemplates(response.data.templates);
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

  return (
    <>
      <Header />
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
      </div>
    </>
  );
};

export default Templates;
