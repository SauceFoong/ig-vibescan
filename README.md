# VibeScan - Instagram Personality Analyzer

Analyze any public Instagram profile to discover personality traits, interests, and MBTI type based on their photos.

## Features

- Input any public Instagram username
- Select a date range (year) to filter posts
- Scrapes up to 20 posts from the profile
- AI-powered analysis using OpenAI GPT-4o-mini vision
- Displays:
  - Personality traits
  - Interests and hobbies
  - MBTI type with explanation
  - Overall personality summary

## Tech Stack

- **Framework:** Next.js 16 (App Router)
- **Styling:** Tailwind CSS + shadcn/ui
- **Instagram Scraping:** Apify (`louisdeconinck/instagram-profile-posts-scraper`)
- **AI Analysis:** OpenAI GPT-4o-mini (vision capabilities)

## Getting Started

### Prerequisites

- Node.js 18+
- npm
- Apify account and API token
- OpenAI API key

### Installation

1. Clone the repository:

```bash
git clone <your-repo-url>
cd ig-vibescan
```

2. Install dependencies:

```bash
npm install
```

3. Create a `.env.local` file with your API keys:

```bash
cp .env.example .env.local
```

4. Edit `.env.local` and add your API keys:

```
APIFY_TOKEN=your_apify_token_here
OPENAI_API_KEY=your_openai_api_key_here
```

5. Run the development server:

```bash
npm run dev
```

6. Open [http://localhost:3000](http://localhost:3000) in your browser.

## Usage

1. Enter a public Instagram username (with or without @)
2. Select the date range (start year and end year)
3. Click "Analyze Profile"
4. Wait for the scraping and analysis to complete
5. View the personality analysis results

## Cost Considerations

- **Apify:** ~$1.90 per 1000 posts scraped
- **OpenAI GPT-4o-mini:** ~$0.15 per 1M input tokens
- Maximum 20 posts per scan to control costs (~$0.04 per scan for Apify)

## Project Structure

```
ig-vibescan/
├── src/
│   ├── app/
│   │   ├── page.tsx              # Home page with input form
│   │   ├── results/
│   │   │   └── page.tsx          # Results display page
│   │   ├── api/
│   │   │   ├── scrape/route.ts   # Apify scraping endpoint
│   │   │   └── analyze/route.ts  # OpenAI analysis endpoint
│   │   ├── layout.tsx
│   │   └── globals.css
│   ├── components/
│   │   ├── ui/                   # shadcn components
│   │   ├── username-form.tsx
│   │   ├── analysis-results.tsx
│   │   ├── loading-state.tsx
│   │   └── error-display.tsx
│   ├── lib/
│   │   ├── apify.ts              # Apify client helper
│   │   ├── openai.ts             # OpenAI client helper
│   │   └── utils.ts
│   └── types/
│       └── index.ts              # TypeScript types
├── .env.example
├── package.json
└── tailwind.config.ts
```

## License

MIT
