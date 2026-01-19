import React, { useEffect, useState } from 'react';
import {
  SafeAreaView,
  View,
  Text,
  FlatList,
  StyleSheet,
  TextInput,
  TouchableOpacity,
  Alert
} from 'react-native';

const API_URL = 'https://noncommunistical-curably-alisa.ngrok-free.dev/api/ujian';

type DataUjian = {
  id: number;
  nama: string;
  nim: string;
};

export default function App() {
  const [data, setData] = useState<DataUjian[]>([]);
  const [nama, setNama] = useState('');
  const [nim, setNim] = useState('');

  // GET DATA
  const getData = async () => {
    try {
      const res = await fetch(API_URL);
      const json = await res.json();
      setData(json);
    } catch (error) {
      console.log('GET ERROR:', error);
    }
  };

  // POST DATA
  const submitData = async () => {
    if (nama.trim() === '' || nim.trim() === '') {
      Alert.alert('Peringatan', 'Nama dan NIM wajib diisi');
      return;
    }

    try {
      const res = await fetch(API_URL, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json',
        },
        body: JSON.stringify({
          nama: nama,
          nim: nim,
        }),
      });

      if (!res.ok) {
        throw new Error('Gagal simpan data');
      }

      setNama('');
      setNim('');
      getData();
      Alert.alert('Sukses', 'Data berhasil disimpan');
    } catch (error) {
      console.log('POST ERROR:', error);
      Alert.alert('Error', 'Data gagal disimpan');
    }
  };

  useEffect(() => {
    getData();
  }, []);

  const renderItem = ({ item }: { item: DataUjian }) => (
    <View style={styles.card}>
      <Text style={styles.text}>Nama: {item.nama}</Text>
      <Text style={styles.text}>NIM: {item.nim}</Text>
    </View>
  );

  return (
    <SafeAreaView style={styles.container}>
      <Text style={styles.title}>Data Mahasiswa</Text>

      {/* FORM INPUT */}
      <View style={styles.form}>
        <TextInput
          placeholder="Nama"
          placeholderTextColor="#888"
          value={nama}
          onChangeText={setNama}
          style={styles.input}
          autoCapitalize="words"
        />

        <TextInput
          placeholder="NIM"
          placeholderTextColor="#888"
          value={nim}
          onChangeText={setNim}
          style={styles.input}
          keyboardType="numeric"
        />

        <TouchableOpacity style={styles.button} onPress={submitData}>
          <Text style={styles.buttonText}>Simpan</Text>
        </TouchableOpacity>
      </View>

      {/* LIST DATA */}
      <FlatList
        data={data}
        keyExtractor={(item) => item.id.toString()}
        renderItem={renderItem}
        ListEmptyComponent={
          <Text style={styles.empty}>Data belum ada</Text>
        }
      />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#ffffff',
    padding: 16
  },
  title: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 16,
    textAlign: 'center',
    color: '#000'
  },
  form: {
    marginBottom: 20
  },
  input: {
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 6,
    padding: 10,
    marginBottom: 10,
    color: '#000'
  },
  button: {
    backgroundColor: '#2563eb',
    padding: 12,
    borderRadius: 6,
    alignItems: 'center'
  },
  buttonText: {
    color: '#fff',
    fontWeight: 'bold'
  },
  card: {
    padding: 12,
    marginBottom: 10,
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 8
  },
  text: {
    fontSize: 16,
    color: '#000'
  },
  empty: {
    textAlign: 'center',
    marginTop: 20,
    color: '#666'
  }
});
