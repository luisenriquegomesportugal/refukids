import { useEffect } from 'react';
import { Alert, Dimensions, FlatList, Image, Linking, Platform, StyleSheet, TouchableOpacity, useColorScheme } from 'react-native';

import { FontAwesome } from '@expo/vector-icons';
import { Stack, useLocalSearchParams, useNavigation } from 'expo-router';
import { useSQLiteContext } from 'expo-sqlite';
import { StatusBar } from 'expo-status-bar';

import { drizzle } from 'drizzle-orm/expo-sqlite';

import { ScrollView, Text, View } from '@/components/Themed';
import * as dbSchemas from "@/database/schema";
import { useCriancasStore } from '@/stories/CriancasStore';
import * as ImagePicker from 'expo-image-picker';

const win = Dimensions.get('window');

export default function Detalhes() {
  const theme = useColorScheme() ?? 'light';

  const { id } = useLocalSearchParams<{ id: string }>();
  const navigator = useNavigation()

  const database = useSQLiteContext()
  const db = drizzle(database, { schema: dbSchemas })

  const { criancas, carregar, entregar } = useCriancasStore()

  useEffect(() => {
    carregar(db)
  }, [])

  const tirarFoto = async () => {
    let result = await ImagePicker.launchCameraAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.All,
      allowsEditing: true,
      aspect: [4, 3],
      quality: 1,
    });

    if (!result.canceled) {
      return result.assets[0].uri;
    }
  };

  async function atualizarEntrega(fotoEntrega?: string) {
    try {
      let update: Partial<dbSchemas.CriancaType> = {
        entregue: true
      }

      if (fotoEntrega) {
        update = {
          ...update,
          fotoEntregue: fotoEntrega
        }
      }

      await entregar(db, Number(id), update)

      Alert.alert("Sucesso", "Crianca entregue com sucesso")
      navigator.goBack()
    } catch (error) {
      Alert.alert("Erro", "Falha ao atualizar a entrega da crianca")

      console.log(error)
    }
  }

  async function entregarCrianca() {
    try {
      Alert.alert(
        "Entregar criança",
        "Deseja bater uma foto do responsável que buscou?",
        [
          {
            text: "Não",
            onPress: async () => {
              await atualizarEntrega()
            }
          },
          {
            text: "Sim",
            onPress: async () => {
              let fotoEntrega = await tirarFoto();
              if (fotoEntrega) {
                await atualizarEntrega(fotoEntrega)
              }
            }
          }
        ]
      )
    } catch (error) {
      Alert.alert("Erro", "Falha ao remover a crianca")

      console.log(error)
    }
  }

  const crianca = criancas?.find(c => c.id === Number(id))
  const fotos = [crianca?.foto]
  if (crianca?.fotoEntregue) {
    fotos.push(crianca?.fotoEntregue)
  }

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <StatusBar style={Platform.OS === 'ios' ? 'light' : 'auto'} />
      <Stack.Screen options={{ title: crianca?.nome }} />
      <FlatList
        horizontal
        style={{ flexGrow: 0 }}
        data={fotos}
        keyExtractor={item => String(item)}
        renderItem={({ item }) => <Image source={{ uri: item }} style={styles.imagem} />} />
      <View style={{ flex: 1 }}>
        <View style={styles.info}>
          <Text style={styles.infoHead}>Número:</Text>
          <Text style={styles.infoValue}>{crianca?.id}</Text>
        </View>
        <View style={styles.info}>
          <Text style={styles.infoHead}>Senha:</Text>
          <Text style={styles.infoValue}>{crianca?.telefone.slice(-4)}</Text>
        </View>
        <View style={styles.info}>
          <Text style={styles.infoHead}>Nome:</Text>
          <Text style={styles.infoValue}>{crianca?.nome}</Text>
        </View>
        <View style={styles.info}>
          <Text style={styles.infoHead}>Responsável:</Text>
          <Text style={styles.infoValue}>{crianca?.responsavel}</Text>
        </View>
        <View style={styles.info}>
          <Text style={styles.infoHead}>Entregue:</Text>
          <Text style={styles.infoValue}>{crianca?.entregue ? 'Sim' : 'Não'}</Text>
        </View>
      </View>
      <View style={styles.botoes}>
        <TouchableOpacity style={styles.botao} onPress={entregarCrianca}>
          <FontAwesome style={[styles.botaoIcon, { color: theme === "light" ? "#000" : "#fff" }]} name='handshake-o' />
          <Text style={styles.botaoLabel}>Entregar criança</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.botao} onPress={() => Linking.openURL(`tel:${crianca?.telefone}`)}>
          <FontAwesome style={[styles.botaoIcon, { color: theme === "light" ? "#000" : "#fff" }]} name='phone' />
          <Text style={styles.botaoLabel}>Ligar para o Responsável</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.botao} onPress={() => Linking.openURL(`http://wa.me/55${crianca?.telefone}`)}>
          <FontAwesome style={[styles.botaoIcon, { color: theme === "light" ? "#000" : "#fff" }]} name='whatsapp' />
          <Text style={styles.botaoLabel}>Whatsapp do Responsável</Text>
        </TouchableOpacity>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  imagem: {
    height: (win.width * 0.5),
    width: (win.width * 0.5) - 10,
    objectFit: 'cover'
  },
  info: {
    gap: 4,
    marginTop: 4,
    paddingHorizontal: 10,
    paddingVertical: 5,
  },
  infoHead: {
    fontSize: 18,
    fontWeight: '300',
  },
  infoValue: {
    fontSize: 18,
    fontWeight: '600',
  },
  botoes: {
    padding: 10,
    gap: 4,
  },
  botao: {
    borderWidth: 1,
    justifyContent: 'flex-start',
    alignItems: 'center',
    flexDirection: 'row',
    padding: 12,
    borderRadius: 5
  },
  botaoIcon: {
    fontSize: 18,
    marginRight: 8,
  },
  botaoLabel: {
    fontSize: 18,
    flex: 1,
  }
})