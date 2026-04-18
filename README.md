# Suno Beats Studio

A professional-grade, minimalist sanctuary for sculpting instrumental sketches. Powered by Next.js and high-fidelity generative audio engines.

## 🎚️ Overview

Suno Beats is a boutique web application designed for producers and creators who need high-quality instrumental foundations. By strictly focusing on rhythm, atmosphere, and melody, it provides a quiet, focused environment for audio generation.

## ✨ Features

- **Dual Generation Flows**: Switch between "Quick Idea" for rapid prototyping and "Custom Control" for precise style blocks.
- **Engine Selection**: Support for multiple Suno models (V4.5, V5, etc.) with real-time feedback.
- **Real-time Polishing**: A "live" status engine that updates incrementally as the generation progresses.
- **Webhook Verifier**: Integrated support for verified delivery snapshots, ensuring the freshest audio links.
- **Premium Aesthetics**: A custom-crafted UI using Glassmorphism, Inter typography, and Instrument Serif accents.
- **Production Hardened**: Modular architecture with specialized hooks, utility-first UI logic, and shared state management.

## 🛠️ Tech Stack

- **Framework**: [Next.js 16](https://nextjs.org/) (App Router)
- **Styling**: [Tailwind CSS 4](https://tailwindcss.com/) with custom Glassmorphism utilities.
- **Typography**: Inter (Sans) & Instrument Serif (Italic).
- **Validation**: [Zod](https://zod.dev/) for robust schema verification.
- **Infrastructure**: Configurable storage (Upstash Redis or In-memory) for webhook snapshots.

## 🏗️ Architecture

The project follows a "Cohesion & Verbs" principle:
- **Hooks**: Logic is centralized in [useBeatStatus](src/hooks/use-beat-status.ts) for clean state management.
- **Components**: UI is broken down into modular, single-purpose units.
- **Verby Functions**: Internal logic is named clearly (e.g., `handleGenerate`, `getStatusLabel`) for maximum maintainability.
- **Single Source of Truth**: Shared constants for models and UI labels prevent divergence.

## 🚀 Getting Started

### 1. Environment Configuration

Clone `.env.example` to `.env.local` and provide your Suno API credentials:

```bash
SUNO_API_KEY=your_api_key_here
SUNO_CALLBACK_URL=https://your-app.com/api/webhooks/suno?token=your_random_token
SUNO_WEBHOOK_SECRET=your_random_token
```

*Note: For production delivery, Upstash Redis is recommended to avoid webhook data loss.*

### 2. Install & Run

```bash
npm install
npm run dev
```

Visit `http://localhost:3000` to start orchestrating.

## 📄 License

Internal use only for Suno Beats Studio.
