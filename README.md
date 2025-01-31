# Workflow Builder

A comprehensive workflow automation platform that enables users to create, optimize, and execute complex workflows through an advanced, AI-powered interface with intelligent suggestion mechanisms.

## Features

- 🔄 **Visual Workflow Builder**: Drag-and-drop interface for creating complex workflows
- 🤖 **AI-Powered Optimization**: Get intelligent suggestions to improve your workflows
- 🔐 **Secure Authentication**: User authentication system with session management
- 📊 **Real-time Updates**: WebSocket integration for live workflow execution updates
- 🎯 **Node-based Design**: Modular workflow components for maximum flexibility
- 🛠️ **Error Recovery**: Robust error handling with user-friendly suggestions

## Tech Stack

- **Frontend**: React + TypeScript
  - Wouter for routing
  - TanStack Query for data management
  - ReactFlow for workflow visualization
  - Shadcn UI components
  - Tailwind CSS for styling

- **Backend**: Node.js + Express
  - PostgreSQL with Drizzle ORM
  - WebSocket for real-time updates
  - OpenAI integration for workflow suggestions
  - Passport.js for authentication

## Getting Started

### Prerequisites

- Node.js (v18 or later)
- PostgreSQL database
- OpenAI API key (for AI suggestions)

### Environment Variables

Create a `.env` file with the following variables:

```env
DATABASE_URL=postgresql://user:password@localhost:5432/workflow_builder
OPENAI_API_KEY=your_openai_api_key
```

### Installation

1. Clone the repository:
```bash
git clone https://github.com/KubeKite/workflow-builder.git
cd workflow-builder
```

2. Install dependencies:
```bash
npm install
```

3. Push database schema:
```bash
npm run db:push
```

4. Start the development server:
```bash
npm run dev
```

The application will be available at `http://localhost:5000`.

## Usage

1. **Authentication**
   - Register a new account or login with existing credentials
   - All workflows are associated with your account

2. **Creating Workflows**
   - Click "New Workflow" to start building
   - Drag nodes from the left panel onto the canvas
   - Connect nodes to create workflow logic
   - Configure each node's properties as needed

3. **Node Types**
   - **Triggers**: Schedule, Webhook, File Watch
   - **Actions**: Send Email, Database Query, File Operations, HTTP Request
   - **Logic**: Conditions, Transformations, Delays

4. **AI Suggestions**
   - Click the lightbulb icon to view optimization suggestions
   - Suggestions cover performance, reliability, security, and design
   - Implement suggestions to improve workflow efficiency

## Project Structure

```
├── client/                 # Frontend React application
│   ├── src/
│   │   ├── components/    # Reusable React components
│   │   ├── hooks/        # Custom React hooks
│   │   ├── pages/        # Page components
│   │   └── lib/          # Utility functions
├── server/                # Backend Express application
│   ├── services/         # Business logic services
│   ├── auth.ts          # Authentication setup
│   └── workflows.ts     # Workflow routes and logic
└── db/                   # Database configuration and schema
```

## Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add some amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## License

This project is licensed under the MIT License - see the LICENSE file for details.
