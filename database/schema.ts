import { int, integer, sqliteTable, text } from "drizzle-orm/sqlite-core";

export type CriancaType = {
    id: number
    nome: string
    responsavel: string
    telefone: string
    foto: string,
    fotoEntregue: string | null,
    entregue: boolean
}

export const crianca = sqliteTable('criancas', {
    id: integer('id').primaryKey(),
    nome: text('nome').notNull(),
    responsavel: text('responsavel').notNull(),
    telefone: text('telefone').notNull(),
    foto: text('foto').notNull(),
    fotoEntregue: text('foto_entregue'),
    entregue: int('entregue', {mode: "boolean"}).default(false).notNull()
})