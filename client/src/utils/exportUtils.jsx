import html2canvas from 'html2canvas';
import jsPDF from 'jspdf';
import axios from 'axios'
import GIF from 'gif.js.optimized';



export const designHasAnimatedText = (elements) => {
    return elements.some(element => element.type === 'animatedText');
};

export const exportToGIF = async (elements, backgroundColor, backgroundImage, animationIntervals = 200, totalDuration = 2000) => {
    console.log("Starting exportToGIF function...");
    
    // Log the elements to check if they are passed correctly
    console.log("Elements passed to exportToGIF:", elements);

    const gif = new GIF({
        workers: 2,
        workerScript: '/gif.worker.js', 
        quality: 10,
    });

    // Calculate the total number of frames
    const framesCount = Math.ceil(totalDuration / animationIntervals);

    // Create a temporary div to hold your design for each frame
    const designContainer = document.createElement('div');
    designContainer.style.position = 'relative';
    designContainer.style.width = '800px';  // Adjust to your design's dimensions
    designContainer.style.height = '600px'; // Adjust to your design's dimensions
    designContainer.style.backgroundColor = backgroundColor;
    if (backgroundImage) {
        designContainer.style.backgroundImage = `url(${backgroundImage})`;
        designContainer.style.backgroundSize = 'cover';
    }

    // Log the container before elements are added
    console.log("Design container before elements are added:", designContainer);

    // Append elements to the design container
    elements.forEach((element, index) => {
        // Log each element to check if it has the expected properties
        console.log(`Element ${index}:`, element);

        const el = document.createElement('div');
        el.style.position = 'absolute';
        el.style.top = `${element.top}px`;
        el.style.left = `${element.left}px`;
        el.style.width = `${element.width}px`;
        el.style.height = `${element.height}px`;
        el.style.color = element.color;
        el.style.fontSize = `${element.fontSize}px`;
        el.style.fontFamily = element.fontType;
        el.innerText = element.text || '';  // Ensure text is added to the element
        
        // Log each element after it is added to the container
        console.log("Element added to design container:", el);
        
        designContainer.appendChild(el);
    });

    // Log the entire design container after elements are added
    console.log("Design container after elements are added:", designContainer);

    // Append the container to the body to capture frames, then remove after capture
    document.body.appendChild(designContainer);

    // Log the design container before starting the frame capture
    console.log("Starting frame capture...");

    // Wait briefly to ensure everything is rendered properly before capturing the frame
    await new Promise(resolve => setTimeout(resolve, 100));

    for (let i = 0; i < framesCount; i++) {
        // Update text animation for each frame if needed
        updateTextAnimationFrame(i, elements);

        // Capture each frame of the design
        const canvas = await html2canvas(designContainer);

        // Log the captured canvas size and details
        console.log("Captured canvas:", canvas);

        gif.addFrame(canvas, { delay: animationIntervals });

        // Add a small delay before capturing the next frame
        await new Promise(resolve => setTimeout(resolve, animationIntervals));
    }

    console.log("All frames added to GIF");

    gif.on('finished', (blob) => {
        const url = URL.createObjectURL(blob);
        const link = document.createElement('a');
        link.href = url;
        link.download = 'animated_design.gif';
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
    });

    gif.render();
    document.body.removeChild(designContainer);
};

// Helper function to update text animations
function updateTextAnimationFrame(frameIndex, elements) {
    // Example: Change text color or size for animation; customize this for your needs
    elements.forEach((element) => {
        if (element.animate) {
            element.fontSize += 1;  // Example of animation effect
            element.color = frameIndex % 2 === 0 ? 'blue' : 'red'; // Alternate colors
        }
    });
}

export const exportToEvent = async (elements, backgroundColor, backgroundImage) => {
    try {
        const canvas = await generateCanvas(elements, backgroundColor, backgroundImage);
        const imgData = canvas.toDataURL('image/png'); // Generate data URL for the image
        return imgData; // Return the image data URL instead of downloading
    } catch (error) {
        console.error('Error exporting to Image:', error);
    }
};  
export const exportToShare = async (elements, backgroundColor, backgroundImage,designId) => {
   
    try {
        const canvas = await generateCanvas(elements, backgroundColor, backgroundImage);
        const imgData = canvas.toDataURL('image/png'); // Get the image data

        // Convert image to a blob
        const response = await fetch(imgData);
        const blob = await response.blob();

        const formData = new FormData();
        formData.append('file', blob, 'design.png');
        formData.append('designId', designId);
        // Send to backend
        await axios.post('/api/v1/store/designimage', formData, {
            headers: {
                'Content-Type': 'multipart/form-data'
            }
        });

    } catch (error) {
        console.error('Error exporting to Image:', error);
    }
};

