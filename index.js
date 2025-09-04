// import express from "express";
// import bodyParser from "body-parser";
// import { dirname } from "path";
// import { fileURLToPath } from "url";
// import path from 'path';
// import axios from "axios";
// import { WebsiteCarbonCalculator, WebsiteCarbonCalculatorError } from 'website-carbon-calculator';
// import { co2 } from "@tgwf/co2";
// // Getting the relative path dynamically to server
// const __dirname = dirname(fileURLToPath(import.meta.url));

// const app = express();
// const port = 3000;

// // Things required for sending request
// const CarbonURL = `https://api.websitecarbon.com/site?url=`;
// const PostLighthouseURL = `https://api.lighthouse-metrics.com/v1/lighthouse/checks`;
// const GetLighthouseURL = `https://api.lighthouse-metrics.com/v1/lighthouse/checks/?id=`;
// const API_TOKEN = `PaBYk7RKAwLZ9Ggbwxn4fvCZ1ID49aMY`;

// // Middlewares for allowing access to CSS/JS files and body of request
// app.use(express.static(path.join(__dirname, 'Frontend', 'Public')));
// app.use(bodyParser.urlencoded({ extended: true }));

// console.log(path.join(__dirname, 'Frontend', 'Public'));

// const carbon_API_KEY = `AIzaSyBI9w_jr2tm8hHcsAa0bJcdVelxTJveLcA`;
// const co2Emission = new co2();
// function getRating(estimatedCO2) {
//     if (estimatedCO2 <= 0.095) {
//       return 'A+';
//     } else if (estimatedCO2 <= 0.186) {
//       return 'A';
//     } else if (estimatedCO2 <= 0.341) {
//       return 'B';
//     } else if (estimatedCO2 <= 0.493) {
//       return 'C';
//     } else if (estimatedCO2 <= 0.656) {
//       return 'D';
//     } else if (estimatedCO2 <= 0.846) {
//       return 'E';
//     } else {
//       return 'F';
//     }
//   }
  

// // Function to make a request to Carbon API
// async function getCarbonData(SearchURL,res) {
//   console.log('Carbon Data Function Started')

//   // const encodedUrl = encodeURIComponent(SearchURL);

//    console.log(SearchURL)

//   try {
//     const websiteCarbonCalculator = new WebsiteCarbonCalculator({ pagespeedApiKey: `${carbon_API_KEY}` });
//     const result = await websiteCarbonCalculator.calculateByURL(SearchURL);

//     console.log(result)

//     console.log('Carbon Data Function Running')

//     const bytesSent = result.bytesTransferred;
//     const greenHost = result.isGreenHost;

//     const estimatedCO2 = co2Emission.perByte(bytesSent, greenHost);
//     const pageWeightKB = (result.bytesTransferred / 1024).toFixed(2);

//     console.log(`Sending a gigabyte had a carbon footprint of ${estimatedCO2.toFixed(3)} grams of CO2`);

//     const rating = getRating(estimatedCO2);
//     console.log('Website rating:', rating);
//     console.log('Page Weight:', pageWeightKB);

//     const data = {
//       rating: rating,
//       webCO2: estimatedCO2,
//       pageweight: pageWeightKB
//     }

//     console.log('Carbon Data Function Completed')
//     console.log(data);

//     return data;
//   } catch (error) {
//     console.error('Error in getCarbonData:', error);
//     return res.redirect('/?error=server_error');

//   }
// }



// // Function to make a request to Lighthouse API and wait for the analysis to complete
// async function getLighthouseData(SearchURL) {

//   console.log('Lighouese Data Function Started')

//     const lighthouseResponse = await axios.post(PostLighthouseURL, {
//         url: SearchURL,
//         "regions": [
//             "us-west1"
//         ]
//     }, {
//         headers: {
//             'Authorization': `Bearer ${API_TOKEN}`,
//         }
//     });
//     const uniqueID = lighthouseResponse.data.id;

//     let lighthouseData = null;
//     const retryDelay = 5000; // 5 seconds
//     const maxRetries = 20;
//     let retries = 0;

//     while (retries < maxRetries) {
//         await new Promise(resolve => setTimeout(resolve, retryDelay));

//         const lighthouseStatusResponse = await axios.get(`${GetLighthouseURL}${uniqueID}`, {
//             headers: {
//                 'Authorization': `Bearer ${API_TOKEN}`,
//             }
//         });
//         lighthouseData = lighthouseStatusResponse.data.data[0];

//         if (lighthouseData && lighthouseData.runs && lighthouseData.runs.length > 0) {
//             const state = lighthouseData.runs[0].state;
//             console.log(`Attempt ${retries + 1}: State - ${state}`);
//             if (state === 'succeeded') {
//                 console.log("Lighthouse analysis succeeded.");
//                 break;
//             } else if (state === 'failed') {
//                 console.log("Lighthouse analysis failed.");
//                 break;
//             }
//         }

