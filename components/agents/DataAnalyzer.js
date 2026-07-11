"use client";

import { useState, useRef } from "react";

const analysisTypes = [
  { id: "summary", label: "Summary Stats", icon: "📋" },
  { id: "trends", label: "Trend Analysis", icon: "📈" },
  { id: "correlation", label: "Correlation", icon: "🔗" },
  { id: "outliers", label: "Outlier Detection", icon: "🔍" },
];

function parseCSV(text) {
  const lines = text.trim().split("\n");
  if (lines.length < 2) return null;
  const headers = lines[0].split(",").map((h) => h.trim().replace(/^"|"$/g, ""));
  const rows = [];
  for (let i = 1; i < lines.length; i++) {
    const values = lines[i].split(",").map((v) => v.trim().replace(/^"|"$/g, ""));
    if (values.length === headers.length) {
      const row = {};
      headers.forEach((h, idx) => {
        const num = parseFloat(values[idx]);
        row[h] = isNaN(num) ? values[idx] : num;
      });
      rows.push(row);
    }
  }
  return { headers, rows };
}

function parseJSON(text) {
  const data = JSON.parse(text);
  const arr = Array.isArray(data) ? data : [data];
  if (arr.length === 0) return null;
  const headers = [...new Set(arr.flatMap((r) => Object.keys(r)))];
  return { headers, rows: arr };
}

function getNumericColumns(data) {
  return data.headers.filter((h) =>
    data.rows.some((r) => typeof r[h] === "number" && !isNaN(r[h]))
  );
}

function getNumericValues(data, col) {
  return data.rows
    .map((r) => r[col])
    .filter((v) => typeof v === "number" && !isNaN(v));
}

function mean(arr) {
  return arr.reduce((s, v) => s + v, 0) / arr.length;
}

function median(arr) {
  const sorted = [...arr].sort((a, b) => a - b);
  const mid = Math.floor(sorted.length / 2);
  return sorted.length % 2 ? sorted[mid] : (sorted[mid - 1] + sorted[mid]) / 2;
}

function stdDev(arr) {
  const m = mean(arr);
  const variance = arr.reduce((s, v) => s + (v - m) ** 2, 0) / arr.length;
  return Math.sqrt(variance);
}

function percentile(arr, p) {
  const sorted = [...arr].sort((a, b) => a - b);
  const idx = (p / 100) * (sorted.length - 1);
  const lower = Math.floor(idx);
  const upper = Math.ceil(idx);
  if (lower === upper) return sorted[lower];
  return sorted[lower] + (sorted[upper] - sorted[lower]) * (idx - lower);
}

function correlation(a, b) {
  const n = Math.min(a.length, b.length);
  if (n < 3) return 0;
  const ma = mean(a.slice(0, n));
  const mb = mean(b.slice(0, n));
  let num = 0, da = 0, db = 0;
  for (let i = 0; i < n; i++) {
    const x = a[i] - ma;
    const y = b[i] - mb;
    num += x * y;
    da += x * x;
    db += y * y;
  }
  const denom = Math.sqrt(da * db);
  return denom === 0 ? 0 : num / denom;
}

function analyzeSummary(data) {
  const numCols = getNumericColumns(data);
  const stats = {};
  numCols.forEach((col) => {
    const vals = getNumericValues(data, col);
    if (vals.length > 0) {
      stats[col] = {
        count: vals.length,
        mean: parseFloat(mean(vals).toFixed(4)),
        median: parseFloat(median(vals).toFixed(4)),
        stdDev: parseFloat(stdDev(vals).toFixed(4)),
        min: Math.min(...vals),
        max: Math.max(...vals),
        q1: parseFloat(percentile(vals, 25).toFixed(4)),
        q3: parseFloat(percentile(vals, 75).toFixed(4)),
      };
    }
  });
  return {
    totalRows: data.rows.length,
    totalColumns: data.headers.length,
    numericColumns: numCols.length,
    columnStats: stats,
  };
}

