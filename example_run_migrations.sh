#!/usr/bin/env bash

docker exec -i ecobserve-db psql -U postgres -d ecobserve < backend/src/migrations/002_auth_enhancements.sql
