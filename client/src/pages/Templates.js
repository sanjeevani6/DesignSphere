// src/components/TemplatesPage.js
import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import Header from '../components/Layouts/Header';

const Templates = () => {
    const [templates, setTemplates] = useState([]);
    const navigate = useNavigate();

    useEffect(() => {
        axios.get('/templates/get-templates')
            .then((response) =>{ 
                console.log("response",response.data);
                setTemplates(response.data.templates)
            })
            .catch(error => console.error('Error fetching templates:', error));
           
    }, []);

    const handleTemplateClick = (templateUrl) => {
        // Navigate to the canvas area with template URL in state
        navigate('/design', { state:{templateUrl}  } );
    };

    return (
        <>
        <Header/>
        <div className="templates-page">
            <h2>Select a Template</h2>
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
