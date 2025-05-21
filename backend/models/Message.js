import mongoose from 'mongoose'

const messageSchema = new mongoose.Schema({
  senderId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  receiverId: {  // 🔁 fixed spelling
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  text: {
    type: String
  },
  image: {
    type: String
  },
 
  seen: {
    type: Boolean,
    default: false
  },
  // messageType: {
  //   type: String,
  //   enum: ['text', 'image', 'emoji'],
  //   default: 'text'
  // }
}, { timestamps: true });

const Message = mongoose.model("Message", messageSchema)
export default Message
