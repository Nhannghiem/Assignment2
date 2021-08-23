const express = require('express')
const app = express()

const {ObjectId, MongoClient} = require('mongodb')
const url = 'mongodb+srv://nhanshoptoy:nhan123@cluster0.ra02h.mongodb.net/test';

app.set('view engine', 'hbs');
app.use(express.urlencoded({extended:true}))

app.use(express.static('body'))

app.post('/index', async(req,res)=>{
    const inputName = req.body.txtName;
    const inputPrice = req.body.txtPrice;
    const inputPicture= req.body.txtPicture;
    if(inputName.length <4){
        res.render('home',{errworng: 'smaller than 4 characters'})
        return;
    }

    const newStudent ={name:inputName,price:inputPrice,picture:inputPicture}

    const client = await MongoClient.connect(url);
    const dbo = client.db("Toys88899");
    await dbo.collection("products").insertOne(newStudent);
    res.redirect("/");
})
app.post('/search', async(req,res)=>{
    const searchInput = req.body.txtSearch;

    const client = await MongoClient.connect(url);
    const dbo = client.db("Toys88899");
    const allStudents =await dbo.collection("products").find({name:searchInput}).toArray();
    res.render('home',{data:allStudents})
})

app.post('/update',async(req,res)=>{
    const inputName = req.body.txtName;
    const inputPrice = req.body.txtPrice;
    const id = req.body.txtId;
    const inputPicture = req.body.txtPicture;

    const fille = {_id: ObjectId(id)}
    const newValue = {$set: {name:inputName,price:inputPrice,picture:inputPicture}}

    const client = await MongoClient.connect(url);
    const dbo = client.db("Toys88899");

    await dbo.collection("products").updateOne(fille,newValue)
    res.redirect("/");

})

app.get('/delete',async(req,res)=>{
    const id = req.query.id;

    const client = await MongoClient.connect(url);
    const dbo = client.db("Toys88899");
    await dbo.collection("products").deleteOne({"_id":ObjectId(id)});
    res.redirect("/")
})
app.get('/edit',async(req,res)=>{
    const id = req.query.id;

    const client = await MongoClient.connect(url);
    const dbo = client.db("Toys88899");
    const shop = await dbo.collection("products").findOne({_id:ObjectId(id)});
    res.render('edit',{product: shop})
    

})
app.get('/', async(req,res)=> {
    const client = await MongoClient.connect(url);
    const dbo = client.db("Toys88899");
    const allStudents =await dbo.collection("products").find({}).toArray();
    
    res.render('home',{data:allStudents})

})

const PORT= process.env.PORT || 5000;
app.listen(PORT)
console.log("app is running",PORT)