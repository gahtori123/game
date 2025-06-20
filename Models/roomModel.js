

const mongoose=require('mongoose');

const RoomSchema= new mongoose.Schema({
  uId:{
    type:String,
    required:true,
    unique:true
  },
  Users:[
    {
    type:mongoose.Schema.Types.ObjectId,
    ref:"User"
    }
  ]
});

module.exports= mongoose.model('Room',RoomSchema);
