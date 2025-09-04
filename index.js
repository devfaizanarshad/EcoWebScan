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

// Get server directory dynamically
const __dirname = dirname(fileURLToPath(import.meta.url));

const app = express();
const port = process.env.PORT || 3000;

// Security headers
app.use(
  helmet({
    contentSecurityPolicy: {
      directives: {
        defaultSrc: ["'self'"],
        scriptSrc: ["'self'", "https://cdn.tailwindcss.com"],
        styleSrc: ["'self'", "'unsafe-inline'"],
        imgSrc: ["'self'", "data:", "https:"],
        connectSrc: ["'self'"],
      },
    },
  })
);

// Rate limiting
app.use(rateLimit({ windowMs: 15 * 60 * 1000, max: 50 }));

// Middlewares
app.use(express.static(path.join(__dirname, "public")));
app.use(bodyParser.json({ limit: '10mb' }));
app.use(bodyParser.urlencoded({ extended: true, limit: '10mb' }));

const carbon_API_KEY = process.env.CARBON_API_KEY || 'AIzaSyBI9w_jr2tm8hHcsAa0bJcdVelxTJveLcA';
const co2Emission = new co2();

// Dynamic CO2 adjustment based on page weight and green hosting
function adjustCO2(co2FromLibrary, bytesSent, isGreenHost) {
  // Scale by page size (smaller pages slightly underestimated, bigger pages slightly overestimated)
  let sizeFactor = 1;
  if (bytesSent < 500 * 1024) sizeFactor = 1.2;
  else if (bytesSent > 2000 * 1024) sizeFactor = 0.8;

  // Green hosting reduces CO2
  const greenFactor = isGreenHost ? 0.5 : 1;

  return co2FromLibrary * sizeFactor * greenFactor;
}

// Generate ratings dynamically
function getRating(estimatedCO2, pageWeightKB, isGreenHost) {
  const carbonRating = estimatedCO2 <= 0.095 ? 'A+' :
                       estimatedCO2 <= 0.186 ? 'A' :
                       estimatedCO2 <= 0.341 ? 'B' :
                       estimatedCO2 <= 0.493 ? 'C' :
                       estimatedCO2 <= 0.656 ? 'D' :
                       estimatedCO2 <= 0.846 ? 'E' : 'F';

  const weightRating = pageWeightKB <= 500 ? 'A+' :
                       pageWeightKB <= 1000 ? 'A' :
                       pageWeightKB <= 1500 ? 'B' :
                       pageWeightKB <= 2000 ? 'C' :
                       pageWeightKB <= 3000 ? 'D' : 'F';

  // Weighted overall rating
  const overallScore = (carbonRating.charCodeAt(0) * 0.7) + (weightRating.charCodeAt(0) * 0.3);
  let overallRating = String.fromCharCode(Math.round(overallScore));
  if (isGreenHost && overallRating < 'B') overallRating = 'A';

  return { carbon: carbonRating, weight: weightRating, overall: overallRating, isGreenHost };
}

// Environmental impact calculations
function calculateImpact(co2Amount, pageWeightKB) {
  return {
    treesNeeded: (co2Amount / 21000).toFixed(2),
    carMiles: (co2Amount / 0.404).toFixed(2),
    smartphoneCharges: (co2Amount / 0.005).toFixed(0),
    equivalentPhotos: (pageWeightKB / 5).toFixed(0),
    equivalentSongs: (pageWeightKB / 3000).toFixed(2)
  };
}

// Yearly impact
function calculateYearlyImpact(co2PerVisit, visitors = 10000) {
  const yearlyCO2 = (co2PerVisit * visitors * 365).toFixed(2);
  const yearlyTrees = (yearlyCO2 / 21000).toFixed(2);
  return { co2: yearlyCO2, treesNeeded: yearlyTrees, basedOnVisitors: visitors };
}

