const express = require('express');
const mongoose= require('mongoose');
const app = express();
mongoose.connect("mongodb://127.0.0.1:27017/Employees")
.then(() => console.log("Connection Success")).catch((err) => console.log(err, "Error Connection"));
const db = mongoose.connection;
app.use(express.json());

const Employees = new mongoose.Schema({
    first_name: String,
    last_name: String,
    email: String,
    gender: String,
  });
  
  const employees = mongoose.model('employees', Employees);
  
  app.listen(3000, () => console.log(`SERVER STARTED AT PORT: 3000`));
  
  app.get("/", (req, res) => {
    res.send("Hello World");
  });
  
  app.get("/api/search", (req, res) => {
    res.send("API Search");
  });
  
  app.get("/api/employees", async (req, res) => {
    try {
      const allemployees = await employees.find();
      res.send(allemployees);
    } catch (err) {
      res.status(500).send(err.message);
    }
  });
  
  app.get("/api/employees/:id", async (req, res) => {
    try {
      const user = await employees.findById(req.params.id);
      if (!user) {
        res.status(404).send('User not found');
      } else {
        res.send(user);
      }
    } catch (err) {
      res.status(500).send(err.message);
    }
  });
  
  app.put("/api/employees/:id", async (req, res) => {
    try {
      const updatedUser = await employees.findByIdAndUpdate(
        req.params.id,
        {
          first_name: req.body.first_name,
          last_name: req.body.last_name,
          email: req.body.email,
          gender: req.body.gender,
        },
        { new: true }
      );
      if (!updatedUser) {
        res.status(404).send('User not found');
      } else {
        res.send(updatedUser);
      }
    } catch (err) {
      res.status(500).send(err.message);
    }
  });
  
  app.delete("/api/employees/:id", async (req, res) => {
    try {
      const deletedUser = await employees.findByIdAndDelete(req.params.id);
      if (!deletedUser) {
        res.status(404).send('User not found');
      } else {
        res.send(deletedUser);
      }
    } catch (err) {
      res.status(500).send(err.message);
    }
  });
  
  app.post("/api/employees", async (req, res) => {
    try {
      const newUser = new employees({
        first_name: req.body.first_name,
        last_name: req.body.last_name,
        email: req.body.email,
        gender: req.body.gender,
      });
      const savedUser = await newUser.save();
      res.send(savedUser);
    } catch (err) {
      res.status(500).send(err.message);
    }
  });