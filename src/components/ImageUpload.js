import React, { useState, useEffect } from "react";

const ImageUpload = () => {
  const [image, setImage] = useState(null);
  const [images, setImages] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState("");
  const [selectedSubcategory, setSelectedSubcategory] = useState("");
  const [selectedBrand, setSelectedBrand] = useState("");

  // Handle file selection
  const handleFileChange = (e) => {
    setImage(e.target.files[0]);
  };

  // Upload image
  const handleUpload = async () => {
    if (!image) {
      alert("Please select an image!");
      return;
    }

    const formData = new FormData();
    formData.append("image", image);

    try {
      const response = await fetch(
        "https://lost-and-found-backend-xi.vercel.app/api/upload",
        {
          method: "POST",
          body: formData,
        }
      );

      const data = await response.json();
      if (data.success) {
        setImages([...images, data.imageUrl]);
        alert("Image uploaded successfully!");
      }
    } catch (error) {
      console.error("Upload failed:", error);
    }
  };

  // Fetch uploaded images
  const fetchImages = async () => {
    try {
      const response = await fetch(
        "https://lost-and-found-backend-xi.vercel.app/api/images"
      );
      const data = await response.json();
      setImages(data.map((img) => img.imageUrl));
    } catch (error) {
      console.error("Error fetching images:", error);
    }
  };

  useEffect(() => {
    fetchImages();
  }, []);

  return (
    <div className="container mt-5">
      <h2 className="text-center">Image Upload</h2>

      <div className="mb-3">
        <input
          type="file"
          onChange={handleFileChange}
          className="form-control"
        />
        <button onClick={handleUpload} className="btn btn-primary mt-2">
          Upload
        </button>
      </div>

      <h3 className="mt-4">Uploaded Images</h3>
      <div className="d-flex flex-wrap">
        {images.map((img, index) => (
          <img
            key={index}
            src={img}
            alt="Uploaded"
            className="m-2 rounded"
            style={{ width: "150px", height: "150px", objectFit: "cover" }}
          />
        ))}
      </div>

      {/* Static Category Dropdowns */}
      <CategoryDropdown
        selectedCategory={selectedCategory}
        setSelectedCategory={setSelectedCategory}
        selectedSubcategory={selectedSubcategory}
        setSelectedSubcategory={setSelectedSubcategory}
        selectedBrand={selectedBrand}
        setSelectedBrand={setSelectedBrand}
      />
    </div>
  );
};

// Category Dropdown Component (Static Dropdowns)
const CategoryDropdown = ({
  selectedCategory,
  setSelectedCategory,
  selectedSubcategory,
  setSelectedSubcategory,
  selectedBrand,
  setSelectedBrand,
}) => {
  const categories = {
    Automobile: {
      Bike: [
        "Atlas Honda",
        "Pak Suzuki",
        "Yamaha",
        "Super Star",
        "Road Prince",
        "United",
        "Other",
      ],
      Car: [
        "Honda",
        "Suzuki",
        "Toyota",
        "Hyundai",
        "KIA",
        "Changan",
        "DFSK",
        "Other",
      ],
      Truck: ["Hino", "Isuzu", "Master", "FAW", "Shacman", "Other"],
    },
    "Clothing & Accessories": {
      Shoes: ["Bata", "Servis", "Borjan", "Nike", "Adidas", "Metro", "Other"],
      Handbag: [
        "Jafferjees",
        "Gucci",
        "Louis Vuitton",
        "Michael Kors",
        "Other",
      ],
      Watch: ["Rolex", "Casio", "Fossil", "Tissot", "Rado", "Other"],
    },
    Electronics: {
      Camera: ["Canon", "Nikon", "Sony", "Fujifilm", "Other"],
      Headphones: ["Audionic", "JBL", "Sony", "Bose", "Beats", "Other"],
      Laptop: ["Dell", "HP", "Lenovo", "Apple", "Asus", "Acer", "Other"],
      "Mobile Phone": [
        "Samsung",
        "Apple",
        "Oppo",
        "Vivo",
        "Realme",
        "Infinix",
        "Tecno",
        "Other",
      ],
      Tablet: ["Apple", "Samsung", "Huawei", "Lenovo", "Other"],
    },
    "Home Appliances": {
      "Air Conditioner": [
        "Dawlance",
        "Orient",
        "Haier",
        "PEL",
        "Gree",
        "Kenwood",
        "Other",
      ],
      Microwave: ["Dawlance", "Haier", "PEL", "Samsung", "LG", "Other"],
      Refrigerator: ["Dawlance", "Haier", "PEL", "Orient", "Samsung", "Other"],
      "Washing Machine": ["Dawlance", "Haier", "PEL", "Samsung", "Other"],
    },
    "Personal Belongings": {
      Bag: ["Backpack", "Handbag", "Laptop Bag", "Travel Bag", "Other"],
      Keys: ["Car Key", "House Key", "Office Key", "Other"],
      Sunglasses: ["Gucci", "Ray-Ban", "Oakley", "Other"],
      Wallet: ["Jafferjees", "Leather", "Fabric", "Other"],
    },
    "Sports & Fitness": {
      Bicycle: ["Sohrab", "Atlas", "Master", "Other"],
      "Sports Shoes": ["Servis", "Bata", "Adidas", "Nike", "Puma", "Other"],
      "Cricket Bat": ["CA", "MB Malik", "Ihsan", "Gray-Nicolls", "Other"],
      "Tennis Racket": ["Wilson", "Head", "Yonex", "Babolat", "Other"],
    },
  };

  const handleCategoryChange = (event) => {
    setSelectedCategory(event.target.value);
    setSelectedSubcategory(""); // Reset subcategory
    setSelectedBrand(""); // Reset brand
  };

  const handleSubcategoryChange = (event) => {
    setSelectedSubcategory(event.target.value);
    setSelectedBrand(""); // Reset brand
  };

  const handleBrandChange = (event) => {
    setSelectedBrand(event.target.value);
  };

  return (
    <div className="mt-4">
      <div className="row">
        {/* Category Dropdown */}
        <div className="col-md-4 mb-3">
          <label className="form-label">Select Category:</label>
          <select
            className="form-select"
            value={selectedCategory}
            onChange={handleCategoryChange}
          >
            <option value="">-- Select a Category --</option>
            {Object.keys(categories).map((category, index) => (
              <option key={index} value={category}>
                {category}
              </option>
            ))}
          </select>
        </div>

        {/* Subcategory Dropdown */}
        <div className="col-md-4 mb-3">
          <label className="form-label">Select Subcategory:</label>
          <select
            className="form-select"
            value={selectedSubcategory}
            onChange={handleSubcategoryChange}
            disabled={!selectedCategory}
          >
            <option value="">-- Select a Subcategory --</option>
            {selectedCategory &&
              Object.keys(categories[selectedCategory]).map(
                (subcategory, index) => (
                  <option key={index} value={subcategory}>
                    {subcategory}
                  </option>
                )
              )}
          </select>
        </div>

        {/* Brand Dropdown */}
        <div className="col-md-4 mb-3">
          <label className="form-label">Select Brand:</label>
          <select
            className="form-select"
            value={selectedBrand}
            onChange={handleBrandChange}
            disabled={!selectedSubcategory}
          >
            <option value="">-- Select a Brand --</option>
            {selectedCategory &&
              selectedSubcategory &&
              categories[selectedCategory][selectedSubcategory].map(
                (brand, index) => (
                  <option key={index} value={brand}>
                    {brand}
                  </option>
                )
              )}
          </select>
        </div>
      </div>
    </div>
  );
};

export default ImageUpload;
