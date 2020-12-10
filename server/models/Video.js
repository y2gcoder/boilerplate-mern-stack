const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const videoSchema = mongoose.Schema({
    writer: {
        type: mongoose.Schema.Types.ObjectId, //ㅇㅣ렇게만 넣어도 user에 대한 모든 정보를 가져올 수 있음.
        ref: 'User'
    },
    title: {
        type: String,
        maxlength: 50
    },
    description: {
        type: String,
    },
    privacy: {
        type: Number,
    },
    filePath: {
        type: String,
    }, 
    category: {
        type: String,
    },
    views: {
        type: Number,
        default: 0
    },
    duration: {
        type: String
    },
    thumbnail: {
        type: String
    }
}, { timestamps: true })




const Video = mongoose.model('Video', videoSchema);

module.exports = { Video }