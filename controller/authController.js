const AuthModel = require("../model/authModel");
const bcrypt = require("bcryptjs");
const fs = require("fs");
const path = require("path");
const jwt = require("jsonwebtoken");

// mail setup
const nodemailer = require("nodemailer");
const transporter = nodemailer.createTransport({
  host: "smtp",
  port: 465,
  secure: false,
  requireTLS: true,
  service: "gmail",
  auth: {
    user: "soumi.webskitters@gmail.com",
    pass: "blvs hwtw nrvo lgbw",
  },
});
//**************** sign up ******************************************** */
const postSignUp = async (req, res) => {
  try {
    // console.log("Values from sign-up",req.body,req.file);
    if (!req.body.email) {
      return res.status(401).json({
        success: false,
        message: "Email is required",
      });
    } else if (!req.body.password) {
      return res.status(401).json({
        success: false,
        message: "Password  is required",
      });
    } else {
      let existingUser = await AuthModel.findOne({ email: req.body.email });
      console.log("Existing user", existingUser);
      if (existingUser === null) {
        let hashPassword = await bcrypt.hash(req.body.password, 12);
        let authData = new AuthModel({
          email: req.body.email,
          password: hashPassword,
          profile_image: req.file.filename,
        });
        let saved = await authData.save();
        if (saved) {
          let mailOptions = {
            from: "soumi.webskitters@gmail.com",
            to: req.body.email,
            subject: "Email Verification",
            text:
              "Hello,\n\nYou have succefully submitted your data to be registered.Please verify your account by clicking the link: \n" +
              "http://" +
              req.headers.host +
              "/mail_confirmation/" +
              req.body.email +
              "\n\nThank You!\n",
          };

          transporter.sendMail(mailOptions, function (error, info) {
            if (error) {
              console.log("Error to send mail:", error);
              return res.status(201).json({
                success: false,
                message: "Registration process done, error to send mail",
                status: 201,
              });
            } else {
              console.log("Email sent: ", info.response);
              console.log("Registration done");
              res.status(200).json({
                success: true,
                message: "Registration done, check your email for verification",
                status: 200,
              });
            }
          });
        }
      } else {
        console.log("Existing email , try with another email address");
        return res.status(201).json({
          success: false,
          message: "Existing email , try with another email address",
          status: 201,
        });
      }
    }

    res.end();
  } catch (err) {
    console.log("Error", err);
  }
};

//************************mail verification ********************************* */
const mail_confirmation = async (req, res) => {
  try {
    // console.log( "Received mail from confirmation mail", req.params.email);
    let user_data = await AuthModel.findOne({
      email: req.params.email,
    });

    if (user_data.isVerified) {
      console.log("User already Verified");
    } else {
      user_data.isVerified = true;
      let save_res = await user_data.save();
      if (save_res) {
        console.log("Your Account Successfully Verified");
        res.status(200).json({
          success: true,
          message: "Account Verification done",
          status: 200,
        });
      }
    }
  } catch (error) {
    console.log("Mail verification error", error);
    res.status(201).json({
      success: false,
      message: "Error to verify email",
      status: 201,
    });
  }
};

// ******************* login ********************************************** */
const postSignIn = async (req, res) => {
  try {
    console.log("login values", req.body);
    if (!req.body.email) {
      return res.status(401).json({
        success: false,
        message: "Email is required",
      });
    } else if (!req.body.password) {
      return res.status(401).json({
        success: false,
        message: "Password  is required",
      });
    } else {
      let existingUser = await AuthModel.findOne({ email: req.body.email });
      // console.log("existing",existingUser);
      if (!existingUser) {
        console.log("Invalid email");
        return res.status(401).json({
          success: false,
          message: "Invalid email",
        });
      } else {
        if (!existingUser.isVerified) {
          console.log("Mail verification not done");
          return res.status(201).json({
            success: false,
            message: "Mail verification not done",
          });
        } else {
          let result = await bcrypt.compare(
            req.body.password,
            existingUser.password
          );
          //  console.log(result,"password comparison");
          if (result) {
            let token_payload = { userdata: existingUser };
            const token_jwt = jwt.sign(token_payload, process.env.secret_key, {
              expiresIn: "1h",
            });
            return res.status(200).json({
              success: true,
              message: "Login done",
              status: 200,
              token: token_jwt,
            });
          } else {
            console.log("Wrong password");
            return res.status(201).json({
              success: false,
              message: "Wrong password",
              status: 201,
            });
          }
        }
      }
    }
  } catch (err) {
    console.log("Error in login:", err);
  }
};

// *************************************profile********************************** */
const profile= async (req,res) =>{
    try{
      let user_data=req.user.userdata 
      console.log(user_data);
     
        return res.status(200).json({
        success: true,
        message: "Profile fetched successfully",
        status: 200,
       data: user_data
      });
  
    }
    catch(err){
     console.log("Error to fetch profile",err);
     return res.status(401).json({
      success: false,
      message: "Token expired",
    });
    }
}

//****************** edit user******************** */

const editUser= async (req,res) =>{
  try {
    console.log("Received new value: ", req.body, req.file);
    const user_id = req.params.id;
    const new_img_url = req.file;
    let existingUser = await AuthModel.findById(user_id);
    console.log("Existing data", existingUser);
    existingUser.email = req.body.email || existingUser.email ;
   existingUser.password = req.body.password || existingUser.password ;
   if (new_img_url === undefined) {
      existingUser.profile_image = existingUser.profile_image;
    } else {
      let old_filePath = path.join(
        __dirname,
        "..",
        "uploads",
        existingUser.profile_image
      );
      console.log("image url",old_filePath);
      fs.unlinkSync(old_filePath);
      existingUser.profile_image = new_img_url.filename;
    }
    let saved = await existingUser.save();
    console.log(saved);
    if (saved) {
      return res.status(200).json({
        success: true,
        message: "User updated successfully",
      });
    }
  } catch (err) {
    console.log("Error for edit:", err);
    return res.status(401).json({
      success: false,
      message: "User updation failed",
    });
  }
};

module.exports = {
  postSignUp,
  mail_confirmation,
  postSignIn,
  profile,
  editUser
};
