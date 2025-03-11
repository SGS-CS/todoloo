import { StatusBar } from 'expo-status-bar';
import React, { useState } from 'react';
import { View, Text, StyleSheet, Button, TextInput, Platform } from 'react-native';
import DateTimePicker from '@react-native-community/datetimepicker';

import List from './List';

export default function App() {
  const [tasks, setTasks] = useState([
    { id: 1, name: 'Buy Groceries', date: new Date(), importance: 3 },
    { id: 2, name: 'Do Laundry', date: new Date(), importance: 3 },
    { id: 3, name: 'Study React Native', date: new Date(), importance: 3 },
  ]);

  const [newTask, setNewTask] = useState('');
  const [dueDate, setDueDate] = useState(new Date());
  const [importance, setImportance] = useState(3);
  const [oldId, saveId] = useState(3);

  const [showDPicker, setShowDPicker] = useState(false);

  const deleteTask = (id) => {
    setTasks(tasks.filter((task) => task.id !== id));
  };

  const handleDateChange = (e) => {
    const newDate = new Date(e.target.value);
    setDueDate(newDate);
  };

  const addTask = () => {
    if (newTask.trim() !== '') {
      let tempId = oldId + 1;
      saveId(tempId);
      setTasks([...tasks, { id: tempId, name: newTask, date: dueDate, importance }]);
      setNewTask('');
    }
  };

  const handleEnter = (e) => {
    if (e.key === 'Enter') addTask();
  };

  return (
    <View style={styles.container}>
      {/* 1) This section flexes to fill the screen, showing the list */}
      <View style={styles.listSection}>
        <List header="Main List" items={tasks} deleteItem={deleteTask} />
      </View>

      {/* 2) This section stays at the bottom */}
      <View style={styles.inputContainer}>
        <TextInput
          style={styles.input}
          placeholder="Enter a new task"
          value={newTask}
          onChangeText={setNewTask}
          onKeyPress={handleEnter}
        />

        {showDPicker ? (
          <Button title="Date >" onPress={() => setShowDPicker(!showDPicker)} />
        ) : (
          <Button title="Date <" onPress={() => setShowDPicker(!showDPicker)} />
        )}

        {showDPicker &&
          (Platform.OS === 'web' ? (
            <input type="date" onChange={handleDateChange} />
          ) : (
            <DateTimePicker
              value={dueDate}
              mode="date"
              display={Platform.OS === 'ios' ? 'spinner' : 'default'}
              onChange={(event, selectedDate) => {
                if (selectedDate) {
                  setDueDate(selectedDate);
                }
              }}
            />
          ))}

        <Button title="Add" onPress={addTask} />
      </View>

      <StatusBar style="auto" />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    // Take up the full screen
    flex: 1,
    backgroundColor: '#fff',
    paddingHorizontal: 20,
  },
  listSection: {
    // This grows to fill all remaining vertical space, pushing input to bottom
    flex: 1,
    marginTop: 20,
  },
  inputContainer: {
    // Placed at the bottom (after the list section)
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 20, // Or adjust as desired
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
