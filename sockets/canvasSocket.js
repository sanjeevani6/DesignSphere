// sockets/canvasSocket.js
const Team = require('../models/Team'); // Import the Project model
const SidebarItem = require('../models/SidebarItem'); // Import the elements id model

// server.js (or socket handler file)
let connections=[];
module.exports = (io) => {
  io.on('connection', (socket) => {
    connections.push(socket);
    console.log('A user connected:', socket.id);

  // Event to join a team
    socket.on('joinTeam', async ({ teamCode }) => {
      socket.join(teamCode);
      console.log(`User ${socket.id} joined team ${teamCode}`);
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

  //     // Handle design updates and broadcast to the team room
  //   socket.on('designUpdate', ({ teamCode, updatedDesign }) => {
  //     console.log(`Broadcasting design update to team ${teamCode}`);
  //     io.to(teamCode).emit(`design-updated-${teamCode}`, updatedDesign);
  // });

  //     // Retrieve the latest canvas data from the database
  //     const project = await Project.findOne({ teamCode });
  //     if (project) {
  //       // Send the current canvas data to the newly joined user
  //       console.log(`Sending canvas data for team ${teamCode} to user ${socket.id}`);
  //       socket.emit('loadCanvas', project.canvasData);
  //     }
  //   });

  //   // Lock an item to prevent concurrent edits
  //   socket.on('lockItem', ({ teamCode, itemId }) => {
  //     socket.to(teamCode).emit('itemLocked', { itemId, userId: socket.id });
  //     console.log(`User ${socket.id} locked item ${itemId} in team ${teamCode}`);
  //   });

  //   // Release a lock on an item
  //   socket.on('releaseItem', ({ teamCode, itemId }) => {
  //     socket.to(teamCode).emit('itemReleased', { itemId, userId: socket.id });
  //     console.log(`User ${socket.id} released item ${itemId} in team ${teamCode}`);
  //   });

  //   // Update item properties
  //   socket.on('updateItem', async ({ teamCode, itemId, updatedProperties }) => {
  //     try {
  //       const project = await Project.findOneAndUpdate(
  //         { teamCode },
  //         { $set: { "canvasData.items.$[item]": updatedProperties } },
  //         { arrayFilters: [{ "item.id": itemId }], new: true }
  //       );

  //       if (project) {
  //         socket.to(teamCode).emit('itemUpdated', { itemId, updatedProperties });
  //       }
  //     } catch (error) {
  //       console.error('Error updating item:', error);
  //     }
  //   });
  //   // Listen for new sidebar item (e.g., uploaded image) and broadcast it to other users in the same team
  //   socket.on('newSidebarItem', ({ teamCode, item }) => {
  //     socket.to(teamCode).emit('sidebarItemAdded', item);
  // });

  //   // Event for updating the canvas
  //   socket.on('canvasUpdate', async ({ teamCode, canvasData }) => {
  //     try {
  //       const project = await Project.findOneAndUpdate(
  //         { teamCode },
  //         { canvasData, updatedAt: new Date() },
  //         { new: true }
  //       );

  //       if (project) {
  //         socket.to(teamCode).emit('canvasUpdate', canvasData);
  //       }
  //     } catch (error) {
  //       console.error('Error updating canvas:', error);
  //     }
  //   });



  // Send initial elements to the newly connected client
    //socket.emit('initializeElements', elements);

    // Listen for item updates from clients
    socket.on('updateItem', async ({ teamCode, updatedItem }) => {
      try {
          // Find the item in the database and update it
          await SidebarItem.findOneAndUpdate(
              { id: updatedItem.id, teamCode: teamCode },
              { $set: updatedItem },
              { new: true }
          );
          console.log("updating item in database")
          // Broadcast the update to all other clients in the same team
         
           
          socket.to(teamCode).emit('updateItem', { teamCode, updatedItem });
          console.log("update sent to all")
        } catch (error) {
          console.error('Error updating item:', error);
      }
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
    // Handle disconnection
    socket.on('disconnect', () => {
      console.log('User disconnected:', socket.id);
    });
  });
};
