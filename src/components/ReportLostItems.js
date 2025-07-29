import { useState } from "react";
import { showToast } from "./Toastify2";
function ReportLostItems() {
  const [selectedCategory, setSelectedCategory] = useState("");
  const [selectedSubcategory, setSelectedSubcategory] = useState("");
  const [selectedBrand, setSelectedBrand] = useState("");
  const [selectedCity, setSelectedCity] = useState("");
  const [location, setLocation] = useState("");
  const [description, setDescription] = useState("");
  const [title, setTitle] = useState("");
  const [date, setDate] = useState("");
  const [images, setImages] = useState(Array(4).fill(null));
  const [selectedFiles, setSelectedFiles] = useState([]);
  const [uploadedFiles, setUploadedFiles] = useState(Array(4).fill(null));
   const [submit, setSubmit] = useState(true);
   

  //const token = useAuth();
  const userId = localStorage.getItem("userId");

  const categories = {
    Automobile: {
      Bike: [
        "Atlas Honda",
        "Pak Suzuki",
        "Yamaha",
        "Super Star",
        "Road Prince",
        "United",
        "Unique",
        "Hero",
        "ZXMCO",
        "Ravi",
        "Metro",
        "Super Power",
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
        "BMW",
        "Mercedes",
        "Audi",
        "Nissan",
        "Chevrolet",
        "Mazda",
        "Other",
      ],
      Truck: [
        "Hino",
        "Isuzu",
        "Master",
        "FAW",
        "Shacman",
        "MAN",
        "Volvo",
        "Scania",
        "Tata",
        "Dongfeng",
        "Other",
      ],
    },

    "Clothing & Accessories": {
      Shoes: [
        "Bata",
        "Servis",
        "Borjan",
        "Nike",
        "Adidas",
        "Metro",
        "Puma",
        "Reebok",
        "Skechers",
        "Other",
      ],
      Handbag: [
        "Jafferjees",
        "Gucci",
        "Louis Vuitton",
        "Michael Kors",
        "Chanel",
        "Prada",
        "Coach",
        "Hermès",
        "Dior",
        "Kate Spade",
        "Other",
      ],
      Watch: [
        "Rolex",
        "Casio",
        "Fossil",
        "Tissot",
        "Rado",
        "Tag Heuer",
        "Omega",
        "Seiko",
        "Citizen",
        "Swatch",
        "Hublot",
        "Other",
      ],
    },

    Electronics: {
      Camera: [
        "Canon",
        "Nikon",
        "Sony",
        "Fujifilm",
        "Panasonic",
        "Olympus",
        "Kodak",
        "GoPro",
        "Other",
      ],
      Headphones: [
        "Audionic",
        "JBL",
        "Sony",
        "Bose",
        "Beats",
        "Sennheiser",
        "Apple AirPods",
        "Samsung",
        "Other",
      ],
      Laptop: [
        "Dell",
        "HP",
        "Lenovo",
        "Apple",
        "Asus",
        "Acer",
        "MSI",
        "Razer",
        "Microsoft",
        "Huawei",
        "Other",
      ],
      "Mobile Phone": [
        "Samsung",
        "Apple",
        "Oppo",
        "Vivo",
        "Realme",
        "Infinix",
        "Tecno",
        "Xiaomi",
        "OnePlus",
        "Nokia",
        "Other",
      ],
      Tablet: [
        "Apple",
        "Samsung",
        "Huawei",
        "Lenovo",
        "Amazon Fire",
        "Microsoft Surface",
        "Other",
      ],
    },

    "Home Appliances": {
      "Air Conditioner": [
        "Dawlance",
        "Orient",
        "Haier",
        "PEL",
        "Gree",
        "Kenwood",
        "Samsung",
        "LG",
        "Other",
      ],
      Microwave: [
        "Dawlance",
        "Haier",
        "PEL",
        "Samsung",
        "LG",
        "Panasonic",
        "Other",
      ],
      Refrigerator: [
        "Dawlance",
        "Haier",
        "PEL",
        "Orient",
        "Samsung",
        "LG",
        "Hitachi",
        "Other",
      ],
      "Washing Machine": [
        "Dawlance",
        "Haier",
        "PEL",
        "Samsung",
        "Bosch",
        "Whirlpool",
        "Other",
      ],
    },

    "Personal Belongings": {
      Bag: [
        "Backpack",
        "Handbag",
        "Laptop Bag",
        "Travel Bag",
        "School Bag",
        "Messenger Bag",
        "Duffle Bag",
        "Other",
      ],
      Keys: [
        "Car Key",
        "House Key",
        "Office Key",
        "Locker Key",
        "Bike Key",
        "Other",
      ],
      Sunglasses: [
        "Gucci",
        "Ray-Ban",
        "Oakley",
        "Prada",
        "Versace",
        "Tom Ford",
        "Other",
      ],
      Wallet: [
        "Jafferjees",
        "Leather",
        "Fabric",
        "Gucci",
        "Louis Vuitton",
        "Tommy Hilfiger",
        "Coach",
        "Other",
      ],
    },

    "Sports & Fitness": {
      Bicycle: [
        "Sohrab",
        "Atlas",
        "Master",
        "Giant",
        "Trek",
        "Scott",
        "Merida",
        "Other",
      ],
      "Sports Shoes": [
        "Servis",
        "Bata",
        "Adidas",
        "Nike",
        "Puma",
        "Reebok",
        "Skechers",
        "New Balance",
        "Other",
      ],
      "Cricket Bat": [
        "CA",
        "MB Malik",
        "Ihsan",
        "Gray-Nicolls",
        "SG",
        "Kookaburra",
        "GM",
        "Other",
      ],
      "Tennis Racket": [
        "Wilson",
        "Head",
        "Yonex",
        "Babolat",
        "Prince",
        "Other",
      ],
    },

    Jewelry: {
      Necklace: [
        "Tiffany & Co.",
        "Cartier",
        "Bvlgari",
        "Van Cleef & Arpels",
        "David Yurman",
        "Other",
      ],
      Ring: [
        "Tiffany & Co.",
        "Cartier",
        "Chopard",
        "Swarovski",
        "Harry Winston",
        "Other",
      ],
      Bracelet: [
        "Pandora",
        "Tiffany & Co.",
        "Cartier",
        "Hermès",
        "Chanel",
        "Other",
      ],
      Earrings: [
        "Tiffany & Co.",
        "Cartier",
        "Bvlgari",
        "Van Cleef & Arpels",
        "Chopard",
        "Other",
      ],
    },

    Documents: {
      Passport: ["Government-Issued", "Other"],
      "ID Card": [
        "National ID",
        "Driver’s License",
        "Student ID",
        "Work ID",
        "Other",
      ],
      "Bank Documents": [
        "Cheque Book",
        "Credit Card",
        "Debit Card",
        "Passbook",
        "Other",
      ],
      Certificates: [
        "Educational",
        "Marriage Certificate",
        "Birth Certificate",
        "Other",
      ],
    },

    "Musical Instruments": {
      Guitar: ["Fender", "Gibson", "Ibanez", "Yamaha", "Other"],
      Piano: ["Yamaha", "Steinway & Sons", "Casio", "Roland", "Other"],
      Drums: ["Pearl", "Tama", "Yamaha", "DW Drums", "Other"],
      Violin: ["Stradivarius", "Yamaha", "Stentor", "Other"],
    },

    "Books & Stationery": {
      Book: ["Fiction", "Non-fiction", "Textbook", "Magazine", "Other"],
      Notebook: ["Oxford", "Dollar", "Other"],
      Pen: ["Parker", "Montblanc", "Cross", "Pilot", "Other"],
      Calculator: ["Casio", "Texas Instruments", "HP", "Sharp", "Other"],
    },

    "Toys & Games": {
      "Action Figures": ["Marvel", "DC", "Hasbro", "Mattel", "Lego", "Other"],
      "Board Games": ["Monopoly", "Scrabble", "Chess", "Risk", "Other"],
      Dolls: ["Barbie", "American Girl", "Baby Alive", "Other"],
      "Remote Control Cars": ["Hot Wheels", "Tamiya", "Maisto", "Other"],
    },

    "Tools & Hardware": {
      "Drill Machine": ["Bosch", "Makita", "DeWalt", "Black & Decker", "Other"],
      "Screwdriver Set": ["Stanley", "Craftsman", "Klein Tools", "Other"],
      Hammer: ["Stanley", "Estwing", "Other"],
      Wrench: ["Snap-on", "Craftsman", "Klein Tools", "Other"],
    },

    "Health & Beauty": {
      Perfume: ["Chanel", "Dior", "Armani", "Gucci", "Other"],
      Makeup: ["MAC", "Sephora", "Maybelline", "Loreal", "Other"],
      "Hair Dryer": ["Dyson", "Philips", "Braun", "Other"],
      "Electric Shaver": ["Philips", "Braun", "Panasonic", "Other"],
    },

    "Pet Supplies": {
      "Dog Food": [
        "Pedigree",
        "Royal Canin",
        "Purina",
        "Hill’s Science Diet",
        "Other",
      ],
      "Cat Food": ["Whiskas", "Meow Mix", "Royal Canin", "Other"],
      "Bird Cage": ["Prevue", "Vision", "Other"],
      "Fish Tank": ["Aqueon", "Fluval", "Other"],
    },

    "Baby & Kids": {
      "Baby Stroller": ["Graco", "Chicco", "Baby Trend", "Other"],
      "Baby Bottle": ["Philips Avent", "Dr. Brown’s", "Other"],
      Diapers: ["Pampers", "Huggies", "Molfix", "Other"],
      Toys: ["Lego", "Fisher-Price", "Hot Wheels", "Barbie", "Other"],
    },
  };

  // List of cities in Pakistan (Alphabetically sorted)
  const cities = [
    "Abbottabad",
    "Ahmadpur East",
    "Ahmed Nager Chatha",
    "Alipur",
    "Arifwala",
    "Attock",
    "Awaran",
    "Badin",
    "Bagh",
    "Bahawalnagar",
    "Bahawalpur",
    "Bannu",
    "Batkhela",
    "Battagram",
    "Bhakkar",
    "Bhalwal",
    "Bhan",
    "Bhera",
    "Bhimber",
    "Bhiria",
    "Bozdar Wada",
    "Burewala",
    "Chakwal",
    "Chaman",
    "Charsadda",
    "Chichawatni",
    "Chiniot",
    "Chishtian",
    "Chitral",
    "Dadu",
    "Daggar",
    "Daska",
    "Dera Allah Yar",
    "Dera Ghazi Khan",
    "Dera Ismail Khan",
    "Dhaular",
    "Digri",
    "Dina",
    "Dinga",
    "Diplo",
    "Dipalpure",
    "Dokri",
    "Duki",
    "Dullewala",
    "Dunya Pur",
    "Eidgah",
    "Faisalabad",
    "Fateh Jang",
    "Gakhar Mandi",
    "Gambat",
    "Garh Maharaja",
    "Ghotki",
    "Gilgit",
    "Gojra",
    "Gujar Khan",
    "Gujranwala",
    "Gujrat",
    "Gulistan",
    "Gwadar",
    "Hafizabad",
    "Hala",
    "Hangu",
    "Haripur",
    "Harnai",
    "Hasilpur",
    "Haveli Lakha",
    "Hingorja",
    "Hujra Shah Muqeem",
    "Hyderabad",
    "Islamabad",
    "Jacobabad",
    "Jalalpur Jattan",
    "Jampur",
    "Jamshoro",
    "Jaranwala",
    "Jati",
    "Jatoi",
    "Jauharabad",
    "Jhang",
    "Jhelum",
    "Jhudo",
    "Kabal",
    "Kahuta",
    "Kahror Pakka",
    "Kakul",
    "Kalabagh",
    "Kalat",
    "Kamalia",
    "Kamar Mushani",
    "Kamoke",
    "Kandhkot",
    "Kandiaro",
    "Karachi",
    "Karor Lal Esan",
    "Kasur",
    "Khairpur",
    "Khan Bela",
    "Khanewal",
    "Khanpur",
    "Kharan",
    "Kharian",
    "Khewra",
    "Khushab",
    "Khuzdar",
    "Kohat",
    "Kohlu",
    "Kot Addu",
    "Kotli",
    "Kot Radha Kishan",
    "Kotri",
    "Kumb",
    "Lahore",
    "Lakki Marwat",
    "Lalamusa",
    "Larkana",
    "Layyah",
    "Liaquat Pur",
    "Lodhran",
    "Loralai",
    "Mach",
    "Mailsi",
    "Malakwal",
    "Mandi Bahauddin",
    "Mansehra",
    "Mardan",
    "Mastung",
    "Matiari",
    "Mehar",
    "Mehrabpur",
    "Mian Channu",
    "Mianwali",
    "Minchinabad",
    "Mingora",
    "Miran Shah",
    "Mirpur",
    "Mirpur Khas",
    "Mithi",
    "Moro",
    "Multan",
    "Muridke",
    "Murree",
    "Mustafabad",
    "Muzaffarabad",
    "Muzaffargarh",
    "Nankana Sahib",
    "Narowal",
    "Nasirabad",
    "Naukot",
    "Nawabshah",
    "New Mirpur",
    "Nowshera",
    "Nushki",
    "Okara",
    "Ormara",
    "Pakpattan",
    "Panjgur",
    "Pasni",
    "Pattoki",
    "Peshawar",
    "Phalia",
    "Pind Dadan Khan",
    "Pindi Bhattian",
    "Pindi Gheb",
    "Pir Mahal",
    "Qadirpur Ran",
    "Quetta",
    "Rahim Yar Khan",
    "Raiwind",
    "Rajanpur",
    "Rajo Khanani",
    "Rawalakot",
    "Rawalpindi",
    "Renala Khurd",
    "Rohri",
    "Sadiqabad",
    "Sahiwal",
    "Sanghar",
    "Sangla Hill",
    "Sarai Alamgir",
    "Sargodha",
    "Sehwan",
    "Setharja",
    "Shahdadkot",
    "Shahdadpur",
    "Shahkot",
    "Shahpur",
    "Shakargarh",
    "Sharqpur",
    "Sheikhupura",
    "Shikarpur",
    "Shorkot",
    "Shujaabad",
    "Sialkot",
    "Sibi",
    "Sillanwali",
    "Sita Road",
    "Skardu",
    "Sohawa",
    "Sukkur",
    "Swabi",
    "Swat",
    "Tando Adam",
    "Tando Allahyar",
    "Tando Jam",
    "Tando Muhammad Khan",
    "Tank",
    "Taxila",
    "Thal",
    "Thatta",
    "Toba Tek Singh",
    "Turbat",
    "Ubauro",
    "Umarkot",
    "Upper Dir",
    "Uthal",
    "Vehari",
    "Wah Cantt",
    "Warburton",
    "Wazirabad",
    "Zafarwal",
    "Zahir Pir",
    "Zhob",
    "Ziarat",
  ];

  const handleCategoryChange = (event) => {
    setSelectedCategory(event.target.value);
    setSelectedSubcategory("");
    setSelectedBrand("");
  };

  const handleSubcategoryChange = (event) => {
    setSelectedSubcategory(event.target.value);
    setSelectedBrand(""); // Reset brand
  };

  const handleBrandChange = (event) => {
    setSelectedBrand(event.target.value);
  };

  const handleCityChange = (event) => {
    setSelectedCity(event.target.value);
  };

  const handleOnClick = async (e) => {
    e.preventDefault();


    if (!date) {
      alert("Please select a date before saving.");
      return;
    }

   const selectedDate = new Date(date);
selectedDate.setHours(0, 0, 0, 0); // clear time from selected date

const today = new Date();
today.setHours(0, 0, 0, 0); // clear time from today

if (selectedDate > today) {
  alert("Date cannot be in the future. Please select a valid date.");
  return;
}


    if (!selectedCategory) {
      alert("Please Select Category");
      return;
    }
    if (!selectedSubcategory) {
      alert("Please Select Subcategory");
      return;
    }
    if (!selectedBrand) {
      alert("Please Select Brand");
      return;
    }
    if (!selectedCity) {
      alert("Please Select City");
      return;
    }
    if (!uploadedFiles || uploadedFiles.length === 0) {
      alert("No files selected.");
      return;
    }
      setSubmit(false)

    await new Promise((resolve) => setTimeout(resolve, 100));
    const formattedDate = new Date(date).toISOString().split("T")[0];

 
    const formData = new FormData();
    formData.append("userId", userId);
    formData.append("title", title);
    formData.append("category", selectedCategory);
    formData.append("subCategory", selectedSubcategory);
    formData.append("brand", selectedBrand);
    formData.append("description", description);
    formData.append("city", selectedCity);
    formData.append("location", location);
    formData.append("dateLost", formattedDate);
   

    uploadedFiles.forEach((file) => {
      formData.append("images", file);
    });
    try {
      const response = await fetch(
        "https://lost-and-found-backend-xi.vercel.app/auth/add-lostItems",
        {
          method: "POST",
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
          body: formData,
        }
      );

      const data = await response.json();

      if (response.ok) {
          setSubmit(true)
          showToast("success", "Item added successfully!", 3000, "top-right");

      

        setSelectedCategory("");
        setSelectedSubcategory("");
        setSelectedBrand("");
        setSelectedCity("");
        setLocation("");
        setDescription("");
        setTitle("");
        setImages(Array(4).fill(null));
        setSelectedFiles([]);
        setUploadedFiles(Array(4).fill(null));
      } else {
        console.error("Error adding item:", data.message);
        alert("Error adding item:", data.message);
      }
    } catch (error) {
      console.error("Network or server error:", error);
    }
  };

  const handleFileChange = (event) => {
    if (!event.target.files || event.target.files.length === 0) return;

    const files = Array.from(event.target.files);


    setSelectedFiles(files);
  };

  const handleUpload = () => {
    if (selectedFiles.length === 0) {
      alert("No Image Selected");
      return;
    }
    if (selectedFiles.length === 4) {
      alert("You cannot upload more than 4 images");
      return;
    }

    const newImages = [...images];
    const newUploadedFiles = [...uploadedFiles];

    selectedFiles.forEach((file) => {
      const index = newImages.findIndex((img) => img === null);

      if (index !== -1) {
        newImages[index] = URL.createObjectURL(file);
        newUploadedFiles[index] = file;
      }
    });

    setImages(newImages);
    setUploadedFiles(newUploadedFiles);

  };
  const handleDeleteImage = (index) => {
    const newImages = [...images];
    newImages[index] = null;
    setImages(newImages);
  };

  return (
    <div className="mt-2 container">
      <h2 className="text-center fw-bold mb-4">
        <i className="fa-solid fa-magnifying-glass me-2"></i> Report Lost Items
      </h2>

      <div className="row g-3">
        {/* Title Input */}
        <div className="col-md-4">
          <label className="form-label">
            <b>
              Enter Title:<span className="text-danger">*</span>
            </b>
          </label>
          <input
            type="text"
            className="form-control"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            placeholder="Short & clear name of the found item"
            required
            minLength={3}
          />
        </div>

        {/* Category Dropdown */}
        <div className="col-md-4">
          <label className="form-label">
            <b>
              Select Category:<span className="text-danger">*</span>
            </b>
          </label>
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
        <div className="col-md-4">
          <label className="form-label">
            <b>
              Select Subcategory:<span className="text-danger">*</span>
            </b>
          </label>
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
        <div className="col-md-3">
          <label className="form-label">
            <b>
              Select Brand:<span className="text-danger">*</span>
            </b>
          </label>
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

        {/* City Dropdown */}
        <div className="col-md-3">
          <label className="form-label">
            <b>
              Select City:<span className="text-danger">*</span>
            </b>
          </label>
          <select
            className="form-select"
            value={selectedCity}
            onChange={handleCityChange}
          >
            <option value="">-- Select a City --</option>
            {cities.map((city, index) => (
              <option key={index} value={city}>
                {city}
              </option>
            ))}
          </select>
        </div>

        {/* Address Input */}
        <div className="col-md-6">
          <label className="form-label">
            <b>
              Enter Location:<span className="text-danger">*</span>
            </b>
          </label>
          <input
            type="text"
            className="form-control"
            value={location}
            onChange={(e) => setLocation(e.target.value)}
            placeholder="Exact place like Bus Station, Gate 3"
            required
            minLength={5}
          />
        </div>
        {/* Date Input */}
        <div className="col-md-3">
          <label className="form-label">
            <b>
              Select Date:<span className="text-danger">*</span>
            </b>
          </label>
          <input
            type="date"
            className="form-control"
            value={date}
            onChange={(e) => setDate(e.target.value)}
          />
        </div>
        {/* Description Input */}
        <div className="col-md-9">
          <label className="form-label">
            <b>
              Description:<span className="text-danger">*</span>
            </b>
          </label>
          <input
            type="text"
            className="form-control"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            placeholder="Details about the item like color, size, special marks, etc"
            required
            minLength={5}
          />
        </div>
        <div className="col-md-9">
          <label className="form-label">
            <b>Upload Picture:</b>
            <span className="text-secondary ms-1">
              (Optional — Recommended: at least 1 sample image)
            </span>
          </label>
          <input
            type="file"
            accept="image/*"
            multiple
            className="form-control"
            onChange={handleFileChange}
            disabled={!images.includes(null)}
          />
        </div>

        <div className="col-md-3" style={{ marginTop: 47 }}>
          <button className="btn btn-outline-dark w-100" onClick={handleUpload}>
            <i className="fa-solid fa-file-arrow-up"></i> Upload
          </button>
        </div>

        <div className="row mt-3">
          {images.map((image, index) => (
            <div key={index} className="col-md-3 mb-3">
              <div
                className="card"
                style={{
                  height: "310px",
                  overflow: "hidden",
                  position: "relative",
                }}
              >
                {/* Delete icon with Font Awesome */}
                {image && (
                  <button
                    onClick={() => handleDeleteImage(index)}
                    className="btn btn-sm"
                    style={{
                      position: "absolute",
                      top: "5px",
                      right: "5px",
                      background: "rgba(0,0,0,0.5)",
                      color: "white",
                      border: "none",
                      borderRadius: "50%",
                      width: "30px",
                      height: "30px",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      cursor: "pointer",
                      zIndex: 1,
                    }}
                    title="Delete image"
                  >
                    <i className="fa-solid fa-trash"></i>
                  </button>
                )}

                {image ? (
                  <img
                    src={image}
                    className="card-img-top"
                    alt={`Uploaded ${index + 1}`}
                    style={{ height: "100%", objectFit: "cover" }}
                  />
                ) : (
                  <div
                    className="d-flex justify-content-center align-items-center"
                    style={{
                      height: "310px",
                      backgroundColor: "#f0f0f0",
                      borderRadius: "8px",
                    }}
                  >
                    <i className="fa-solid fa-image fa-3x text-muted"></i>
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>

        {/* Submit Button */}
        
        <div className="col-md-12 d-flex justify-content-end end-0 mb-1">
          <button
            className="btn btn-outline-success px-4 py-2"
            onClick={handleOnClick}
            disabled={!submit}
          >
            <i className="fas fa-clipboard-check me-2"></i>
            {submit === true ? (
              "Report Lost Item"
            ) : (
              <>
                Submitting...
                <div
                  className="spinner-border spinner-border-sm text-success ms-2"
                  role="status"
                ></div>
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  );
}

export default ReportLostItems;
