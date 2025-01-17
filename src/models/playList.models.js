import mongoose, {Schema} from "mongoose";

const playListSchema = new Schema({

    name: {
        type: String,
        required: [true, 'name is required'],
    },
    description: {
        type: String,
        required: [true, 'description is required'],
    },
    owner: {
        type: Schema.Types.ObjectId,
        ref: 'User',
        required: [true, 'owner is required']
    },
    videos: [
        {
            type: Schema.Types.ObjectId,
            ref: 'Vedio'
        }
    ],
}, {timestamps: true})

export const PlayList = mongoose.model('PlayList', playListSchema)