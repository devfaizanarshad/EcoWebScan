
document.addEventListener('DOMContentLoaded', function() {
  const analyzeBtn = document.getElementById('analyzeBtn');
  const websiteUrl = document.getElementById('websiteUrl');
  const loading = document.getElementById('loading');
  const resultsLoader = document.getElementById('resultsLoader');
  const resultsContainer = document.getElementById('resultsContainer');
  const errorMessage = document.getElementById('errorMessage');

  analyzeBtn.addEventListener('click', analyzeWebsite);
  websiteUrl.addEventListener('keypress', function(e) {
    if (e.key === 'Enter') analyzeWebsite();
  });

  function analyzeWebsite() {
    const url = websiteUrl.value.trim();

    if (!url) {
      showError('Please enter a website URL');
      return;
    }

    // Show loading, hide results and errors
    loading.classList.remove('hidden');
    resultsLoader.classList.remove('hidden');
    resultsContainer.classList.add('hidden');
    errorMessage.classList.add('hidden');
    analyzeBtn.disabled = true;

    // Make API call to your backend
    fetch('https://website-carbon-analyzer.vercel.app/api/analyze', {
      method: 'POST',
      headers: { 
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ url })
    })
    .then(response => {
      if (!response.ok) {
        throw new Error('Network response was not ok');
      }
      return response.json();
    })
    .then(data => {
      // Hide loading indicators
      loading.classList.add('hidden');
      resultsLoader.classList.add('hidden');
      analyzeBtn.disabled = false;

      if (data.success) {
        displayResults(data.data);
      } else {
        showError(data.error || 'An error occurred during analysis');
      }
    })
    .catch(error => {
      // Hide loading indicators
      loading.classList.add('hidden');
      resultsLoader.classList.add('hidden');
      analyzeBtn.disabled = false;
      
      showError('Network error. Please try again later.');
      console.error('Error:', error);
    });
  }

  function displayResults(data) {
    document.getElementById('overallGrade').textContent = data.ratings.overall;
    document.getElementById('overallGrade').className = 
      'text-3xl font-bold mt-2 grade-' + data.ratings.overall.toLowerCase();

    document.getElementById('co2Value').textContent = data.statistics.co2 + 'g';
    document.getElementById('pageWeight').textContent = data.statistics.pageWeight + 'KB';
    document.getElementById('greenHost').textContent = data.statistics.greenHost ? 'Yes' : 'No';

    document.getElementById('treesValue').textContent = data.environmentalImpact.treesNeeded;
    document.getElementById('carMiles').textContent = data.environmentalImpact.carMiles;
    document.getElementById('phoneCharges').textContent = data.environmentalImpact.smartphoneCharges;

    const recList = document.getElementById('recommendationsList');
    recList.innerHTML = '';
    data.recommendations.forEach(rec => {
      const recElement = document.createElement('div');
      recElement.className = `p-4 border-l-4 ${
        rec.priority === 'high' ? 'border-red-500 bg-red-50' :
        rec.priority === 'medium' ? 'border-yellow-500 bg-yellow-50' :
        'border-green-500 bg-green-50'
      } rounded`;
      recElement.innerHTML = `<h4 class="font-semibold">${rec.category} (${rec.priority} priority)</h4>
                              <p class="text-gray-700">${rec.message}</p>`;
      recList.appendChild(recElement);
    });

    // Reveal results with animation
    resultsContainer.classList.remove('hidden');
    resultsContainer.classList.add('fade-in');
    
    // Scroll to results on mobile
    if (window.innerWidth < 768) {
      document.getElementById('results').scrollIntoView({ behavior: 'smooth' });
    }
  }

  function showError(msg) {
    errorMessage.textContent = msg;
    errorMessage.classList.remove('hidden');
    loading.classList.add('hidden');
    resultsLoader.classList.add('hidden');
    analyzeBtn.disabled = false;
  }
});