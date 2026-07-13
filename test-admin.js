const admin = require('firebase-admin');
try {
  admin.initializeApp({
    credential: admin.credential.applicationDefault(),
  });
  console.log('Admin SDK initialized via ADC');
} catch(e) {
  console.log('ADC failed:', e.message);
}

// Try with explicit cert
try {
  const app2 = admin.initializeApp({
    credential: admin.cert({
      projectId: 'ai-cluster-6f1cc',
      clientEmail: 'firebase-adminsdk-fbsvc@ai-cluster-6f1cc.iam.gserviceaccount.com',
      privateKey: `-----BEGIN PRIVATE KEY-----
MIIEvAIBADANBgkqhkiG9w0BAQEFAASCBKYwggSiAgEAAoIBAQCyG90YTf9qtrTZ
dwdTU9LvjLLbviwMEnjzR40N9B9AucjEQvS/Cw12NMlS6Wn43x9qQYV/98uN9olU
ksrs4MGRjPq2rlga/59GkIaPkeFB88FQOCg8vC2MkXIl1KVYeAz8RjNDb86MRJ9k
KsPbzjly6ptTgQ2xjB4nSzhkuaDH+UQUdDTbB1YwHBqIRZdOaUJNhcKKlupSQ5SD
xWevNERKrZgFnOojOwSY2AYvqEfQM7M7oXX4rgikDvvZn94YSgBRd7pOhIaqzN51
zGdwM+4/lwmlMEPL4XykgbadRR3ZmXZnFLTViHex9RlSrqnl1iMoxzdEIsLpFtGy
GxvV+Ew7AgMBAAECggEADzEdPLN6c8m9x0bF0y+1MEWaA/BGpYj11BpoR6Zo/AZc
v5DOe3Uf4tNB0Naj+Vxeu5t3HaEvNZ6vvA0BTg8ls5qI0Agy76qaFVTChYB17EA0
XvlLRVLvt6u4Rs3KhK9IvEPon3nr7j70MYEMT7VZZRnpwceiOWCwOb3Kw5ypwCS4
TDv5ZVFk4l7vU15UBw4CkhYFu9ItnwzigTCgAu2vOERODBFCnQMlxrZtKjtZN6HG
l+8ocsPJM66ykMKAt65/yXHMoIhs3GhyUCje69eGIdcED4NSlJ8saWGg037L08ty
mkbDN09svs7VtCNuJpONvabR8JZG32aGgsj+XR0ukQKBgQDk0TznxkGoSFiQaXqa
Q1KcKy/rYprmw7I5hAkakpwecxbUIEusr2zQJCKMjMGwosXdgadf+5XwfEkAkE/U
+8woKKTFsP7h7a1C695J51Ze7G1FqQMk31DkPkTHhbTUReD2zEHKBuS4X0o+WKLR
GZeUUT9uzUhudYvEVNp9RmfJ7wKBgQDHRHxg5b/O46aEy0bZQlEaFdoEIpWjsf2j
QwEIKcwqVReHhP6ATVkFwBR2N59y3LDetz2SX9HYP5eIdGdS7RUtzPng/9gDOUM0
MfKNyz/W4y9bdEgi3XagngQLtXxZ8ekdnSSMjjiU/yeUluREDUnPLQ1AYrFSRJV/
bZQZShEedQKBgHl9s1XoyUG9r/B1YNh5eGpc7+OOBmsSaxXoyiCmyWfNeciFoUh+
GEtndESmE81ij6Ztyd3HqjP2+ZfoB8sxKpQECIDC2oJA/Sa0L+GTiCN8awR6maXB
QKT/futlTb8Ln0fK6f+Hq3dNeREjZMebTAU/ImwFaTjlBqHm3992O3NXAoGAe554
DuDZEm9WMZGuHUAv8h/WRbRy4r+cGzmJHVhYyXZKh48xF8VkUdXsm748E9TngPNq
pjD9jMs+pa+ZHe/osKY16qitiKpwj6Pg1qhdrWD5UyIbUk3TtybwWZc4UtBpjy6a
qvvcDEsScfL+H12jCXzoeKYBXYkguZHwS5QQdLUCgYAkUGlqa8NRHQRIc17TLp/X
osXn6+ACaoEssiQwArzVMfRil9FojLC8g6b1iwhZTK/v8GDn3oZNTsFotaKWQz3t
cRJDSXq9fGqDkS4POWDYR2YDAlRvsZ30fF1UCCJYx0ey273tlsFMulK0ouIVV0nj
xvHY51qxfvkvXtgEmpR8Fw==
-----END PRIVATE KEY-----`,
    }),
  }, 'second-app');
  console.log('Admin SDK initialized with cert');
  const auth = admin.auth(app2);
  auth.createSessionCookie('fake-token', { expiresIn: 7 * 24 * 60 * 60 * 1000 })
    .then(() => console.log('Session cookie created (unexpected)'))
    .catch(e => console.log('Expected error with fake token:', e.code || e.message));
} catch(e) {
  console.log('Cert init error:', e.message);
}
