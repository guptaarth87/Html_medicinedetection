// Load the Teachable Machine model
let model;
// const modelURL = "https://teachablemachine.withgoogle.com/models/RI_wubqTe/model.json"; // Replace with your model URL
// const metadataURL = "https://teachablemachine.withgoogle.com/models/RI_wubqTe/metadata.json"; // Replace with your metadata URL
// import plantData from './Details.js';

let plantData  = {
    
  "alovera": {
    "name": "Aloe Vera",
    "scientific_name": "Aloe barbadensis miller",
    "specie_locations": "Native to the Arabian Peninsula but cultivated worldwide",
    "description": "Aloe vera is a succulent plant known for its gel-filled leaves, which are used for various medicinal and cosmetic purposes. It is valued for its soothing and healing properties."
  },
  "bamboo": {
    "name": "Bamboo",
    "scientific_name": "Bambusoideae",
    "specie_locations": "Found in various regions, including Asia, Africa, and the Americas",
    "description": "Bamboo is a fast-growing plant known for its tall, woody stems. It has a wide range of uses, including construction, furniture, and as a food source in some cultures."
  },
  "coriander": {
    "name": "Coriander",
    "scientific_name": "Coriandrum sativum",
    "specie_locations": "Native to Southern Europe and Western Asia",
    "description": "Coriander is an herb known for its aromatic leaves and seeds. It is a common spice in many cuisines and is also used for its medicinal properties."
  },
  "curry": {
    "name": "Curry Plant",
    "scientific_name": "Helichrysum italicum",
    "specie_locations": "Native to the Mediterranean region",
    "description": "The curry plant, not to be confused with curry spices, is an aromatic herb known for its silver-gray foliage and pleasant scent. It is used in perfumes and aromatherapy."
  },
  "mint": {
    "name": "Mint",
    "scientific_name": "Mentha",
    "specie_locations": "Widely distributed across Europe, Asia, Africa, and the Americas",
    "description": "Mint is a fragrant herb known for its refreshing flavor. It is commonly used in cooking, beverages, and herbal teas. Mint leaves are also valued for their medicinal properties."
  },
  "tamarind": {
    "name": "Tamarind",
    "scientific_name": "Tamarindus indica",
    "specie_locations": "Native to tropical Africa but cultivated in various tropical regions",
    "description": "Tamarind is a fruit-bearing tree known for its sweet and tangy pulp. It is used in cooking, beverages, and traditional medicine."
  },
  "tulsi": {
    "name": "Tulsi",
    "scientific_name": "Ocimum sanctum",
    "specie_locations": "Native to the Indian subcontinent",
    "description": "Tulsi, also known as Holy Basil, is a sacred herb in Hinduism. It is revered for its medicinal properties and is often used in traditional medicine and religious rituals."
  
}

}

// Get references to HTML elements
const imageInput = document.getElementById('imageInput');
const imagePreview = document.getElementById('imagePreview');

// Add an event listener to the file input element
imageInput.addEventListener('change', (event) => {
    // Get the selected file
    const selectedFile = event.target.files[0];

    // Check if a file was selected
    if (selectedFile) {
        // Create a FileReader to read the selected file
        const reader = new FileReader();

        // Set up a function to run when the FileReader has finished reading the file
        reader.onload = (e) => {
            // Set the source of the image preview to the data URL
            imagePreview.src = e.target.result;
        };

        // Read the file as a data URL (this will trigger the `onload` function)
        reader.readAsDataURL(selectedFile);
    } else {
        // If no file was selected, clear the image preview
        imagePreview.src = '';
    }
});


async function loadModel() {
    loaderContainer.style.display = 'flex';
    const modelURL = "https://teachablemachine.withgoogle.com/models/7fywPXKXJ/model.json"; // Replace with your model URL
    const metadataURL = "https://teachablemachine.withgoogle.com/models/7fywPXKXJ/metadata.json"; // Replace with your metadata URL

    // const modelURL = './model.json';
   
    model = await tmImage.load(modelURL, metadataURL);
    console.log('Model loaded successfully');
    // console.log(plantData);
    loaderContainer.style.display = 'none';
}
function extractObjectWithHighestProbability(objects) {
    if (!Array.isArray(objects) || objects.length === 0) {
      return null; // Return null for invalid input
    }
  
    let highestProbabilityObject = objects[0]; // Initialize with the first object
  
    for (let i = 1; i < objects.length; i++) {
      if (objects[i].probability > highestProbabilityObject.probability) {
        highestProbabilityObject = objects[i];
      }
    }
  
    return highestProbabilityObject;
  }
// Function to predict the uploaded image
async function predictImage() {
    loaderContainer.style.display = 'flex';
    const imageInput = document.getElementById('imageInput');
    const predictionResult = document.getElementById('predictionResult');

    if (!model) {
        console.error('Model not loaded yet.');
        return;
    }

    if (!imageInput.files || imageInput.files.length === 0) {
        console.error('Please select an image.');
        return;
    }

    const file = imageInput.files[0];
    const imageURL = URL.createObjectURL(file);

    const img = new Image();
    img.src = imageURL;

    img.onload = async () => {
        try {
           
            const prediction = await model.predict(img);
         

            console.log('Prediction:', prediction);
         
            
            const highestProbabilityObject = extractObjectWithHighestProbability(prediction);
            console.log(highestProbabilityObject);
            let plant =highestProbabilityObject.className
            let speciesObject = plantData[highestProbabilityObject.className]
            console.log(speciesObject);
            // console.log(plant)
            // console.log(`plantData.${plant}`)
            
            highest_prediction.innerText = JSON.stringify(`predicted specie - ${highestProbabilityObject.className}`);
            highest_probability.innerText = JSON.stringify(`probability - ${highestProbabilityObject.probability}`);
            speciesName.innerText = JSON.stringify(`${speciesObject.name}`);
            scientificName.innerText = JSON.stringify(`${speciesObject.scientific_name}`);
            specieLocations.innerText = JSON.stringify(`${speciesObject.specie_locations}`);
            specieDetails.innerText = JSON.stringify(`${speciesObject.description}`);


            // predictionResult.innerText = JSON.stringify(prediction, null, 2);
            loaderContainer.style.display = 'none';
        } catch (error) {
            console.error('Error predicting image:', error);
            loaderContainer.style.display = 'none';
        }
    };
}

// Initialize the model when the page loads
window.addEventListener('load', loadModel);

