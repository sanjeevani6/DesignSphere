// sockets/canvasSocket.js
const SidebarItem = require('../models/SidebarItem'); // Import the elements id model

let connections=[];
const rooms={};
module.exports = (io) => {
  io.on('connection', (socket) => {
    connections.push(socket);
    socket.emit("welcome","thanks for connecting");
    console.log('A user connected:', socket.id);

    socket.on("msg",(data)=>{
      console.log("message from client: ",data)
    });

  // Event to join a team
    socket.on('joinRoom',async ( {teamCode,callback }) => {
      console.log(`attempting to join team on server side ${teamCode}`);
      if(teamCode){
        socket.join(teamCode);
      console.log(`User ${socket.id} joined team ${teamCode}`);
      if (callback && typeof callback === 'function') {
        callback({ status: 'success', room: teamCode });
    }
      }
      else{
        console.log("invalid teamCode received");
        if (callback && typeof callback === 'function') {
          callback({ status: 'error', message: 'Invalid teamCode' });
      }
      }
      
      // Send current room state to the newly connected client
      if (rooms[teamCode]) {
        socket.emit('initializeCanvas', rooms[teamCode]);
    } else {
        rooms[teamCode] = []; // Initialize the room if it doesn't exist
    }
      try {
        // Fetch the current elements for this team from the database
        const elements = await SidebarItem.find({ teamCode: teamCode });
         console.log("canvas for this team updated")
        // Emit the elements to the client who joined
        socket.emit('initializeElements', elements);
    } catch (error) {
        console.error('Error fetching elements:', error);
    }
});

  

  

  
socket.on('joinChat', (teamCode) => {
  socket.join(teamCode);
  console.log(`User ${socket.id} joined chat room: ${teamCode}`);
});

socket.on('sendMessage', (message) => {
  console.log('Message received:', message);
  socket.to(message.teamCode).emit('receiveMessage', message);
});

socket.on('leaveChat', (teamCode) => {
  socket.leave(teamCode);
  console.log(`User ${socket.id} left chat room: ${teamCode}`);
});



  
  socket.on('itemResize', async ({ teamCode, itemId, size }) => {
    try {
        // Update the size of the item in the database
        const updatedItem = await SidebarItem.findOneAndUpdate(
            { id: itemId, teamCode: teamCode }, // Find item by ID and teamCode
            { $set: { size: size } }, // Update the size field
            { new: true } // Return the updated document
        );

            console.log("resize change saved in database")
        // Broadcast the updated item size to other clients in the same room
        if (updatedItem) {
            socket.to(teamCode).emit('itemResize', { teamCode, itemId, size });
        }
    } catch (error) {
        console.error('Error resizing item:', error);
    }
});





  





socket.on('updateDesign', ({ teamCode, updatedItem }) => {
  if (!teamCode || !updatedItem || typeof updatedItem !== 'object' || !updatedItem.id) {
      console.error("Invalid updateDesign request:", { teamCode, updatedItem });
      return;
  }

  // Emit the updated design to all sockets in the same teamCode room
  io.to(teamCode).emit('receiveDesignUpdate', {
    elements:[updatedItem],}
  );

  console.log(`Update sent to room ${teamCode}:`, updatedItem);
});




// Listen for updates to design properties like backgroundColor or backgroundImage
socket.on('updateDesignProperties', ({ teamCode, properties }) => {
  console.log('Received updateDesignProperties request:', properties);

  if (!teamCode || !properties) {
      console.error('Invalid updateDesignProperties request:', { teamCode, properties });
      return;
  }

  console.log(`Received updateDesignProperties for teamCode ${teamCode}:`, properties);
  console.log(`Broadcasting backgroundImage for teamCode ${teamCode}:`, properties.backgroundImage);

  // Broadcast the updated properties to all clients in the same room except the sender
  socket.to(teamCode).emit('receiveDesignUpdate', {...properties, updatedBy: socket.id});
  socket.emit('receiveDesignUpdate', { ...properties, updatedBy: socket.id }); // Optional: broadcast to sender

  console.log(`Broadcasted updateDesignProperties for teamCode ${teamCode}`);
});





socket.on('deleteItem', ({ teamCode, itemId }) => {
  if (!teamCode || !itemId) {
      console.error('Invalid deleteItem request:', { teamCode, itemId });
      return;
  }

  console.log(`Received deleteItem for teamCode ${teamCode}, itemId ${itemId}`);

  // Broadcast the deleted item to all clients in the room except the sender
  socket.to(teamCode).emit('receiveDesignUpdate', { deletedItemId: itemId });

  console.log(`Broadcasted deleteItem for teamCode ${teamCode}`);
});













    // Handle disconnection
    socket.on('disconnect', () => {
      console.log('User disconnected:', socket.id);
      connections = connections.filter((conn) => conn.id !== socket.id);
    });
  });
};

