import { StatusBar } from 'expo-status-bar';
import React, { useState, useId } from 'react';
import { View, Text, StyleSheet, FlatList, Button, TextInput } from 'react-native';
import Task from './Task';

export default function App() {
  const [tasks,setTasks] = useState([
    {id: 1, name: 'Buy Groceries'},
    {id: 2, name: 'Do Laundry'}, 
    {id: 3, name:'Study React Native'}
    ]);
  const [newTask, setNewTask] = useState('');
  const [oldId, saveId] = useState(3);
  
  const deleteTask = (id) => {//delete the task with a checkbox
    setTasks(tasks.filter((task) => task.id !== id));
  }

  const addTask = () => {//add a new task with an id of prevId + 1
    if (newTask.trim() !== ''){
      let tempId = oldId + 1; //Research "useId" to generate unique ids, hopefully replace this
      saveId(tempId)
      setTasks([...tasks,{id: tempId, name: newTask}]);
      setNewTask('');
    }
  }

  return (
    <View style={styles.container}>
      <Text style={styles.header}>Task List</Text>
      <FlatList
        data={tasks}
        keyExtractor={item => item.id}
        renderItem={({ item }) => (
          <Task name={item.name} onDelete={deleteTask} id={item.id} />
        )}
      />
      <View style={styles.inputContainer}>
      <TextInput
        style={styles.input}
        placeholder="Enter a new task"
        value={newTask}
        onChangeText={setNewTask}
      />
      <Button title="Add" onPress={addTask} />
      </View>
      <StatusBar style="auto" />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: '#fff',
  },
  header: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 20,
  },
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 20,
  },
  input: {
    flex: 1,
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 8,
    padding: 10,
    marginRight: 10,
  },
});
