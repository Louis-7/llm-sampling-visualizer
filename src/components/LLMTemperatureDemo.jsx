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
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold text-gray-900">LLM Temperature & Sampling Visualizer</h1>
        <a
          href="https://github.com/Louis-7/llm-sampling-visualizer"
          target="_blank"
          rel="noopener noreferrer"
          aria-label="Open GitHub repository"
          className="text-gray-500 hover:text-gray-900 transition-colors"
          title="GitHub repository"
        >
          {/* GitHub icon (Octocat) */}
          <svg
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 24 24"
            fill="currentColor"
            aria-hidden="true"
            className="w-6 h-6"
          >
            <path d="M12 2C6.48 2 2 6.58 2 12.26c0 4.52 2.87 8.36 6.84 9.72.5.1.68-.22.68-.49 0-.24-.01-.88-.01-1.73-2.78.61-3.37-1.2-3.37-1.2-.46-1.21-1.12-1.53-1.12-1.53-.92-.64.07-.63.07-.63 1.02.07 1.56 1.07 1.56 1.07.9 1.58 2.37 1.12 2.95.86.09-.67.35-1.12.63-1.38-2.22-.26-4.56-1.13-4.56-5.04 0-1.11.39-2.02 1.03-2.73-.1-.26-.45-1.32.1-2.75 0 0 .84-.27 2.75 1.05.8-.23 1.66-.35 2.51-.36.85.01 1.71.13 2.51.36 1.9-1.32 2.75-1.05 2.75-1.05.55 1.43.2 2.49.1 2.75.64.71 1.03 1.62 1.03 2.73 0 3.92-2.35 4.77-4.58 5.03.36.32.68.94.68 1.9 0 1.37-.01 2.48-.01 2.82 0 .27.18.6.69.49A10.03 10.03 0 0 0 22 12.26C22 6.58 17.52 2 12 2Z"/>
          </svg>
        </a>
      </div>

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
            <div className="mb-12">
              <div className="text-xs text-gray-500 mb-2">Probability Distribution (0% - 100%)</div>
              
              {/* Main bar plot */}
              <div className="relative h-12 bg-white border border-gray-300 rounded">
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
              
              {/* Ruler below the bar plot */}
              <div className="relative mt-2 h-6">
                {/* Ruler base line */}
                <div className="absolute w-full h-px bg-gray-300 top-0"></div>
                
                {/* Major tick marks at 10% intervals */}
                {[0, 10, 20, 30, 40, 50, 60, 70, 80, 90, 100].map((pct) => (
                  <div
                    key={pct}
                    className="absolute"
                    style={{ left: `${pct}%`, top: 0 }}
                  >
                    {/* Tick mark */}
                    <div className="absolute w-px h-3 bg-gray-400" style={{ left: 0 }}></div>
                    
                    {/* Percentage label */}
                    <div className="absolute text-xs text-gray-500" style={{
                      top: '14px',
                      left: '50%',
                      transform: 'translateX(-50%)',
                      whiteSpace: 'nowrap'
                    }}>
                      {pct}%
                    </div>
                  </div>
                ))}
                
                {/* Minor tick marks at 5% intervals */}
                {[5, 15, 25, 35, 45, 55, 65, 75, 85, 95].map((pct) => (
                  <div
                    key={`minor-${pct}`}
                    className="absolute"
                    style={{ left: `${pct}%`, top: 0 }}
                  >
                    <div className="absolute w-px h-2 bg-gray-300" style={{ left: 0 }}></div>
                  </div>
                ))}
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
