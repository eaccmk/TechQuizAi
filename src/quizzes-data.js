window.QUIZ_CATALOG = {
  "manifest": [
    {
      "id": "evaluation-evals",
      "icon": "📊",
      "title": "Evaluation (Evals)",
      "subtitle": "Understand AI evaluation frameworks, LLM benchmarks, and scoring metrics",
      "category": "Artificial Intelligence (AI) Foundations",
      "questions": 10,
      "completed": false,
      "available": false
    },
    {
      "id": "llm-fundamentals",
      "icon": "🧠",
      "title": "LLM Fundamentals",
      "subtitle": "Learn Large Language Models, prompt engineering, and GenAI concepts",
      "category": "Artificial Intelligence (AI) Foundations",
      "questions": 10,
      "completed": false,
      "available": false
    },
    {
      "id": "mcp-concepts",
      "icon": "🔌",
      "title": "MCP Concepts",
      "subtitle": "Master Model Context Protocol, agent tools, and server integrations",
      "category": "Artificial Intelligence (AI) Foundations",
      "questions": 10,
      "completed": false,
      "available": false
    },
    {
      "id": "aws-basics",
      "icon": "🪣",
      "title": "AWS Basics",
      "subtitle": "Master the fundamentals of Amazon Web Services",
      "category": "AWS Fundamentals",
      "questions": 10,
      "completed": false,
      "available": true
    },
    {
      "id": "ec2-compute",
      "icon": "🖥️",
      "title": "EC2 & Compute",
      "subtitle": "Learn virtual servers and compute resources",
      "category": "AWS Fundamentals",
      "questions": 10,
      "completed": false,
      "available": false
    },
    {
      "id": "iam-concepts",
      "icon": "🔐",
      "title": "IAM Concepts",
      "subtitle": "Understand Identity and Access Management",
      "category": "AWS Fundamentals",
      "questions": 5,
      "completed": false,
      "available": true
    },
    {
      "id": "azure-devops",
      "icon": "♾️",
      "title": "Azure DevOps Essentials",
      "subtitle": "Master CI/CD automation pipelines, Repos, and Azure release management",
      "category": "Azure Cloud & DevOps",
      "questions": 10,
      "completed": false,
      "available": false
    },
    {
      "id": "azure-fundamentals",
      "icon": "🔷",
      "title": "Azure Fundamentals",
      "subtitle": "Explore Microsoft Azure core cloud services and architecture",
      "category": "Azure Cloud & DevOps",
      "questions": 10,
      "completed": false,
      "available": false
    },
    {
      "id": "azure-security",
      "icon": "🛡️",
      "title": "Azure Security & Identity",
      "subtitle": "Learn Microsoft Entra ID, Key Vault, and Azure Security Center",
      "category": "Azure Cloud & DevOps",
      "questions": 10,
      "completed": false,
      "available": false
    },
    {
      "id": "gcp-architecture",
      "icon": "☁️",
      "title": "GCP Cloud Architecture",
      "subtitle": "Understand GCP VPC networking, IAM security, and Cloud Storage",
      "category": "Google Cloud Platform (GCP)",
      "questions": 10,
      "completed": false,
      "available": false
    },
    {
      "id": "gcp-data-ai",
      "icon": "🤖",
      "title": "GCP Data & AI",
      "subtitle": "Master BigQuery, Vertex AI, and Google Cloud data engineering",
      "category": "Google Cloud Platform (GCP)",
      "questions": 10,
      "completed": false,
      "available": false
    },
    {
      "id": "gcp-fundamentals",
      "icon": "🌈",
      "title": "GCP Fundamentals",
      "subtitle": "Learn Google Cloud infrastructure, Compute Engine, and BigQuery",
      "category": "Google Cloud Platform (GCP)",
      "questions": 10,
      "completed": false,
      "available": false
    }
  ],
  "catalog": {
    "evaluation-evals": {
      "id": "evaluation-evals",
      "icon": "📊",
      "title": "Evaluation (Evals)",
      "subtitle": "Understand AI evaluation frameworks, LLM benchmarks, and scoring metrics",
      "category": "Artificial Intelligence (AI) Foundations",
      "questionsCount": 10,
      "completed": false,
      "available": false,
      "questions": []
    },
    "llm-fundamentals": {
      "id": "llm-fundamentals",
      "icon": "🧠",
      "title": "LLM Fundamentals",
      "subtitle": "Learn Large Language Models, prompt engineering, and GenAI concepts",
      "category": "Artificial Intelligence (AI) Foundations",
      "questionsCount": 10,
      "completed": false,
      "available": false,
      "questions": []
    },
    "mcp-concepts": {
      "id": "mcp-concepts",
      "icon": "🔌",
      "title": "MCP Concepts",
      "subtitle": "Master Model Context Protocol, agent tools, and server integrations",
      "category": "Artificial Intelligence (AI) Foundations",
      "questionsCount": 10,
      "completed": false,
      "available": false,
      "questions": []
    },
    "aws-basics": {
      "id": "aws-basics",
      "icon": "🪣",
      "title": "AWS Basics",
      "subtitle": "Master the fundamentals of Amazon Web Services",
      "category": "AWS Fundamentals",
      "questionsCount": 10,
      "completed": false,
      "available": true,
      "questions": [
        {
          "id": 1,
          "difficulty": "easy",
          "text": "What does IAM stand for?",
          "options": [
            "Identity and Access Management",
            "Internal Application Model",
            "Internet Access Module",
            "Integrated Auth Mechanism"
          ],
          "answerHash": "bb133561f40b2cbc6282dd2e93289d786c5f367d9d3f49ca3dc5252d398f3ab4",
          "hint": "It controls who can do what in your AWS account."
        },
        {
          "id": 2,
          "difficulty": "easy",
          "text": "Which AWS service is used for object storage?",
          "options": [
            "EC2",
            "S3",
            "RDS",
            "Lambda"
          ],
          "answerHash": "44d6a8a73eddb284d49799fdbfa2919a004ece6d2df3546eaa4e246048bcdf81",
          "hint": "Think \"buckets\" of files."
        },
        {
          "id": 3,
          "difficulty": "easy",
          "text": "What does EC2 stand for?",
          "options": [
            "Elastic Compute Cloud",
            "Enterprise Cloud Center",
            "External Compute Cluster",
            "Elastic Container Cloud"
          ],
          "answerHash": "db54992d0fdfe8a01297730e3e0852bc6af33fa6996067db7a1718b942db5fc8",
          "hint": "It's about renting virtual servers."
        },
        {
          "id": 4,
          "difficulty": "easy",
          "text": "Which service is a managed relational database?",
          "options": [
            "DynamoDB",
            "S3",
            "RDS",
            "CloudFront"
          ],
          "answerHash": "14723897eca7b2b287c5e0011ca710e40bd47299df22d8a2587a34667492aa47",
          "hint": "Think MySQL, PostgreSQL, hosted by AWS."
        },
        {
          "id": 5,
          "difficulty": "easy",
          "text": "What is a VPC?",
          "options": [
            "A billing tool",
            "A virtual private network in AWS",
            "A type of storage",
            "A monitoring service"
          ],
          "answerHash": "17b7ec3397e68005d20f5eefb9e38a7623534a263ef0912a405141e37a5e8f72",
          "hint": "It's your own isolated network inside AWS."
        },
        {
          "id": 6,
          "difficulty": "easy",
          "text": "Which AWS service delivers content via a CDN?",
          "options": [
            "CloudFront",
            "CloudWatch",
            "CloudTrail",
            "CloudFormation"
          ],
          "answerHash": "d01a39af588122591bd7583b877f54644a8bbe36d4e7a70d605e9702867884ca",
          "hint": "Think fast content delivery to users worldwide."
        },
        {
          "id": 7,
          "difficulty": "medium",
          "text": "What is the default limit on VPCs per region?",
          "options": [
            "3",
            "5",
            "10",
            "Unlimited"
          ],
          "answerHash": "ef2d127de37b942baad06145e54b0c619a1f22327b2ebbcfbec78f5564afe39d",
          "hint": "It's a soft limit you can request to increase."
        },
        {
          "id": 8,
          "difficulty": "medium",
          "text": "Which storage class is cheapest for rarely accessed data?",
          "options": [
            "S3 Standard",
            "S3 Glacier",
            "S3 Intelligent-Tiering",
            "S3 One Zone-IA"
          ],
          "answerHash": "03ac1fe0756f7bbb3986f4cbd61b1662c343959a567d64dfd0188d1a824f49d8",
          "hint": "Think long-term archival storage."
        },
        {
          "id": 9,
          "difficulty": "medium",
          "text": "What does an IAM policy attached to a role define?",
          "options": [
            "Billing limits",
            "Permissions",
            "Network speed",
            "Storage size"
          ],
          "answerHash": "abccc78cc93c07931feccfbd0665c003373b48334fd8d4cf5c6d0c714e68f26e",
          "hint": "It's about what actions are allowed or denied."
        },
        {
          "id": 10,
          "difficulty": "hard",
          "text": "In S3, what consistency model applies to all operations as of Dec 2020?",
          "options": [
            "Eventual consistency only",
            "Strong read-after-write consistency",
            "No consistency guarantee",
            "Weak consistency"
          ],
          "answerHash": "028ad6797c2f7492727353be4f17937fad5637ee55a9d3168458c741b57f31be",
          "hint": "AWS made a major consistency announcement for S3."
        }
      ]
    },
    "ec2-compute": {
      "id": "ec2-compute",
      "icon": "🖥️",
      "title": "EC2 & Compute",
      "subtitle": "Learn virtual servers and compute resources",
      "category": "AWS Fundamentals",
      "questionsCount": 10,
      "completed": false,
      "available": false,
      "questions": []
    },
    "iam-concepts": {
      "id": "iam-concepts",
      "icon": "🔐",
      "title": "IAM Concepts",
      "subtitle": "Understand Identity and Access Management",
      "category": "AWS Fundamentals",
      "questionsCount": 5,
      "completed": false,
      "available": true,
      "questions": [
        {
          "id": 1,
          "difficulty": "easy",
          "text": "Which IAM entity is assigned to AWS services to grant permissions securely without hardcoding credentials?",
          "options": [
            "IAM User",
            "IAM Group",
            "IAM Role",
            "Root User"
          ],
          "answerHash": "bd27098052ba14e638dcf9b62f97825c5baf4077ab3841455efc3e4afddb0f57",
          "hint": "Used by EC2 instances or Lambda functions to assume permissions temporarily."
        },
        {
          "id": 2,
          "difficulty": "easy",
          "text": "What is the recommended best practice for the AWS Root Account user?",
          "options": [
            "Use it for everyday administrative tasks",
            "Enable MFA and lock it away, using IAM users/roles instead",
            "Share root credentials with all team members",
            "Delete the root account immediately"
          ],
          "answerHash": "3f2de56da9151efe0d0652897206a44475232305f7e50830ae08b9d78ee310f5",
          "hint": "Root has unrestricted access to everything in your AWS account."
        },
        {
          "id": 3,
          "difficulty": "medium",
          "text": "What format are IAM policy documents written in?",
          "options": [
            "XML",
            "YAML",
            "JSON",
            "TOML"
          ],
          "answerHash": "db1a21a0bc2ef8fbe13ac4cf044e8c9116d29137d5ed8b916ab63dcb2d4290df",
          "hint": "Key-value pairs containing Version, Statement, Effect, Action, Resource."
        },
        {
          "id": 4,
          "difficulty": "medium",
          "text": "What does an explicit DENY in an IAM policy do when evaluated against an explicit ALLOW?",
          "options": [
            "ALLOW takes precedence over DENY",
            "DENY overrides any ALLOW",
            "Both apply equally",
            "Causes an evaluation error"
          ],
          "answerHash": "6c4d4f42b2ce10ef94613d2698b0b802b0d600ca9bcee6c26ecebd53d792bbc9",
          "hint": "In AWS IAM, an explicit DENY always wins."
        },
        {
          "id": 5,
          "difficulty": "hard",
          "text": "Which IAM feature allows authentication via external identity providers like Google or Okta?",
          "options": [
            "IAM Access Analyzer",
            "IAM Identity Center (SAML 2.0 / OIDC Federation)",
            "AWS KMS",
            "Amazon Cognito Sync"
          ],
          "answerHash": "3b6c6e58f96b06e870d0c44c73b0967ea97bbd241c35b4fb1c4863916631d17c",
          "hint": "Enables Single Sign-On (SSO) with enterprise identity systems."
        }
      ]
    },
    "azure-devops": {
      "id": "azure-devops",
      "icon": "♾️",
      "title": "Azure DevOps Essentials",
      "subtitle": "Master CI/CD automation pipelines, Repos, and Azure release management",
      "category": "Azure Cloud & DevOps",
      "questionsCount": 10,
      "completed": false,
      "available": false,
      "questions": []
    },
    "azure-fundamentals": {
      "id": "azure-fundamentals",
      "icon": "🔷",
      "title": "Azure Fundamentals",
      "subtitle": "Explore Microsoft Azure core cloud services and architecture",
      "category": "Azure Cloud & DevOps",
      "questionsCount": 10,
      "completed": false,
      "available": false,
      "questions": []
    },
    "azure-security": {
      "id": "azure-security",
      "icon": "🛡️",
      "title": "Azure Security & Identity",
      "subtitle": "Learn Microsoft Entra ID, Key Vault, and Azure Security Center",
      "category": "Azure Cloud & DevOps",
      "questionsCount": 10,
      "completed": false,
      "available": false,
      "questions": []
    },
    "gcp-architecture": {
      "id": "gcp-architecture",
      "icon": "☁️",
      "title": "GCP Cloud Architecture",
      "subtitle": "Understand GCP VPC networking, IAM security, and Cloud Storage",
      "category": "Google Cloud Platform (GCP)",
      "questionsCount": 10,
      "completed": false,
      "available": false,
      "questions": []
    },
    "gcp-data-ai": {
      "id": "gcp-data-ai",
      "icon": "🤖",
      "title": "GCP Data & AI",
      "subtitle": "Master BigQuery, Vertex AI, and Google Cloud data engineering",
      "category": "Google Cloud Platform (GCP)",
      "questionsCount": 10,
      "completed": false,
      "available": false,
      "questions": []
    },
    "gcp-fundamentals": {
      "id": "gcp-fundamentals",
      "icon": "🌈",
      "title": "GCP Fundamentals",
      "subtitle": "Learn Google Cloud infrastructure, Compute Engine, and BigQuery",
      "category": "Google Cloud Platform (GCP)",
      "questionsCount": 10,
      "completed": false,
      "available": false,
      "questions": []
    }
  }
};
