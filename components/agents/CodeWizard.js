"use client";

import { useState } from "react";

const languages = [
  { id: "javascript", label: "JavaScript" },
  { id: "python", label: "Python" },
  { id: "java", label: "Java" },
  { id: "go", label: "Go" },
  { id: "rust", label: "Rust" },
  { id: "cpp", label: "C++" },
];

const codeTemplates = {
  javascript: {
    sort: `// Bubble Sort Implementation
function bubbleSort(arr) {
  const n = arr.length;
  for (let i = 0; i < n - 1; i++) {
    for (let j = 0; j < n - i - 1; j++) {
      if (arr[j] > arr[j + 1]) {
        [arr[j], arr[j + 1]] = [arr[j + 1], arr[j]];
      }
    }
  }
  return arr;
}

const data = [64, 34, 25, 12, 22, 11, 90];
console.log("Sorted:", bubbleSort([...data]));`,
    search: `// Binary Search Implementation
function binarySearch(arr, target) {
  let left = 0;
  let right = arr.length - 1;

  while (left <= right) {
    const mid = Math.floor((left + right) / 2);
    if (arr[mid] === target) return mid;
    if (arr[mid] < target) left = mid + 1;
    else right = mid - 1;
  }
  return -1;
}

const sortedArray = [2, 5, 8, 12, 16, 23, 38, 56, 72, 91];
console.log("Found at index:", binarySearch(sortedArray, 23));`,
    api: `// REST API with Express.js
const express = require('express');
const app = express();
app.use(express.json());

let items = [
  { id: 1, name: 'Item A', price: 29.99 },
  { id: 2, name: 'Item B', price: 49.99 },
];

// GET all items
app.get('/api/items', (req, res) => {
  res.json({ success: true, data: items });
});

// POST new item
app.post('/api/items', (req, res) => {
  const item = { id: items.length + 1, ...req.body };
  items.push(item);
  res.status(201).json({ success: true, data: item });
});

// DELETE item
app.delete('/api/items/:id', (req, res) => {
  items = items.filter(i => i.id !== parseInt(req.params.id));
  res.json({ success: true });
});

app.listen(3000, () => console.log('Server on port 3000'));`,
    database: `// MongoDB Database Operations
const { MongoClient } = require('mongodb');
const uri = 'mongodb://localhost:27017';
const client = new MongoClient(uri);

async function connectDB() {
  await client.connect();
  const db = client.db('myapp');
  return db.collection('users');
}

// Create
async function createUser(name, email) {
  const col = await connectDB();
  return col.insertOne({ name, email, createdAt: new Date() });
}

// Read
async function findUser(email) {
  const col = await connectDB();
  return col.findOne({ email });
}

// Update
async function updateUser(email, updates) {
  const col = await connectDB();
  return col.updateOne({ email }, { $set: updates });
}

// Delete
async function deleteUser(email) {
  const col = await connectDB();
  return col.deleteOne({ email });
}`,
    default: `// JavaScript Utility Functions

// Deep clone an object
function deepClone(obj) {
  return JSON.parse(JSON.stringify(obj));
}

// Debounce function
function debounce(fn, delay) {
  let timer;
  return (...args) => {
    clearTimeout(timer);
    timer = setTimeout(() => fn(...args), delay);
  };
}

// Array chunking
function chunk(arr, size) {
  const chunks = [];
  for (let i = 0; i < arr.length; i += size) {
    chunks.push(arr.slice(i, i + size));
  }
  return chunks;
}

// Usage
console.log(deepClone({ a: { b: 1 } }));
console.log(chunk([1,2,3,4,5], 2));`,
  },
  python: {
    sort: `# Quick Sort Implementation
def quick_sort(arr):
    if len(arr) <= 1:
        return arr
    pivot = arr[len(arr) // 2]
    left = [x for x in arr if x < pivot]
    middle = [x for x in arr if x == pivot]
    right = [x for x in arr if x > pivot]
    return quick_sort(left) + middle + quick_sort(right)

# Example usage
data = [64, 34, 25, 12, 22, 11, 90]
print(f"Original: {data}")
print(f"Sorted:   {quick_sort(data)}")`,
    search: `# Binary Search Implementation
def binary_search(arr, target):
    left, right = 0, len(arr) - 1
    
    while left <= right:
        mid = (left + right) // 2
        if arr[mid] == target:
            return mid
        elif arr[mid] < target:
            left = mid + 1
        else:
            right = mid - 1
    
    return -1

# Example usage
sorted_array = [2, 5, 8, 12, 16, 23, 38, 56, 72, 91]
result = binary_search(sorted_array, 23)
print(f"Found at index: {result}")`,
    api: `# REST API with Flask
from flask import Flask, jsonify, request

app = Flask(__name__)

items = [
    {"id": 1, "name": "Item A", "price": 29.99},
    {"id": 2, "name": "Item B", "price": 49.99},
]

@app.route('/api/items', methods=['GET'])
def get_items():
    return jsonify({"success": True, "data": items})

@app.route('/api/items', methods=['POST'])
def create_item():
    data = request.json
    item = {"id": len(items) + 1, **data}
    items.append(item)
    return jsonify({"success": True, "data": item}), 201

@app.route('/api/items/<int:id>', methods=['DELETE'])
def delete_item(id):
    global items
    items = [i for i in items if i["id"] != id]
    return jsonify({"success": True})

if __name__ == '__main__':
    app.run(debug=True, port=5000)`,
    database: `# SQLite Database Operations
import sqlite3
from datetime import datetime

def init_db():
    conn = sqlite3.connect('myapp.db')
    c = conn.cursor()
    c.execute('''CREATE TABLE IF NOT EXISTS users
                 (id INTEGER PRIMARY KEY, name TEXT, 
                  email TEXT UNIQUE, created_at TIMESTAMP)''')
    conn.commit()
    return conn

# Create
def create_user(conn, name, email):
    c = conn.cursor()
    c.execute('INSERT INTO users (name, email, created_at) VALUES (?, ?, ?)',
              (name, email, datetime.now()))
    conn.commit()
    return c.lastrowid

# Read
def find_user(conn, email):
    c = conn.cursor()
    c.execute('SELECT * FROM users WHERE email = ?', (email,))
    return c.fetchone()

# Update
def update_user(conn, email, name):
    c = conn.cursor()
    c.execute('UPDATE users SET name = ? WHERE email = ?', (name, email))
    conn.commit()

# Delete
def delete_user(conn, email):
    c = conn.cursor()
    c.execute('DELETE FROM users WHERE email = ?', (email,))
    conn.commit()`,
    default: `# Python Utility Functions
from functools import reduce

# Fibonacci generator
def fibonacci(n):
    a, b = 0, 1
    for _ in range(n):
        yield a
        a, b = b, a + b

# Flatten nested lists
def flatten(lst):
    return reduce(lambda a, b: a + b, 
                  [flatten(x) if isinstance(x, list) else [x] for x in lst])

# Word frequency counter
def word_freq(text):
    words = text.lower().split()
    return {w: words.count(w) for w in set(words)}

# Usage
print(list(fibonacci(10)))
print(flatten([1, [2, 3], [4, [5, 6]]]))
print(word_freq("hello world hello"))`,
  },
  java: {
    sort: `// Merge Sort Implementation
import java.util.Arrays;

public class MergeSort {
    public static void mergeSort(int[] arr, int left, int right) {
        if (left < right) {
            int mid = left + (right - left) / 2;
            mergeSort(arr, left, mid);
            mergeSort(arr, mid + 1, right);
            merge(arr, left, mid, right);
        }
    }

    private static void merge(int[] arr, int l, int m, int r) {
        int[] left = Arrays.copyOfRange(arr, l, m + 1);
        int[] right = Arrays.copyOfRange(arr, m + 1, r + 1);
        int i = 0, j = 0, k = l;
        while (i < left.length && j < right.length) {
            arr[k++] = left[i] <= right[j] ? left[i++] : right[j++];
        }
        while (i < left.length) arr[k++] = left[i++];
        while (j < right.length) arr[k++] = right[j++];
    }

    public static void main(String[] args) {
        int[] data = {64, 34, 25, 12, 22, 11, 90};
        mergeSort(data, 0, data.length - 1);
        System.out.println("Sorted: " + Arrays.toString(data));
    }
}`,
    search: `// Binary Search Implementation
public class BinarySearch {
    public static int binarySearch(int[] arr, int target) {
        int left = 0, right = arr.length - 1;
        while (left <= right) {
            int mid = left + (right - left) / 2;
            if (arr[mid] == target) return mid;
            if (arr[mid] < target) left = mid + 1;
            else right = mid - 1;
        }
        return -1;
    }

    public static void main(String[] args) {
        int[] sorted = {2, 5, 8, 12, 16, 23, 38, 56, 72, 91};
        int index = binarySearch(sorted, 23);
        System.out.println("Found at index: " + index);
    }
}`,
    api: `// Spring Boot REST API
import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.web.bind.annotation.*;
import java.util.*;

@SpringBootApplication
@RestController
public class ApiApp {
    private final List<Map<String, Object>> items = new ArrayList<>(Arrays.asList(
        Map.of("id", 1, "name", "Item A", "price", 29.99),
        Map.of("id", 2, "name", "Item B", "price", 49.99)
    ));

    @GetMapping("/api/items")
    public Map<String, Object> getItems() {
        return Map.of("success", true, "data", items);
    }

    @PostMapping("/api/items")
    public Map<String, Object> createItem(@RequestBody Map<String, Object> body) {
        Map<String, Object> item = new HashMap<>(body);
        item.put("id", items.size() + 1);
        items.add(item);
        return Map.of("success", true, "data", item);
    }

    public static void main(String[] args) {
        SpringApplication.run(ApiApp.class, args);
    }
}`,
    default: `// Java Utility Class
import java.util.*;
import java.util.stream.*;

public class Utils {
    // List comprehension equivalent
    public static <T> List<T> filter(List<T> list, Predicate<T> pred) {
        return list.stream().filter(pred).collect(Collectors.toList());
    }

    // Find max in array
    public static int findMax(int[] arr) {
        return Arrays.stream(arr).max().orElseThrow();
    }

    // Check palindrome
    public static boolean isPalindrome(String s) {
        String clean = s.replaceAll("[^a-zA-Z0-9]", "").toLowerCase();
        return clean.equals(new StringBuilder(clean).reverse().toString());
    }

    public static void main(String[] args) {
        List<Integer> nums = Arrays.asList(1, 2, 3, 4, 5, 6, 7, 8);
        List<Integer> evens = filter(nums, n -> n % 2 == 0);
        System.out.println("Evens: " + evens);
        System.out.println("Max: " + findMax(new int[]{3, 7, 1, 9, 4}));
        System.out.println("Palindrome: " + isPalindrome("racecar"));
    }
}`,
  },
  go: {
    sort: `package main

import "fmt"

func insertionSort(arr []int) []int {
    result := make([]int, len(arr))
    copy(result, arr)
    
    for i := 1; i < len(result); i++ {
        key := result[i]
        j := i - 1
        for j >= 0 && result[j] > key {
            result[j+1] = result[j]
            j--
        }
        result[j+1] = key
    }
    return result
}

func main() {
    data := []int{64, 34, 25, 12, 22, 11, 90}
    fmt.Println("Sorted:", insertionSort(data))
}`,
    search: `package main

import "fmt"

func binarySearch(arr []int, target int) int {
    left, right := 0, len(arr)-1
    for left <= right {
        mid := left + (right-left)/2
        if arr[mid] == target {
            return mid
        }
        if arr[mid] < target {
            left = mid + 1
        } else {
            right = mid - 1
        }
    }
    return -1
}

func main() {
    sorted := []int{2, 5, 8, 12, 16, 23, 38, 56, 72, 91}
    idx := binarySearch(sorted, 23)
    fmt.Println("Found at index:", idx)
}`,
    api: `package main

import (
    "encoding/json"
    "net/http"
    "sync"
)

type Item struct {
    ID    int     \`json:"id"\`
    Name  string  \`json:"name"\`
    Price float64 \`json:"price"\`
}

var (
    items = []Item{
        {ID: 1, Name: "Item A", Price: 29.99},
        {ID: 2, Name: "Item B", Price: 49.99},
    }
    mu sync.RWMutex
)

func getItems(w http.ResponseWriter, r *http.Request) {
    mu.RLock()
    defer mu.RUnlock()
    json.NewEncoder(w).Encode(map[string]interface{}{
        "success": true, "data": items,
    })
}

func main() {
    http.HandleFunc("/api/items", getItems)
    http.ListenAndServe(":8080", nil)
}`,
    default: `package main

import (
    "fmt"
    "strings"
)

func reverse(s string) string {
    runes := []rune(s)
    for i, j := 0, len(runes)-1; i < j; i, j = i+1, j-1 {
        runes[i], runes[j] = runes[j], runes[i]
    }
    return string(runes)
}

func wordCount(s string) map[string]int {
    words := strings.Fields(strings.ToLower(s))
    freq := make(map[string]int)
    for _, w := range words {
        freq[w]++
    }
    return freq
}

func main() {
    fmt.Println(reverse("Hello, World!"))
    fmt.Println(wordCount("the cat sat on the mat the cat"))
}`,
  },
  rust: {
    sort: `fn merge_sort<T: Ord + Clone>(arr: &[T]) -> Vec<T> {
    if arr.len() <= 1 {
        return arr.to_vec();
    }
    let mid = arr.len() / 2;
    let left = merge_sort(&arr[..mid]);
    let right = merge_sort(&arr[mid..]);
    merge(&left, &right)
}

fn merge<T: Ord + Clone>(left: &[T], right: &[T]) -> Vec<T> {
    let mut result = Vec::with_capacity(left.len() + right.len());
    let (mut i, mut j) = (0, 0);
    while i < left.len() && j < right.len() {
        if left[i] <= right[j] {
            result.push(left[i].clone());
            i += 1;
        } else {
            result.push(right[j].clone());
            j += 1;
        }
    }
    result.extend_from_slice(&left[i..]);
    result.extend_from_slice(&right[j..]);
    result
}

fn main() {
    let data = vec![64, 34, 25, 12, 22, 11, 90];
    println!("Sorted: {:?}", merge_sort(&data));
}`,
    search: `fn binary_search<T: Ord>(arr: &[T], target: &T) -> Option<usize> {
    let (mut left, mut right) = (0, arr.len());
    while left < right {
        let mid = left + (right - left) / 2;
        match arr[mid].cmp(target) {
            std::cmp::Ordering::Equal => return Some(mid),
            std::cmp::Ordering::Less => left = mid + 1,
            std::cmp::Ordering::Greater => right = mid,
        }
    }
    None
}

fn main() {
    let sorted = vec![2, 5, 8, 12, 16, 23, 38, 56, 72, 91];
    match binary_search(&sorted, &23) {
        Some(idx) => println!("Found at index: {}", idx),
        None => println!("Not found"),
    }
}`,
    default: `fn fibonacci(n: usize) -> Vec<u64> {
    let mut fib = vec![0, 1];
    for i in 2..n {
        fib.push(fib[i-1] + fib[i-2]);
    }
    fib
}

fn is_palindrome(s: &str) -> bool {
    let cleaned: String = s.chars().filter(|c| c.is_alphanumeric()).collect();
    let lower = cleaned.to_lowercase();
    lower.chars().rev().collect::<String>() == lower
}

fn main() {
    println!("Fibonacci: {:?}", fibonacci(10));
    println!("Is 'racecar' palindrome: {}", is_palindrome("racecar"));
}`,
  },
  cpp: {
    sort: `#include <iostream>
#include <vector>
using namespace std;

void quickSort(vector<int>& arr, int low, int high) {
    if (low < high) {
        int pivot = arr[high];
        int i = low - 1;
        for (int j = low; j < high; j++) {
            if (arr[j] < pivot) {
                swap(arr[++i], arr[j]);
            }
        }
        swap(arr[i + 1], arr[high]);
        int pi = i + 1;
        quickSort(arr, low, pi - 1);
        quickSort(arr, pi + 1, high);
    }
}

int main() {
    vector<int> data = {64, 34, 25, 12, 22, 11, 90};
    quickSort(data, 0, data.size() - 1);
    cout << "Sorted: ";
    for (int x : data) cout << x << " ";
    cout << endl;
    return 0;
}`,
    search: `#include <iostream>
#include <vector>
using namespace std;

int binarySearch(const vector<int>& arr, int target) {
    int left = 0, right = arr.size() - 1;
    while (left <= right) {
        int mid = left + (right - left) / 2;
        if (arr[mid] == target) return mid;
        if (arr[mid] < target) left = mid + 1;
        else right = mid - 1;
    }
    return -1;
}

int main() {
    vector<int> sorted = {2, 5, 8, 12, 16, 23, 38, 56, 72, 91};
    cout << "Found at index: " << binarySearch(sorted, 23) << endl;
    return 0;
}`,
    default: `#include <iostream>
#include <vector>
#include <algorithm>
using namespace std;

vector<int> mergeSorted(const vector<int>& a, const vector<int>& b) {
    vector<int> result;
    merge(a.begin(), a.end(), b.begin(), b.end(), back_inserter(result));
    return result;
}

bool isPrime(int n) {
    if (n < 2) return false;
    for (int i = 2; i * i <= n; i++)
        if (n % i == 0) return false;
    return true;
}

int main() {
    vector<int> a = {1, 3, 5, 7};
    vector<int> b = {2, 4, 6, 8};
    auto merged = mergeSorted(a, b);
    cout << "Merged: ";
    for (int x : merged) cout << x << " ";
    cout << "\\nPrimes: ";
    for (int i = 1; i <= 20; i++)
        if (isPrime(i)) cout << i << " ";
    cout << endl;
    return 0;
}`,
  },
};

