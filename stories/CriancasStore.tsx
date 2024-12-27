import * as dbSchemas from "@/database/schema";
import { CriancaType } from "@/database/schema";
import { desc, eq } from "drizzle-orm";
import { ExpoSQLiteDatabase } from "drizzle-orm/expo-sqlite";
import { create } from "zustand";

type CriancasStore = {
    criancas: dbSchemas.CriancaType[] | null,
    carregar: (db: ExpoSQLiteDatabase<typeof dbSchemas>,) => Promise<void>,
    limpar: (db: ExpoSQLiteDatabase<typeof dbSchemas>,) => Promise<void>,
    salvar: (db: ExpoSQLiteDatabase<typeof dbSchemas>, nome: string, responsavel: string, telefone: string, foto: string) => Promise<number>,
    entregar: (db: ExpoSQLiteDatabase<typeof dbSchemas>, id: number, payload: Partial<CriancaType>) => Promise<void>
}

export const useCriancasStore = create<CriancasStore>((set, store) => ({
    criancas: null,
    carregar: async (db) => {
        const criancas = await db.query.crianca.findMany({
            orderBy: desc(dbSchemas.crianca.id)
        })

        set({ criancas })
    },
    limpar: async (db) => {
        await db.delete(dbSchemas.crianca)
        set({ criancas: [] })
    },
    salvar: async (db, nome, responsavel, telefone, foto) => {
        let { lastInsertRowId } = await db.insert(dbSchemas.crianca)
            .values({
                nome: nome,
                responsavel: responsavel,
                telefone: telefone,
                foto: foto
            })

        store()
            .carregar(db)

        return lastInsertRowId
    },
    entregar: async (db, id, payload) => {
        await db.update(dbSchemas.crianca)
            .set(payload)
            .where(eq(dbSchemas.crianca.id, Number(id)))

        store()
            .carregar(db)
    }
}))
