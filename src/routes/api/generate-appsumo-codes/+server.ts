// import { v4 as uuidv4 } from 'uuid';
// import { writeFile } from 'fs';
// import { prismaClient } from '$lib/server/prisma';

// export const GET = async () => {
// let codes = []

// for (let i = 0; i < 10000; i++) {
//     codes[i] =  {code: uuidv4().replaceAll('-', '')}
// }

// const csv = codes.map(row => Object.values(row).join(',')).join('\n');
// n

// const createMany = await prismaClient.appSumoCodes.createMany({
//     data: codes
//   })

// writeFile('./codes.csv', csv, err => {
//     if (err) {
//       console.error(err);
//     }
//     // file written successfully
//   });

//   return
// }
