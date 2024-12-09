# Fullstack Monorepo

This is a modern fullstack monorepo containing:
- Mobile app (React Native)
- Web app (Next.js)
- Backend API (NestJS)
- Database (PostgreSQL)

## Prerequisites

- Node.js >=18
- Yarn
- Docker (for PostgreSQL)
- iOS/Android development environment for mobile

## Structure

```
.
├── apps
│   ├── mobile        # React Native mobile app
│   ├── web          # Next.js web app
│   └── api          # NestJS backend
├── packages         # Shared packages
│   └── config       # Shared configurations
└── docker          # Docker configurations
```

## Getting Started

1. Install dependencies:
```bash
yarn install
```

2. Start PostgreSQL:
```bash
docker-compose up -d
```

3. Start development servers:
```bash
yarn dev
```

## Development

- Web app: http://localhost:3000
- API: http://localhost:3001
- Mobile: Follow React Native CLI instructions
- PostgreSQL: localhost:5432
