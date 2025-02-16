# RoundCall Frontend

RoundCall is a modern web application built for HackMETU 2025, designed to provide an interactive platform for trainers and trainees to engage in effective learning experiences.

## 🚀 Features

- **Authentication & Authorization**

  - Secure user authentication with Supabase
  - Role-based access control (Admin, Trainer, Trainee)
  - Protected routes and API endpoints

- **Dashboard Interface**

  - Intuitive dashboard for managing lessons and trainees
  - Real-time analytics and progress tracking
  - Responsive design for all devices

- **Lesson Management**

  - Create and edit interactive lessons
  - Assign lessons to trainees
  - Track lesson completion and performance
  - Rich text editor for lesson content

- **Practice Sessions**

  - Interactive practice environments
  - Real-time feedback
  - Progress tracking
  - Performance analytics

- **User Management**
  - User profile management
  - Role assignment
  - Activity tracking
  - User analytics

## 🛠️ Tech Stack

- **Framework**: Next.js 15 (App Router)
- **Language**: TypeScript
- **Styling**:
  - Tailwind CSS
  - Shadcn UI (Radix UI)
  - CSS Modules
- **State Management**:
  - Zustand
  - TanStack Query
- **Form Handling**:
  - React Hook Form
  - Zod Validation
- **API Integration**: TanStack Query
- **Development Tools**:
  - ESLint
  - Prettier
  - Husky
  - TypeScript

## 📦 Installation

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

## 🏗️ Project Structure

```
src/
├── app/                    # Next.js app directory
│   ├── (auth)/            # Authentication routes
│   ├── dashboard/         # Dashboard routes
│   └── layout.tsx         # Root layout
├── components/            # Reusable components
├── hooks/                # Custom React hooks
├── lib/                  # Utilities and services
│   ├── services/         # API services
│   ├── store/           # State management
│   ├── utils/           # Helper functions
│   └── validations/     # Schema validations
└── middleware.ts         # Next.js middleware
```

## 🔐 Authentication

The application uses Supabase for authentication with the following features:

- Email/Password authentication
- JWT token management
- Protected routes
- Role-based access control

## 🎨 UI Components

Built with Shadcn UI, the application includes:

- Customizable UI components
- Responsive design
- Dark/Light theme support
- Accessible components

## 🔄 State Management

- **Global State**: Zustand for app-wide state
- **Server State**: TanStack Query for API data
- **Form State**: React Hook Form with Zod
- **Local State**: React's useState and useReducer

## 📱 Responsive Design

- Mobile-first approach
- Breakpoint system:
  - sm: 640px
  - md: 768px
  - lg: 1024px
  - xl: 1280px
  - 2xl: 1536px

## 🧪 Testing

- Unit tests with Jest
- Component testing with React Testing Library
- E2E testing with Playwright
- API integration tests

## 📚 Documentation

Comprehensive documentation is available in the `front-docs` directory:

- [Getting Started](./front-docs/getting-started.md)
- [Architecture](./front-docs/architecture.md)
- [Components](./front-docs/components.md)
- [API Integration](./front-docs/api-integration.md)
- [State Management](./front-docs/state-management.md)
- [Styling Guide](./front-docs/styling.md)

## 🚀 Deployment

The application can be deployed to various platforms:

- Vercel (recommended)
- Netlify
- Self-hosted

## 🤝 Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add some amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## 📄 License

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
