#!/bin/bash

# Create or overwrite the .env file
touch .env

# Append environment variables to the .env file
echo "ORIGIN=https://stacks.hoytlabs.app" >> .env
echo "PORT=3000" >> .env
echo "ENABLE_DRIZZLE_LOGGER=$ENABLE_DRIZZLE_LOGGER" >> .env
echo "POSTGRES_DB_HOST=$POSTGRES_DB_HOST" >> .env
echo "POSTGRES_DB_PORT=$POSTGRES_DB_PORT" >> .env
echo "POSTGRES_DB_USER=$POSTGRES_DB_USER" >> .env
echo "POSTGRES_DB_PASSWORD=$POSTGRES_DB_PASSWORD" >> .env
echo "POSTGRES_DB_NAME=$POSTGRES_DB_NAME" >> .env
echo "POSTGRES_MAX_CONNECTIONS=$POSTGRES_MAX_CONNECTIONS" >> .env

echo "TUNNEL_HOST=$TUNNEL_HOST" >> .env
echo "TUNNEL_USER=$TUNNEL_USER" >> .env
echo "TUNNEL_PORT=22" >> .env
echo "TUNNEL_PRIVATE_KEY=$TUNNEL_PRIVATE_KEY" >> .env
echo "TUNNEL_PRIVATE_KEY_PATH=" >> .env
echo "TUNNEL_DEST_HOST=$TUNNEL_DEST_HOST" >> .env
echo "TUNNEL_DEST_PORT=$TUNNEL_DEST_PORT" >> .env
echo "TUNNEL_LOCAL_PORT=$TUNNEL_LOCAL_PORT" >> .env
echo "TUNNEL_DEBUG=$TUNNEL_DEBUG" >> .env

echo "MYSQL_DB_HOST=$MYSQL_DB_HOST" >> .env
echo "MYSQL_DB_PORT=$MYSQL_DB_PORT" >> .env
echo "MYSQL_DB_USER=$MYSQL_DB_USER" >> .env
echo "MYSQL_DB_PASSWORD=$MYSQL_DB_PASSWORD" >> .env
echo "MYSQL_DB_NAME=$MYSQL_DB_NAME" >> .env
echo "MYSQL_USE_SSH=$MYSQL_USE_SSH" >> .env

echo "GITHUB_CLIENT_ID=" >> .env
echo "GITHUB_CLIENT_SECRET=" >> .env
echo "GOOGLE_OAUTH_CLIENT_ID=" >> .env
echo "GOOGLE_OAUTH_CLIENT_SECRET=" >> .env
echo "GOOGLE_OAUTH_REDIRECT_URI=" >> .env
echo "RESEND_API_KEY=$RESEND_API_KEY" >> .env
echo "FROM_EMAIL=$FROM_EMAIL" >> .env
echo "CMP_CLIENT_ID=$CMP_CLIENT_ID" >> .env

echo "SUPABASE_URL=$SUPABASE_URL" >> .env
echo "SUPABASE_API_KEY=$SUPABASE_API_KEY" >> .env
echo "PUBLIC_SUPABASE_KEY=$PUBLIC_SUPABASE_KEY" >> .env
echo "PUBLIC_POSTHOG_KEY=$PUBLIC_POSTHOG_KEY" >> .env
echo "AUTH_INITIALIZE=false" >> .env

echo "INSTANTDB_ADMIN_TOKEN=$INSTANTDB_ADMIN_TOKEN" >> .env
echo "PUBLIC_APP_ID=$PUBLIC_APP_ID" >> .env

# Output the contents of the .env file to the console
cat .env