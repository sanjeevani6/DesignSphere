// src/components/TemplatesPage.js
import React, { useEffect, useState } from 'react';
import { useNavigate,useLocation } from 'react-router-dom';
import axios from 'axios';
import Header from '../components/Layouts/Header';

const Templates = () => {
    const [templates, setTemplates] = useState([]);
    //const [teamCode, setTeamCode] = useState(null);  // Store teamCode if available
    const navigate = useNavigate();

    const location = useLocation();
    const teamCode = location.state?.teamCode || ''; // Get teamCode from state
     console.log(teamCode)
    useEffect(() => {
        axios.get('/templates/get-templates')
            .then((response) =>{ 
                console.log("response",response.data);
                setTemplates(response.data.templates)
            })
            .catch(error => console.error('Error fetching templates:', error));
           
    
    console.log(teamCode)
}, []);

    const handleTemplateClick = (templateUrl) => {
        if (teamCode) {
            console.log(templateUrl)
            // If teamCode exists, navigate to the team design page
            navigate(`/design/team/${teamCode}`, { state: { templateUrl } });
        } else {
            // Otherwise, navigate to the individual design page
            navigate('/design', { state: { templateUrl } });
        }
    };

    return (
        <>
        <Header/>
        <div className="templates-page">
            <h2> BACKGROUND TEMPLATE</h2>
            <div className="template-grid">
                {templates.map((template, index) => (
                    <div key={index} className="template-card" onClick={() => handleTemplateClick(template.url)}>
                        <img src={template.url} alt={`Template ${index + 1}`} className="template-image" />
                        <div className="template-info">
                            <h3>{template.fileName}</h3>
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
