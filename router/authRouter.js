const router=require('express').Router();
const { postSignUp, mail_confirmation, postSignIn, profile, editUser } = require('../controller/authController');
const AuthJwt = require("../middle-ware/isAuth");
const multer=require('multer');
const path=require('path');

const fileStorage=multer.diskStorage({
    destination:(req,file,callback)=>{
        callback(null, path.join(__dirname, "..", "uploads"), (err, data) => {
            if (err) throw err;
          });
        },
        filename: (req, file, callback) => {
          callback(null, file.originalname, (err, data) => {
            if (err) throw err;
          });
        }    
})

const fileFilter = (req, file, callback) => {
    if (
      file.mimetype.includes("png") ||
      file.mimetype.includes("jpg") ||
      file.mimetype.includes("jpeg")||
      file.mimetype.includes("webp")
    ) {
      callback(null, true);
    } else {
      callback(null, false);
    }
  };
  
  const upload = multer({
    storage: fileStorage,
    fileFilter: fileFilter,
    limits: { fieldSize: 1024 * 1024 * 5 },
  });

  const upload_type=upload.single('profile_image');

   
  router.post('/sign-up',upload_type,postSignUp);
  router.post("/mail_confirmation/:email", mail_confirmation);
  router.post('/sign-in',postSignIn);
  router.get('/profile',AuthJwt.authJwt,profile);
  router.put('/edit-user/:id',upload_type,editUser)



module.exports=router