function analyzeTrends(data) {
  const numCols = getNumericColumns(data);
  const insights = [];
  numCols.forEach((col) => {
    const vals = getNumericValues(data, col);
    if (vals.length < 2) return;
    const firstHalf = vals.slice(0, Math.floor(vals.length / 2));
    const secondHalf = vals.slice(Math.floor(vals.length / 2));
    const firstMean = mean(firstHalf);
    const secondMean = mean(secondHalf);
    const change = ((secondMean - firstMean) / (firstMean || 1)) * 100;
    if (change > 5) {
      insights.push(`${col}: Increasing trend (+${change.toFixed(1)}% from first to second half)`);
    } else if (change < -5) {
      insights.push(`${col}: Decreasing trend (${change.toFixed(1)}% from first to second half)`);
    } else {
      insights.push(`${col}: Relatively stable (${change > 0 ? "+" : ""}${change.toFixed(1)}% change)`);
    }
    const diffs = [];
    for (let i = 1; i < vals.length; i++) diffs.push(vals[i] - vals[i - 1]);
    const avgDiff = mean(diffs);
    const vol = stdDev(diffs);
    if (vol > Math.abs(avgDiff) * 2) {
      insights.push(`${col}: High volatility detected (std of changes: ${vol.toFixed(2)})`);
    }
  });
  if (insights.length === 0) {
    insights.push("Not enough numeric data for trend analysis. Add columns with numbers.");
  }
  return insights;
}

function analyzeCorrelations(data) {
  const numCols = getNumericColumns(data);
  const results = [];
  for (let i = 0; i < numCols.length; i++) {
    for (let j = i + 1; j < numCols.length; j++) {
      const a = getNumericValues(data, numCols[i]);
      const b = getNumericValues(data, numCols[j]);
      const r = correlation(a, b);
      const strength =
        Math.abs(r) > 0.7
          ? "Strong"
          : Math.abs(r) > 0.4
          ? "Moderate"
          : Math.abs(r) > 0.2
          ? "Weak"
          : "Very weak";
      const direction = r > 0 ? "positive" : "negative";
      results.push({
        pair: `${numCols[i]} vs ${numCols[j]}`,
        coefficient: parseFloat(r.toFixed(4)),
        description: `${strength} ${direction} correlation (r=${r.toFixed(3)})`,
      });
    }
  }
  if (results.length === 0) {
    results.push({
      pair: "N/A",
      coefficient: 0,
      description: "Need at least 2 numeric columns for correlation analysis.",
    });
  }
  return results;
}

function analyzeOutliers(data) {
  const numCols = getNumericColumns(data);
  const results = [];
  numCols.forEach((col) => {
    const vals = getNumericValues(data, col);
    if (vals.length < 4) return;
    const q1 = percentile(vals, 25);
    const q3 = percentile(vals, 75);
    const iqr = q3 - q1;
    const lowerBound = q1 - 1.5 * iqr;
    const upperBound = q3 + 1.5 * iqr;
    const outliers = vals.filter((v) => v < lowerBound || v > upperBound);
    if (outliers.length > 0) {
      results.push({
        column: col,
        count: outliers.length,
        values: outliers.slice(0, 10),
        bounds: { lower: lowerBound.toFixed(2), upper: upperBound.toFixed(2) },
        severity:
          outliers.length > vals.length * 0.1 ? "high" : outliers.length > 2 ? "medium" : "low",
      });
    }
  });
  if (results.length === 0) {
    results.push({
      column: "All columns",
      count: 0,
      values: [],
      bounds: {},
      severity: "low",
      message: "No significant outliers detected using the IQR method.",
    });
  }
  return results;
}

const sampleData = `name,score,age,hours,grade,salary
Alice,92,28,6.5,A,72000
Bob,78,34,5.2,B,65000
Charlie,85,22,7.1,A,78000
Diana,95,31,8.0,A,92000
Evan,63,26,4.0,C,54000
Fiona,88,29,6.8,A,81000
George,72,35,5.0,B,62000
Hannah,91,24,7.5,A,85000
Ivan,68,30,4.5,C,58000
Julia,82,27,6.0,B,71000
Kevin,97,23,8.2,A,95000
Laura,74,33,5.3,B,66000
Mike,89,25,7.0,A,83000
Nina,76,32,5.5,B,68000
Oscar,84,28,6.3,B,75000`;

