const express = require('express');
const app = express();
const mongoose = require('mongoose');
app.use(express.json());

// db connect
mongoose.connect("mongodb://127.0.0.1:27017/todo", {
    useNewUrlParser: true,
    useUnifiedTopology: true,
})
    .then(() => {
        console.log("Connected to the database");
    })
    .catch((err) => {
        console.error("Error connecting to the database:", err.message);
    });

//schema
const schema = new mongoose.Schema({
    desc: String,
    id: String,
  }, { versionKey: false }); 

const mondb = mongoose.model("description", schema);

//post route
app.post("/post", async(req, res)=>{
    console.log("inside post function")

    const data =new mondb({
        desc:req.body.desc,
    })
    const val=await data.save();
    res.json(val);
});

//put (UPDATE)
app.put("/update/:id", async (req, res) => {
    let upid = req.params.id;
    let updesc = req.body.desc;
  
    try {
      if (!mongoose.Types.ObjectId.isValid(upid)) {
        return res.status(400).send("ObjectID Tidak Valid");
      }
  
      const dataTerupdate = await mondb.findOneAndUpdate(
        { _id: upid },
        { $set: { desc: updesc } },
        { new: true }
      );
  
      if (!dataTerupdate) {
        return res.send("Data Tidak Ditemukan");
      }
  
      res.send(dataTerupdate);
    } catch (err) {
      console.error("Error mengupdate data:", err.message);
      res.status(500).send("Error mengupdate data");
    }
  });

//show 
app.get('/show/:id', async (req, res) => {
    try {
        const showId = req.params.id;
        const val = await mondb.find({ _id: showId }).exec();

        if (val.length === 0) {
            return res.send("Nothing Found");
        }

        res.send(val);
    } catch (err) {
        console.error("Error finding data:", err.message);
        res.status(500).send("Error finding data");
    }
});


//delete
app.delete('/delete/:id', async (req, res) => {
    try {
        const delid = req.params.id;
        const deletedData = await mondb.findOneAndDelete({ _id: delid }).exec();

        if (!deletedData) {
            return res.send("Nothing Found");
        }

        res.send("Success delete ");
    } catch (err) {
        console.error("Error deleting data:", err.message);
        res.status(500).send("Error deleting data");
    }
});

// GET all data
app.get('/list', async (req, res) => {
    try {
        const allData = await mondb.find().exec();

        if (allData.length === 0) {
            return res.send("Database is empty");
        }

        res.send(allData);
    } catch (err) {
        console.error("Error fetching data:", err.message);
        res.status(500).send("Error fetching data");
    }
});



app.listen(3000, () => {
    console.log("Listening on port 3000");
});
