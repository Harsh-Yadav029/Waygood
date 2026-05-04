/**
 * API Verification Script
 * This script tests the critical flows of the Waygood Backend.
 * Run with: node src/scripts/verify-api.js
 */

const http = require('http');

const API_URL = 'http://127.0.0.1:4000/api';
const TEST_USER = {
  email: 'aarav@example.com',
  password: 'Candidate123!'
};

async function runTests() {
  console.log('🚀 Starting API Verification Tests...\n');

  try {
    // 1. Test Login & JWT Issuance
    console.log('🧪 Testing Authentication Flow...');
    const loginData = await post('/auth/login', TEST_USER);
    if (!loginData.success || !loginData.data.token) {
      throw new Error('Login failed or no token returned');
    }
    const token = loginData.data.token;
    console.log('✅ Login successful! JWT received.\n');

    // 2. Test Recommendation Engine
    console.log('🧪 Testing Recommendation Engine (AI Scoring)...');
    const recData = await get('/recommendations', token);
    
    // Updated check for the "Humanized" data structure
    if (!recData.success || !recData.data.recommendations || !Array.isArray(recData.data.recommendations)) {
      throw new Error('Recommendation structure invalid or fetch failed');
    }
    const recommendations = recData.data.recommendations;
    console.log(`✅ Received ${recommendations.length} personalized matches.`);
    
    if (recommendations.length > 0 && recommendations[0].matchScore > 0) {
      console.log(`✅ AI Scoring active: Top match score is ${recommendations[0].matchScore}\n`);
    }

    // 3. Test Discovery Filtering
    console.log('🧪 Testing Discovery Filtering (Canada)...');
    const discData = await get('/programs?country=Canada', token);
    const allInCanada = discData.data.every(p => p.country === 'Canada');
    if (!allInCanada) {
      throw new Error('Filtering failed: Found non-Canada programs');
    }
    console.log(`✅ Discovery filtering verified: All ${discData.data.length} results are in Canada.\n`);

    console.log('🎉 All Critical API Flows Verified Successfully!');
  } catch (error) {
    console.error('\n❌ Test failed!');
    if (error.response) {
      console.error(`   Status: ${error.response.status}`);
      console.error(`   Message: ${JSON.stringify(error.response.data)}`);
    } else if (error.message) {
      console.error(`   Error Message: ${error.message}`);
    } else {
      console.error(`   Error details: ${JSON.stringify(error)}`);
    }
    process.exit(1);
  }
}

// --- Helper Functions ---

function get(path, token) {
  return new Promise((resolve, reject) => {
    const options = {
      headers: { 'Authorization': `Bearer ${token}` }
    };
    http.get(`${API_URL}${path}`, options, (res) => {
      let data = '';
      res.on('data', (chunk) => data += chunk);
      res.on('end', () => {
        if (res.statusCode >= 400) {
          reject({ response: { status: res.statusCode, data: data ? JSON.parse(data) : 'No body' } });
        } else {
          resolve(JSON.parse(data));
        }
      });
    }).on('error', reject);
  });
}

function post(path, payload) {
  return new Promise((resolve, reject) => {
    const body = JSON.stringify(payload);
    const options = {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Content-Length': body.length
      }
    };
    const req = http.request(`${API_URL}${path}`, options, (res) => {
      let data = '';
      res.on('data', (chunk) => data += chunk);
      res.on('end', () => {
        if (res.statusCode >= 400) {
          reject({ response: { status: res.statusCode, data: data ? JSON.parse(data) : 'No body' } });
        } else {
          resolve(JSON.parse(data));
        }
      });
    });
    req.on('error', reject);
    req.write(body);
    req.end();
  });
}

runTests();
