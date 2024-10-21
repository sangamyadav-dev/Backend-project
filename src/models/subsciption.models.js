import mongoose, {Schema} from "mongoose";

const subsciptionSchema =  new Schema({
    subscriber: {
        type: Schema.Types.ObjectId, // one who is subscribing
        ref: "User"
    },
    channel:{
        type: Schema.Types.ObjectId, // one to whom 'subscribe' is subscribing
        ref: "User"
    },
},{timestamps: true})

export const subsciption = mongoose.model("subsciption", subsciptionSchema)