//         retries++;
//     }
    

//     return lighthouseData;
// }

// // Route handler for the main route
// app.get('/', (req, res) => {
//   // Construct the absolute path to index.html in the client directory  
//   // Send the index.html file from the client directory
//     app.use(express.static(path.resolve(__dirname,"Frontend", "Public")));
//     console.log("I am here bro")
//     res.sendFile(path.join(__dirname, 'Frontend', 'Public', 'index.html'));
// });

// // Route handler for the FindResult route
// app.post('/FindResult', async (req, res) => {
    
//   console.log('I am in a Find Route')
//         // Extract the URL from the request body
//         let SearchURL = req.body.URLSearch;

//         // Check if the URL is empty or missing 'http://' or 'https://'
//         if (!SearchURL) {
//           // Redirect user to home page with an error message
//           return res.redirect('/?error=empty_url');
//       }  else {
//         // Prepend 'http://' if the URL does not start with it
//         if (!/^https?:\/\/|^http?:\/\//i.test(SearchURL)) {
//           // Append 'http://' if not already specified
//           SearchURL = 'http://' + SearchURL;

//           console.log(SearchURL)
//       }

//       if (!/www\./i.test(SearchURL)) {
//         SearchURL = SearchURL.replace(/^(http?:\/\/)/, '$1www.');
//         console.log(SearchURL)

//     }
      
         
       
//     }

//     let result = null;
//     let SeoOptimizationValue = null;

//     try {
//         // Request to Carbon API
//         result = await getCarbonData(SearchURL,res);

//         // Request to Lighthouse API
//         const lighthouseData = await getLighthouseData(SearchURL);
//         console.log(lighthouseData.runs[0].performance);
//         console.log(lighthouseData.runs[0].bestPractices);
//         console.log(lighthouseData.runs[0].seo);

//         // Extracting relevant information from the Lighthouse data for setting progressEndValue
//         const seoScore = lighthouseData.runs[0].seo;
//         const bestPracticesScore = lighthouseData.runs[0].bestPractices;
//         const performanceScore = lighthouseData.runs[0].performance;
//         const fcp = lighthouseData.runs[0].fcp / 1000;
//         const si = lighthouseData.runs[0].si / 1000;
//         const lcp = lighthouseData.runs[0].lcp / 1000;
//         const tti = lighthouseData.runs[0].tti / 1000;
//         const tbt = lighthouseData.runs[0].tbt / 1000;
//         const cls = lighthouseData.runs[0].cls;

//         console.log("FirsFirst Contentful Paint" + fcp);
//         console.log("Speed Index" + si);
//         console.log("Largest Contentful Paint" + lcp);
      
//         // Set progressEndValue based on the received scores for each progress bar
//         SeoOptimizationValue= {
//         seoPerformance: seoScore,
//         bestPractices: bestPracticesScore,
//         seoScore: performanceScore,
//         fcp : fcp,
//         si : si,
//         lcp : lcp,
//         tti : tti,
//         tbt : tbt,
//         cls : cls
//       };


//     } catch (error) {
//         console.error("Error:", error);
//     }

//     console.log(result)
//     res.render('report.ejs', { list: result, seo: SeoOptimizationValue});
// });

// // Start the server
// app.listen(port, () => {
//     console.log("Listening to port 3000");
// });


import express from "express";
import bodyParser from "body-parser";
import { dirname } from "path";
import { fileURLToPath } from "url";
import path from 'path';
import { WebsiteCarbonCalculator } from 'website-carbon-calculator';
import { co2 } from "@tgwf/co2";
import rateLimit from "express-rate-limit";
import helmet from "helmet";
import { validationResult, body } from "express-validator";

// Getting the relative path dynamically to server
const __dirname = dirname(fileURLToPath(import.meta.url));

const app = express();
const port = process.env.PORT || 3000;

app.use(
  helmet({
    contentSecurityPolicy: {
      directives: {
        defaultSrc: ["'self'"],
        scriptSrc: ["'self'", "https://cdn.tailwindcss.com"],
        styleSrc: ["'self'", "'unsafe-inline'"], // allows Tailwind CDN to inject styles
        imgSrc: ["'self'", "data:", "https:"],
        connectSrc: ["'self'"],
      },
    },
  })
);

// Serve static files from public directory
app.use(express.static(path.join(__dirname)));

// Rate limiting
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 50 // limit each IP to 50 requests per windowMs
});
app.use(limiter);

// Middlewares
app.use(express.static(path.join(__dirname)));
app.use(bodyParser.json({ limit: '10mb' }));
app.use(bodyParser.urlencoded({ extended: true, limit: '10mb' }));

