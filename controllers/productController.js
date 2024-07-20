const Product = require('../models/Product');
const {generateToken} = require('../utils/authorization');


exports.createProduct = async (req, res) => {
    try{

        // const { name, quantity, price, vendorId } = req.body;
        const { name, quantity, price } = req.body;
        const { userId } = req.user
        console.log("req.body for create product : ", name, quantity, price);
        console.log("userId from token : ", userId);

        const newProduct = new Product({
          name,
          quantity,
          price,
          vendorId: userId
        });

        const savedProduct = await newProduct.save();
        res.status(201).json(savedProduct);
    } catch (error) {
        res.status(500).json({ message: 'Error creating product', error });
    }
}


exports.getProducts = async (req, res) => {
    try{
        let products = await Product.find();
        let response = {
            "message": "List of Products",
            "products": products
        }
        res.status(200).json(response);

    } catch(err) {
        res.status(401).json(err)
    }
}

exports.getProductsById = async (req, res) => {
    try{
      const {id} = req.params;
      console.log("id", id);
      console.log("req.params", req.params);
      let getProductsById = await Product.findById(id);
      console.log("getProductsById", getProductsById);
      res.status(200).json(getProductsById)
  
    } catch (err) {
      res.status(401).json(err)
    }
  }

  exports.updateProductById = async (req, res) => {
    try{
        const { id } = req.params;
        const { name, quantity, price, vendorId } = req.body;

        
    } catch (err) {
        
    }
  }


  exports.deleteProductById = async (req, res) => {
    try {
      const { id } = req.params;
      await Product.findByIdAndDelete(id);
      res.json({ message: 'User deleted' });
    } catch (err) {
      res.status(500).json({ message: err.message });
    }
  }


