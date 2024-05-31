import React, { useState, useEffect } from 'react';
import { StyleSheet, Text, View, TextInput, Button, FlatList, TouchableOpacity } from 'react-native';
import { getFirestore, collection, addDoc, onSnapshot, deleteDoc, doc, updateDoc } from 'firebase/firestore'; // Ne laissez qu'une seule fois

import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
import { isSupported } from '@firebase/analytics';

if (isSupported()) {
  // Initialisation de Firebase Analytics
}

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyD_BIHiRubYh2zETW2mzmZNCD24PvVSTTA",
  authDomain: "todo-1c4f0.firebaseapp.com",
  projectId: "todo-1c4f0",
  storageBucket: "todo-1c4f0.appspot.com",
  messagingSenderId: "87436065332",
  appId: "1:87436065332:web:46cb6dcf60138aaea02861",
  measurementId: "G-G25JQM5913"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);
const db = getFirestore(app);

export default function TodoApp() {
  const [task, setTask] = useState('');
  const [tasks, setTasks] = useState([]);
  const [newTaskText, setNewTaskText] = useState('');
  const [editingTaskId, setEditingTaskId] = useState(null);

  useEffect(() => {
    const unsubscribe = onSnapshot(collection(db, 'tasks'), (snapshot) => {
      const tasksList = snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      }));
      setTasks(tasksList);
    });

    return () => unsubscribe();
  }, []);

  const handleAddTask = async () => {
    if (task.trim()) {
      await addDoc(collection(db, 'tasks'), { text: task.trim() });
      setTask('');
    }
  };

  const handleDeleteTask = async (id) => {
    await deleteDoc(doc(db, 'tasks', id));
  };

  const handleUpdateTask = async (id) => {
    await updateDoc(doc(db, 'tasks', id), { text: newTaskText });
    setEditingTaskId(null);
    setNewTaskText('');
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Todo App</Text>
      <TextInput
        style={styles.input}
        placeholder="New Task"
        value={task}
        onChangeText={setTask}
      />
      <Button title="Add Task" onPress={handleAddTask} />
      <FlatList
        data={tasks}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          <View style={styles.taskContainer}>
            {editingTaskId === item.id ? (
              <>
                <TextInput
                  style={styles.editInput}
                  value={newTaskText}
                  onChangeText={setNewTaskText}
                />
                <Button title="Save" onPress={() => handleUpdateTask(item.id)} />
              </>
            ) : (
              <>
                <Text style={styles.taskText}>{item.text}</Text>
                <TouchableOpacity onPress={() => setEditingTaskId(item.id)}>
                  <Text style={styles.editButton}>Edit</Text>
                </TouchableOpacity>
                <TouchableOpacity onPress={() => handleDeleteTask(item.id)}>
                  <Text style={styles.deleteButton}>Delete</Text>
                </TouchableOpacity>
              </>
            )}
          </View>
        )}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    padding: 20,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 20,
  },
  input: {
    height: 40,
    borderColor: '#ddd',
    borderWidth: 1,
    marginBottom: 20,
    paddingHorizontal: 10,
  },
  editInput: {
    flex: 1,
    height: 40,
    borderColor: '#ddd',
    borderWidth: 1,
    marginRight: 10,
    paddingHorizontal: 10,
  },
  taskContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 10,
    borderBottomColor: '#ddd',
    borderBottomWidth: 1,
  },
  taskText: {
    flex: 1,
    fontSize: 18,
  },
  editButton: {
    color: 'blue',
    marginRight: 10,
  },
  deleteButton: {
    color: 'red',
  },
});
