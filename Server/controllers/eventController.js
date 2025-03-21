const Event = require("../models/Event");
const cloudinary = require("../config/cloudinary");
const mongoose = require("mongoose");
const { ObjectId } = mongoose.Types;



// Create or update an event
const createOrUpdateEvent = async (req, res, next) => {
    try {
        const organizerId = req.user.id;
        const { id } = req.params; // Check for event ID to update
        const { eventType, name, start, end, location, description, status } = req.body;

        // Parse tickets and agenda from req.body if they exist
        const tickets = req.body.tickets ? JSON.parse(req.body.tickets) : [];
       
        const imageUrl = req.file ? req.file.path : null;

        if (!name || !start || !location || !description || !organizerId) {
            return res.status(400).json({ message: "All required fields must be provided." });
        }
        if (new Date(end) < new Date(start)) {
            return res.status(400).json({ message: "End date must be after start date" });
          }

        let event;
        
        if (id) {
            // Update existing event
            event = await Event.findById(id);
            if (!event) return res.status(404).json({ message: "Event not found" });
            
            if (req.file && event.image) {
                const publicId = event.image.split("/").pop().split(".")[0];
                await cloudinary.uploader.destroy(`partypilot/${publicId}`);
            }
            
            event = await Event.findByIdAndUpdate(id, {
                eventType : eventType || event.eventType,
                name,
                start,
                end,
                location,
                description,
                organizer: organizerId,
                status: status || event.status,
                image: imageUrl || event.image,
                tickets: tickets || event.tickets
            }, { new: true, runValidators: true });

            return res.status(200).json({ message: "Event updated successfully", event });
        } else {
            // Create a new event
           // console.log("ebtere");
            const newEvent = new Event({
                eventType :eventType || "Public",
                name,
                start,
                end,
                location,
                description,
                organizer: organizerId,
                status: status || "Draft",
                image: imageUrl,
                tickets,
               
                state: 'active',
            });
            console.log("data",newEvent);
            await newEvent.save();
            
            res.status(201).json({ message: "Event created successfully", event: newEvent });
        }
    } catch (error) {
        next(error);
    }
};




// Create an event
const createEvent = async (req, res, next) => {

    try {
        // Extract organizer ID from the authenticated user
        const organizerId = req.user.id;
       // console.log(req.body);
        //console.log(req.file);
        const { eventType, name, start, end, location, description, status, tickets } = req.body;
        const imageUrl = req.file ? req.file.path : null; // Get Cloudinary URL


        // Validate required fields
        if (!name || !start || !location || !description || !organizerId) {
            return res.status(400).json({ message: "All required fields must be provided." });
        }
        // Create a new event
        const newEvent = new Event({
            eventType: eventType || "Public",
            name,
            
            start,
            end,
            location,
            description,
            organizer: organizerId,
            status: status || "Draft", // Default to 'Upcoming' if not provided
            image: imageUrl,
            tickets,
            state : 'active'
        });
        // Save event to database
        await newEvent.save();
        res.status(201).json({ message: "Event created successfully", event: newEvent });
    } catch (error) {
        next(error);
    }
};


// List all events
const getAllEvents = async (req, res, next) => {
    try {
        const events = await Event.find({status:'Published'}).sort({createdAt:-1});
        res.status(200).json(events);
    } catch (error) {
        next(error);
    }
};
const getAllAdminEvents = async (req, res, next) => {
    try {
        const events = await Event.find().sort({createdAt:-1});
        res.status(200).json(events);
    } catch (error) {
        next(error);
    }
};

// List all events
/*const getAllOrganizerEvents = async (req, res, next) => {
    try {
        const events = await Event.find();
        res.status(200).json(events);
    } catch (error) {
        next(error);
    }
};
*/


const getAllOrganizerEvents = async (req, res) => {
    try {
        //const organizerId = req.params.id;
        //console.log("org",organizerId);
    
        // Query the database to find all events for this organizer
        //const events = await Event.find({ organizerId: organizerId });
        const organizerId = req.params.id; // Extract organizer ID from the request
        //console.log(organizerId,"orgid");

        // Ensure the organizerId is a valid ObjectId
        if (!ObjectId.isValid(organizerId)) {
            return res.status(400).json({ message: 'Invalid organizer ID format' });
        }

        // Query the database for events using the valid ObjectId
        //const events = await Event.find({ organizer: new ObjectId(organizerId) });

        const events = await Event.find({ organizer: new ObjectId(organizerId) })
    .sort({ createdAt: -1 }); // Sort by createdAt in descending order (latest first)


        // Handle no events case
        
        if (!events || events.length === 0) {
            console.log("no events");
          return res.status(200).json({ message: 'No events found for this organizer.' });
        }
    //console.log(events);
        res.status(200).json(events);
      } catch (error) {
        console.error('Error fetching events:', error);
        res.status(500).json({ message: 'Server error', error });
      }
};


