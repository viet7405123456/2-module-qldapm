#!/bin/sh
set -e

echo "Applying database migrations..."
ATTEMPTS=0
MAX_ATTEMPTS=20
until npx prisma migrate deploy; do
  ATTEMPTS=$((ATTEMPTS + 1))
  if [ "$ATTEMPTS" -ge "$MAX_ATTEMPTS" ]; then
    echo "Database not ready after $MAX_ATTEMPTS attempts, giving up."
    exit 1
  fi
  echo "Database not ready, retrying in 3s... ($ATTEMPTS/$MAX_ATTEMPTS)"
  sleep 3
done

echo "Seeding database..."
node prisma/run-seed.js || echo "Seed step skipped/failed (likely already applied), continuing."

echo "Starting application..."
exec node dist/main.js
