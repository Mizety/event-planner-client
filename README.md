# Event Management Platform Frontend

A modern, responsive frontend for the Event Management Platform built with Next.js 15+, React 19, TypeScript, and Tailwind CSS. Features server-side rendering, optimistic updates, and skeleton-based loading states for a smooth user experience.

## Why Next?

Because it's recommended way to build react.js applications.

## Features

- Server-side rendering with Next.js 15+ App Router
- Real-time updates using Socket.IO (v4.8+)
- Responsive design with Tailwind CSS and typography plugin
- Comprehensive UI component system using shadcn/ui and Radix UI primitives
- JWT-based authentication with context providers
- Advanced image upload with react-dropzone
- Dynamic event filtering and search functionality
- Real-time attendee management
- Skeleton loading states for enhanced UX
- Date handling with date-fns
- TypeScript for type safety
- Modern React patterns with React 19
- Toast notifications for user feedback using shadCN toast

## Project Structure

```
src/
├── app/
│   ├── page.tsx              # Home page
│   ├── layout.tsx            # Root layout
│   ├── globals.css           # Global styles
│   ├── login/
│   │   └── page.tsx         # Login page
│   ├── register/
│   │   └── page.tsx         # Registration page
│   └── events/
│       ├── create/
│       │   └── page.tsx     # Create event page
│       └── [id]/
│           ├── page.tsx     # Event details page
│           └── edit/        # Edit event page
├── components/
│   ├── ui/                  # shadcn/ui components
│   ├── Navbar.tsx          # Navigation component
│   ├── EventList.tsx       # Event listing component
│   ├── EventFilters.tsx    # Event filtering component
│   ├── ImageUploader.tsx   # Image upload component
│   ├── DeleteEventModal.tsx # Event deletion modal
│   └── TrialStatus.tsx     # Trial status component
├── context/
│   ├── AuthContext.tsx     # Authentication context
│   └── SocketContext.tsx   # Socket.IO context
├── hooks/
│   └── use-toast.ts        # Toast notification hook (shadCN)
└── lib/
    └── utils.ts            # Utility functions
```

## Prerequisites

- Node.js (v20 or higher) - LTS
- npm package manager
- Backend service running (event-backend)

## Environment Variables

Create a `.env.local` file in the root directory:

```env
NEXT_PUBLIC_API_URL=http://localhost:3001
```

## Installation

1. Clone the repository:

   ```bash
   git clone <repository-url>
   cd event-management-frontend
   ```

2. Install dependencies:

   ```bash
   npm install
   ```

3. Start the development server:
   ```bash
   npm run dev
   ```

The application will be available at `http://localhost:3000`.

## Components

### UI Components

All UI components are built on top of shadcn/ui and Radix UI primitives, providing a consistent, accessible, and customizable interface.

#### Event Components

`EventList.tsx`

- Displays a list of events
- Implements pagination scrolling
- Handles loading states with skeletons
- Supports filtering and sorting

`EventFilters.tsx`

- Category selection
- Date range picker using react-day-picker / shadCN via calendar component
- Search input
- Sort options

`ImageUploader.tsx`

- Drag and drop functionality with react-dropzone
- Multiple file upload support (select mode: single/multiple)
- Preview capabilities (when uploaded)
- Error handling

#### Authentication Components

`AuthContext.tsx`

```typescript
export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  // Handles authentication state
  // Provides login, register, and logout functions
  // Manages JWT token
  // Implements basic guest login
};
```

#### Real-time Components

`SocketContext.tsx`

```typescript
export const SocketProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  // Manages Socket.IO connection
  // Handles real-time events
  // Provides connection status
};
```

### Loading States

Each component implements a skeleton loading state:

```typescript
// inside page.tsx

function ComponentSkeleton() {
  return <div className={"animate-pulse rounded-md bg-muted"} />;
}
```

### Usage example:

```typescript
{
  isLoading ? <EventDetailsSkeleton /> : <EventDetails event={event} />;
}
```

### Core Components

- `Navbar`: Main navigation component with authentication status and mobile navigation
- `EventList`: Displays events with pagination
- `EventFilters`: Provides filtering and search functionality
- `ImageUploader`: Handles image upload to Cloudinary
- `DeleteEventModal`: Confirmation modal for event deletion
- `TrialStatus`: Displays trial/guest account status as notice

### Context Providers

#### AuthContext

Manages authentication state and provides:

- Login/Logout functionality
- User information
- Authentication status
- Token management
- Guest Login

#### SocketContext

Handles real-time communication:

- Socket.IO connection management
- Real-time event updates
- Attendee list updates

## Pages

### Home Page (`/`)

- Displays featured events
- Provides search and filtering options
- Shows upcoming events