// Function to export the design as a PDF
export const exportToPDF = async (elements, backgroundColor, backgroundImage) => {
    try {
        const canvas = await generateCanvas(elements, backgroundColor, backgroundImage);
        const imgData = canvas.toDataURL('image/jpeg', 1.0); // High quality JPEG
        const pdf = new jsPDF({
            orientation: 'landscape',
            unit: 'pt',
            format: [canvas.width, canvas.height],
        });
        pdf.addImage(imgData, 'JPEG', 0, 0, canvas.width, canvas.height);
        pdf.save('design.pdf');
    } catch (error) {
        console.error('Error exporting to PDF:', error);
    }
};

// Function to export the design as an image
export const exportToImage = async (elements, backgroundColor, backgroundImage) => {
    try {
        const canvas = await generateCanvas(elements, backgroundColor, backgroundImage);
        const imgData = canvas.toDataURL('image/png');
        const link = document.createElement('a');
        link.href = imgData;
        link.download = 'design.png';
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
    } catch (error) {
        console.error('Error exporting to Image:', error);
    }
};

// Helper function to generate a canvas from design elements
const generateCanvas = async (elements, backgroundColor, backgroundImage) => {
    const tempDiv = document.createElement('div');
    tempDiv.style.position = 'relative';
    tempDiv.style.width = '1000px';
    tempDiv.style.height = '600px';
    tempDiv.style.backgroundColor = backgroundColor || '#ffffff';

    if (backgroundImage) {
        tempDiv.style.backgroundImage = `url("${backgroundImage}")`;
        tempDiv.style.backgroundSize = 'cover';
        tempDiv.style.backgroundPosition = 'center center';
        tempDiv.style.backgroundRepeat = 'no-repeat';
    }

    // Render each element
    for (const element of elements) {
        const itemDiv = document.createElement('div');
        itemDiv.style.position = 'absolute';
        itemDiv.style.top = `${element.top || 0}px`;
        itemDiv.style.left = `${element.left || 0}px`;
        itemDiv.style.width = `${element.size?.width || 100}px`;
        itemDiv.style.height = `${element.size?.height || 100}px`;

        if (element.type === 'text') {
            itemDiv.innerText = element.name || '';
            itemDiv.style.fontSize = `${element.fontSize || 16}px`;
            itemDiv.style.color = element.color || '#000';
            itemDiv.style.fontFamily = element.fontType || 'Arial';
        } else if (element.type === 'shape') {
            itemDiv.style.backgroundColor = element.color || '#000';
            if (element.shapeType === 'circle') itemDiv.style.borderRadius = '50%';
            if (element.shapeType === 'triangle') {
                itemDiv.style.width = '0px';
                itemDiv.style.height = '0px';
                itemDiv.style.borderLeft = `${(element.size?.width || 50) / 2}px solid transparent`;
                itemDiv.style.borderRight = `${(element.size?.width || 50) / 2}px solid transparent`;
                itemDiv.style.borderBottom = `${element.size?.height || 50}px solid ${element.color || '#000'}`;
            }
        } else if (element.type === 'animatedText') {
            const screenshotDiv = await captureAnimatedText(element); // Capture static screenshot of animated text
            itemDiv.appendChild(screenshotDiv);
        } else if (['image', 'sticker', 'campuselement'].includes(element.type) && element.imageUrl) {
            const img = document.createElement('img');
            img.src = element.imageUrl;
            img.style.width = '100%';
            img.style.height = '100%';
            img.style.objectFit = 'cover';
            itemDiv.appendChild(img);
        }

        tempDiv.appendChild(itemDiv);
    }

    document.body.appendChild(tempDiv);

    // Wait for layout updates before taking the screenshot
    await new Promise((resolve) => setTimeout(resolve, 500));

    const canvas = await html2canvas(tempDiv, {
        useCORS: true,
        logging: true,
        scale: 2, // Increase resolution
    });

    document.body.removeChild(tempDiv);

    return canvas;
};


// Helper function to capture a static screenshot of animated text
const captureAnimatedText = async (element) => {
    const animatedDiv = document.createElement('div');
    animatedDiv.style.fontSize = `${element.fontSize || 16}px`;
    animatedDiv.style.color = element.color || '#000';
    animatedDiv.style.fontFamily = element.fontType || 'Arial';
    animatedDiv.style.backgroundColor = element.backgroundColor || 'transparent';
    animatedDiv.innerText = element.name || '';

    // Temporarily add to the DOM for screenshot
    document.body.appendChild(animatedDiv);

    const canvas = await html2canvas(animatedDiv, {
        useCORS: true,
        logging: false,
    });

    document.body.removeChild(animatedDiv);

    const img = new Image();
    img.src = canvas.toDataURL('image/png');
    img.style.width = '100%';
    img.style.height = '100%';

    return img;
};