// Recommendations
function generateRecommendations(ratings) {
  const recs = [];

  if (ratings.carbon > 'B') recs.push({ category: 'Carbon Efficiency', message: 'Optimize images and use WebP/AVIF formats.', priority: 'high' });
  if (ratings.weight > 'B') recs.push({ category: 'Page Weight', message: 'Minify CSS/JS, remove unused code, enable compression.', priority: 'high' });
  if (!ratings.isGreenHost) recs.push({ category: 'Hosting', message: 'Switch to a green hosting provider.', priority: 'medium' });

  recs.push({ category: 'Performance', message: 'Implement lazy loading for images/videos.', priority: 'medium' });
  recs.push({ category: 'Caching', message: 'Leverage browser caching and CDN.', priority: 'medium' });

  if (ratings.overall <= 'B') recs.push({ category: 'Maintenance', message: 'Website performing well! Regular monitoring recommended.', priority: 'low' });

  return recs;
}

// Potential CO2 savings
function calculatePotentialSavings(ratings, co2Amount) {
  let percentage = 0;
  if (ratings.carbon > 'B') percentage = 40 + Math.random() * 20;
  else if (ratings.carbon > 'C') percentage = 20 + Math.random() * 15;

  return {
    co2: (co2Amount * percentage / 100).toFixed(5),
    percentage: percentage.toFixed(1)
  };
}

// Core: Fetch carbon data
async function getCarbonData(url) {
  const calculator = new WebsiteCarbonCalculator({ pagespeedApiKey: carbon_API_KEY });
  const result = await calculator.calculateByURL(url);

  const bytesSent = result.bytesTransferred;
  const greenHost = result.isGreenHost;
  const rawCO2 = co2Emission.perByte(bytesSent, greenHost);

  const estimatedCO2 = adjustCO2(rawCO2, bytesSent, greenHost);
  const pageWeightKB = (bytesSent / 1024).toFixed(2);

  const ratings = getRating(estimatedCO2, pageWeightKB, greenHost);
  const impact = calculateImpact(estimatedCO2, pageWeightKB);
  const yearlyImpact = calculateYearlyImpact(estimatedCO2);
  const recommendations = generateRecommendations(ratings);
  const potentialSavings = calculatePotentialSavings(ratings, estimatedCO2);

  return {
    url,
    ratings,
    statistics: { co2: estimatedCO2.toFixed(5), pageWeight: pageWeightKB, greenHost, dataTransfer: bytesSent },
    environmentalImpact: impact,
    yearlyImpact,
    recommendations,
    potentialSavings,
    timestamp: new Date().toISOString()
  };
}

// API endpoint
app.post('/api/analyze', [
  body('url').isURL().withMessage('Please provide a valid URL')
], async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) return res.status(400).json({ success: false, errors: errors.array() });

    let url = req.body.url;
    if (!/^https?:\/\//i.test(url)) url = 'http://' + url;

    const result = await getCarbonData(url);
    res.json({ success: true, data: result });
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, error: 'Internal server error' });
  }
});

// Optimization tips endpoint
app.get('/api/tips', (req, res) => {
  const tips = [
    { category: "Images", tips: ["Use WebP/AVIF formats", "Responsive images", "Compress before upload", "CSS effects over images"] },
    { category: "Code", tips: ["Minify CSS/JS/HTML", "Remove unused code", "Efficient algorithms", "Lazy load non-critical resources"] },
    { category: "Hosting", tips: ["Green hosting", "Use CDN", "Enable compression", "Implement caching"] },
    { category: "Design", tips: ["Reduce HTTP requests", "Optimize above-the-fold content", "Use system fonts", "Reduce heavy animations"] }
  ];
  res.json({ success: true, data: tips });
});

// Serve frontend
app.get('/', (req, res) => res.sendFile(path.join(__dirname, 'index.html')));

// Health check
app.get('/api/health', (req, res) => res.json({ status: 'OK', timestamp: new Date().toISOString() }));

// Global error handling
app.use((error, req, res, next) => {
  console.error(error);
  res.status(500).json({ success: false, error: 'Internal server error' });
});

// Start server
app.listen(port, () => console.log(`Server running on port ${port}`));
