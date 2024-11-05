import { prisma } from "../src/lib/prisma"
import dotenv from 'dotenv'

dotenv.config()


async function seed() {

  if(process.env.USERNAME_USER === undefined || process.env.PASSWORD_USER === undefined){
    throw new Error('.env is undefined')
  }

  const existingUser = await prisma.user.findUnique({
    where: { username: process.env.USERNAME_USER }
  });

  if (!existingUser) {
    await prisma.user.create({
      data: {
        username: process.env.USERNAME_USER,
        password: process.env.PASSWORD_USER
      }
    });
    console.log('Usuário criado e banco de dados seeded!');
  } else {
    console.log('Usuário já existe, nenhum dado foi alterado.');
  }
}

seed().then(() => {
  console.log('Database seeded!')
  prisma.$disconnect()
})