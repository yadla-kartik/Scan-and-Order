const cookieParser = require("cookie-parser");
const express = require("express");
const mongoose = require("mongoose");
const path = require("path");
const { connectDB } = require("./connection");
const userRoute = require("./routes/user");
const userMenu = require("./routes/menu");
const cartRoute = require('./routes/cart');
const { checkForAuthAndRedirect } = require("./middlewares/auth");
const Food = require("./models/menu");
const { timeEnd } = require("console");
const User = require("./models/user");
mongoose.set("strictQuery", true);

const app = express();

// EJS
app.set("view engine", "ejs");
app.set("views", path.resolve("./views"));

// Middleware
app.use(express.static(path.join(__dirname, 'public')));
app.use(express.urlencoded({ extended: false }));
app.use(express.json());
app.use(cookieParser());

// Home route
app.get("/", checkForAuthAndRedirect('userToken'), (req, res) => {
  if (req.user) {
    user = req.user;
    return res.render("home",{
      user,
    });
  } 
  else {
    return res.redirect("/user");
  }
});

// Login Route
app.get("/user", (req, res) => {
    return res.render("login");
});
app.use("/login", userRoute);

// Home Post Route
app.use("/", userMenu);

// Cart Route
app.use('/', cartRoute);


// OrderBill
app.get('/orderBill', checkForAuthAndRedirect('userToken'), async(req, res)=>{
  if(!req.user){
    res.redirect('/user')
  }
  const foodItems = await Food.find({
    'userItem.createdBy': req.user._id
  })
  let userItems = foodItems.flatMap(item => 
    item.userItem.map(userItem => ({
      ...userItem._doc, 
      amt: userItem.price * userItem.quantity, 
    
  })).filter(item => item.paymentStatus === 'Pending')
);
  return res.render('orderBill',{
    user: req.user,
    UserItems: userItems, 
  })
});


// Chef Route
app.get('/chef', async(req, res)=>{
  try{
    const pendingOrders = await Food.find({ 'userItem.status': 'Pending' });

    const user = await User.find({});
    let chefOrders = pendingOrders.flatMap(order => order.userItem.filter(item => item.status === 'Pending'));
 
    res.render('chef', { 
      users: user,
      chefOrders 
    }); 
  } catch (err) {
    res.status(500).send(err.message);
  } 
  }
)

app.post('/markAsDone', async (req, res) => {
  const { itemId } = req.body;

  try {
    await Food.updateOne(
      { 'userItem._id': itemId },
      { $set: { 'userItem.$.status': 'completed' } }
    );
    res.redirect('/chef'); 
  } catch (err) {
    res.status(500).send(err.message);
  }
});

// ADMIN Route
app.get('/admin', async(req, res)=>{

  try {
    const pendingOrders = await Food.find({ 'userItem.paymentStatus': 'Pending' });

    const user = await User.find({});
    let chefOrders = pendingOrders.flatMap(order =>
      order.userItem.filter(item => item.paymentStatus === 'Pending')
    );
    return res.render('admin',{
      user,
      chefOrders,
    })
  } catch (error) {
    console.log(error);
  }

})

app.post('/paymentSuccess', async(req, res)=>{
  const { userId } = req.body;

  try {
    await Food.updateMany(
      { 'createdBy': userId },
      { $set: { 'paymentStatus': 'Success' } }
    );
    res.redirect('/admin'); 
  } catch (err) {
    res.status(500).send(err.message);
  }
})


// Connection
connectDB("mongodb://localhost:27017/scan_order")
  .then(() => {
    console.log("MongoDB Connected");
  })
  .catch((err) => {
    console.log("Error", err);
  });

const Port = process.env.Port || 8000

app.listen(Port, () => console.log("Server Started"));
