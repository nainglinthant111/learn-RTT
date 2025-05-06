import { prisma } from "../services/prismaClient";
export type PostArgs = {
    title: string;
    content: string;
    image: string;
    authorId: number;
    body: string;
    category: string;
    type: string;
    tags: string[];
};
export const createOnePost = async (postData: PostArgs) => {
    const data: any = {
        title: postData.title,
        content: postData.content,
        image: postData.image,
        author: {
            connect: {
                id: postData.authorId,
            },
        },
        body: postData.body,
        category: {
            connectOrCreate: {
                where: {
                    name: postData.category,
                },
                create: {
                    name: postData.category,
                },
            },
        },
        type: {
            connectOrCreate: {
                where: {
                    name: postData.type,
                },
                create: {
                    name: postData.type,
                },
            },
        },
    };
    if (postData.tags && postData.tags.length > 0) {
        data.postTags = {
            connectOrCreate: postData.tags.map((tagName: string) => ({
                where: { name: tagName },
                create: { name: tagName },
            })),
        };
    }
    return prisma.post.create({ data: data });
};

export const getPostById = async (id: number) => {
    return prisma.post.findUnique({ where: { id } });
};
export const updatePostById = async (id: number, reqData: any) => {
    const data: any = {
        title: reqData.title,
        content: reqData.content,
        body: reqData.body,
        category: {
            connectOrCreate: {
                where: {
                    name: reqData.category,
                },
                create: {
                    name: reqData.category,
                },
            },
        },
        type: {
            connectOrCreate: {
                where: {
                    name: reqData.type,
                },
                create: {
                    name: reqData.type,
                },
            },
        },
    };
    if (reqData.image) {
        data.image = reqData.image;
    }
    if (reqData.tags && reqData.tags.length > 0) {
        data.postTags = {
            connectOrCreate: reqData.tags.map((tagName: string) => ({
                where: { name: tagName },
                create: { name: tagName },
            })),
        };
    }
    return prisma.post.update({ where: { id }, data: data });
};

export const deletePostById = async (id: number) => {
    return prisma.post.delete({ where: { id } });
};
export const getPostWithRelations = async (id: number) => {
    return prisma.post.findUnique({
        where: { id },
        select: {
            id: true,
            title: true,
            content: true,
            image: true,
            body: true,
            category: {
                select: {
                    name: true,
                },
            },
            author: {
                select: {
                    fullName: true,
                },
            },
            type: {
                select: {
                    name: true,
                },
            },
            postTags: {
                select: {
                    name: true,
                },
            },
            updatedAt: true,
        },
    });
};

export const getPostsList = async (options: any) => {
    return prisma.post.findMany(options);
};
