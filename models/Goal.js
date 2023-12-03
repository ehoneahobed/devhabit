const mongoose = require('mongoose');

const metricSchema = new mongoose.Schema({
  // Common fields for all metrics
  type: { type: String, required: true }, // e.g., 'Hours to Dedicate', 'Key Concepts', etc.
  progress: { type: Number, default: 0 }, // Common progress indicator

  // Specific fields based on the metric type
  targetHours: Number, // For 'Hours to Dedicate'
  conceptsToComplete: [String], // For 'Key Concepts' - list of completed concepts
  milestones: [String], // For 'Project Development' - list of milestones
  weeklyCommitGoal: Number, // For 'Code Commits'
  solvedProblemsCount: Number, // For 'Weekly Problem Goals'
  coreAlgorithms: [String], // For 'Core Algorithms'
  // ... other specific fields for different metrics
}, { _id: false });

const goalSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  title: { type: String, required: true, trim: true },
  description: { type: String, trim: true },
  category: { type: String, required: true, enum: ['Learning Language', 'Project Development', 'Algorithm Mastery'] },
  startDate: { type: Date, default: Date.now },
  completionDate: { type: Date },
  metrics: [metricSchema], // Array of metrics
  priority: { type: String, enum: ['High', 'Medium', 'Low'], default: 'Medium' },
  isCompleted: { type: Boolean, default: false }
}, { timestamps: true });

const Goal = mongoose.model('Goal', goalSchema);

module.exports = Goal;
