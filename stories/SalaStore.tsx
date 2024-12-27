import AsyncStorage from "@react-native-async-storage/async-storage";
import { create } from "zustand";

type SalaStore = {
    sala: string | null,
    carregarSala: () => void,
    limparSala: () => void,
    salvarSala: (sala: string) => void,
}

export const useSalaStore = create<SalaStore>((set) => ({
    sala: null,
    carregarSala: async () => {
        let sala = await AsyncStorage.getItem('sala');
        set({ sala })
    },
    limparSala: async () => {
        await AsyncStorage.removeItem('sala')
        set({ sala: null })
    },
    salvarSala: async (sala) => {
        await AsyncStorage.setItem('sala', sala);
        set({ sala })
    }
}))
