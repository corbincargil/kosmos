import { Note } from "@/types/note";

export const dummyNotes: Note[] = [
  {
    id: 6,
    title: "System Architecture Documentation",
    content: `# Complete System Architecture Overview
      
## 1. Frontend Architecture
### Technology Stack
- Next.js 14 with App Router
- React Server Components
- TailwindCSS
- TypeScript
- ShadcnUI Components
      
### State Management
- React Context for global state
- React Query for server state
- Zustand for complex state
- Local Storage for persistence
      
## 2. Backend Services
### Main API Server
- Node.js with Express
- PostgreSQL database
- Redis caching layer
- GraphQL API endpoint
      
   ### Authentication Service
    - JWT implementation
    - OAuth2 integration
    - Role-based access control
    - Session management
      
    ### Media Processing
    - Image optimization pipeline
    - Video transcoding service
    - CDN integration
    - Storage management
      
    ## 3. Infrastructure
    ### Cloud Services (AWS)
    - EC2 for application hosting
    - RDS for database
    - S3 for file storage
    - CloudFront for CDN
    - Route53 for DNS
    - ELB for load balancing
      
    ### Monitoring & Logging
    - Prometheus metrics
    - Grafana dashboards
    - ELK stack integration
    - Error tracking with Sentry
      
## 4. Security Measures
### Implementation Details
\`\`\`typescript
interface SecurityConfig {
        rateLimit: {
          windowMs: 15 * 60 * 1000,
          max: 100
        },
        helmet: {
          contentSecurityPolicy: true,
          crossOriginEmbedderPolicy: true
        },
        cors: {
          origin: ['trusted-domain.com'],
          methods: ['GET', 'POST']
        }
      }
\`\`\`
      
## 5. Deployment Pipeline
### CI/CD Configuration
- GitHub Actions workflow
- Automated testing
- Docker containerization
- K8s orchestration
      
    ### Environment Management
    - Development
    - Staging
    - Production
    - Disaster Recovery
      
    ## 6. Performance Optimization
    ### Frontend
    - Code splitting
    - Lazy loading
    - Image optimization
    - Cache strategies
      
    ### Backend
    - Query optimization
    - Connection pooling
    - Microservices architecture
    - Load balancing
      
    ## 7. Scaling Strategy
    ### Horizontal Scaling
    - Auto-scaling groups
    - Container orchestration
    - Database sharding
    - Cache distribution
      
    ### Vertical Scaling
    - Resource optimization
    - Performance monitoring
    - Capacity planning
    - Cost analysis
      
    ## 8. Backup & Recovery
    ### Backup Strategy
    - Daily automated backups
    - Point-in-time recovery
    - Cross-region replication
    - Backup validation
      
    ### Disaster Recovery
    - Failover procedures
    - Data consistency checks
    - Recovery time objectives
    - Business continuity plan`,
    createdAt: new Date("2024-09-28"),
    updatedAt: new Date("2024-09-28"),
    workspaceId: 1,
    userId: 1,
  },
  {
    id: 0,
    title: "🚀 New Notes Feature",
    content: `# Notes notes
## To-do's
- Add max height to cards
    - Probably not scrollable
- Add note detail view
    - Should be able to show in modal or page
    - Use intercepted routes
- See about improving list view
  `,
    createdAt: new Date("2024-10-15"),
    updatedAt: new Date("2024-10-15"),
    workspaceId: 1,
    userId: 1,
  },
  {
    id: 1,
    title: "Meeting Notes",
    content: `# Project Meeting
  ## Action Items
  - Set up weekly check-ins
  - Review design mockups
  - Plan next sprint
  
  **Important Deadlines:**
  * MVP by end of month
  * Beta testing starts next week`,
    createdAt: new Date("2024-10-12"),
    updatedAt: new Date("2024-10-12"),
    workspaceId: 1,
    userId: 1,
  },
  {
    id: 2,
    title: "Ideas for New Features",
    content: `### Feature Roadmap
  
  1. Dark mode support
     * Toggle in settings
     * System preference detection
  2. Mobile responsive design
     * Tablet optimization
     * Touch gestures
  3. Calendar Integration
     * Google Calendar sync
     * Event reminders
  
  \`\`\`
  Priority: High
  Status: Planning
  \`\`\``,
    createdAt: new Date("2024-10-10"),
    updatedAt: new Date("2024-10-10"),
    workspaceId: 1,
    userId: 1,
  },
  {
    id: 3,
    title: "Daily Reflections",
    content: `#### Today's Achievements
  
  - ~~Completed main navigation~~ ✅
  - ~~Set up authentication system~~ ✅
  
  **Tomorrow's Goals:**
  * [ ] Start API integration
  * [ ] Write documentation
  
  > Remember to update the team on progress`,
    createdAt: new Date("2024-10-08"),
    updatedAt: new Date("2024-10-08"),
    workspaceId: 1,
    userId: 1,
  },
  {
    id: 4,
    title: "Research: AI Implementation Strategies",
    content: `# Artificial Intelligence Integration Research
  
  ## 1. Machine Learning Models
  ### Potential Applications
  - User behavior prediction
  - Content recommendation engine
  - Automated categorization
  - Natural language processing for search
  
  ### Technical Requirements
  * TensorFlow or PyTorch integration
  * GPU acceleration support
  * Model versioning system
  * Training pipeline setup
  
  ## 2. Data Collection & Processing
  - User interaction patterns
  - Content engagement metrics
  - Search queries and results
  - Performance benchmarks
  
  ## 3. Implementation Phases
  1. Initial Data Collection (Q2 2024)
  2. Model Development (Q3 2024)
  3. Beta Testing (Q4 2024)
  4. Production Deployment (Q1 2025)
  
  ### Resource Requirements
  * 2 ML Engineers
  * 1 Data Scientist
  * 1 DevOps Specialist
  * Cloud Computing Resources
  
  ## 4. Ethical Considerations
  - Data privacy compliance
  - Bias prevention strategies
  - Transparency in AI decisions
  - User consent management
  
  ## 5. Success Metrics
  * Prediction accuracy > 85%
  * Response time < 100ms
  * User satisfaction increase
  * Resource utilization optimization
  
  \`\`\`python
  # Sample implementation pseudocode
  def train_model(data):
      preprocess_data()
      validate_inputs()
      initialize_model()
      train_iterations()
      validate_results()
  \`\`\`
  
  > Note: Regular model retraining will be necessary to maintain accuracy`,
    createdAt: new Date("2024-10-05"),
    updatedAt: new Date("2024-10-05"),
    workspaceId: 1,
    userId: 1,
  },
  {
    id: 5,
    title: "Quick Task List",
    content: `### Today's Tasks
  - [x] Code review
  - [ ] Team meeting at 2 PM
  - [ ] Deploy hotfix
  - [ ] Update documentation
  
  **Reminder:** Back up database at 5 PM`,
    createdAt: new Date("2024-09-30"),
    updatedAt: new Date("2024-09-30"),
    workspaceId: 1,
    userId: 1,
  },
];
