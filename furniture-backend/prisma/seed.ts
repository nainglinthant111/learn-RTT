import { PrismaClient, Prisma } from "@prisma/client";
import bcrypt from "bcrypt";
import { faker } from "@faker-js/faker";

const prisma = new PrismaClient();

// const userData: Prisma.UserCreateInput[] = [
//     {
//         phone: "4123456789",
//         password: "",
//         randonToken: "12345mcmcvndsaidnie6789",
//         email: "teat1@gmail.com",
//     },
//     {
//         phone: "3123456788",
//         password: "",
//         randonToken: "12345mcmcvndsaidnie6789",
//         email: "teat2@gmail.com",
//     },
//     {
//         phone: "2123456787",
//         password: "",
//         randonToken: "12345mcmcvndsaidnie6789",
//         email: "teat3@gmail.com",
//     },
//     {
//         phone: "1123456786",
//         password: "",
//         randonToken: "12345mcmcvndsaidnie6789",
//         email: "teat4@gmail.com",
//     },
//     {
//         phone: "0123456785",
//         password: "",
//         randonToken: "12345mcmcvndsaidnie6789",
//         email: "teat5@gmail.com",
//     },
// ];

export function createRandomUser() {
    return {
        phone: faker.phone.number({ style: "international" }),
        email: faker.internet.email(),
        randonToken: faker.internet.jwt(),
        password: "",
    };
}

export const userData = faker.helpers.multiple(createRandomUser, {
    count: 5,
});

async function main() {
    console.log(`Start seeding ...`);
    const salt = await bcrypt.genSalt(10);
    const password = await bcrypt.hash("12345678", salt);
    for (const u of userData) {
        u.password = password;
        await prisma.user.create({ data: u });
    }
    console.log(`Seeding finished.`);
}
main()
    .then(async () => {
        await prisma.$disconnect();
    })
    .catch(async (e) => {
        console.error(e);
        await prisma.$disconnect();
        process.exit(1);
    });
