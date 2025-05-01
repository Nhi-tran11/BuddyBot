const mongoose = require('mongoose');
const { assignmentData } = require('./utils/AssignmentMockData');
const Assignment = require('./model/Assignment');
require('dotenv').config();
async function seedAssignments() {
  try {
    // Connect to your MongoDB database
    await mongoose.connect(process.env.MONGODB_URI);
    
    console.log('Connected to MongoDB');
    
    // Clear existing assignments if needed
    // await Assignment.deleteMany({});
    // console.log('Cleared existing assignments');
    
    // Insert the mock data
    const result = await Assignment.insertMany(assignmentData);
    console.log(`${result.length} assignments inserted successfully`);
    
    // Disconnect from MongoDB
    await mongoose.disconnect();
    console.log('Disconnected from MongoDB');
    
  } catch (error) {
    console.error('Error seeding assignments:', error);
  }
}

seedAssignments();