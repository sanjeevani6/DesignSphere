<h1 align="center">DesignSphere</h1>
<p align="center">Welcome to DesignSphere, a web-based design tool built for students, faculty, and clubs to create personalized visuals for campus-themed events, organizations, and personal projects. Whether you’re creating posters, social media content, or logos, this tool aims to provide an intuitive yet powerful design experience. It supports collaborative design and event integrations, offering features like drag-and-drop functionality, image imports, exports in various formats, and printing options.</p>


<h2 align="center">🌐 Website Live At</h2>
<p align="center">
  <a href="https://designsphere27.netlify.app/" target="_blank"><strong>🔗 Click Here to Visit the Live Site</strong></a>
</p>



<h2>Table of Contents</h2>
<ul>
  <li><a href="#features">Features</a></li>
  <li><a href="#installation">Installation</a></li>
  <li><a href="#usage">Usage</a></li>
  <li><a href="#api-integration">API Integration</a></li>
  <li><a href="#technologies-used">Technologies Used</a></li>
  <li><a href="#contributing">Contributing</a></li>
  <li><a href="#license">License</a></li>
</ul>

<h2 id="features">Features</h2>
<ul>
  <li><strong>User Authentication:</strong> Secure login options via Google OAuth. Users can easily sign in to save and manage their designs.</li>
  <li><strong>Canvas Editor:</strong>
    <ul>
      <li>Drag-and-Drop Functionality: Users can add elements (shapes, text, images) to their design canvas and reposition them freely.</li>
      <li>Canvas Customization: Elements can be customized with various properties such as size, color, font, and position.</li>
      <li>Background Customization: Users can select or upload a background for their canvas.</li>
    </ul>
  </li>
  <li><strong>Design Import & Export:</strong>
    <ul>
      <li>Image Import: Users can import images from their local machine.</li>
      <li>Export Designs: Download completed designs as PDFs or PNG images for digital or printed use.</li>
    </ul>
  </li>
  <li><strong>Event Integration:</strong>
    <ul>
      <li>Event Template Selection: Choose from pre-designed templates and customize them to align with specific events.</li>
      <li>Social Media Sharing: Share designs directly to social media or generate shareable links.</li>
    </ul>
  </li>
  <li><strong>Printing Integration:</strong> Send completed designs to a local printing shop via email through Nodemailer.</li>
  <li><strong>Save and Load Designs:</strong> Save designs to the database for future editing.</li>
  <li><strong>Collaborative Design:</strong> Real-time collaboration with others using Socket.IO.</li>
  <li><strong>Responsive and User-Friendly UI:</strong> Optimized design for various devices using media queries, responsive components, and libraries like Bootstrap, Material UI, and Ant Design.</li>
</ul>

<h2 id="installation">Installation</h2>
<ol>
  <li>Clone the repository:
    <pre><code>git clone https://github.com/sanjeevani6/DesignSphere.git
cd DesignSphere
</code></pre>
  </li>
  <li>Install backend dependencies:
    <pre><code>npm install</code></pre>
  </li>
  <li>Install frontend dependencies:
    <pre><code>cd client
npm install
</code></pre>
  </li>
  <li>Set up environment variables for the backend:
    <p>Create a <code>.env</code> file in the backend directory and add your MongoDB and OAuth credentials.</p>
  </li>
  <li>Start both the frontend and backend servers:
    <pre><code># For the frontend
npm start

# For the backend
npm run server

# For running both Frontend and Backend concurrently
npm run dev
</code></pre>
  </li>
</ol>

<h2 id="usage">Usage</h2>
<p><strong>Creating a Design:</strong> After logging in via a custom login dialog or Google OAuth, users can start creating designs by adding elements to the canvas, uploading images, dragging elements, and using the toolbar for customization.</p>

<p><strong>Exporting Designs:</strong> Click the Download button to export the design as a PDF or image.</p>

<p><strong>Sending for Printing:</strong> Use the Send for Printing feature to email the design to a local print shop via Nodemailer.</p>

<p><strong>Collaborative Design:</strong> Share your design link for real-time collaboration with others.</p>

<p><strong>Event Integration:</strong> Select an event template and customize it according to your needs.</p>

<h2 id="api-integration">API Integration</h2>
<ul>
  <li><strong>OAuth (Google, GitHub):</strong> Handles user authentication, storing user data in MongoDB.</li>
  <li><strong>Export Functionality:</strong> Utilizes html2canvas and jsPDF for exporting the canvas as PDF or image.</li>
  <li><strong>Email Sending (Nodemailer):</strong> Sends the design file to local printing shops via email.</li>
  <li><strong>Real-time Collaboration (Socket.IO):</strong> Enables users to collaborate on the same design in real-time.</li>
</ul>

<h2 id="technologies-used">Technologies Used</h2>
<ul>
  <li><strong>Frontend:</strong> React, Material UI, Bootstrap, Ant Design, Axios, html2canvas, jsPDF</li>
  <li><strong>Backend:</strong> Node.js, Express, MongoDB (Mongoose), Nodemailer, Socket.IO</li>
  <li><strong>Authentication:</strong> Google OAuth</li>
  <li><strong>Email Service:</strong> Nodemailer</li>
  <li><strong>Real-time Communication:</strong> Socket.IO</li>
</ul>

<h2 id="contributing">Contributing</h2>
<p>We welcome contributions to improve DesignSphere. Feel free to fork the repository, create a branch, and submit pull requests with your improvements. If you encounter any issues, please create an issue on GitHub.</p>

<h2 id="license">License</h2>
<p>This project is licensed under the MIT License - see the LICENSE file for details.</p>
