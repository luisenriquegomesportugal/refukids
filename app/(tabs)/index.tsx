import { useEffect } from 'react';
import { Dimensions, FlatList, Image, StyleSheet } from 'react-native';

import { drizzle } from 'drizzle-orm/expo-sqlite';

import { Link, Tabs } from 'expo-router';
import { useSQLiteContext } from 'expo-sqlite';

import SalaRefukidsToggle from '@/components/SalaRefukidsToggle';
import SalaRefukidsValidate from '@/components/SalaRefukidsValidate';
import { Text, View } from '@/components/Themed';
import * as dbSchemas from "@/database/schema";
import { useCriancasStore } from '@/stories/CriancasStore';

const win = Dimensions.get('window');

export default function Index() {
  const database = useSQLiteContext()
  const db = drizzle(database, { schema: dbSchemas })

  const { criancas, carregar } = useCriancasStore()

  useEffect(() => {
    carregar(db)
  }, [])

  return (
    <View style={styles.container}>
      <Tabs.Screen options={{
        headerRight: ({ }) => <SalaRefukidsToggle />
      }} />
      <SalaRefukidsValidate>
        <FlatList
          data={criancas}
          numColumns={2}
          keyExtractor={item => String(item.id)}
          renderItem={({ item }) => (
            <Link href={`/detalhes/${item.id}`}>
              <View style={styles.itemContainer}>
                <View style={styles.itemNumeroContainer}>
                  <Text style={styles.itemNumeroLabel}>{item.id}</Text>
                </View>
                <Image source={{ uri: item.foto }} style={[styles.itemImagem, { opacity: item.entregue ? 0.4 : 1 }]} />
              </View>
            </Link>
          )}
          ListEmptyComponent={() => <Text style={styles.emptyList}>Nenhuma criança listada</Text>} />
      </SalaRefukidsValidate>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  input: {
    height: 48,
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 6,
    width: '100%',
    paddingHorizontal: 16,
  },
  separator: {
    marginVertical: 10,
    marginHorizontal: 'auto',
    height: 1,
    width: '80%',
  },
  emptyList: {
    paddingVertical: 16,
    fontSize: 16
  },
  itemImagem: {
    width: win.width / 2,
    height: win.width / 2,
    objectFit: 'cover'
  },
  itemContainer: {
    flex: 1,
    position: "relative"
  },
  itemNumeroContainer: {
    position: 'absolute',
    bottom: 10,
    right: 10,
    borderRadius: 50,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: "#fff",
    width: 30,
    height: 30,
    zIndex: 1,
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 1,
    },
    shadowOpacity: 0.40,
    shadowRadius: 1.41,
    elevation: 2,
  },
  itemNumeroLabel: {
    color: "#000",
    fontWeight: '500'
  }
});
