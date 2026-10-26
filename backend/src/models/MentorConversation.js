const mongoose = require('mongoose');

const mentorMessageSchema = new mongoose.Schema(
  {
    role: {
      type: String,
      enum: ['user', 'assistant'],
      required: true,
    },
    content: {
      type: String,
      required: true,
      trim: true,
    },
    createdAt: {
      type: Date,
      default: Date.now,
    },
  },
  {
    _id: true,
  }
);

const mentorConversationSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
      index: true,
    },
    title: {
      type: String,
      default: 'New Conversation',
      trim: true,
    },
    messages: {
      type: [mentorMessageSchema],
      default: [],
    },
  },
  {
    timestamps: true,
  }
);

// Compound index for optimizing user conversation history queries sorted by updatedAt DESC
mentorConversationSchema.index({ userId: 1, updatedAt: -1 });

module.exports = mongoose.model('MentorConversation', mentorConversationSchema);