function detectCategory(prompt) {
  const lower = prompt.toLowerCase();
  if (/sort|bubble|merge|quick|insertion|heap/.test(lower)) return "sort";
  if (/search|binary|find|lookup/.test(lower)) return "search";
  if (/api|rest|endpoint|server|http|express|flask|route/.test(lower)) return "api";
  if (/database|sql|mongo|db|crud|sqlite/.test(lower)) return "database";
  return "default";
}

export default function CodeWizard({ agent }) {
  const [language, setLanguage] = useState("javascript");
  const [prompt, setPrompt] = useState("");
  const [code, setCode] = useState("");
  const [loading, setLoading] = useState(false);
  const [category, setCategory] = useState("");
  const [streaming, setStreaming] = useState(false);

  async function handleGenerate() {
    if (!prompt.trim()) return;
    setLoading(true);
    setCode("");
    setStreaming(true);

    const detected = detectCategory(prompt);
    setCategory(detected);

    await new Promise((r) => setTimeout(r, 500));

    const templates = codeTemplates[language];
    const selected = templates[detected] || templates.default;

    let current = "";
    const chars = selected.split("");
    for (let i = 0; i < chars.length; i++) {
      current += chars[i];
      setCode(current);
      if (i % 5 === 0) await new Promise((r) => setTimeout(r, 5));
    }

    setStreaming(false);
    setLoading(false);
  }

  const lineCount = code ? code.split("\n").length : 0;

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap gap-2 mb-4">
        {languages.map((lang) => (
          <button
            key={lang.id}
            onClick={() => setLanguage(lang.id)}
            className={`px-4 py-1.5 rounded-lg text-sm font-medium transition-all ${
              language === lang.id
                ? "bg-emerald-600 text-white border border-emerald-500"
                : "bg-black/30 text-gray-400 border border-white/10 hover:bg-white/10"
            }`}
          >
            {lang.label}
          </button>
        ))}
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-300 mb-2">
          Describe what you want to build
        </label>
        <textarea
          value={prompt}
          onChange={(e) => setPrompt(e.target.value)}
          placeholder={`Describe the ${language} code you need... (e.g., "sort algorithm", "binary search", "REST API", "database operations")`}
          rows={3}
          className="w-full px-4 py-3 bg-black/30 border border-white/10 rounded-xl text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-emerald-500/50 resize-none"
        />
        {prompt.trim() && (
          <p className="text-xs text-gray-500 mt-1">
            Detected: <span className="text-emerald-400">{category || "general"}</span> in <span className="text-emerald-400">{language}</span>
          </p>
        )}
      </div>

      <button
        onClick={handleGenerate}
        disabled={loading || !prompt.trim()}
        className="px-6 py-3 bg-gradient-to-r from-emerald-600 to-green-600 hover:from-emerald-500 hover:to-green-500 text-white font-semibold rounded-xl transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
      >
        {loading ? (
          <>
            <svg className="animate-spin h-5 w-5" viewBox="0 0 24 24">
              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
            </svg>
            Writing Code...
          </>
        ) : (
          <>
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 20l4-16m4 4l4 4-4 4M6 16l-4-4 4-4" />
            </svg>
            Generate Code
          </>
        )}
      </button>

      {code && (
        <div className="animate-fadeInUp">
          <div className="flex items-center justify-between mb-3">
            <h3 className="text-sm font-semibold text-emerald-400 uppercase tracking-wider">
              Generated Code
            </h3>
            <div className="flex items-center gap-3">
              <span className="text-xs text-gray-500">
                {lineCount} lines | {language}
              </span>
              {streaming && (
                <span className="text-xs text-emerald-400 animate-pulse">typing...</span>
              )}
              <button
                onClick={() => navigator.clipboard.writeText(code)}
                className="p-1.5 rounded-lg bg-white/5 hover:bg-white/10 border border-white/10 transition-colors"
                title="Copy code"
              >
                <svg className="w-4 h-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z" />
                </svg>
              </button>
            </div>
          </div>
          <pre className="bg-black/50 border border-white/10 rounded-xl p-4 overflow-x-auto">
            <code className="text-sm text-gray-200 font-mono leading-relaxed whitespace-pre">
              {code}
              {streaming && <span className="inline-block w-2 h-4 bg-emerald-400 animate-pulse ml-0.5" />}
            </code>
          </pre>
        </div>
      )}
    </div>
  );
}
