import React, { useState, useEffect } from 'react';
import '../../css/AddEditProduct.css'; // import the CSS file
import { useParams } from 'react-router-dom';
import axios from 'axios';
import { useAuth } from '../AuthContext';

const categories = ['Electronics', 'Books', 'Clothing', 'Furniture'];

const AddEditProduct = () => {
  var {token}=useAuth();

  const API_BASE_URL = 'https://dapperly-bpcbh3erbzc4ckhh.eastasia-01.azurewebsites.net';
  const [product, setProduct] = useState({
    productName: '',
    category: '',
    description: '',
    imageBaseUrl: '',
    price: '',
    stock: ''    
  });

  const[isProdAvailable,setProdAvailable]=useState(false);
  const[isUpdate,setIsUpdate]=useState(false);

  const { id } = useParams();

  useEffect(() => {
    if (id) {
axios.get(`${API_BASE_URL}/api/service/getProdById/${id}`, {
    headers: {
      Authorization: `Bearer ${token}`
    }
  })
  .then((response) => {
      console.log(response.data); // data from backend
      setProdAvailable(true);
      setIsUpdate(true);
      setProduct(response.data);
    })
    .catch((error) => {
      console.error('Error fetching products:', error);
    });
      
    }
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setProduct({ ...product, [name]: value });
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    const reader = new FileReader();
    reader.onloadend = () => {
      setProduct({ ...product, ImageBaseUrl: reader.result });
    };
    if (file) reader.readAsDataURL(file);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if(!isUpdate){
       axios.post(`${API_BASE_URL}/api/service/addProduct`, product, {
  headers: {
    Authorization: `Bearer ${token}`,
    'Content-Type': 'application/json'  // Optional but good to specify
  }
})
.then((response) => {
  if (response.status === 200 || response.status === 201) {
    alert("Product Added Successfully");
  } else {
    alert(`Unexpected status code: ${response.status}`);
  }
})
.catch((error) => {
  console.error('Error adding product:', error);

  if (error.response) {
    // Server responded with a status code out of 2xx
    alert(`Failed to add product: ${error.response.data?.message || error.response.statusText}`);
  } else if (error.request) {
    // Request was made but no response received
    alert("No response from server.");
  } else {
    // Something else happened
    alert("An error occurred: " + error.message);
  }
});
    }else{
 axios.put(`${API_BASE_URL}/api/service/updateProduct/${id}`, product, {
  headers: {
    Authorization: `Bearer ${token}`,
    'Content-Type': 'application/json'  // Optional but good to specify
  }
})
.then((response) => {
  if (response.status === 200 || response.status === 201) {
    alert("Product Update Successfully");
  } else {
    alert(`Unexpected status code: ${response.status}`);
  }
})
.catch((error) => {
  console.error('Error updating product:', error);

  if (error.response) {
    // Server responded with a status code out of 2xx
    alert(`Failed to update product: ${error.response.data?.message || error.response.statusText}`);
  } else if (error.request) {
    // Request was made but no response received
    alert("No response from server.");
  } else {
    // Something else happened
    alert("An error occurred: " + error.message);
  }
});
    }
  };

  return (
    <div className="form-wrapper">
      <h2>{isProdAvailable ? 'Edit' : 'Add'} Product</h2>
      <form onSubmit={handleSubmit} className="product-form">
        <label>Product Name:</label>
        <input
          type="text"
          name="productName"
          value={product.productName}
          onChange={handleChange}
          required
        />

        <label>Category:</label>
        <select
          name="category"
          value={product.category}
          onChange={handleChange}
          required
        >
          <option value="">Select Category</option>
          {categories.map((cat) => (
            <option key={cat} value={cat}>{cat}</option>
          ))}
        </select>

        <label>Description:</label>
        <textarea
          name="description"
          value={product.description}
          onChange={handleChange}
        />

        <label>Upload Image:</label>
        <input
          type="file"
          accept="image/*"
          onChange={handleImageChange}
        />
        {product.imageBaseUrl && (
            <div className="image-preview-wrapper">
          <img
            src={product.imageBaseUrl}
            alt="Preview"
            className="preview-image"
          />
          </div>
        )}

        <label>Price:</label>
        <input
          type="number"
          name="price"
          min={0}
          value={product.price}
          onChange={handleChange}
          required
        />

        <label>Stock:</label>
        <input
          type="number"
          name="stock"
          min={0}
          value={product.stock}
          onChange={handleChange}
          required
        />

        <button type="submit">{isProdAvailable ? 'Update' : 'Add'} Product</button>
      </form>
    </div>
  );
};

export default AddEditProduct;
