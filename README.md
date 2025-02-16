# 📞 RoundCall

<div align="center">
  <p><strong>Next-Generation Call Center Training Platform</strong></p>
  <p>
    <a href="https://nextjs.org">
      <img src="https://img.shields.io/badge/Next.js-14-black?style=for-the-badge" alt="Next.js" />
    </a>
    <a href="https://www.typescriptlang.org">
      <img src="https://img.shields.io/badge/TypeScript-5.2-blue?style=for-the-badge" alt="TypeScript" />
    </a>
    <a href="https://tailwindcss.com">
      <img src="https://img.shields.io/badge/Tailwind-3.4-38bdf8?style=for-the-badge" alt="Tailwind CSS" />
    </a>
  </p>
</div>

## 🌟 Overview

RoundCall is an innovative call center training platform built for HackMETU 2025. It revolutionizes how call centers train their agents by providing interactive learning experiences, real-time feedback, and comprehensive performance analytics.

### 🎯 Key Features

#### 🔐 Authentication & Role Management

- Secure authentication with Supabase
- Role-based access control (Admin, Trainer, Trainee)
- Protected routes and API endpoints
- Secure session management

#### 📊 Interactive Dashboard

- Real-time performance metrics
- Progress tracking
- Customizable learning paths
- Analytics visualization

#### 📚 Training Management

- Interactive lesson creation
- Rich content editor
- Video integration
- Progress tracking
- Performance assessment

#### 🤖 AI-Powered Practice

- Simulated customer interactions
- Real-time feedback
- Voice analysis
- Sentiment detection
- Performance scoring

#### 📈 Analytics & Reporting

- Detailed performance metrics
- Progress tracking
- Custom report generation
- Team analytics
- Improvement suggestions

## 🛠️ Technology Stack

### Frontend

- **Framework**: Next.js 15 (App Router)
- **Language**: TypeScript
- **Styling**:
  - Tailwind CSS
  - Shadcn UI (Radix UI)
  - CSS Modules
- **State Management**:
  - Zustand (Global state)
  - TanStack Query (Server state)
- **Form Handling**:
  - React Hook Form
  - Zod Validation

### Backend

- **Database**: Supabase
- **Authentication**: Supabase Auth
- **API**: REST + tRPC
- **Storage**: Supabase Storage

## 🚀 Getting Started

### Prerequisites

- Node.js 18.x or higher
- pnpm 8.x or higher
- Git

### Installation

1. Clone the repository:

```bash
git clone https://github.com/byigitt/roundcall-frontend.git
cd roundcall-frontend
```

2. Install dependencies:

```bash
pnpm install
```

3. Set up environment variables:

```bash
cp .env.example .env.local
```

4. Update `.env.local` with your configuration:

```env
NEXT_PUBLIC_API_URL=your_api_url
```

5. Start the development server:

```bash
pnpm dev
```

Visit [http://localhost:3000](http://localhost:3000) to see the application.

## 📖 Documentation

Comprehensive documentation is available in the `front-docs` directory:

- [Getting Started](./front-docs/getting-started.md)
- [Architecture](./front-docs/architecture.md)
- [Components](./front-docs/components.md)
- [API Integration](./front-docs/api-integration.md)
- [State Management](./front-docs/state-management.md)
- [Styling Guide](./front-docs/styling.md)

## 🧪 Testing

- Unit tests with Jest
- Component testing with React Testing Library
- E2E testing with Playwright
- API integration tests

Run tests:

```bash
pnpm test        # Run unit tests
pnpm test:e2e    # Run E2E tests
pnpm test:ci     # Run all tests
```

## 🚀 Deployment

The application can be deployed to:

- [Vercel](https://vercel.com) (recommended)
- [Netlify](https://netlify.com)
- Self-hosted

## 🤝 Contributing

1. Fork the repository
2. Create your feature branch:

```bash
git checkout -b feature/amazing-feature
```

3. Commit your changes:

```bash
git commit -m 'Add amazing feature'
```

4. Push to the branch:

```bash
git push origin feature/amazing-feature
```

5. Open a Pull Request

## 📝 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 👥 Team

- [Barış Cem Bayburtlu](https://github.com/byigitt) - Full Stack Developer
- [Mehmet Ali Selvet](https://github.com/phu333) - Full Stack Developer

## 🙏 Acknowledgments

- [Next.js](https://nextjs.org/)
- [Tailwind CSS](https://tailwindcss.com/)
- [Shadcn UI](https://ui.shadcn.com/)
- [TanStack Query](https://tanstack.com/query/latest)
- [Zustand](https://zustand-demo.pmnd.rs/)
