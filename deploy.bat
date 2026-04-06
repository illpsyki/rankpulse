@echo off
echo.
echo  ================================
echo   RankPulse - One Deploy Script
echo  ================================
echo.
echo  Step 1: Push to a private GitHub repo
echo    (create one at github.com/new, then:)
echo.
echo    git remote add origin YOUR_REPO_URL
echo    git push -u origin main
echo.
echo  Step 2: Deploy to Vercel
echo    Run this command from the project folder:
echo.
echo    npx vercel deploy
echo.
echo  This will open your browser to log in, then deploy
echo  your app to a public URL automatically.
echo.
echo  Step 3: Add these env vars in Vercel dashboard:
echo    DATABASE_URL        = file:./dev.db  (or Neon/Supabase PostgreSQL URL)
echo    NEXTAUTH_SECRET     = 865ddd0a74ea68a386729455a54de65d1cc4caf753948601395bf4bc6bd58096
echo    NEXTAUTH_URL        = (your Vercel URL)
echo    STRIPE_SECRET_KEY   = (from stripe.com after setup)
echo    STRIPE_WEBHOOK_SECRET = (from Stripe webhooks)
echo    STRIPE_PRO_PRICE_ID = price_xxx
echo    STRIPE_AGENCY_PRICE_ID = price_xxx
echo.
pause
