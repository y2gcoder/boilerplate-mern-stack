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
    const limit = req.body.limit ? parseInt(req.body.limit) : 20;
    const skip = req.body.skip ? parseInt(req.body.skip) : 0;
    const term = req.body.searchTerm;
    const findArgs = {};
    for(let key in req.body.filters) {
        if (req.body.filters[key].length > 0) {

            if (key === 'price') {
                findArgs[key] = {
                    $gte: req.body.filters[key][0],
                    $lte: req.body.filters[key][1]
                }
            } else {
                findArgs[key] = req.body.filters[key];
            }

            
        }
    }
    
    

    console.log('findArgs', findArgs);

    if (term) {
        Product.find(findArgs)
        .find({ $text: {$search: term }})
        .populate('writer').skip(skip).limit(limit)
        .exec((err, productsInfo) => {
            if (err) return res.status(400).json({ success: false, err })
            return res.status(200).json({ 
                success: true, productsInfo,
                postSize: productsInfo.length
             })
        })
    } else {
        Product.find(findArgs)
        .populate('writer').skip(skip).limit(limit)
        .exec((err, productsInfo) => {
            if (err) return res.status(400).json({ success: false, err })
            return res.status(200).json({ 
                success: true, productsInfo,
                postSize: productsInfo.length
             })
        })
    }

    
})

module.exports = router;
