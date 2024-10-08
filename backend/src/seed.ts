import prisma from "./lib/prisma";

async function main() {
    const user=await prisma.user.create({
        data: {
            email: "xxx@gmail.com",
            username: "Alice",
            password: "123456",
        },
    })
    console.log(user);
}

main();