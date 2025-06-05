// Simple test script to verify RPC connectivity
const http = require('https');

function testRpcEndpoint(url) {
  return new Promise((resolve, reject) => {
    console.log(`Testing ${url}...`);
    
    const postData = JSON.stringify({
      jsonrpc: "2.0",
      id: 1,
      method: "getHealth"
    });

    const options = {
      hostname: url.replace('https://', '').replace('http://', ''),
      port: 443,
      path: '/',
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Content-Length': postData.length
      },
      timeout: 10000
    };

    const req = http.request(options, (res) => {
      let data = '';
      
      res.on('data', (chunk) => {
        data += chunk;
      });
      
      res.on('end', () => {
        try {
          const response = JSON.parse(data);
          console.log(`✅ ${url} - Status: ${res.statusCode}`);
          console.log(`   Response:`, response);
          resolve({ url, status: res.statusCode, response });
        } catch (error) {
          console.log(`❌ ${url} - Failed to parse response:`, data);
          reject({ url, error: 'Invalid JSON response' });
        }
      });
    });

    req.on('error', (error) => {
      console.log(`❌ ${url} - Network error:`, error.message);
      reject({ url, error: error.message });
    });

    req.on('timeout', () => {
      console.log(`❌ ${url} - Timeout`);
      req.destroy();
      reject({ url, error: 'Timeout' });
    });

    req.write(postData);
    req.end();
  });
}

async function testAllEndpoints() {
  const endpoints = [
    'https://soroban-testnet.stellar.org',
    'https://rpc-futurenet.stellar.org',
    'https://mainnet.sorobanrpc.com'
  ];

  console.log('🔍 Testing Stellar RPC endpoints...\n');

  for (const endpoint of endpoints) {
    try {
      await testRpcEndpoint(endpoint);
    } catch (error) {
      // Error already logged in testRpcEndpoint
    }
    console.log(''); // Add spacing
  }
}

testAllEndpoints().catch(console.error);
