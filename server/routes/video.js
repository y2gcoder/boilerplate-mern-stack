const express = require('express');
const router = express.Router();
// const { Video } = require("../models/Video");

const { auth } = require("../middleware/auth");
const multer = require('multer');
const path = require('path');
const ffmpeg = require('fluent-ffmpeg')

//STORAGE MULTER CONFIG
let storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, "uploads/");
    },
    filename: (req, file, cb) => {
        cb(null, `${Date.now()}_${file.originalname}`);
    },
    fileFilter: (req, file, cb) => {
        const ext = path.extname(file.originalname)
        if (ext !== '.mp4') {
            return cb(res.status(400).end('only mp4 is allowed'), false);
        }
        cb(null, true)
    }
})
// single은 하나만.
const upload = multer({ storage: storage }).single("file");

//=================================
//             Video
//=================================

router.post('/uploadfiles', (req, res) => {
    //비디오를 서버에 저장한다.
    upload(req, res, err => {
        if (err) {
            return res.json({ success: false, err })
        }
        //url: uploads 폴더 안에 들어간 경로를 보내줌.
        return res.json({ success: true, url: res.req.file.path, fileName: res.req.file.filename })
    })

})

router.post('/thumbnail', (req, res) => {
    //썸네일 생성 하고 비디오 러닝타임도 가져오기

    //정보
    let filePath = "";
    let fileDuration = "";

    //비디오 정보 가져오기
    ffmpeg.ffprobe(req.body.url, function (err, metadata) {
        console.dir(metadata); //all metadata
        console.log(metadata.format.duration);
        fileDuration = metadata.format.duration;
    })

    //썸네일 생성하기
    ffmpeg(req.body.url)
    .on('filenames', function (filenames) {
        console.log('Will generate ' + filenames.join(', '))
        console.log(filenames)

        filePath = "uploads/thumbnails/" + filenames[0]
    })
    .on('end', function () {
        console.log('Screenshots taken');
        return res.json({ success: true, url: filePath, fileDuration: fileDuration});
    })
    .on('error', function (err) {
        console.error(err);
        return res.json({ success: false, err });
    })
    .screenshots({
        //Will take screenshots at 20%, 40%, 60% and 80% of the video
        count: 3,
        folder: 'uploads/thumbnails',
        size: '320x240',
        //'%b': input basename (filename w/o extension)
        filename: 'thumbnail-%b.png'
    })
})

module.exports = router;
