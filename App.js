import { StatusBar } from 'expo-status-bar';
import React, { useState, useId } from 'react';
import { View, Text, StyleSheet, FlatList, Button, TextInput, Platform } from 'react-native';
import DateTimePicker from '@react-native-community/datetimepicker';
import Task from './Task';

export default function App() {
  const [tasks,setTasks] = useState([
    {id: 1, name: 'Buy Groceries', date: new Date(), importance: 3},
    {id: 2, name: 'Do Laundry', date: new Date(), importance: 3}, 
    {id: 3, name:'Study React Native', date: new Date(), importance: 3}
    ]);
  const [newTask, setNewTask] = useState('');
  const [dueDate, setDueDate] = useState(new Date());
  const [importance, setImportance] = useState(3);
  const [oldId, saveId] = useState(3);

  const [showDPicker, setShowDPicker] = useState(false); // NEW: State to control showing/hiding the DateTimePicker

  const deleteTask = (id) => {//NEW: delete the task with a checkbox
  //IDEA: later add fade out effect
    setTasks(tasks.filter((task) => task.id !== id));
  }

  const handleDateChange = (e) => {//NEW: makes this applicable to anywhere
    const newDate = new Date(e.target.value);
    setDueDate(newDate);
  }

  const addTask = () => {//NEW: add a new task with an id of prevId + 1
    if (newTask.trim() !== ''){
      let tempId = oldId + 1; //IDEA: Research "useId" to generate unique ids, hopefully replace this
      saveId(tempId)
      setTasks([...tasks,{id: tempId, name: newTask, date: dueDate, importance: importance}]);
      setNewTask('');
    }
  }
  const handleEnter = (e) => {//NEW: added later on for convenience in testing
    if (e.key === "Enter") addTask();//IDEA: make it so when you press enter the textbox is reselected, so you don't click every time
  }
  
  //IDEA: make "Lists" into a separate function
  //IDEA: add an archive list

  return (
    <View style={styles.container}>
      <Text style={styles.header}>Task List</Text>
      <FlatList
        data={tasks}
        keyExtractor={item => item.id}
        renderItem={({ item }) => (
          <Task name={item.name} onDelete={deleteTask} id={item.id} date={item.date} importance={item.importance}/>
        )}
      />
      <View style={styles.inputContainer}>
        <TextInput
          style={styles.input}
          placeholder="Enter a new task"
          value={newTask}
          onChangeText={setNewTask}
          onKeyPress={handleEnter}
        />
        
        {/* NEW: Button to open the modal DateTimePicker on Android (inline on some iOS versions) */}
        {showDPicker ? (
        <Button title="Date >" onPress={() => setShowDPicker(!showDPicker)} />) 
        : (<Button title="Date <" onPress={() => setShowDPicker(!showDPicker)} />)
        }
        {showDPicker && (
        
        Platform.OS === 'web' ? (
          // NEW: for if on web, different date selection method
          // IDEA: change this later to make the date selector pop up above the select date option rather than beside
          <input 
            type="date"
            onChange={handleDateChange}
          />
        ) : (
          /* NEW: Conditionally render DateTimePicker based on showPicker */
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
        )
      )
        }
      

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
