const mongoose= require('mongoose');

const reqModel = mongoose.Schema({
  status: {
    type: String,
    required: true,
  },
  sender: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
  },
  reciever: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    
  },
});

module.exports=mongoose.model("Req",reqModel);