const mongoose = require('mongoose');

// Schema for Event
const eventSchema = new mongoose.Schema(
  {
    userId: { 
      type: mongoose.Schema.Types.ObjectId, 
      ref: 'User', // Assuming you're linking to a user model
      required: true 
    },
    eventName: { 
      type: String, 
      required: true 
    },
    eventDescription: { 
      type: String, 
      required: true 
    },
    eventDate: { 
      type: Date, 
      required: true 
    },
    eventLocation: { 
      type: String, 
      required: true 
    },
    designId: { 
      type: mongoose.Schema.Types.ObjectId, 
      ref: 'Design', 
      required: true
    },
    createdAt: { 
      type: Date, 
      default: Date.now 
    }
  },
  {
    timestamps: true
  }
);

// Create and export the model
const Event = mongoose.model('Event', eventSchema);
module.exports = Event;