### Authentication Pages

- `/login`: User login
- `/register`: New user registration

### Event Pages

- `/events/create`: Create new event
- `/events/[id]`: Event details and attendance management
- `/events/[id]/edit`: Edit event details

## State Management

### Authentication Context

The application uses React Context for managing authentication state. The `AuthProvider` handles user authentication, token management, and session persistence.

```typescript
interface AuthContextType {
  user: User | null;
  login: (
    email: string,
    password: string
  ) => Promise<null | ValidationResponse>;
  guestLogin: () => Promise<void>;
  register: (
    name: string,
    email: string,
    password: string
  ) => Promise<null | ValidationResponse>;
  logout: () => void;
  isLoading: boolean;
}

// Usage example:
const { user, login, logout, isLoading } = useAuth();
```

#### Features

- JWT token-based authentication
- Persistent sessions with localStorage
- Guest user support
- Validation response handling
- Automatic token refresh
- Loading state management

#### Authentication Flow

1. **Initial Load**

   ```typescript
   useEffect(() => {
     checkUser(); // Checks localStorage for existing token
   }, []);
   ```

2. **Login Process**

   ```typescript
   const login = async (email: string, password: string) => {
     const response = await fetch(`${API_URL}/api/auth/login`, {
       method: "POST",
       body: JSON.stringify({ email, password }),
     });
     // Handle token storage and user state
   };
   ```

3. **Token Management**

   ```typescript
   // Store token
   localStorage.setItem("token", data.token);

   // Remove token on logout
   const logout = () => {
     localStorage.removeItem("token");
     setUser(null);
   };
   ```

### Socket Context

Real-time functionality is managed through the `SocketProvider`, which handles Socket.IO connections and event subscriptions.

```typescript
interface SocketContextType {
  socket: Socket | null;
}

// Usage example:
const { socket } = useSocket();
```

#### Socket Connection Management

```typescript
export function SocketProvider({ children }: { children: React.ReactNode }) {
  const [socket, setSocket] = useState<Socket | null>(null);

  useEffect(() => {
    const socketInstance = io(`${process.env.NEXT_PUBLIC_API_URL}`);
    setSocket(socketInstance);
    return () => {
      socketInstance.close();
    };
  }, []);

  return (
    <SocketContext.Provider value={{ socket }}>
      {children}
    </SocketContext.Provider>
  );
}
```

#### Event Handling Examples

```typescript
// Join event room
socket.emit("joinEvent", eventId);

// Listen for updates
socket.on("eventUpdated", (updatedEvent) => {
  setEvent(updatedEvent);
});

// Cleanup on unmount
useEffect(() => {
  return () => {
    socket.off("eventUpdated");
    socket.emit("leaveEvent", eventId);
  };
}, []);
```

### Validation Error Handling

The application implements comprehensive error handling for validation errors in authentication and other API requests:

```typescript
interface ValidationError {
  field: string;
  message: string;
}

interface ValidationResponse {
  message: string;
  errors: ValidationError[];
}

// Example error handling in login
try {
  const response = await login(email, password);
  if (response?.errors) {
    // Handle validation errors
    // set errors for rendering
  }
} catch (error) {
  // Handle unexpected errors
}
```

### Context Provider Setup

The application wraps the main component tree with both providers:

```typescript
function App({ children }: { children: React.ReactNode }) {
  return (
    <AuthProvider>
      <SocketProvider>{children}</SocketProvider>
    </AuthProvider>
  );
}
```

The application uses React Context for global state management:

- `AuthContext` for user authentication state
- `SocketContext` for real-time updates

## Styling

- Tailwind CSS for utility-first styling
- shadcn/ui for pre-built components
- Custom CSS in `globals.css`

## API Integration

The frontend communicates with the backend through:

- RESTful API endpoints for CRUD operations
- Socket.IO for real-time updates
- Cloudinary for image uploads

## Real-time Features

Socket.IO integration provides:

- Live attendee count updates
- Real-time event modifications
- Instant notifications for event changes

## Building for Production

```bash
npm run build
```

This creates an optimized production build in the `.next` directory.

## Deployment

You can deploy this application to any platform but currently its deployed with CI/CD in netlify.

## Troubleshooting

Common issues and solutions:

1. **Build Errors**

   - Clear `.next` directory
   - Remove `node_modules` and reinstall

2. **API Connection Issues**

   - Verify `NEXT_PUBLIC_API_URL`
   - Check CORS settings

3. **Socket Connection Issues**
   - Verify backend socket server
   - Check connection status in SocketContext

## Contributing

1. Fork the repository
2. Create feature branch
3. Commit changes
4. Push to branch
5. Create Pull Request

## License

This project is licensed under the MIT License.
