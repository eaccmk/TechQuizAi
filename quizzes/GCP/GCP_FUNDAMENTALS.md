---
id: gcp-fundamentals
title: GCP Fundamentals
icon: 🌈
subtitle: Learn Google Cloud infrastructure, Compute Engine, and BigQuery
category: Google Cloud Platform (GCP)
available: true
---

### Question 1
Difficulty: easy
What is the primary IaaS (Infrastructure as a Service) offering in Google Cloud Platform?
- [x] Google Compute Engine
- [ ] Google App Engine
- [ ] Google Cloud Storage
- [ ] Cloud Run
> Hint: It provides scalable virtual machines.
<!-- Source: https://www.skills.google/ -->

### Question 2
Difficulty: easy
Which GCP service is designed for serverless, fully managed container execution?
- [ ] Google Kubernetes Engine
- [x] Cloud Run
- [ ] Compute Engine
- [ ] Cloud Functions
> Hint: It runs stateless containers on a fully managed environment.
<!-- Source: https://www.skills.google/ -->

### Question 3
Difficulty: easy
What is Google Cloud's fully managed, serverless data warehouse?
- [ ] Cloud SQL
- [ ] Cloud Spanner
- [x] BigQuery
- [ ] Cloud Storage
> Hint: It allows super-fast SQL queries on massive datasets.
<!-- Source: https://www.skills.google/ -->

### Question 4
Difficulty: medium
How does GCP organize resources hierarchically?
- [x] Organization -> Folders -> Projects -> Resources
- [ ] Projects -> Folders -> Organization -> Resources
- [ ] Organization -> Projects -> Resources -> Folders
- [ ] Regions -> Zones -> Projects -> Resources
> Hint: Projects sit below folders and above individual resources.
<!-- Source: https://www.skills.google/ -->

### Question 5
Difficulty: medium
Which database service provides horizontal scaling, strong consistency, and relational semantics globally?
- [ ] Cloud SQL
- [x] Cloud Spanner
- [ ] Bigtable
- [ ] Firestore
> Hint: It's the only enterprise-grade, globally-distributed, and strongly consistent database service built for the cloud.
<!-- Source: https://www.skills.google/ -->

### Question 6
Difficulty: medium
What is the default global load balancing service for HTTP(S) traffic in GCP?
- [ ] Network Load Balancer
- [x] HTTP(S) Load Balancing
- [ ] Cloud CDN
- [ ] Internal Load Balancer
> Hint: It distributes web traffic across multiple regions automatically.
<!-- Source: https://www.skills.google/ -->

### Question 7
Difficulty: medium
What is the difference between standard and nearline storage classes in Cloud Storage?
- [ ] Standard is for archival, nearline is for frequent access
- [x] Standard is for frequent access, nearline is for data accessed less than once a month
- [ ] Nearline is faster than standard
- [ ] Standard is multi-regional only, nearline is regional only
> Hint: Nearline is slightly cheaper for storage but incurs retrieval costs.
<!-- Source: https://www.skills.google/ -->

### Question 8
Difficulty: hard
Which of the following is true about VPC networks in GCP compared to AWS?
- [ ] GCP VPCs are regional, AWS VPCs are global
- [x] GCP VPCs are global resources, AWS VPCs are regional
- [ ] Both are global resources
- [ ] Both are regional resources
> Hint: In GCP, a single VPC can span multiple regions without peering.
<!-- Source: https://www.skills.google/ -->

### Question 9
Difficulty: hard
What is the primary purpose of Google Cloud Identity and Access Management (IAM) service accounts?
- [ ] To allow external users to log in
- [x] To provide an identity for an application or VM to interact with other GCP services
- [ ] To manage billing accounts
- [ ] To replace user passwords
> Hint: It's an identity that belongs to your application or virtual machine, not an individual end user.
<!-- Source: https://www.skills.google/ -->

### Question 10
Difficulty: hard
Which GCP service provides a fully managed, Apache Kafka-compatible messaging service?
- [ ] Cloud Tasks
- [ ] Eventarc
- [ ] RabbitMQ
- [x] Pub/Sub
> Hint: It's an asynchronous messaging service designed for streaming analytics and data integration pipelines.
<!-- Source: https://www.skills.google/ -->
