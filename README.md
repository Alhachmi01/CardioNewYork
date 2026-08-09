# GuideVexa V1

GuideVexa is a mobile-first Next.js site for practical tools and concise guides.

## Routes

- `/` — Homepage
- `/tools` — Tool directory
- `/guides` — SEO guide index
- `/tools/[slug]` — Dynamic micro-tool pages
- `/about`
- `/privacy`
- `/terms`

## Included tools

- Travel Budget Planner
- Trip Packing Checklist
- Percentage Calculator
- Unit Converter

## Run locally

```bash
npm install
npm run dev
```

## Deploy to Vercel

Import the GitHub repository into Vercel. After deployment, add `guidevexa.com` under Project Settings → Domains and configure the DNS records Vercel provides in Spaceship.

## Monetization

V1 intentionally does not contain an OGAds locker. Validate traffic and user behaviour first. A later version can place a compliant content locker on a real value action such as an enhanced export or downloadable resource.