export default function DataAnalyzer({ agent }) {
  const [hasFile, setHasFile] = useState(false);
  const [fileName, setFileName] = useState("");
  const [data, setData] = useState(null);
  const [analysisType, setAnalysisType] = useState("summary");
  const [loading, setLoading] = useState(false);
  const [results, setResults] = useState(null);
  const [error, setError] = useState("");
  const fileInputRef = useRef(null);

  function handleFileSelect(e) {
    const file = e.target?.files?.[0];
    if (!file) return;
    setError("");
    const reader = new FileReader();
    reader.onload = (ev) => {
      try {
        const text = ev.target.result;
        let parsed;
        if (file.name.endsWith(".json")) {
          parsed = parseJSON(text);
        } else {
          parsed = parseCSV(text);
        }
        if (!parsed || parsed.rows.length === 0) {
          setError("Could not parse file. Check format.");
          return;
        }
        setData(parsed);
        setFileName(file.name);
        setHasFile(true);
        setResults(null);
      } catch (err) {
        setError("Failed to parse file: " + err.message);
      }
    };
    reader.readAsText(file);
  }

  function handleFileDrop(e) {
    e.preventDefault();
    const file = e.dataTransfer?.files?.[0];
    if (file) {
      const fakeEvent = { target: { files: [file] } };
      handleFileSelect(fakeEvent);
    }
  }

  function loadSampleData() {
    try {
      const parsed = parseCSV(sampleData);
      setData(parsed);
      setFileName("sample_data.csv");
      setHasFile(true);
      setResults(null);
      setError("");
    } catch {
      setError("Failed to load sample data.");
    }
  }

  async function handleAnalyze() {
    if (!data) return;
    setLoading(true);
    setResults(null);

    await new Promise((r) => setTimeout(r, 800));

    try {
      let result;
      switch (analysisType) {
        case "summary":
          result = analyzeSummary(data);
          break;
        case "trends":
          result = analyzeTrends(data);
          break;
        case "correlation":
          result = analyzeCorrelations(data);
          break;
        case "outliers":
          result = analyzeOutliers(data);
          break;
        default:
          result = analyzeSummary(data);
      }
      setResults(result);
    } catch (err) {
      setError("Analysis failed: " + err.message);
    } finally {
      setLoading(false);
    }
  }

  function removeFile() {
    setHasFile(false);
    setFileName("");
    setData(null);
    setResults(null);
    setError("");
    if (fileInputRef.current) fileInputRef.current.value = "";
  }

  return (
    <div className="space-y-6">
      {error && (
        <div className="bg-red-500/10 border border-red-500/30 text-red-400 text-sm rounded-lg px-4 py-3">
          {error}
        </div>
      )}

      {!hasFile ? (
        <div>
          <div
            onDrop={handleFileDrop}
            onDragOver={(e) => e.preventDefault()}
            className="border-2 border-dashed border-white/20 rounded-xl p-8 text-center hover:border-amber-500/50 transition-colors cursor-pointer"
          >
            <input
              ref={fileInputRef}
              type="file"
              accept=".csv,.json"
              onChange={handleFileSelect}
              className="hidden"
              id="file-upload"
            />
            <label htmlFor="file-upload" className="cursor-pointer">
              <div className="text-5xl mb-4">📂</div>
              <p className="text-gray-300 font-medium mb-1">
                Drop your dataset here or click to browse
              </p>
              <p className="text-gray-500 text-sm">
                Supports CSV and JSON files
              </p>
            </label>
          </div>
          <div className="text-center mt-3">
            <button
              onClick={loadSampleData}
              className="text-sm text-amber-400 hover:text-amber-300 transition-colors"
            >
              Or load sample dataset →
            </button>
          </div>
        </div>
      ) : (
        <div className="bg-black/30 border border-white/10 rounded-xl p-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <span className="text-2xl">📄</span>
            <div>
              <p className="text-white font-medium text-sm">{fileName}</p>
              <p className="text-gray-500 text-xs">
                {data.rows.length} rows | {data.headers.length} columns
              </p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <span className="text-xs text-gray-500">
              Columns: {data.headers.join(", ")}
            </span>
            <button
              onClick={removeFile}
              className="text-sm text-gray-400 hover:text-white transition-colors ml-2"
            >
              Remove
            </button>
          </div>
        </div>
      )}

      {hasFile && (
        <>
          <div>
            <label className="block text-sm font-medium text-gray-300 mb-3">
              Analysis Type
            </label>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
              {analysisTypes.map((type) => (
                <button
                  key={type.id}
                  onClick={() => {
                    setAnalysisType(type.id);
                    setResults(null);
                  }}
                  className={`px-4 py-3 rounded-xl text-sm font-medium transition-all flex flex-col items-center gap-1 ${
                    analysisType === type.id
                      ? "bg-amber-600 text-white border border-amber-500"
                      : "bg-black/30 text-gray-400 border border-white/10 hover:bg-white/10"
                  }`}
                >
                  <span className="text-lg">{type.icon}</span>
                  <span>{type.label}</span>
                </button>
              ))}
            </div>
          </div>

          <button
            onClick={handleAnalyze}
            disabled={loading}
            className="px-6 py-3 bg-gradient-to-r from-amber-600 to-orange-600 hover:from-amber-500 hover:to-orange-500 text-white font-semibold rounded-xl transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
          >
            {loading ? (
              <>
                <svg className="animate-spin h-5 w-5" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                </svg>
                Analyzing...
              </>
            ) : (
              <>
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                </svg>
                Run Analysis
              </>
            )}
          </button>
        </>
      )}

      {results && (
        <div className="animate-fadeInUp bg-black/30 border border-white/10 rounded-xl p-6">
          <h3 className="text-sm font-semibold text-amber-400 uppercase tracking-wider mb-4">
            {analysisType === "summary" && "Summary Statistics"}
            {analysisType === "trends" && "Trend Analysis"}
            {analysisType === "correlation" && "Correlation Matrix"}
            {analysisType === "outliers" && "Outlier Detection"}
          </h3>

          {analysisType === "summary" && (
            <div className="space-y-4">
              <div className="grid grid-cols-3 gap-3 mb-4">
                <div className="bg-white/5 rounded-lg p-3">
                  <p className="text-xs text-gray-500 uppercase mb-1">Total Rows</p>
                  <p className="text-lg font-semibold text-white">{results.totalRows}</p>
                </div>
                <div className="bg-white/5 rounded-lg p-3">
                  <p className="text-xs text-gray-500 uppercase mb-1">Total Columns</p>
                  <p className="text-lg font-semibold text-white">{results.totalColumns}</p>
                </div>
                <div className="bg-white/5 rounded-lg p-3">
                  <p className="text-xs text-gray-500 uppercase mb-1">Numeric Columns</p>
                  <p className="text-lg font-semibold text-white">{results.numericColumns}</p>
                </div>
              </div>
              {Object.entries(results.columnStats).map(([col, stats]) => (
                <div key={col} className="bg-white/5 rounded-lg p-4">
                  <h4 className="text-sm font-semibold text-amber-300 mb-3">{col}</h4>
                  <div className="grid grid-cols-3 sm:grid-cols-7 gap-2">
                    {Object.entries(stats).map(([key, val]) => (
                      <div key={key} className="text-center">
                        <p className="text-[10px] text-gray-500 uppercase">{key}</p>
                        <p className="text-sm font-mono text-white">{val}</p>
                      </div>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          )}

          {analysisType === "trends" && (
            <ul className="space-y-3">
              {results.map((item, i) => (
                <li key={i} className="flex items-start gap-3 text-sm text-gray-300">
                  <span className="text-amber-400 mt-0.5">●</span>
                  <span>{item}</span>
                </li>
              ))}
            </ul>
          )}

          {analysisType === "correlation" && (
            <div className="space-y-3">
              {results.map((item, i) => (
                <div key={i} className="bg-white/5 rounded-lg p-4 flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-white">{item.pair}</p>
                    <p className="text-xs text-gray-400 mt-1">{item.description}</p>
                  </div>
                  <div className={`text-lg font-bold font-mono ${
                    Math.abs(item.coefficient) > 0.7
                      ? "text-green-400"
                      : Math.abs(item.coefficient) > 0.4
                      ? "text-yellow-400"
                      : "text-gray-400"
                  }`}>
                    {item.coefficient}
                  </div>
                </div>
              ))}
            </div>
          )}

          {analysisType === "outliers" && (
            <div className="space-y-3">
              {results.map((item, i) => (
                <div key={i} className="bg-white/5 rounded-lg p-4">
                  <div className="flex items-center justify-between mb-2">
                    <p className="text-sm font-medium text-white">{item.column}</p>
                    <span className={`text-xs px-2 py-1 rounded-full ${
                      item.severity === "high"
                        ? "bg-red-500/20 text-red-400"
                        : item.severity === "medium"
                        ? "bg-yellow-500/20 text-yellow-400"
                        : "bg-green-500/20 text-green-400"
                    }`}>
                      {item.count} outliers
                    </span>
                  </div>
                  {item.message ? (
                    <p className="text-sm text-gray-400">{item.message}</p>
                  ) : (
                    <>
                      <p className="text-xs text-gray-500">
                        Bounds: [{item.bounds.lower}, {item.bounds.upper}]
                      </p>
                      <p className="text-xs text-gray-400 mt-1 font-mono">
                        Values: {item.values.join(", ")}
                      </p>
                    </>
                  )}
                </div>
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  );
}
