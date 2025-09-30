# Production Deployment Checklist

## Environment Variables Required

The following environment variables must be set in your production deployment platform (Vercel, Netlify, etc.):

### Essential Variables
```
DATABASE_URL=postgresql://neondb_owner:npg_stzc9ESNIAf4@ep-fancy-cherry-a1179pkn-pooler.ap-southeast-1.aws.neon.tech/neondb?sslmode=require&channel_binding=require
JWT_SECRET=e120ddd39c72450af51013031456c10c93622731e43f4751265cc82bf60372f1
NEXTAUTH_SECRET=your-secret-key
NEXTAUTH_URL=https://your-production-domain.com
NODE_ENV=production
```

### Optional Variables
```
NEXT_DISABLE_DEVTOOLS=true
NEXT_DEV_TOOLS_BUTTON=false
NEXT_PUBLIC_FONT_BASE_PATH=/fonts
NEXT_PUBLIC_NAVER_MAP_CLIENT_ID=8yau1yclyu
```

## Database Setup

1. **Push Prisma Schema to Production Database**
   ```bash
   DATABASE_URL="your-production-database-url" npx prisma db push
   ```

2. **Create Production Test Data**
   ```bash
   NODE_ENV=production npx tsx src/scripts/create-production-data.ts
   ```

## Verification Steps

1. **Check Environment Variables**
   - Ensure DATABASE_URL is set and accessible
   - Verify JWT_SECRET is set for authentication
   - Confirm NEXTAUTH_URL matches your production domain

2. **Test Database Connection**
   - Verify database tables exist
   - Check that test users are created
   - Ensure production data is populated

3. **Test Authentication**
   - Try logging in with test credentials:
     - Veterinarian: `vet@test.com` / `vet123!`
     - Hospital: `hospital@test.com` / `hospital123!`

## Common Issues

### 500 Error on Login
- **Cause**: Missing DATABASE_URL environment variable
- **Solution**: Set DATABASE_URL in deployment platform

### Database Connection Errors  
- **Cause**: Incorrect database URL or network issues
- **Solution**: Verify database URL and network accessibility

### Authentication Failures
- **Cause**: Missing JWT_SECRET or incorrect cookie settings
- **Solution**: Set JWT_SECRET and verify secure cookie settings

## Production Test Users

After running the production data creation script, you can test with:

### Veterinarians (vet1@iamvet.kr to vet20@iamvet.kr)
- Password: `vet123!`
- Example: `vet1@iamvet.kr` / `vet123!`

### Hospitals (hospital1@iamvet.kr to hospital10@iamvet.kr) 
- Password: `hospital123!`
- Example: `hospital1@iamvet.kr` / `hospital123!`

## Troubleshooting

1. **Check deployment logs** for specific error messages
2. **Verify environment variables** are properly set
3. **Test database connectivity** from deployment environment
4. **Review Next.js server-side errors** in production logs