import React, { useEffect, useState } from 'react';


function Templates() {
  const [templates, setTemplates] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Fetch templates from the backend API
    const fetchTemplates = async () => {
      try {
        const response = await fetch('http://localhost:8080/api/v1/templates');
        if (!response.ok) {
            // Log the response status and text for debugging
            const errorText = await response.text();
            throw new Error(`Error: ${response.status} ${response.statusText}. Response: ${errorText}`);
        }
        const data = await response.json();
        console.log('Templates fetched:', data);
        setTemplates(data);
      } catch (error) {
        console.error('Error fetching templates:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchTemplates();
  }, []);

  if (loading) return <p>Loading templates...</p>;

  return (
    <div>
      <h2>Templates</h2>
      <div className="templates-list">
        {templates.map(template => (
          <div key={template._id} className="template">
            <h3>{template.title}</h3>
            <p>{template.description}</p>
            <img src={template.filePath} alt={template.title} />
          </div>
        ))}
      </div>
    </div>
  );
}

export default Templates;
