# LLM Temperature & Sampling Visualizer

A React-based interactive visualization tool for exploring LLM temperature, top-p (nucleus sampling), and top-k sampling parameters.

## Features

- 🌡️ **Interactive Temperature Control** - Adjust temperature (0-2) to see how it affects token probability distributions
- 📊 **Three Visualization Modes**:
  - Grid view: Colored tiles showing token probabilities
  - Bar chart view: Traditional bar chart visualization
  - Probability axis view: Stacked probability distribution on a number line
- 🎯 **Sampling Strategies**:
  - Temperature scaling
  - Top-k filtering (keep top k tokens)
  - Top-p (nucleus) sampling (keep tokens until cumulative probability ≥ p)
- 📝 **Multiple Examples** - Math, Poetry, and Open-ended prompts with realistic token distributions

## Getting Started

### Prerequisites

- Node.js 18+ and npm

### Installation

1. Clone the repository:
```bash
git clone https://github.com/louis-7/llm-sampling-visualizer.git
cd llm-sampling-visualizer
```

2. Install dependencies:
```bash
npm install
```

3. Start the development server:
```bash
npm run dev
```

The app will be available at `http://localhost:5173`

### Building

Build the project for production:
```bash
npm run build
```

The build output will be in the `dist` directory.

### Deployment

#### Deploy to GitHub Pages (Manual)

Run the deploy script:
```bash
npm run deploy
```

This will build the project and push it to the `gh-pages` branch.

#### Deploy to GitHub Pages (Automatic)

The project includes a GitHub Actions workflow (`.github/workflows/deploy.yml`) that automatically deploys to GitHub Pages when you:
1. Push to the main branch
2. Manually trigger the workflow via GitHub Actions UI

Make sure GitHub Pages is enabled in your repository settings and configured to use the `gh-pages` branch as the source.

## Project Structure

```
llm-sampling-visualizer/
├── src/
│   ├── components/
│   │   └── LLMTemperatureDemo.jsx   # Main visualizer component
│   ├── App.jsx                       # Root app component
│   ├── main.jsx                      # React DOM entry point
│   └── index.css                     # Global styles (Tailwind)
├── .github/
│   └── workflows/
│       └── deploy.yml                # GitHub Actions deployment workflow
├── index.html                        # HTML entry point
├── vite.config.js                    # Vite configuration
├── tailwind.config.js                # Tailwind CSS configuration
├── postcss.config.js                 # PostCSS configuration
├── package.json                      # Dependencies and scripts
└── README.md                         # This file
```

## Technologies Used

- **React 18** - UI framework
- **Vite** - Build tool and dev server
- **Tailwind CSS** - Styling
- **PostCSS & Autoprefixer** - CSS processing

## Understanding the Parameters

### Temperature
- **Range**: 0 to 2
- **Effect**: Controls the randomness of token selection
- **Low (0.1-0.3)**: More deterministic, favors high-probability tokens
- **Medium (0.5-0.8)**: Balanced, good for most use cases
- **High (1.5-2.0)**: More random, more diverse outputs

### Top-p (Nucleus Sampling)
- **Range**: 0 to 1
- **Effect**: Selects smallest set of tokens whose cumulative probability ≥ p
- **Lower values**: More focused, fewer token options
- **Higher values**: More diverse, more token options

### Top-k
- **Range**: 1 to 10
- **Effect**: Only consider the k most likely next tokens
- **Lower values**: More focused predictions
- **Higher values**: More options to choose from

## License

This project is open source and available under the MIT License. See the LICENSE file for details.