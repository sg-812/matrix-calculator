const router=require('express').Router();
const { createMatrix,addMatrix, mulMatrix, subMatrix ,dashboard} = require('../controller/matController');
const AuthJwt = require("../middle-ware/isAuth");

router.post('/createMatrix',AuthJwt.authJwt,createMatrix)
router.get('/addMatrix',AuthJwt.authJwt,addMatrix)
router.get('/multiplyMatrix',AuthJwt.authJwt,mulMatrix)
router.get('/subMatrix',AuthJwt.authJwt,subMatrix)
router.get('dashboard',AuthJwt.authJwt,dashboard)
module.exports=router