import { prisma } from "@/lib/prisma";
import { NextResponse } from "next/server";

//--- BUSCAR PROPRIEDADE POR ID ---
export async function GET(
    request: Request,
    { params }: { params: { id: string } }
) {
    try {
        //busca apenas o imovel que tenha o id na URL
        const property = await prisma.property.findUnique({
            where: { id: params.id },
        });

        if (!property) {
            return NextResponse.json({ error: "Imóvel não encontrado" }, { status: 404 });
        }

        return NextResponse.json(property, { status: 200 });
    } catch (error) {
        console.error("Error fetching property:", error);
        return NextResponse.json({ error: "Failed to fetch property" }, { status: 500 });
    }
}

export async function PUT(
    request: Request,
    { params }: { params: { id: string } }
) {
    try {
        const body = await request.json();

        //atualiza o imovel que tenha o id na URL com os dados do body
        const updatedProperty = await prisma.property.update({
            where: { id: params.id },
            data: {
                title: body.title,
                description: body.description,
                price: body.price,
            },
        });
        
        return NextResponse.json(updatedProperty, { status: 200 });
    } catch (error) {
        console.error("Error updating property:", error);
        return NextResponse.json({ error: "Falha ao atualizar imóvel!" }, { status: 500 });
    }
}

//--- DELETAR PROPRIEDADE POR ID ---
    export async function DELETE(
        request: Request,
        { params }: { params: { id: string } }
    ) {
        try {
            //deleta o imovel que tenha o id na URL
            await prisma.property.delete({
                where: { id: params.id },
            });
            return new Response("Imóvel deletado com sucesso!", { status: 200 });
        } catch (error) {
            return NextResponse.json({ error: "Falha ao deletar imóvel!" }, { status: 500 });

        }
    }