"use client";

import { useState } from "react";
import { evaluate, simplify, parse } from "mathjs";

const mathSymbols = [
  "+", "-", "×", "÷", "=", "^", "√", "π", "∞",
  "(", ")", "[", "]", ".", ",", "sin", "cos", "tan",
  "log", "ln", "e", "!",
];

function trySolve(expression) {
  const steps = [];
  let cleanExpr = expression
    .replace(/×/g, "*")
    .replace(/÷/g, "/")
    .replace(/²/g, "^2")
    .replace(/³/g, "^3")
    .replace(/π/g, "pi");

  const hasEquals = cleanExpr.includes("=");
  let lhs, rhs;

  if (hasEquals) {
    const parts = cleanExpr.split("=");
    lhs = parts[0].trim();
    rhs = parts[1].trim();
  } else {
    lhs = cleanExpr;
    rhs = null;
  }

  steps.push({
    title: "Step 1: Parse the expression",
    detail: `The expression is: ${expression}`,
  });

  try {
    const node = parse(lhs);
    steps.push({
      title: "Step 2: Identify operations",
      detail: `Recognized: ${node.toString()}`,
    });
  } catch {
    steps.push({
      title: "Step 2: Identify operations",
      detail: "Analyzing the mathematical structure...",
    });
  }

  if (hasEquals && rhs) {
    try {
      const rhsVal = evaluate(rhs);
      steps.push({
        title: "Step 3: Evaluate right side",
        detail: `Right side evaluates to: ${rhsVal}`,
      });

      try {
        const simplified = simplify(lhs);
        steps.push({
          title: "Step 4: Simplify left side",
          detail: `Simplified form: ${simplified.toString()}`,
        });
      } catch {
        // skip simplification
      }

      try {
        const solution = evaluate(lhs, { x: rhsVal });
        steps.push({
          title: "Step 5: Evaluate",
          detail: `Substituting and evaluating: ${solution}`,
        });
      } catch {
        // skip
      }
    } catch {
      // skip
    }
  }

  try {
    let result;
    if (hasEquals && rhs) {
      const rhsVal = evaluate(rhs);
      try {
        result = simplify(`${lhs} - (${rhs})`);
        steps.push({
          title: "Step 4: Rearrange equation",
          detail: `Move all terms to one side: ${result.toString()} = 0`,
        });
      } catch {
        // skip
      }
    }

    const evaluated = evaluate(cleanExpr);
    steps.push({
      title: `Step ${steps.length + 1}: Evaluate`,
      detail: `Computing the result...`,
      isAnswer: false,
    });

    steps.push({
      title: `Step ${steps.length + 1}: Final result`,
      detail: `Result = ${typeof evaluated === "number" ? parseFloat(evaluated.toPrecision(10)) : evaluated.toString()}`,
      isAnswer: true,
    });

    return {
      steps,
      answer: typeof evaluated === "number"
        ? parseFloat(evaluated.toPrecision(10))
        : evaluated.toString(),
    };
  } catch (evalErr) {
    steps.push({
      title: `Step ${steps.length + 1}: Final result`,
      detail: `Unable to evaluate. Please check syntax: ${evalErr.message}`,
      isError: true,
    });
    return { steps, answer: "Error" };
  }
}

