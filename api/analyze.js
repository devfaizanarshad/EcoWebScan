import { WebsiteCarbonCalculator } from 'website-carbon-calculator';
import { co2 } from '@tgwf/co2';
import { body, validationResult } from 'express-validator';

const co2Emission = new co2();
const carbon_API_KEY = process.env.CARBON_API_KEY || 'YOUR_KEY_HERE';

function getRating(estimatedCO2, pageWeight, greenHost) {
  let carbonRating;
  if (estimatedCO2 <= 0.095) carbonRating = 'A+';
  else if (estimatedCO2 <= 0.186) carbonRating = 'A';
  else if (estimatedCO2 <= 0.341) carbonRating = 'B';
  else if (estimatedCO2 <= 0.493) carbonRating = 'C';
  else if (estimatedCO2 <= 0.656) carbonRating = 'D';
  else if (estimatedCO2 <= 0.846) carbonRating = 'E';
  else carbonRating = 'F';

  let weightRating;
  if (pageWeight <= 500) weightRating = 'A+';
  else if (pageWeight <= 1000) weightRating = 'A';
  else if (pageWeight <= 1500) weightRating = 'B';
  else if (pageWeight <= 2000) weightRating = 'C';
  else if (pageWeight <= 3000) weightRating = 'D';
  else weightRating = 'F';

  const overallScore = (carbonRating.charCodeAt(0) * 0.7) + (weightRating.charCodeAt(0) * 0.3);
  let overallRating = String.fromCharCode(Math.round(overallScore));
  if (greenHost && overallRating < 'B') overallRating = 'A';

  return { carbon: carbonRating, weight: weightRating, overall: overallRating, isGreenHost: greenHost };
}

function calculateImpactComparisons(co2Amount, pageWeight) {
  return {
    treesNeeded: (co2Amount / 21000).toFixed(2),
    carMiles: (co2Amount / 0.404).toFixed(2),
    smartphoneCharges: (co2Amount / 0.005).toFixed(0),
    equivalentPhotos: (pageWeight / 5).toFixed(0),
    equivalentSongs: (pageWeight / 3000).toFixed(2)
  };
}

function calculateYearlyImpact(co2PerVisit, estimatedVisitors = 10000) {
  const yearlyCO2 = (co2PerVisit * estimatedVisitors * 365).toFixed(2);
  return { co2: yearlyCO2, treesNeeded: (yearlyCO2 / 21000).toFixed(2), basedOnVisitors: estimatedVisitors };
}

function generateRecommendations(ratings, pageWeight, co2) {
  const recommendations = [];
  if (ratings.carbon > 'B') recommendations.push({ category: 'Carbon Efficiency', message: 'Optimize images and use modern formats like WebP/AVIF.', priority: 'high' });
  if (ratings.weight > 'B') recommendations.push({ category: 'Page Weight', message: 'Minify CSS/JS and remove unused code.', priority: 'high' });
  if (!ratings.isGreenHost) recommendations.push({ category: 'Hosting', message: 'Use green hosting powered by renewable energy.', priority: 'medium', resources: ['GreenGeeks','Kinsta','Google Cloud'] });
  recommendations.push({ category: 'Performance', message: 'Lazy load images/videos.', priority: 'medium' });
  recommendations.push({ category: 'Caching', message: 'Use caching strategies and CDN.', priority: 'medium' });
  if (ratings.overall <= 'B') recommendations.push({ category: 'Maintenance', message: 'Website is performing well! Monitor regularly.', priority: 'low' });
  return recommendations;
}

function calculatePotentialSavings(ratings, pageWeight, co2) {
  let potentialReduction = { co2: 0, percentage: 0 };
  if (ratings.carbon > 'B') {
    potentialReduction.percentage = 40 + Math.random() * 20;
    potentialReduction.co2 = (co2 * potentialReduction.percentage / 100).toFixed(5);
  } else if (ratings.carbon > 'C') {
    potentialReduction.percentage = 20 + Math.random() * 15;
    potentialReduction.co2 = (co2 * potentialReduction.percentage / 100).toFixed(5);
  }
  return potentialReduction;
}

async function getCarbonData(SearchURL) {
  const websiteCarbonCalculator = new WebsiteCarbonCalculator({ pagespeedApiKey: carbon_API_KEY });
  const result = await websiteCarbonCalculator.calculateByURL(SearchURL);

  const bytesSent = result.bytesTransferred;
  const greenHost = result.isGreenHost;
  const estimatedCO2 = co2Emission.perByte(bytesSent, greenHost);
  const pageWeightKB = (bytesSent / 1024).toFixed(2);

  const ratings = getRating(estimatedCO2, pageWeightKB, greenHost);
  return {
    url: SearchURL,
    ratings,
    statistics: { co2: estimatedCO2.toFixed(5), pageWeight: pageWeightKB, greenHost, dataTransfer: bytesSent },
    environmentalImpact: calculateImpactComparisons(estimatedCO2, pageWeightKB),
    yearlyImpact: calculateYearlyImpact(estimatedCO2),
    recommendations: generateRecommendations(ratings, pageWeightKB, estimatedCO2),
    potentialSavings: calculatePotentialSavings(ratings, pageWeightKB, estimatedCO2),
    timestamp: new Date().toISOString()
  };
}

export default async function handler(req, res) {
  if (req.method !== 'POST') return res.status(405).json({ success: false, error: 'Method not allowed' });

  try {
    const { url } = req.body;
    if (!url) return res.status(400).json({ success: false, error: 'URL is required' });

    const SearchURL = url.startsWith('http') ? url : `http://${url}`;
    const result = await getCarbonData(SearchURL);

    res.status(200).json({ success: true, data: result });
  } catch (err) {
    console.error(err);
    res.status(500).json({ success: false, error: 'Internal server error' });
  }
}
