// S3 연결 테스트 스크립트
const { S3Client, ListBucketsCommand, PutObjectCommand } = require('@aws-sdk/client-s3');

// 환경 변수 수동 로드
const fs = require('fs');
const path = require('path');

function loadEnv() {
  try {
    const envPath = path.join(__dirname, '.env.local');
    const envContent = fs.readFileSync(envPath, 'utf8');
    
    envContent.split('\n').forEach(line => {
      const match = line.match(/^([^=]+)=(.*)$/);
      if (match) {
        const key = match[1].trim();
        const value = match[2].trim().replace(/^["']|["']$/g, '');
        process.env[key] = value;
      }
    });
  } catch (error) {
    console.error('환경 변수 파일 로드 실패:', error.message);
  }
}

loadEnv();

console.log('=== AWS S3 연결 테스트 ===');
console.log('AWS_ACCESS_KEY_ID:', process.env.AWS_ACCESS_KEY_ID ? '✓ 설정됨' : '✗ 없음');
console.log('AWS_SECRET_ACCESS_KEY:', process.env.AWS_SECRET_ACCESS_KEY ? '✓ 설정됨' : '✗ 없음');
console.log('AWS_REGION:', process.env.AWS_REGION);
console.log('AWS_S3_BUCKET_NAME:', process.env.AWS_S3_BUCKET_NAME);
console.log('');

// S3 클라이언트 생성
const s3Client = new S3Client({
  region: process.env.AWS_REGION,
  credentials: {
    accessKeyId: process.env.AWS_ACCESS_KEY_ID,
    secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
  },
});

async function testS3Connection() {
  try {
    console.log('1. S3 버킷 목록 조회 테스트...');
    const listBucketsCommand = new ListBucketsCommand({});
    const bucketsResult = await s3Client.send(listBucketsCommand);
    
    console.log('✓ S3 연결 성공!');
    console.log('사용 가능한 버킷들:');
    bucketsResult.Buckets?.forEach(bucket => {
      console.log(`  - ${bucket.Name} (생성일: ${bucket.CreationDate})`);
    });
    console.log('');

    // 지정된 버킷이 존재하는지 확인
    const targetBucket = process.env.AWS_S3_BUCKET_NAME;
    const bucketExists = bucketsResult.Buckets?.some(bucket => bucket.Name === targetBucket);
    
    if (bucketExists) {
      console.log(`✓ 타겟 버킷 '${targetBucket}' 존재함`);
      
      // 테스트 파일 업로드
      console.log('2. 테스트 파일 업로드...');
      const testContent = 'S3 연결 테스트 파일 - ' + new Date().toISOString();
      const putCommand = new PutObjectCommand({
        Bucket: targetBucket,
        Key: 'test-connection.txt',
        Body: testContent,
        ContentType: 'text/plain',
        ACL: 'public-read',
      });
      
      const uploadResult = await s3Client.send(putCommand);
      console.log('✓ 테스트 파일 업로드 성공!');
      console.log('업로드 결과:', uploadResult);
      
      const testUrl = `https://${targetBucket}.s3.${process.env.AWS_REGION}.amazonaws.com/test-connection.txt`;
      console.log(`테스트 파일 URL: ${testUrl}`);
      
    } else {
      console.log(`✗ 타겟 버킷 '${targetBucket}' 존재하지 않음`);
    }
    
  } catch (error) {
    console.error('✗ S3 연결 실패:');
    console.error('Error name:', error.name);
    console.error('Error message:', error.message);
    console.error('Error code:', error.Code);
    console.error('HTTP status:', error.$metadata?.httpStatusCode);
    console.error('Request ID:', error.$metadata?.requestId);
    
    if (error.name === 'CredentialsProviderError') {
      console.error('→ AWS 자격 증명 문제입니다. ACCESS_KEY_ID와 SECRET_ACCESS_KEY를 확인하세요.');
    } else if (error.name === 'AccessDenied') {
      console.error('→ IAM 권한 문제입니다. S3 접근 권한을 확인하세요.');
    } else if (error.message?.includes('Network')) {
      console.error('→ 네트워크 연결 문제입니다.');
    }
  }
}

testS3Connection();