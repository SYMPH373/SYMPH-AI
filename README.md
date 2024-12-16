# Blockchain Symphony

An interactive web application that transforms blockchain transactions into musical compositions, built with Next.js.

## Overview

Blockchain Symphony is a unique project that converts blockchain data into musical experiences. It combines blockchain technology with algorithmic music generation to create an immersive audio-visual experience.

## Features

- Real-time blockchain transaction monitoring
- Dynamic music generation based on transaction data
- Interactive visualization of blockchain-music relationships
- Live activity feed of transactions
- Remix mode for user interaction
- Share functionality for created melodies

## Getting Started

First, install the dependencies:

bash
git clone https://github.com/SYMPH373/SYMPH-AI.git


2. Install dependencies:

bash
npm install

3. Run the development server:

bash
npm run dev


## Configuration Notes

### Next.js Configuration
The project uses a custom `next.config.js` that includes:
- ESLint and TypeScript build error handling
- Webpack configurations for Node.js module compatibility
- SWC transforms optimization

### ESLint Configuration
`.eslintrc.json` is configured to handle:
- TypeScript-specific rules
- React Hooks dependencies
- Unused variable checks

## Known Issues

- React 19.0.0 has some peer dependency conflicts with react-reconciler
- Some TypeScript/ESLint configurations may need adjustment for production builds

## Contributing

Contributions are welcome! Please feel free to submit a Pull Request.