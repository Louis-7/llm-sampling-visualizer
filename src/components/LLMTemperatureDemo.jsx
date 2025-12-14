import React, { useState, useMemo } from "react";

const EXAMPLES = {
  math: {
    prompt: "1 + 1 =",
    topTokens: (temperature) => [
      { word: "2", prob: Math.max(0.05, 0.85 - temperature * 0.3) },
      { word: "3", prob: 0.1 + temperature * 0.1 },
      { word: "1", prob: 0.03 + temperature * 0.05 },
      { word: "0", prob: 0.01 + temperature * 0.03 },
      { word: "4", prob: 0.01 + temperature * 0.02 },
      { word: "5", prob: 0.005 + temperature * 0.02 },
      { word: "7", prob: 0.003 + temperature * 0.01 },
      { word: "8", prob: 0.002 + temperature * 0.01 },
      { word: "10", prob: 0.001 + temperature * 0.01 },
      { word: "11", prob: 0.001 + temperature * 0.01 },
    ],
  },
  poem: {
    prompt: "Twinkle twinkle little",
    topTokens: (temperature) => [
      { word: "star", prob: Math.max(0.05, 0.7 - temperature * 0.25) },
      { word: "car", prob: 0.1 + temperature * 0.1 },
      { word: "light", prob: 0.08 + temperature * 0.07 },
      { word: "bar", prob: 0.06 + temperature * 0.08 },
      { word: "bird", prob: 0.05 + temperature * 0.05 },
      { word: "moon", prob: 0.03 + temperature * 0.04 },
      { word: "dream", prob: 0.02 + temperature * 0.04 },
      { word: "kite", prob: 0.01 + temperature * 0.03 },
      { word: "cloud", prob: 0.01 + temperature * 0.03 },
      { word: "sky", prob: 0.01 + temperature * 0.02 },
    ],
  },
  open: {
    prompt: "The secret to success is",
    topTokens: (temperature) => [
      { word: "hard", prob: 0.2 + temperature * 0.15 },
      { word: "luck", prob: 0.18 + temperature * 0.12 },
      { word: "consistency", prob: 0.17 + temperature * 0.1 },
      { word: "discipline", prob: 0.15 + temperature * 0.1 },
      { word: "failure", prob: 0.09 + temperature * 0.1 },
      { word: "passion", prob: 0.07 + temperature * 0.1 },
      { word: "vision", prob: 0.05 + temperature * 0.08 },
      { word: "drive", prob: 0.04 + temperature * 0.05 },
      { word: "money", prob: 0.03 + temperature * 0.03 },
      { word: "grit", prob: 0.02 + temperature * 0.03 },
    ],
  },
};

