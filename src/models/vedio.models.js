
import mongoose, {Schema} from 'mongoose';
import mongooseAggregatePaginate from 'mongoose-aggregate-paginate-v2';

const vedioSchema = new Schema({
    vedioFile: {
        type: String,
        required: [true, 'vedioFile is required'],
    },
    title: {
        type: String,
        required: [true, 'title is required'],
    },
    description: {
        type: String,
        required: [true, 'description is required'],
    },
    duration: {
        type: Number,
        required: [true, 'duration is required'],
    },
    views: {
        type: Number,
        default: 0
    },
    isPublished: {
        type: Boolean,
        default: false
    },
    owner: {
        type: Schema.Types.ObjectId,
        ref: 'User'
    },
    thumbnail: {
        type: String,
        required: [true, 'thumbnail is required'],
    }
}, {timestamps: true})

vedioSchema.plugin(mongooseAggregatePaginate)

export const Vedio = mongoose.model('Vedio', vedioSchema)