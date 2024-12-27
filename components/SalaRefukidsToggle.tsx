import * as dbSchemas from "@/database/schema";
import { useSalaStore } from "@/stories/SalaStore";
import { useActionSheet } from "@expo/react-native-action-sheet";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import { drizzle } from "drizzle-orm/expo-sqlite";
import { useSQLiteContext } from "expo-sqlite";
import { useEffect } from "react";
import { Alert, TouchableOpacity, View, useColorScheme } from "react-native";
import { Text } from "./Themed";
import { useCriancasStore } from "@/stories/CriancasStore";

export default function SalaRefukidsToggle() {
    const database = useSQLiteContext()
    const db = drizzle(database, { schema: dbSchemas })

    const { limpar } = useCriancasStore()
    const { sala, carregarSala, salvarSala, limparSala } = useSalaStore()

    const { showActionSheetWithOptions } = useActionSheet();
    const theme = useColorScheme() ?? 'light';

    useEffect(() => {
        carregarSala()
    }, [])

    const selecionarSala = async () => {
        try {
            let salas = ['Refubabies', 'Refukids 1', 'Refukids 2', 'Refuteens', 'Encerrar sala', 'Cancelar']
            showActionSheetWithOptions({
                title: "Sala",
                message: "Qual sala você está",
                options: salas,
                cancelButtonIndex: 5,
                destructiveButtonIndex: 4,
                disabledButtonIndices: sala ? [0, 1, 2, 3] : [4],
            }, (selectedIndex?: number) => {
                switch (selectedIndex) {
                    case 0:
                    case 1:
                    case 2:
                    case 3:
                        salvarSala(salas[selectedIndex])
                        Alert.alert("Sucesso", "Sala salva com sucesso")
                        break;
                    case 4:
                        Alert.alert(
                            "Encerrar sala",
                            "Você deseja encerrar a sala? isso irá apagar todos os dados salvos.",
                            [
                                {
                                    text: 'Não',
                                    isPreferred: true,
                                    style: 'cancel'
                                },
                                {
                                    text: "Sim",
                                    onPress: async () => {
                                        await db.delete(dbSchemas.crianca)
                                        limparSala()
                                        limpar(db)

                                        Alert.alert("Sucesso", "Sala encerrada com sucesso")
                                    }
                                }
                            ]
                        )
                        break;
                    default:
                        return;
                }
            });
        } catch (error) {
            Alert.alert("Erro", "Falha ao salvar a sala")

            console.log(error)
        }
    };


    return <TouchableOpacity onPress={selecionarSala} style={{ flex: 1, paddingHorizontal: 10, flexDirection: "row", alignItems: 'center', justifyContent: 'center', gap: 6 }}>
            <MaterialCommunityIcons name='google-classroom' size={18} color={theme === 'light' ? "#000" : "#fff"} />
            <Text style={{ fontSize: 16 }}>{sala || "Salas"}</Text>
        </TouchableOpacity>
}