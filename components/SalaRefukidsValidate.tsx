import { useSalaStore } from "@/stories/SalaStore";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import { ReactNode } from "react";
import { useColorScheme } from "react-native";
import { Text, View } from "./Themed";

export default function SalaRefukidsValidate({ children }: { children: ReactNode }) {
    const theme = useColorScheme() ?? 'light';
    const { sala } = useSalaStore()

    if (!sala) {
        return <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center', gap: 8, paddingHorizontal: 10 }}>
            <MaterialCommunityIcons name='google-classroom' size={32} color={theme === 'light' ? "#000" : "#fff"} />
            <Text style={{ fontSize: 16, textAlign: 'center' }}>Para começar, selecione uma sala clicando em Salas no canto superior direito.</Text>
        </View>
    }

    return children
}