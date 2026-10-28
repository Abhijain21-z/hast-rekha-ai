@echo off
set DATABASE_URL=postgresql://abhishek:JmIMon7c1lXAPM9vx1rwjA@rose-orca-35581.j77.aws-ap-south-1.cockroachlabs.cloud:26257/defaultdb?sslmode=verify-full
set NODE_OPTIONS=--max-old-space-size=4096
npm run dev -- -p 3001
