// src/components/Canvas.js
import React, { useEffect, useRef, useState } from 'react';
import socket from '../socket';

const Canvas = ({ teamCode }) => {
  const canvasRef = useRef(null);
  const [drawing, setDrawing] = useState(false);

  // This will be used to store the canvas data
  const [canvasData, setCanvasData] = useState('');

  useEffect(() => {
    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');
    let startX, startY;

    // Listen for canvas updates from other users
    socket.on('canvasUpdate', (newCanvasData) => {
      setCanvasData(newCanvasData);
      const image = new Image();
      image.onload = () => ctx.drawImage(image, 0, 0);
      image.src = newCanvasData;
    });

    // Emit canvas data to the server whenever it's updated
    const handleMouseDown = (e) => {
      setDrawing(true);
      startX = e.clientX - canvas.offsetLeft;
      startY = e.clientY - canvas.offsetTop;
    };

    const handleMouseMove = (e) => {
      if (drawing) {
        const endX = e.clientX - canvas.offsetLeft;
        const endY = e.clientY - canvas.offsetTop;
        ctx.beginPath();
        ctx.moveTo(startX, startY);
        ctx.lineTo(endX, endY);
        ctx.stroke();
        startX = endX;
        startY = endY;

        // Emit the updated canvas data
        const newCanvasData = canvas.toDataURL();
        setCanvasData(newCanvasData);
        socket.emit('canvasUpdate', { teamCode, canvasData: newCanvasData });
      }
    };

    const handleMouseUp = () => {
      setDrawing(false);
    };

    canvas.addEventListener('mousedown', handleMouseDown);
    canvas.addEventListener('mousemove', handleMouseMove);
    canvas.addEventListener('mouseup', handleMouseUp);

    // Clean up event listeners
    return () => {
      canvas.removeEventListener('mousedown', handleMouseDown);
      canvas.removeEventListener('mousemove', handleMouseMove);
      canvas.removeEventListener('mouseup', handleMouseUp);
    };
  }, [teamCode]);

  return (
    <div>
      <h2>Collaborative Canvas</h2>
      <canvas
        ref={canvasRef}
        width="800"
        height="600"
        style={{ border: '1px solid black' }}
      />
    </div>
  );
};

export default Canvas;
