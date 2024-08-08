const MatrixModel = require("../model/matModel");

const createMatrix = async (req, res) => {
  try {
    console.log("No of row", req.body.row, "No of column", req.body.col);
    if (!req.body.row) {
      return res.status(401).json({
        success: false,
        message: "Number of Row is required",
      });
    } else if (!req.body.col) {
      return res.status(401).json({
        success: false,
        message: "Number of Column is required",
      });
    } else {
      let mat1 = [];
      let mat2 = [];
      for (let i = 0; i < req.body.row; i++) {
        mat1[i] = [];
        for (let j = 0; j < req.body.col; j++) {
          mat1[i][j] = i + j;
        }
      }
      for (let i = 0; i < req.body.row; i++) {
        mat2[i] = [];
        for (let j = 0; j < req.body.col; j++) {
          mat2[i][j] = i * j;
        }
      }
      console.log(mat1, mat2);
      let Matrix = new MatrixModel({
        user: req.user.userdata._id,
        matrix1: mat1,
        matrix2: mat2,
      });
      await Matrix.save();

      return res.status(200).json({
        success: true,
        message: "Matrix created",
        status: 200,
      });
    }
  } catch (err) {
    console.log("Error to create matrix", err);
  }
};

const viewMatrix=async(req,res)=>{
try{
  let userId=req.user.userdata._id;
  let matrixData=await MatrixModel.findOne({user:userId})
  console.log("Existing Data",matrixData);
  let matArr={matrix1:matrixData.matrix1,matrix2:matrixData.matrix2}
  return res.status(200).json({
    success: true,
    message: "Matrix fetched",
    status: 200,
    data:matArr
  });
}catch(err){
  console.log("error for viewing matrix",err);
  return res.status(401).json({
    success: false,
    message: "Matrix fetching failed",
    status: 401
  });
}
}

const addMatrix = async (req, res) => {
  try {
    let userId=req.user.userdata._id;
    // console.log(userId,"Id of user who want to add");    
    let matrixData=await MatrixModel.findOne({user:userId})
    console.log("Existing Data",matrixData);
 
    let {matrix1,matrix2}=matrixData
    // console.log("a",a,"b",b);
    let add = [];
    for(let i of matrix1)
      add.push([])
    for (let i = 0; i <matrix1.length; i++) {
    for (let j = 0; j < matrix1[i].length; j++) {
    add[i][j] = matrix1[i][j] + matrix2[i][j];
     }
    }
    // console.log(c);
    matrixData.addOpt=matrixData.addOpt+1;
    matrixData.result=add;
    let saved=await matrixData.save();
    // console.log("Saved:",saved);
    
   if(saved){
    return res.status(200).json({
      success: true,
      message: "Matrix created",
      status: 200,
      data:saved.result
    });
  }
  } catch (err) {
    console.log("Error to add matrix", err);
  }
};

const mulMatrix = async (req, res) => {
  try {
    let userId=req.user.userdata._id;
    // console.log(userId,"Id of user who want to add");    
    let matrixData=await MatrixModel.findOne({user:userId})
    console.log("Existing Data",matrixData);
 
    let {matrix1,matrix2}=matrixData
    // console.log("a",a,"b",b);
    let mul = [];
    for(let i of matrix2)
      mul.push([])

    for (let i = 0; i <matrix1.length; i++) {
    for (let j = 0; j < matrix1.length; j++) {
    mul[i][j] = 0;
    for(let k=0;k<matrix1.length;k++)
    {
      mul[i][j]+=matrix1[i][k]*matrix2[k][j]
    }
     }
    }
    console.log(mul);

    matrixData.mulOpt=matrixData.mulOpt+1;
    matrixData.result=mul;
    let saved=await matrixData.save();
    // console.log("Saved:",saved);
    
   if(saved){
    return res.status(200).json({
      success: true,
      message: "Matrix created",
      status: 200,
      data:saved.result
    });
  }
  } catch (err) {
    console.log("Error to add matrix", err);
  }
};

const subMatrix = async (req, res) => {
  try {
    let userId=req.user.userdata._id;
    // console.log(userId,"Id of user who want to add");    
    let matrixData=await MatrixModel.findOne({user:userId})
    console.log("Existing Data",matrixData);
 
    let {matrix1,matrix2}=matrixData
    // console.log("a",a,"b",b);
    let sub = [];
    for(let i of matrix1)
      sub.push([])
    for (let i = 0; i <matrix1.length; i++) {
    for (let j = 0; j < matrix1[i].length; j++) {
    sub[i][j] = matrix1[i][j] - matrix2[i][j];
     }
    }
    // console.log(c);
    matrixData.subOpt=matrixData.subOpt+1;
    matrixData.result=sub;
    let saved=await matrixData.save();
    // console.log("Saved:",saved);
    
   if(saved){
    return res.status(200).json({
      success: true,
      message: "Matrix created",
      status: 200,
      data:saved.result
    });
  }
  } catch (err) {
    console.log("Error to add matrix", err);
  }
};


const dashboard=async (req,res)=>{
  try{
    let userId=req.user.userdata._id;
    let matrixData=await MatrixModel.findOne({user:userId})
    if(matrixData)
    {
      let data={
        add:matrixData.addOpt,
        mul:matrixData.mulOpt,
        sub:matrixData.sub
      }
      return res.status(200).json({
        success: true,
        message: "couting found",
        status: 200,
        data:data
      });

    }
    else{
      return res.status(401).json({
        success: true,
        message: "User has not generated matrix yet",
        status: 401,
        data:{}
      });
    }
  }
  catch(err){
    console.log("Dashboard err",err);
    
  }
}
module.exports = {
  createMatrix,
  viewMatrix,
  addMatrix,
  mulMatrix,
  subMatrix,
  dashboard
};