const carbon_API_KEY = process.env.CARBON_API_KEY || `AIzaSyBI9w_jr2tm8hHcsAa0bJcdVelxTJveLcA`;
const co2Emission = new co2();

// Enhanced rating system
function getRating(estimatedCO2, pageWeight, greenHost) {
  // Carbon rating
  let carbonRating;
  if (estimatedCO2 <= 0.095) carbonRating = 'A+';
  else if (estimatedCO2 <= 0.186) carbonRating = 'A';
  else if (estimatedCO2 <= 0.341) carbonRating = 'B';
  else if (estimatedCO2 <= 0.493) carbonRating = 'C';
  else if (estimatedCO2 <= 0.656) carbonRating = 'D';
  else if (estimatedCO2 <= 0.846) carbonRating = 'E';
  else carbonRating = 'F';
  
  // Page weight rating
  let weightRating;
  if (pageWeight <= 500) weightRating = 'A+';
  else if (pageWeight <= 1000) weightRating = 'A';
  else if (pageWeight <= 1500) weightRating = 'B';
  else if (pageWeight <= 2000) weightRating = 'C';
  else if (pageWeight <= 3000) weightRating = 'D';
  else weightRating = 'F';
  
  // Overall rating (weighted average)
  const overallScore = (carbonRating.charCodeAt(0) * 0.7) + (weightRating.charCodeAt(0) * 0.3);
  let overallRating = String.fromCharCode(Math.round(overallScore));
  if (greenHost && overallRating < 'B') overallRating = 'A'; // Boost for green hosting
  
  return {
    carbon: carbonRating,
    weight: weightRating,
    overall: overallRating,
    isGreenHost: greenHost
  };
}

// Calculate environmental impact comparisons
function calculateImpactComparisons(co2Amount, pageWeight) {
  // CO2 comparisons
  const treesNeeded = (co2Amount / 21000).toFixed(2); // A tree absorbs ~21kg CO2 per year
  const carMiles = (co2Amount / 0.404).toFixed(2); // Average car emits 404g CO2 per mile
  const smartphoneCharges = (co2Amount / 0.005).toFixed(0); // Charging a smartphone produces ~5g CO2
  
  // Data comparisons
  const equivalentPhotos = (pageWeight / 5).toFixed(0); // Average photo ~5KB
  const equivalentSongs = (pageWeight / 3000).toFixed(2); // 3-minute MP3 ~3MB
  
  return {
    treesNeeded,
    carMiles,
    smartphoneCharges,
    equivalentPhotos,
    equivalentSongs
  };
}

// Calculate yearly impact for a website
function calculateYearlyImpact(co2PerVisit, estimatedVisitors = 10000) {
  const yearlyCO2 = (co2PerVisit * estimatedVisitors * 365).toFixed(2);
  const yearlyTrees = (yearlyCO2 / 21000).toFixed(2);
  
  return {
    co2: yearlyCO2,
    treesNeeded: yearlyTrees,
    basedOnVisitors: estimatedVisitors
  };
}

// Generate recommendations based on the results
function generateRecommendations(ratings, pageWeight, co2) {
  const recommendations = [];
  
  if (ratings.carbon > 'B') {
    recommendations.push({
      category: 'Carbon Efficiency',
      message: 'Optimize images and use modern formats like WebP or AVIF to reduce data transfer.',
      priority: 'high'
    });
  }
  
  if (ratings.weight > 'B') {
    recommendations.push({
      category: 'Page Weight',
      message: `Reduce page weight by minifying CSS/JS, enabling compression, and removing unused code.`,
      priority: 'high'
    });
  }
  
  if (!ratings.isGreenHost) {
    recommendations.push({
      category: 'Hosting',
      message: 'Switch to a green web host powered by renewable energy to reduce your carbon footprint.',
      priority: 'medium',
      resources: ['GreenGeeks', 'Kinsta', 'Google Cloud (carbon neutral)']
    });
  }
  
  // Additional recommendations based on best practices
  recommendations.push({
    category: 'Performance',
    message: 'Implement lazy loading for images and videos to reduce initial page load weight.',
    priority: 'medium'
  });
  
  recommendations.push({
    category: 'Caching',
    message: 'Leverage browser caching and CDN to reduce server requests and data transfer.',
    priority: 'medium'
  });
  
  if (ratings.overall <= 'B') {
    recommendations.push({
      category: 'Maintenance',
      message: 'Your website is performing well! Regular monitoring will help maintain efficiency.',
      priority: 'low'
    });
  }
  
  return recommendations;
}

