# Article Quiz Generator

An AI-powered app that summarizes articles and generates quizzes using Gemini AI. Built with Next.js 15, shadcn/ui, Tailwind CSS, Prisma, PostgreSQL, and Clerk.

## Tech Stack

- **Next.js 15** — App Router, server + client components
- **Clerk** — Authentication (email/password + social login)
- **Gemini 1.5 Flash** — AI summarization and quiz generation
- **Prisma ORM** — Type-safe database access
- **PostgreSQL** — Data storage
- **shadcn/ui** — UI component library
- **Tailwind CSS** — Styling
- **Vercel** — Deployment

## Project Structure

```
quiz-app/
├── app/
│   ├── api/
│   │   ├── articles/route.ts          # GET all articles for user
│   │   ├── generate/route.ts          # POST summarize article
│   │   └── article/[articleId]/
│   │       ├── route.ts               # GET single article
│   │       └── quizzes/route.ts       # POST generate quiz
│   ├── dashboard/page.tsx             # Protected dashboard
│   ├── globals.css
│   └── layout.tsx
├── components/
│   ├── ui/                            # shadcn/ui components
│   ├── article-detail.tsx             # Summary + quiz UI
│   ├── article-form.tsx               # Article input form
│   └── dashboard-layout.tsx           # Sidebar layout
├── lib/
│   ├── gemini.ts                      # Gemini AI helpers
│   ├── prisma.ts                      # Prisma singleton
│   └── utils.ts                       # cn() utility
├── prisma/
│   └── schema.prisma                  # DB schema
├── middleware.ts                      # Clerk route protection
└── .env.example
```

## Setup

### 1. Clone and install dependencies

```bash
git clone <your-repo>
cd quiz-app
npm install
```

### 2. Configure environment variables

```bash
cp .env.example .env.local
```

Fill in `.env.local`:

```env
# Clerk — https://dashboard.clerk.com
NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY=pk_test_...
CLERK_SECRET_KEY=sk_test_...
NEXT_PUBLIC_CLERK_SIGN_IN_URL=/sign-in
NEXT_PUBLIC_CLERK_SIGN_UP_URL=/sign-up
NEXT_PUBLIC_CLERK_AFTER_SIGN_IN_URL=/dashboard
NEXT_PUBLIC_CLERK_AFTER_SIGN_UP_URL=/dashboard

# PostgreSQL
DATABASE_URL="postgresql://postgres:password@localhost:5432/quizapp"

# Gemini — https://aistudio.google.com/app/apikey
GEMINI_API_KEY=AIzaSy...
```

### 3. Set up the database

Make sure PostgreSQL is running, then:

```bash
npm run db:push      # Push schema to database
npm run db:generate  # Generate Prisma client
```

### 4. Install additional required packages

```bash
npm install @radix-ui/react-label @radix-ui/react-separator @radix-ui/react-scroll-area @radix-ui/react-slot tailwindcss-animate
```

### 5. Run development server

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000).

## Deploying to Vercel

1. Push your code to GitHub
2. Import project in [Vercel](https://vercel.com)
3. Add all environment variables from `.env.local`
4. Add a PostgreSQL database (Vercel Postgres or Neon)
5. Deploy

## User Flow

1. **Sign up / Sign in** via Clerk (email or Google)
2. **Paste an article** title and content on the dashboard
3. Click **Generate summary** → Gemini AI creates a concise summary
4. Click **Generate quiz** → Gemini creates 5 multiple-choice questions
5. **Take the quiz** and see your score with correct answers highlighted
6. All articles are saved in the **sidebar history** for revisiting
