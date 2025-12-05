# Cartesia Voice Mixer

A simple single-page application to mix multiple Cartesia voices and create a new voice.

## Features

- Input Cartesia API key
- Select API version
- Add multiple voice IDs with weights
- Mix voices and create a new voice
- Display the resulting voice ID

## Getting Started

### Install Dependencies

```bash
npm install
```

### Run Development Server

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

### Build for Production

```bash
npm run build
npm start
```

## Deploy to Vercel

1. Push your code to GitHub
2. Import your repository in Vercel
3. Vercel will automatically detect Next.js and deploy

Or use the Vercel CLI:

```bash
npm i -g vercel
vercel
```

## API Usage

The app uses two Cartesia APIs:

1. **Mix Voices** (`POST /voices/mix`) - Combines multiple voices with weights to create an embedding
2. **Create Voice** (`POST /voices`) - Creates a new voice from the embedding

The final output is the `voice_id` of the newly created voice.