// Function to get carbon data
async function getCarbonData(SearchURL) {
  console.log(SearchURL);
  
  try {
    const websiteCarbonCalculator = new WebsiteCarbonCalculator({ 
      pagespeedApiKey: carbon_API_KEY 
    });
    
    const result = await websiteCarbonCalculator.calculateByURL(SearchURL);
    const bytesSent = result.bytesTransferred;
    const greenHost = result.isGreenHost;

    const estimatedCO2 = co2Emission.perByte(bytesSent, greenHost);
    const pageWeightKB = (result.bytesTransferred / 1024).toFixed(2);
    
    // Get ratings
    const ratings = getRating(estimatedCO2, pageWeightKB, greenHost);
    
    // Get environmental impact comparisons
    const impact = calculateImpactComparisons(estimatedCO2, pageWeightKB);
    
    // Calculate yearly impact
    const yearlyImpact = calculateYearlyImpact(estimatedCO2);
    
    // Get recommendations based on results
    const recommendations = generateRecommendations(ratings, pageWeightKB, estimatedCO2);
    
    // Calculate potential savings
    const potentialSavings = calculatePotentialSavings(ratings, pageWeightKB, estimatedCO2);
    
    return {
      url: SearchURL,
      ratings: ratings,
      statistics: {
        co2: estimatedCO2.toFixed(5), // More precision for small values
        pageWeight: pageWeightKB,
        greenHost: greenHost,
        dataTransfer: bytesSent
      },
      environmentalImpact: impact,
      yearlyImpact: yearlyImpact,
      recommendations: recommendations,
      potentialSavings: potentialSavings,
      timestamp: new Date().toISOString()
    };
  } catch (error) {
    console.error('Error in getCarbonData:', error);
    throw new Error('Failed to calculate carbon footprint');
  }
}

// Calculate potential savings if optimizations are made
function calculatePotentialSavings(ratings, pageWeight, co2) {
  const potentialReduction = {
    co2: 0,
    percentage: 0
  };
  
  if (ratings.carbon > 'B') {
    // Estimate 30-60% reduction for poor ratings
    potentialReduction.percentage = 40 + (Math.random() * 20);
    potentialReduction.co2 = (co2 * potentialReduction.percentage / 100).toFixed(5);
  } else if (ratings.carbon > 'C') {
    // Estimate 15-30% reduction for average ratings
    potentialReduction.percentage = 20 + (Math.random() * 15);
    potentialReduction.co2 = (co2 * potentialReduction.percentage / 100).toFixed(5);
  }
  
  return potentialReduction;
}

// Route handler for the main API endpoint
app.post('/api/analyze', [
  body('url').isURL().withMessage('Please provide a valid URL')
], async (req, res) => {
  try {
    // Check for validation errors
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({
        success: false,
        errors: errors.array()
      });
    }
    
    let SearchURL = req.body.url;

    // Add http:// if missing
    if (!/^https?:\/\//i.test(SearchURL)) {
      SearchURL = 'http://' + SearchURL;
    }

    const result = await getCarbonData(SearchURL);
    
    res.json({
      success: true,
      data: result
    });
  } catch (error) {
    console.error("Error:", error);
    res.status(500).json({
      success: false,
      error: error.message || 'Internal server error'
    });
  }
});

// Route to get optimization tips
app.get('/api/tips', (req, res) => {
  const tips = [
    {
      category: "Images",
      tips: [
        "Use WebP or AVIF format instead of JPEG or PNG",
        "Implement responsive images with srcset",
        "Compress images before uploading",
        "Use CSS effects instead of image files when possible"
      ]
    },
    {
      category: "Code",
      tips: [
        "Minify CSS, JavaScript, and HTML",
        "Remove unused code and dependencies",
        "Use efficient algorithms and data structures",
        "Implement lazy loading for non-critical resources"
      ]
    },
    {
      category: "Hosting",
      tips: [
        "Choose a green web hosting provider",
        "Use a CDN to reduce data travel distance",
        "Enable compression (Gzip/Brotli)",
        "Implement caching strategies"
      ]
    },
    {
      category: "Design",
      tips: [
        "Reduce the number of HTTP requests",
        "Optimize above-the-fold content loading",
        "Use system fonts instead of web fonts when possible",
        "Reduce animations and complex visual effects"
      ]
    }
  ];
  
  res.json({
    success: true,
    data: tips
  });
});

// Serve the frontend
app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'index.html'));
});

// Health check endpoint
app.get('/api/health', (req, res) => {
  res.json({ 
    status: 'OK', 
    timestamp: new Date().toISOString() 
  });
});

// Error handling middleware
app.use((error, req, res, next) => {
  console.error(error);
  res.status(500).json({
    success: false,
    error: 'Internal server error'
  });
});

// // 404 handler
// app.use('*', (req, res) => {
//   res.status(404).json({
//     success: false,
//     error: 'Endpoint not found'
//   });
// });

// Start the server
app.listen(port, () => {
  console.log(`Server running on port ${port}`);
});