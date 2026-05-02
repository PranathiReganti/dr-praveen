import http from 'http';

function makeRequest(method, path, body = null) {
  return new Promise((resolve, reject) => {
    const options = {
      hostname: 'localhost',
      port: 5000,
      path: path,
      method: method,
      headers: {
        'Content-Type': 'application/json'
      }
    };

    const req = http.request(options, (res) => {
      let data = '';
      res.on('data', chunk => data += chunk);
      res.on('end', () => {
        try {
          resolve({
            status: res.statusCode,
            body: JSON.parse(data)
          });
        } catch (e) {
          resolve({
            status: res.statusCode,
            body: data
          });
        }
      });
    });

    req.on('error', reject);
    
    if (body) {
      req.write(JSON.stringify(body));
    }
    req.end();
  });
}

async function runTests() {
  console.log('\n============================================');
  console.log('🧪 Testing Queue Forward Endpoint');
  console.log('============================================\n');

  try {
    // Test 1: Check current queue status
    console.log('📋 TEST 1: Check current queue status');
    const statusResp = await makeRequest('GET', '/api/queue');
    console.log('Current Token:', statusResp.body.data.currentToken);
    console.log('Waiting Count:', statusResp.body.data.waiting);
    console.log('Estimated Time:', statusResp.body.data.estimatedTime);

    // Test 2: Move queue forward
    console.log('\n⏭️  TEST 2: Move queue forward (POST /api/queue/next)');
    const nextResp = await makeRequest('POST', '/api/queue/next');
    console.log('Status:', nextResp.status);
    console.log('Message:', nextResp.body.message);
    if (nextResp.body.data.currentToken) {
      console.log('New Current Token:', nextResp.body.data.currentToken);
      console.log('Patient Name:', nextResp.body.data.patient);
      console.log('Waiting After Move:', nextResp.body.data.waiting);
    } else {
      console.log('Queue is now empty or no more patients');
    }

    // Test 3: Check queue status after move
    console.log('\n📋 TEST 3: Check queue status after move');
    const statusResp2 = await makeRequest('GET', '/api/queue');
    console.log('Current Token:', statusResp2.body.data.currentToken);
    console.log('Waiting Count:', statusResp2.body.data.waiting);
    console.log('Estimated Time:', statusResp2.body.data.estimatedTime);

    // Test 4: Move queue forward again
    console.log('\n⏭️  TEST 4: Move queue forward again');
    const nextResp2 = await makeRequest('POST', '/api/queue/next');
    console.log('Status:', nextResp2.status);
    console.log('Message:', nextResp2.body.message);
    if (nextResp2.body.data.currentToken) {
      console.log('New Current Token:', nextResp2.body.data.currentToken);
      console.log('Patient Name:', nextResp2.body.data.patient);
      console.log('Waiting After Move:', nextResp2.body.data.waiting);
    }

    console.log('\n============================================');
    console.log('✅ All tests completed successfully!');
    console.log('============================================\n');

  } catch (error) {
    console.error('❌ Test failed:', error.message);
  }

  process.exit(0);
}

runTests();
