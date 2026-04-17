import { prisma } from "@/lib/prisma";
import { NextResponse } from "next/server";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";

export async function POST(request: Request) {
    try {
        const body = await request.json();
        const { email, password } = body;

        //procura um usuário com o email fornecido
        const admin = await prisma.admin.findUnique({
            where: { email },
        });

        if (!admin) {
            return NextResponse.json({ error: "Email ou senha inválidos!" }, { status: 401 });
        }

        //verifica se a senha fornecida corresponde à senha armazenada
        const isPasswordValid = await bcrypt.compare(password, admin.password);
        if (!isPasswordValid) {
            return NextResponse.json({ error: "Email ou senha inválidos!" }, { status: 401 });
        }

        //gerar um token JWT
        //crachá de 24h
        const secret = process.env.JWT_SECRET!;
        const token = jwt.sign({ adminId: admin.id }, secret, { expiresIn: "24h" });

        return NextResponse.json({ token });
        
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    } catch (error) {
        return NextResponse.json({ error: "Falha ao fazer login!" }, { status: 500 });
    }
}