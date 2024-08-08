require('dotenv').config();

const express=require('express');
const app=express();
const mongoose=require('mongoose');
const path=require('path');

const PORT=process.env.POR || 1000;

const authRouter=require('./router/authRouter');
const matRouter=require('./router/matRouter');

app.use(express.urlencoded({extended:true}));
app.use(express.json({extended:true}));

app.use((req, res, next) => {
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'GET,POST,PUT,PATCH,DELETE');
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type,Authorization');
    res.setHeader(
        'Cache-Control',
        'no-store, no-cache, must-revalidate, proxy-revalidate'
      );
    next();
  });


  app.use(authRouter);
  app.use(matRouter);
  app.use((req, res) => {
    res.send("<h1>PAGE  NOT FOUND!! Please recheck.</h1>");
  });

  mongoose
  .connect(process.env.DB_URL)
  .then((res) => {
    console.log("Database connected");
    app.listen(PORT, () =>{
      console.log(`Server running at  http://localhost:${PORT}`)
  });
  })
  .catch((err) => console.log("Error to connect databasee", err));