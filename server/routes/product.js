const express = require('express');
const router = express.Router();
const multer = require('multer');
const { Product } = require('../models/Product');

//=================================
//             Product
//=================================

var storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, 'uploads/')
    },
    filename: function (req, file, cb) {
        cb(null, `${Date.now()}_${file.originalname}`)
    }
})

var upload = multer({ storage: storage }).single("file")

router.post('/image', (req, res) => {
    //가져온 이미지를 저장하면 됨.
    upload(req, res, err => {
        if (err) {
            return req.json({ success: false, err })
        }
        return res.json({ success: true, filePath:res.req.file.path , fileName: res.req.file.filename })
    })
})

router.post('/', (req, res) => {
    //받아온 정보들을 DB에 넣어준다. 
    const product = new Product(req.body);
    product.save((err) => {
        if (err) return res.status(400).json({ success: false, err })
        return res.status(200).json({ success: true })
    })
})

router.post('/products', (req, res) => {
    //product collection에 들어있는 모든 상품 정보를 가져오기
    Product.find()
        .populate('writer')
        .exec((err, productsInfo) => {
            if (err) return res.status(400).json({ success: false, err })
            return res.status(200).json({ success: true, productsInfo})
        })
})

module.exports = router;
