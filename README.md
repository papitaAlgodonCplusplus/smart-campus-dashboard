# TODO

[] Add effects to Dashboard comme 3D carousel
[] Users can buck space in X place from 0:00 to 0:00

# Smart Campus Dashboard: End-to-End System Design

## System Architecture Overview

```
[Users] ←→ [Frontend UI] ←→ [API Gateway] ←→ [Backend Services] ←→ [Data Sources]
```

## 1. Frontend Implementation

### Technologies:
- **Framework**: React.js with TypeScript
- **State Management**: Redux or Context API
- **UI Components**: Material-UI or Tailwind CSS
- **Data Visualization**: D3.js and Chart.js
- **Maps**: Leaflet or MapBox for campus mapping
- **Real-time Updates**: Socket.io for live data

### Key Features:
- Responsive design (mobile, tablet, desktop)
- Interactive dashboard with customizable widgets
- Dark/light mode support
- Offline capabilities with service workers
- Campus map interface with building information overlays

## 2. Backend Services

### Technologies:
- **API Framework**: Node.js with Express or NestJS
- **Authentication**: JWT with OAuth 2.0 integration for university SSO
- **Database**: 
  - MongoDB for flexible document storage
  - PostgreSQL for relational data
  - Redis for caching and real-time data
- **Search Engine**: Elasticsearch for campus-wide search
- **Task Processing**: Bull or Celery for background jobs

### Microservices:
1. **User Service**: Authentication, profiles, preferences
2. **Spaces Service**: Room occupancy, availability tracking
3. **Events Service**: Campus activities, calendar integration
4. **Transportation Service**: Shuttle tracking, schedules
5. **Facilities Service**: Maintenance requests, building status
6. **Analytics Service**: Usage statistics, trends
7. **Notification Service**: Push notifications, alerts

## 3. Data Collection Layer

### IoT Infrastructure:
- **Sensors**: Wi-Fi-based occupancy sensors for spaces
- **Gateway**: Raspberry Pi or ESP32 devices as local collection points
- **Protocol**: MQTT for sensor data transmission
- **Edge Computing**: Basic processing at collection points

### Integration Points:
- University timetable system API
- Campus energy management systems
- Dining services databases
- Transportation management systems
- Weather data APIs
- University event calendars

### Data Processing:
- Apache Kafka for real-time data streaming
- Apache Spark for batch processing of historical data
- TensorFlow Lite for edge ML predictions (e.g., space occupancy)

## 4. DevOps & Infrastructure

### Hosting Options:
- **University Infrastructure**: If available and permitted
- **Cloud Provider**: AWS, GCP, or Azure with student credits
- **Containers**: Docker with Kubernetes for orchestration

### CI/CD Pipeline:
- GitHub Actions or GitLab CI
- Automated testing with Jest and Cypress
- Continuous deployment with version control

### Monitoring:
- Prometheus for metrics collection
- Grafana for operational dashboards
- ELK Stack for log management
- Sentry for error tracking

## 5. Security Considerations

- HTTPS encryption for all traffic
- Rate limiting to prevent abuse
- Data anonymization for privacy
- Regular security audits
- GDPR/privacy compliance
- Role-based access control

## 6. Development Phases

### Phase 1 (MVP):
- Basic dashboard with static data
- Authentication with university credentials
- Simple space availability tracking
- Events calendar integration

### Phase 2:
- Real-time updates for occupancy
- Interactive campus map
- Transportation tracking
- Basic analytics

### Phase 3:
- IoT sensor integration
- Predictive models for space availability
- Mobile app version
- Personalization features

### Phase 4:
- Full automation of data collection
- Advanced analytics and reporting
- API for third-party developers
- Integration with additional university systems

## 7. Testing Strategy

- Unit testing with Jest
- Integration testing with Supertest
- E2E testing with Cypress
- User testing with student focus groups
- Load testing with k6 or Locust

## 8. Documentation

- API documentation with Swagger
- Technical documentation in GitHub wiki
- User guides for students and administrators
- Data dictionary for all collected metrics

## 9. Team Structure (If Applicable)

- Frontend developers (2-3)
- Backend developers (2-3)
- IoT specialist (1)
- UI/UX designer (1)
- DevOps engineer (1)
- Project manager (1)

## 10. Estimated Timeline

- **Planning & Design**: 2-4 weeks
- **MVP Development**: 2-3 months
- **Initial Deployment**: 1 month
- **Iterative Improvements**: Ongoing