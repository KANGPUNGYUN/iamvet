const { PrismaClient } = require('@prisma/client');

async function forceFix() {
  const prisma = new PrismaClient();
  
  try {
    console.log('=== Force Fix JWT Token Issue ===');
    
    // 1. 잘못된 사용자를 올바른 사용자로 업데이트
    const wrongId = 'AAbGoJ8vNectzFZ4';
    const correctId = 'tXqwI8K8X1vgD2WM';
    
    console.log(`\n1. Wrong ID: ${wrongId}`);
    console.log(`   Correct ID: ${correctId}`);
    
    // 2. 잘못된 ID로 생성된 사용자가 있다면 삭제
    const wrongUser = await prisma.$queryRawUnsafe(`
      SELECT * FROM users WHERE id = $1
    `, wrongId);
    
    if (wrongUser.length > 0) {
      console.log('\n2. Found wrong user, deleting...');
      await prisma.$executeRawUnsafe(`DELETE FROM users WHERE id = $1`, wrongId);
      console.log('   ✅ Wrong user deleted');
    } else {
      console.log('\n2. No wrong user found in DB');
    }
    
    // 3. 올바른 사용자 정보 확인
    const correctUser = await prisma.$queryRawUnsafe(`
      SELECT u.*, vp.nickname 
      FROM users u 
      LEFT JOIN veterinarian_profiles vp ON u.id = vp."userId"
      WHERE u.id = $1
    `, correctId);
    
    console.log('\n3. Correct user info:');
    console.log(correctUser[0]);
    
    // 4. Google 소셜 계정에서 잘못된 사용자 ID 수정
    const socialAccounts = await prisma.$queryRawUnsafe(`
      SELECT * FROM social_accounts WHERE "providerId" = '105001797652571859920'
    `);
    
    console.log('\n4. Social accounts:');
    console.log(socialAccounts);
    
    if (socialAccounts.length > 0) {
      // 소셜 계정을 올바른 사용자로 연결
      await prisma.$executeRawUnsafe(`
        UPDATE social_accounts 
        SET "userId" = $1, "updatedAt" = NOW()
        WHERE "providerId" = '105001797652571859920'
      `, correctId);
      console.log('   ✅ Social account updated to correct user');
    }
    
    console.log('\n🔧 Next steps:');
    console.log('1. Clear all browser data (localStorage, cookies, cache)');
    console.log('2. Restart browser');
    console.log('3. Login again - should now get correct JWT token');
    
  } catch (error) {
    console.error('Error:', error);
  } finally {
    await prisma.$disconnect();
  }
}

forceFix();