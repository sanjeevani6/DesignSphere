// import the necessary libraries
import html2canvas from 'html2canvas';
import jsPDF from 'jspdf';

// Function to export design as PDF
export const exportToPDF = async (elements, backgroundColor) => {
    try {
        const canvas = await generateCanvas(elements, backgroundColor);
        const imgData = canvas.toDataURL('image/jpeg', 1.0);
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

// Function to export design as Image
export const exportToImage = async (elements, backgroundColor) => {
    try {
        const canvas = await generateCanvas(elements, backgroundColor);
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

// Helper function to create a canvas from design elements
const generateCanvas = async (elements, backgroundColor) => {
    const tempDiv = document.createElement('div');
    tempDiv.style.position = 'relative';
    tempDiv.style.width = '1000px';
    tempDiv.style.height = '600px';
    tempDiv.style.backgroundColor = backgroundColor || '#ffffff';

    elements.forEach((element) => {
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
                itemDiv.style.borderLeft = `${element.size.width / 2 || 25}px solid transparent`;
                itemDiv.style.borderRight = `${element.size.width / 2 || 25}px solid transparent`;
                itemDiv.style.borderBottom = `${element.size.height || 50}px solid ${element.color || '#000'}`;
            }
        } else if (element.type === 'image' && element.imageUrl) {
            const img = document.createElement('img');
            img.src = element.imageUrl;
            img.style.width = '100%';
            img.style.height = '100%';
            img.style.objectFit = 'cover';
            itemDiv.appendChild(img);
        }

        tempDiv.appendChild(itemDiv);
    });

    document.body.appendChild(tempDiv);
    const canvas = await html2canvas(tempDiv);
    document.body.removeChild(tempDiv);

    return canvas;
};