export default function MathSolver({ agent }) {
  const [equation, setEquation] = useState("");
  const [solution, setSolution] = useState(null);
  const [loading, setLoading] = useState(false);
  const [history, setHistory] = useState([]);

  function insertSymbol(symbol) {
    setEquation((prev) => prev + symbol);
  }

  function handleClear() {
    setEquation("");
    setSolution(null);
  }

  function handleBackspace() {
    setEquation((prev) => prev.slice(0, -1));
  }

  async function handleSolve() {
    if (!equation.trim()) return;
    setLoading(true);
    setSolution(null);

    await new Promise((r) => setTimeout(r, 600));

    const result = trySolve(equation);
    setSolution(result);
    setHistory((prev) => [
      { expr: equation, answer: result.answer },
      ...prev.slice(0, 9),
    ]);
    setLoading(false);
  }

  function handleKeyDown(e) {
    if (e.key === "Enter") {
      e.preventDefault();
      handleSolve();
    }
  }

  function loadFromHistory(expr) {
    setEquation(expr);
    setSolution(null);
  }

  return (
    <div className="space-y-6">
      <div>
        <label className="block text-sm font-medium text-gray-300 mb-2">
          Enter Equation
        </label>
        <div
          className="bg-black/30 border border-white/10 rounded-xl p-4"
          onClick={() => document.getElementById("math-input")?.focus()}
        >
          <input
            id="math-input"
            type="text"
            value={equation}
            onChange={(e) => setEquation(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder="Type your equation here... (e.g., 2^2 + 3*4)"
            className="w-full bg-transparent text-white text-lg font-mono placeholder-gray-500 focus:outline-none"
          />
        </div>
      </div>

      <div className="bg-black/30 border border-white/10 rounded-xl p-3">
        <div className="flex flex-wrap gap-1.5">
          {mathSymbols.map((sym) => (
            <button
              key={sym}
              onClick={() => insertSymbol(sym)}
              className="px-2.5 h-9 rounded-lg bg-white/5 hover:bg-white/15 border border-white/10 text-gray-300 font-mono text-sm transition-all hover:border-red-500/30"
            >
              {sym}
            </button>
          ))}
        </div>
      </div>

      <div className="flex items-center gap-3">
        <button
          onClick={handleSolve}
          disabled={loading || !equation.trim()}
          className="px-6 py-3 bg-gradient-to-r from-red-600 to-rose-600 hover:from-red-500 hover:to-rose-500 text-white font-semibold rounded-xl transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
        >
          {loading ? (
            <>
              <svg className="animate-spin h-5 w-5" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
              </svg>
              Solving...
            </>
          ) : (
            <>
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 7h6m0 10v-3m-3 3h.01M9 17h.01M9 14h.01M12 14h.01M15 11h.01M12 11h.01M9 11h.01M7 21h10a2 2 0 002-2V5a2 2 0 00-2-2H7a2 2 0 00-2 2v14a2 2 0 002 2z" />
              </svg>
              Solve
            </>
          )}
        </button>

        <button
          onClick={handleClear}
          className="px-4 py-3 bg-white/5 hover:bg-white/10 border border-white/10 rounded-xl text-gray-400 transition-all"
        >
          Clear
        </button>

        <button
          onClick={handleBackspace}
          className="px-4 py-3 bg-white/5 hover:bg-white/10 border border-white/10 rounded-xl text-gray-400 transition-all"
        >
          ⌫
        </button>
      </div>

      {solution && (
        <div className="animate-fadeInUp bg-black/30 border border-red-500/20 rounded-xl p-6">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-sm font-semibold text-red-400 uppercase tracking-wider">
              Step-by-Step Solution
            </h3>
            {solution.answer !== "Error" && (
              <div className="bg-red-500/10 border border-red-500/30 rounded-lg px-4 py-2">
                <span className="text-xs text-gray-400 mr-2">Answer:</span>
                <span className="text-lg font-bold text-white font-mono">
                  {solution.answer}
                </span>
              </div>
            )}
          </div>
          <div className="space-y-3">
            {solution.steps.map((step, i) => (
              <div
                key={i}
                className={`p-4 rounded-lg ${
                  step.isAnswer
                    ? "bg-green-500/10 border border-green-500/30"
                    : step.isError
                    ? "bg-red-500/10 border border-red-500/30"
                    : "bg-white/5 border border-white/10"
                }`}
              >
                <p
                  className={`text-sm font-semibold mb-1 ${
                    step.isAnswer
                      ? "text-green-400"
                      : step.isError
                      ? "text-red-400"
                      : "text-red-400"
                  }`}
                >
                  {step.title}
                </p>
                <p className="text-sm text-gray-300 font-mono">
                  {step.detail}
                </p>
              </div>
            ))}
          </div>
        </div>
      )}

      {history.length > 0 && (
        <div className="bg-black/30 border border-white/10 rounded-xl p-4">
          <h3 className="text-sm font-semibold text-gray-400 uppercase tracking-wider mb-3">
            Recent Calculations
          </h3>
          <div className="space-y-2">
            {history.map((h, i) => (
              <button
                key={i}
                onClick={() => loadFromHistory(h.expr)}
                className="w-full flex items-center justify-between px-3 py-2 rounded-lg bg-white/5 hover:bg-white/10 border border-white/5 transition-colors text-left"
              >
                <span className="text-sm text-gray-300 font-mono">
                  {h.expr}
                </span>
                <span className="text-sm text-red-400 font-mono font-bold">
                  = {h.answer}
                </span>
              </button>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