const toggleEventActiveStatus = async (req, res) => {
    try {
        const { id } = req.params;
        const  { state }  = req.body; // The new active status
      //console.log(state,"state");
  
      const event = await Event.findByIdAndUpdate(
        id,
        { state },
        { new: true }  // Return the updated user object
      );
  
      if (!event) {
        return res.status(404).json({ message: 'Event not found' });
      }
     // console.log(event);
  
      res.json(event);  // Return the updated user
    } catch (error) {
      res.status(500).json({ message: 'Server error' });
    }
  };
  


/*

const getOrganizerEvents = async (req, res) => {
    try {
        const organizerId = req.user.id; // Extract organizer ID from the JWT token
        //console.log("orgid",organizerId);
        const events = await Event.find({ organizer: organizerId });

        if (events.length === 0) {
            console.log("noevents");
           res.status(404).json({ message: "No events found for this organizer" });
        }else{
            try {
                const eventCount = await Event.countDocuments({ organizer: organizerId });
                res.status(200).json({ eventCount }); 
              } catch (error) {
                console.error('Error fetching event count:', error);
                throw error;
              }
        }

        
    } catch (error) {
        console.error("Error fetching organizer's events:", error);
        res.status(500).json({ message: "Failed to retrieve events", error: error.message });
    }
};*/

const getAllPublishedEvents = async (req, res) => {
    try {


        const events = await Event.find({ status: "published" });

        if (events.length === 0) {
            return res.status(404).json({ message: "No events are there under published" });
        }

        res.status(200).json({ events });
    } catch (error) {
        console.error("Error fetching events:", error);
        res.status(500).json({ message: "Failed to retrieve events", error: error.message });
    }
};


// Get event by ID
const getEventById = async (req, res, next) => {
    try {
        const event = await Event.findById(req.params.id);
        if (!event) return res.status(404).json({ message: "Event not found" });

        res.status(200).json(event);
    } catch (error) {
        next(error);
    }
};

// Update event by ID
const updateEvent = async (req, res, next) => {
    try {
        const { eventId } = req.params;
        const event = await Event.findById(eventId);
        if (!event) {
            return res.status(404).json({ message: "Event not found" });
        }

        // Handle profile image update
        let imageUrl = event.image; // Keep existing image by default
        //console.log("file uploaded",req.file);
        //console.log("data uploaded",req.body);
        if (req.file) {
            // Delete old image from Cloudinary if a new one is uploaded
            if (event.image) {
                const publicId = event.image.split("/").pop().split(".")[0];
                await cloudinary.uploader.destroy(`partypilot/${publicId}`);
            }
            // Upload new image to Cloudinary
            const result = await cloudinary.uploader.upload(req.file.path);
            imageUrl = result.secure_url;

            // Upload new image to Cloudinary
            //imageUrl = req.file.path;
        }
        // const updatedEvent = await Event.findByIdAndUpdate(req.params.id, req.body, { new: true });
        // if (!updatedEvent) return res.status(404).json({ message: "Event not found" });

        // Update event data
        const updatedEvent = await Event.findByIdAndUpdate(
            id,
            { ...req.body, image: imageUrl },
            { new: true, runValidators: true }
        );

        if (!updatedEvent) {
            return res.status(404).json({ message: "Failed to update event" });
        }

        res.status(200).json({ message: "Event updated successfully", event: updatedEvent });
    } catch (error) {
        next(error);
    }
};
const getEventNameById = async (req,res) => {
    try {
        const eventId = req.params.id; // Or get from request body/query
       const response = await Event.findById(eventId).select('name');
        console.log("serverresponse",response);
       return response;
        
      } catch (error) {
        console.error("Error fetching event name:", error);
      }
}

// Delete event by ID
const deleteEvent = async (req, res, next) => {
    try {
        const deletedEvent = await Event.findByIdAndDelete(req.params.id);
        if (!deletedEvent) return res.status(404).json({ message: "Event not found" });

        res.status(200).json({ message: "Event deleted successfully" });
    } catch (error) {
        next(error);
    }
};

//router.get('/list', async (req, res) => {
    const getAllEventsForReport = async (req, res) => {
        //console.log("enetered event list");
    try {
      const events = await Event.find({})
        .sort({ start: 1 }) // Sort by date ascending
        .select('_id name date location status'); // Select only needed fields
     // console.log(events,"events");
      res.json(events);
    } catch (error) {
      console.error('Error fetching events:', error);
      res.status(500).json({ message: 'Server error' });
    }
  };
  //router.get("/events/latest", async (req, res) => {
    const getEventsLatest = async (req,res) =>{
    try {
        const events = await Event.find().sort({ createdAt: -1 }).limit(5); // Fetch latest 5 events
        res.json(events);
    } catch (error) {
        res.status(500).json({ message: "Error fetching events" });
    }
};


  

// Export all functions
module.exports = {
    getAllEvents,
    getEventById,
    createEvent,
    updateEvent,
    getEventNameById,
    getAllOrganizerEvents,
    getAllPublishedEvents,
    deleteEvent,
    createOrUpdateEvent,
    toggleEventActiveStatus,
    getAllEventsForReport,
    getAllAdminEvents,
    getEventsLatest
};