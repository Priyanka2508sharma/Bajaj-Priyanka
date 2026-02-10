require('dotenv').config();
const express = require('express');
const { GoogleGenerativeAI } = require('@google/generative-ai');

const app = express();
app.use(express.json());

const EMAIL = "priyanka1398.be23@chitkarauniversity.edu.in";
const API_KEY = process.env.GEMINI_API_KEY;

const genAI = new GoogleGenerativeAI(API_KEY);

app.get('/health', (req, res) => {
  res.json({
    is_success: true,
    official_email: EMAIL
  });
});

app.post('/bfhl', async (req, res) => {
  try {
    const body = req.body;
    let data;
    if (body.fibonacci !== undefined) {
      const n = body.fibonacci;
      if (typeof n !== 'number' || n < 0) {
        return res.status(400).json({ is_success: false, message: 'Invalid input for fibonacci' });
      }
      data = fibonacci(n);
    } else if (body.prime !== undefined) {
      const arr = body.prime;
      if (!Array.isArray(arr) || !arr.every(x => typeof x === 'number')) {
        return res.status(400).json({ is_success: false, message: 'Invalid input for prime' });
      }
      data = arr.filter(isPrime);
    } else if (body.lcm !== undefined) {
      const arr = body.lcm;
      if (!Array.isArray(arr) || arr.length < 2 || !arr.every(x => typeof x === 'number' && x > 0)) {
        return res.status(400).json({ is_success: false, message: 'Invalid input for lcm' });
      }
      data = arr.reduce(lcm);
    } else if (body.hcf !== undefined) {
      const arr = body.hcf;
      if (!Array.isArray(arr) || arr.length < 2 || !arr.every(x => typeof x === 'number' && x > 0)) {
        return res.status(400).json({ is_success: false, message: 'Invalid input for hcf' });
      }
      data = arr.reduce(gcd);
    } else if (body.AI !== undefined) {
      const question = body.AI;
      if (typeof question !== 'string') {
        return res.status(400).json({ is_success: false, message: 'Invalid input for AI' });
      }
      const model = genAI.getGenerativeModel({ model: "gemini-1.0-pro" });
      const result = await model.generateContent(question);
      const response = await result.response;
      const text = response.text().trim();
      data = text;
    } else {
      return res.status(400).json({ is_success: false, message: 'Invalid request body' });
    }
    res.json({
      is_success: true,
      official_email: EMAIL,
      data: data
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ is_success: false, message: 'Internal server error' });
  }
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});

// Helper functions
function fibonacci(n) {
  if (n <= 0) return [];
  let fib = [0];
  if (n > 1) fib.push(1);
  for (let i = 2; i < n; i++) {
    fib.push(fib[i-1] + fib[i-2]);
  }
  return fib;
}

function isPrime(num) {
  if (num <= 1) return false;
  for (let i = 2; i <= Math.sqrt(num); i++) {
    if (num % i === 0) return false;
  }
  return true;
}

function gcd(a, b) {
  return b === 0 ? a : gcd(b, a % b);
}

function lcm(a, b) {
  return (a * b) / gcd(a, b);
}
