import { PrismaClient } from "@prisma/client";
const prisma = new PrismaClient();

export const getUserByPhone = async (phone: string) => {
    return prisma.user.findUnique({ where: { phone } });
};

export const createOtp = async (otpData: any) => {
    return prisma.otp.create({ data: otpData });
};

export const getOtpByPhone = async (phone: string) => {
    return prisma.otp.findUnique({ where: { phone } });
};

export const updateOtp = async (id: number, otpdata: any) => {
    return prisma.otp.update({ where: { id }, data: otpdata });
};

export const createUser = async (userData: any) => {
    return prisma.user.create({ data: userData });
};

export const updateUser = async (id: number, userdata: any) => {
    return prisma.user.update({ where: { id }, data: userdata });
};

export const getUserById = async (id: number) => {
    return prisma.user.findUnique({ where: { id } });
};
