# EcoWebScan

EcoWebScan is a web application designed to measure and analyze the environmental impact of any website. It provides a detailed report on carbon emissions, page weight, and hosting practices, along with actionable recommendations to promote a more sustainable digital presence.

## ✨ Features

-   **Carbon Footprint Analysis**: Calculates the estimated CO₂ emissions per page visit.
-   **Performance Metrics**: Measures total page weight and data transferred.
-   **Green Hosting Detection**: Checks if the website is hosted by a provider using renewable energy.
-   **Grading System**: Provides an intuitive A+ to F rating for carbon efficiency, page weight, and overall performance.
-   **Environmental Impact Equivalents**: Translates digital data into tangible metrics like trees needed, car miles driven, and smartphone charges.
-   **Yearly Impact Projections**: Estimates the annual carbon footprint based on monthly visitor traffic.
-   **Actionable Recommendations**: Offers prioritized suggestions for reducing a site's environmental impact, covering images, code, hosting, and design.
-   **Potential Savings**: Estimates the potential reduction in CO₂ emissions if optimizations are applied.

## 🚀 How It Works

EcoWebScan provides a simple interface for users to analyze a website's sustainability:

1.  The user enters a website URL into the input field.
2.  The frontend sends a request to the backend API (`/api/analyze`).
3.  The server uses the `website-carbon-calculator` and `@tgwf/co2` libraries to fetch website data (like bytes transferred via Google PageSpeed Insights) and calculate CO₂ emissions.
4.  The backend processes this information to generate ratings, environmental impact comparisons, and tailored recommendations.
5.  The comprehensive analysis is sent back to the frontend and displayed on a clean and responsive results dashboard.

## 🛠️ Technology Stack

-   **Backend**: Node.js, Express.js
-   **Frontend**: HTML, JavaScript, Tailwind CSS
-   **Core Libraries**:
    -   `website-carbon-calculator`: For calculating web carbon metrics.
    -   `@tgwf/co2`: The Green Web Foundation's library for CO₂ estimation.
-   **Security & Validation**:
    -   `helmet`: Secures the application by setting various HTTP headers.
    -   `express-rate-limit`: Provides rate-limiting to prevent abuse.
    -   `express-validator`: For validating incoming API requests.
-   **Deployment**: Vercel

## ⚙️ API Endpoints

The application exposes the following REST API endpoints:

| Method | Endpoint         | Description                                                      |
| :----- | :--------------- | :--------------------------------------------------------------- |
| `POST` | `/api/analyze`   | Analyzes a given URL and returns the full sustainability report. |
| `GET`  | `/api/tips`      | Returns a list of general optimization tips for web sustainability. |
| `GET`  | `/api/health`    | A health check endpoint to confirm the service is running.       |

### Example: `/api/analyze`

**Request Body:**
```json
{
  "url": "https://example.com"
}
```

**Successful Response:**
```json
{
  "success": true,
  "data": {
    "url": "http://example.com",
    "ratings": {
      "carbon": "A+",
      "weight": "A+",
      "overall": "A",
      "isGreenHost": false
    },
    "statistics": {
      "co2": "0.00281",
      "pageWeight": "12.34",
      "greenHost": false,
      "dataTransfer": 12638
    },
    "environmentalImpact": {
      "treesNeeded": "0.00",
      "carMiles": "0.01",
      "smartphoneCharges": "1",
      "equivalentPhotos": "2",
      "equivalentSongs": "0.00"
    },
    // ... and more data
  }
}
```

## 🔧 Local Development Setup

To run EcoWebScan on your local machine, follow these steps:

1.  **Clone the repository:**
    ```bash
    git clone https://github.com/devfaizanarshad/EcoWebScan.git
    cd EcoWebScan
    ```

2.  **Install dependencies:**
    ```bash
    npm install
    ```

3.  **Set up environment variables:**
    Create a `.env` file in the root directory and add your Google PageSpeed API key:
    ```
    CARBON_API_KEY=your_google_pagespeed_api_key
    ```

4.  **Start the development server:**
    ```bash
    node index.js
    ```

The application will be available at `http://localhost:3000`.

## 📦 Deployment

This project is configured for seamless deployment to [Vercel](https://vercel.com/). The `vercel.json` file handles the build process and route mappings for the serverless API functions and static frontend assets. Simply link your GitHub repository to a new Vercel project for automatic builds and deployments.
