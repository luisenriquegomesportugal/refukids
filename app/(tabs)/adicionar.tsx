import { useState } from 'react';
import { Alert, Dimensions, Image, Keyboard, Linking, StyleSheet, TextInput, TouchableOpacity, TouchableOpacityProps, TouchableWithoutFeedback, useColorScheme } from 'react-native';

import * as ImagePicker from 'expo-image-picker';

import { Text, View } from '@/components/Themed';
import Colors from '@/constants/Colors';
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view';


import SalaRefukidsToggle from '@/components/SalaRefukidsToggle';
import SalaRefukidsValidate from '@/components/SalaRefukidsValidate';
import * as dbSchemas from "@/database/schema";
import { useCriancasStore } from '@/stories/CriancasStore';
import { useSalaStore } from '@/stories/SalaStore';
import { drizzle } from 'drizzle-orm/expo-sqlite';
import { Tabs } from 'expo-router';
import { useSQLiteContext } from 'expo-sqlite';
import { useHandleCamera } from '@/utils/handleCameraPermission';

const win = Dimensions.get('window');

export default function Adicionar() {
  const colorScheme = useColorScheme();
  const handleCamera = useHandleCamera()

  const { sala } = useSalaStore()

  const [foto, setFoto] = useState('')
  const [nome, setNome] = useState('')
  const [responsavel, setResponsavel] = useState('')
  const [telefone, setTelefone] = useState('')

  const database = useSQLiteContext()
  const db = drizzle(database, { schema: dbSchemas })

  const { salvar } = useCriancasStore()

  const tirarFoto = async () => {
    let result = await ImagePicker.launchCameraAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.All,
      allowsEditing: true,
      aspect: [4, 3],
      quality: 1,
    });

    if (!result.canceled) {
      setFoto(result.assets[0].uri);
    }
  };

  const cadastrarCrianca = async () => {
    if (
      !nome ||
      !responsavel ||
      !telefone ||
      !foto
    ) {
      Alert.alert("Erro", "Todos os campos são obrigatórios")
      return
    }

    try {
      let lastInsertRowId = await salvar(db, nome, responsavel, telefone, foto)

      let senha = telefone.slice(-4)
      let message = `Ola ${responsavel}
Aqui é o tio(a) da Refukids, estamos muito felizes de ter sua criança cultuando aqui conosco. 
      
Sala: ${sala}
Nome: ${nome}
Número: ${lastInsertRowId}
Senha: ${senha}
      
Lembramos que é importante que ao final do culto *Você* venha buscar sua criança aqui na sala, e não terceiros.
      
Deus abençoe seu culto.`

      let linkCompartilhar = `https://wa.me/${telefone}?text=${message}`

      Alert.alert(
        "Sucesso",
        `Crianca nº ${lastInsertRowId} cadastrada com sucesso com senha: ${senha}`,
        [
          {
              text: 'Não',
              isPreferred: false,
              style: 'cancel'
          },
          {
            text: 'Compartilhar',
            isPreferred: true,
            onPress: () => {
              Linking.openURL(linkCompartilhar)
            }
          }
        ]
      )

      setFoto('');
      setNome('');
      setResponsavel('');
      setTelefone('');
    } catch (error) {
      Alert.alert("Erro", "Falha ao cadastrar a crianca")

      console.log(error)
    }
  }


  return (
    <>
      <Tabs.Screen options={{
        headerRight: ({ }) => <SalaRefukidsToggle />
      }} />
      <SalaRefukidsValidate>
        <TouchableWithoutFeedback style={styles.container} onPress={Keyboard.dismiss}>
          <KeyboardAwareScrollView contentContainerStyle={[styles.scrollview, { backgroundColor: Colors[colorScheme!].background }]}>
            {foto && <Image source={{ uri: foto }} style={styles.imagem} />}
            <TouchableOpacity onPress={async e => await handleCamera(tirarFoto)} style={styles.botao}>
              <Text style={[styles.botaoLabel, { color: Colors[colorScheme!].text }]}>Tirar foto</Text>
            </TouchableOpacity>
            <View style={styles.separator} lightColor="#ccc" darkColor="rgba(255,255,255,0.2)" />
            <TextInput
              style={[styles.input, { backgroundColor: Colors[colorScheme!].background, color: Colors[colorScheme!].text }]}
              placeholder="Nome da criança"
              onChangeText={setNome}
              value={nome} />
            <TextInput
              style={[styles.input, { backgroundColor: Colors[colorScheme!].background, color: Colors[colorScheme!].text }]}
              placeholder="Nome do responsável"
              onChangeText={setResponsavel}
              value={responsavel} />
            <TextInput
              style={[styles.input, { backgroundColor: Colors[colorScheme!].background, color: Colors[colorScheme!].text }]}
              placeholder="Wpp do responsável"
              onChangeText={setTelefone}
              value={telefone} />
            <TouchableOpacity onPress={cadastrarCrianca} style={[styles.botao, { backgroundColor: Colors[colorScheme!].background }]}>
              <Text style={[styles.botaoLabel, { color: Colors[colorScheme!].text }]}>Salvar</Text>
            </TouchableOpacity>
          </KeyboardAwareScrollView>
        </TouchableWithoutFeedback>
      </SalaRefukidsValidate>
    </>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1
  },
  scrollview: {
    flex: 1,
    gap: 10,
    padding: 10,
    justifyContent: 'flex-start'
  },
  loading: {
    flex: 1,
    alignItems: 'center',
    justifyContent: "center"
  },
  message: {
    textAlign: 'center',
    paddingBottom: 10,
  },
  title: {
    fontSize: 20,
    fontWeight: 'bold',
  },
  separator: {
    marginVertical: 10,
    marginHorizontal: 'auto',
    height: 1,
    width: '80%',
  },
  input: {
    height: 48,
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 6,
    width: '100%',
    paddingHorizontal: 16,
  },
  imagem: {
    height: 362 * (win.width / 541),
    width: win.width - 20,
    borderRadius: 6,
    objectFit: 'cover'
  },
  botao: {
    paddingVertical: 16,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 6,
    width: '100%',
  },
  botaoLabel: {
    fontSize: 16,
    fontWeight: '600'
  }
})