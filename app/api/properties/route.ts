import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import jwt from "jsonwebtoken";

// -- FUNÇÃO PARA LISTAR IMÓVEIS --
export async function GET() {
    try {
        //busca todos os imóveis cadastrados no banco de dados, 
        //ordenando-os pela data de criação (do mais recente para o mais antigo).
        const properties = await prisma.property.findMany({
            orderBy: {
                createdAt: 'desc',
            },
        });
        return NextResponse.json(properties, { status: 200 });
    } catch (error) {
        console.error("Error fetching properties:", error);
        return NextResponse.json({ error: "Erro ao Buscar Imóveis!" }, { status: 500 });
    }
}

// -- FUNÇÃO PARA CADASTRAR IMÓVEIS (PROTEGIDO/AUTENTICADO) --
export async function POST(request: Request) {
    try {
        //verifica o token de autenticação no cabeçalho da requisição
        const authHeader = request.headers.get("authorization");

        //se o token estiver ausente ou não começar com "Bearer ", retorna
        if (!authHeader || !authHeader.startsWith("Bearer")) {
            return NextResponse.json({ error: "Token de autenticação ausente!" }, { status: 401 });
        }

        //extrai o token do cabeçalho de autorização
        const token = authHeader.split(' ')[1];

        //verifica a validade do token usando a chave secreta definida nas variáveis de ambiente
        try {
            jwt.verify(token, process.env.JWT_SECRET!);
        } catch (error) {
            return NextResponse.json({ error: "Token de autenticação inválido!" }, { status: 401 });
        }

        //extrai os dados do imóvel do corpo da requisição
        const body = await request.json();

        const newProperty = await prisma.property.create({
            data: {
                title: body.title,
                description: body.description,
                price: parseFloat(body.price), //converte o preço para um número de ponto flutuante
                type: body.type, //apartamento, casa ou kitnet
                bathrooms: parseInt(body.bathrooms), //converte o número de banheiros para um inteiro
                bedrooms: parseInt(body.bedrooms), //converte o número de quartos para um inteiro
                garages: parseInt(body.garages), //converte o número de vagas de garagem para um inteiro
                privateArea: parseFloat(body.privateArea), //converte a área privativa para um número de ponto flutuante
                photo: body.photo, //URL da foto do imóvel
                hasServiceArea: body.hasServiceArea, //indica se o imóvel possui área de serviço
                hasKitchen: body.hasKitchen, //indica se o imóvel possui cozinha
                hasGas: body.hasGas, //indica se o imóvel possui gás encanado
                hasLivingRoom: body.hasLivingRoom, //indica se o imóvel possui sala de estar
            },
        });
        return NextResponse.json(newProperty, { status: 201 });
    } catch (error) {
        console.error("Error creating property:", error);
        return NextResponse.json({ error: "Erro ao Cadastrar Imóvel!" }, { status: 500 });
    }
}