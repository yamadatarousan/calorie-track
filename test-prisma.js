import prisma from './lib/prisma.js';
(async () => {
  try {
 // テストデータ挿入
 await prisma.user.create({
   data: {
     email: 'test@example.com',
     name: 'Test User',
     records: {
       create: {
         date: new Date(),
         meal: 'Sushi',
         calories: 500
       }
     }
   }
 });
 // データ取得
 const users = await prisma.user.findMany({
   include: { records: true }
 });
 console.log('データ:', JSON.stringify(users, null, 2));
  } catch (e) {
 console.log('エラー:', e.message);
  }
})();
