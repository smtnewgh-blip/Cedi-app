#!/bin/bash

# Cedi App - Complete Setup Script
# This script automates the setup process for your Next.js + Supabase + OpenAI app

set -e

echo "🚀 Cedi App Setup Script"
echo "======================="
echo ""

# Check if .env.local exists
if [ -f .env.local ]; then
    echo "✅ .env.local already exists"
    read -p "Do you want to reconfigure? (y/n) " -n 1 -r
    echo
    if [[ ! $REPLY =~ ^[Yy]$ ]]; then
        echo "Skipping configuration..."
        exit 0
    fi
fi

echo ""
echo "📋 Setup Instructions:"
echo "===================="
echo ""
echo "Before continuing, you need to have:"
echo "1. ✅ Supabase account and project (https://supabase.com)"
echo "2. ✅ OpenAI API key (https://platform.openai.com)"
echo "3. ✅ Node.js 18+ installed"
echo ""

read -p "Press Enter to continue..."

echo ""
echo "🔐 Please enter your credentials:"
echo "=================================="
echo ""

# Get Supabase URL
read -p "Enter your Supabase Project URL: " SUPABASE_URL
if [ -z "$SUPABASE_URL" ]; then
    echo "❌ Supabase URL is required"
    exit 1
fi

# Get Supabase Key
read -p "Enter your Supabase Publishable Key: " SUPABASE_KEY
if [ -z "$SUPABASE_KEY" ]; then
    echo "❌ Supabase Key is required"
    exit 1
fi

# Get OpenAI Key
read -p "Enter your OpenAI API Key: " OPENAI_KEY
if [ -z "$OPENAI_KEY" ]; then
    echo "❌ OpenAI API Key is required"
    exit 1
fi

# Create .env.local
cat > .env.local << EOF
# Supabase Configuration
NEXT_PUBLIC_SUPABASE_URL=$SUPABASE_URL
NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY=$SUPABASE_KEY

# OpenAI Configuration
OPENAI_API_KEY=$OPENAI_KEY

# App Configuration
NEXT_PUBLIC_APP_URL=http://localhost:3000
EOF

echo ""
echo "✅ .env.local created successfully!"
echo ""

# Install dependencies
echo "📦 Installing dependencies..."
npm install

echo ""
echo "✅ Setup Complete!"
echo ""
echo "🚀 You can now run the app with:"
echo "   npm run dev"
echo ""
echo "Then visit: http://localhost:3000"
echo ""