export default function LLMTemperatureDemo() {
  const [temperature, setTemperature] = useState(1.0);
  const [topP, setTopP] = useState(1.0);
  const [topK, setTopK] = useState(10);
  const [example, setExample] = useState("math");
  const [viewMode, setViewMode] = useState("grid");

  // Get tokens and normalize probabilities
  const rawTokens = EXAMPLES[example].topTokens(temperature);
  const totalProb = rawTokens.reduce((sum, t) => sum + t.prob, 0);
  const normalizedTokens = rawTokens.map(t => ({
    ...t,
    prob: t.prob / totalProb
  }));

  // Apply top-k filtering
  const topKFiltered = normalizedTokens.slice(0, topK);

  // Apply top-p (nucleus) filtering
  const sortedTokens = [...topKFiltered].sort((a, b) => b.prob - a.prob);
  let cumProb = 0;
  const topPFiltered = [];
  for (const token of sortedTokens) {
    cumProb += token.prob;
    topPFiltered.push(token);
    if (cumProb >= topP) break;
  }

  // Renormalize after filtering
  const filteredTotal = topPFiltered.reduce((sum, t) => sum + t.prob, 0);
  const finalTokens = topPFiltered.map(t => ({
    ...t,
    prob: t.prob / filteredTotal
  }));

  const maxProb = Math.max(...finalTokens.map(t => t.prob));

  const getColor = (prob) => {
    const clamped = Math.max(0, Math.min(1, prob));
    return `rgba(34, 197, 94, ${clamped})`;
  };

  return (
    <div className="p-6 space-y-6 max-w-4xl mx-auto bg-white min-h-screen">
      <h1 className="text-2xl font-bold text-gray-900">LLM Temperature & Sampling Visualizer</h1>

      {/* Example Tabs */}
      <div className="space-y-2">
        <label className="text-sm font-medium text-gray-700">Example Type</label>
        <div className="flex space-x-1 bg-gray-100 p-1 rounded-lg">
          {Object.keys(EXAMPLES).map((key) => (
            <button
              key={key}
              onClick={() => setExample(key)}
              className={`px-3 py-1 text-sm font-medium rounded-md transition-colors ${
                example === key
                  ? "bg-white text-gray-900 shadow-sm"
                  : "text-gray-600 hover:text-gray-900"
              }`}
            >
              {key === "math" ? "Math" : key === "poem" ? "Poem" : "Open-ended"}
            </button>
          ))}
        </div>
      </div>

      {/* Controls Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {/* Temperature Slider */}
        <div className="space-y-2">
          <label className="text-sm font-medium text-gray-700">
            Temperature: {temperature.toFixed(2)}
          </label>
          <input
            type="range"
            min="0"
            max="2"
            step="0.01"
            value={temperature}
            onChange={(e) => setTemperature(parseFloat(e.target.value))}
            className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer slider"
          />
          <div className="text-xs text-gray-500">
            Controls randomness
          </div>
        </div>

        {/* Top-p Slider */}
        <div className="space-y-2">
          <label className="text-sm font-medium text-gray-700">
            Top-p (Nucleus): {topP.toFixed(2)}
          </label>
          <input
            type="range"
            min="0"
            max="1"
            step="0.01"
            value={topP}
            onChange={(e) => setTopP(parseFloat(e.target.value))}
            className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer slider"
          />
          <div className="text-xs text-gray-500">
            Cumulative probability threshold
          </div>
        </div>

        {/* Top-k Slider */}
        <div className="space-y-2">
          <label className="text-sm font-medium text-gray-700">
            Top-k: {topK}
          </label>
          <input
            type="range"
            min="1"
            max="10"
            step="1"
            value={topK}
            onChange={(e) => setTopK(parseInt(e.target.value))}
            className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer slider"
          />
          <div className="text-xs text-gray-500">
            Max tokens to consider
          </div>
        </div>
      </div>

      {/* View Mode Toggle */}
      <div className="space-y-2">
        <label className="text-sm font-medium text-gray-700">Visualization Mode</label>
        <div className="flex space-x-1 bg-gray-100 p-1 rounded-lg">
          {["grid", "bar", "line"].map((mode) => (
            <button
              key={mode}
              onClick={() => setViewMode(mode)}
              className={`px-3 py-1 text-sm font-medium rounded-md transition-colors ${
                viewMode === mode
                  ? "bg-white text-gray-900 shadow-sm"
                  : "text-gray-600 hover:text-gray-900"
              }`}
            >
              {mode === "grid" ? "Grid" : mode === "bar" ? "Bar View" : "Probability Axis"}
            </button>
          ))}
        </div>
      </div>

      {/* Results Card */}
      <div className="border border-gray-200 rounded-lg p-4 space-y-4 bg-white shadow-sm">
        <div className="text-xl text-gray-900">
          Prompt: <strong>{EXAMPLES[example].prompt}</strong>
        </div>
        <div className="text-sm text-gray-600">
          Active tokens: {finalTokens.length} (filtered by top-k and top-p)
        </div>

        {/* Grid View */}
        {viewMode === "grid" && (
          <div className="grid grid-cols-2 md:grid-cols-5 gap-2">
            {finalTokens.map((token, i) => (
              <div
                key={`${token.word}-${i}`}
                className="border border-gray-200 p-3 rounded-xl shadow-sm transition-all duration-200 hover:shadow-md"
                style={{ 
                  backgroundColor: `rgba(34, 197, 94, ${token.prob})`,
                  opacity: 0.9 + (token.prob * 0.1)
                }}
              >
                <div className="font-medium text-gray-900">{token.word}</div>
                <div className="text-xs text-gray-600">
                  {(token.prob * 100).toFixed(1)}%
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Bar Chart View */}
        {viewMode === "bar" && (
          <div className="space-y-2">
            {finalTokens.map((token, i) => (
              <div key={`${token.word}-${i}`} className="flex items-center space-x-2">
                <div className="w-20 text-sm font-medium text-gray-700">{token.word}</div>
                <div className="flex-1 bg-gray-200 rounded-full h-8 relative">
                  <div
                    className="h-8 rounded-full transition-all duration-300 flex items-center justify-end pr-2 bg-green-500"
                    style={{ width: `${(token.prob / maxProb) * 100}%` }}
                  >
                    <span className="text-xs text-white font-medium">
                      {(token.prob * 100).toFixed(1)}%
                    </span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Line Plot View - X-Axis Probability Distribution */}
        {viewMode === "line" && (
          <div className="relative bg-gray-50 rounded-lg p-6">
            <div className="mb-8">
              <div className="text-xs text-gray-500 mb-2">Probability Distribution (0% - 100%)</div>
              
              {/* Main axis line */}
              <div className="relative h-12 bg-white border-t-2 border-b-2 border-gray-300 rounded overflow-hidden">
                {/* Percentage markers */}
                <div className="absolute w-full flex justify-between text-xs text-gray-500 -bottom-6">
                  {[0, 25, 50, 75, 100].map((pct) => (
                    <span key={pct}>{pct}%</span>
                  ))}
                </div>
                
                {/* Token markers on the axis */}
                {(() => {
                  let cumulative = 0;
                  return finalTokens.map((token, i) => {
                    const startPos = cumulative;
                    cumulative += token.prob;
                    const width = (token.prob * 100);
                    
                    return (
                      <div
                        key={`${token.word}-${i}`}
                        className="absolute h-full flex items-center justify-center transition-all duration-300"
                        style={{
                          left: `${startPos * 100}%`,
                          width: `${width}%`,
                          backgroundColor: `rgba(34, 197, 94, ${token.prob})`,
                          opacity: 0.9 + (token.prob * 0.1)
                        }}
                      >
                        {width > 8 && (
                          <span className="text-xs font-medium text-gray-900 px-1 truncate">
                            {token.word}
                          </span>
                        )}
                      </div>
                    );
                  });
                })()}
              </div>
            </div>
            
            {/* Legend below */}
            <div className="mt-12 space-y-1">
              {finalTokens.map((token, i) => (
                <div key={`legend-${token.word}-${i}`} className="flex items-center space-x-2 text-sm">
                  <div 
                    className="w-4 h-4 rounded"
                    style={{
                      backgroundColor: `rgba(34, 197, 94, ${token.prob})`,
                      opacity: 0.9 + (token.prob * 0.1)
                    }}
                  ></div>
                  <span className="font-medium text-gray-700">
                    {token.word}
                  </span>
                  <span className="text-gray-500">
                    {(token.prob * 100).toFixed(1)}%
                  </span>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>

      <style jsx>{`
        .slider::-webkit-slider-thumb {
          appearance: none;
          height: 20px;
          width: 20px;
          border-radius: 50%;
          background: #3b82f6;
          cursor: pointer;
          box-shadow: 0 2px 4px rgba(0,0,0,0.2);
        }
        
        .slider::-moz-range-thumb {
          height: 20px;
          width: 20px;
          border-radius: 50%;
          background: #3b82f6;
          cursor: pointer;
          border: none;
          box-shadow: 0 2px 4px rgba(0,0,0,0.2);
        }
      `}</style>
    </div>
  );
}
