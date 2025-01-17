import mongoose, {Schema} from 'mongoose';
import mongooseAggregatePaginate from 'mongoose-aggregate-paginate-v2';

const commentSchema = new Schema({
    content: {
        type: String,
        required: [true, 'content is required'],
    },
    owner: {
        type: Schema.Types.ObjectId,
        ref: 'User',
        required: [true, 'owner is required']
    },
    vedio: {
        type: Schema.Types.ObjectId,
        ref: 'Vedio',
        required: [true, 'vedio is required']
    },
    isDeleted: {
        type: Boolean,
        default: false
    }
},{timestamps: true})

commentSchema.plugin(mongooseAggregatePaginate)
const Comment = mongoose.model('Comment', commentSchema)

export default Comment;