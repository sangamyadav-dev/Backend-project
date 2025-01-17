import mongoose, {Schema} from "mongoose";

const likeSchema = new Schema({

    vedio: {
        type: Schema.Types.ObjectId,
        ref: 'Vedio',
        // required: [true, 'vedio is required']
    },
    comment: {
        type: Schema.Types.ObjectId,
        ref: 'Comment',
    },
    tweet: {
        type: Schema.Types.ObjectId,
        ref: 'Tweet',
    },
    LikeBy: {
        type: Schema.Types.ObjectId,
        ref: 'User',
    },

},{timestamps: true})

export const Like = mongoose.model('Like', likeSchema);