import html2canvas from 'html2canvas';
import jsPDF from 'jspdf';
import axios from 'axios'
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
        await axios.post('/store/designimage', formData, {
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
