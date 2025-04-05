import { StatusBar } from 'expo-status-bar';
import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  Button,
  TextInput,
  Platform,
  TouchableOpacity,
} from 'react-native';
import DateTimePicker from '@react-native-community/datetimepicker';
import { Picker } from '@react-native-picker/picker';

import List from './List';

export default function App() {
  const [tasks, setTasks] = useState([
    { id: 1, name: 'Buy Groceries', date: new Date(), importance: 3, tags: ['main'] },
    { id: 2, name: 'Do Laundry', date: new Date(), importance: 3, tags: ['main'] },
    { id: 3, name: 'Study React Native', date: new Date(), importance: 3, tags: ['main'] },
    { id: 4, name: 'Old Task', date: new Date(), importance: 3, tags: ['archived'] },
  ]);
  const [newTask, setNewTask] = useState('');
  const [dueDate, setDueDate] = useState(new Date());
  const [importance, setImportance] = useState(5);
  const [lastId, setLastId] = useState(5);
  const [showDPicker, setShowDPicker] = useState(false);
  const [showImportancePicker, setShowImportancePicker] = useState(false);

  // New state for tag input
  const [newTag, setNewTag] = useState('');
  const [newTaskTags, setNewTaskTags] = useState([]);

  const archiveTask = (id) => {
    setTasks(tasks.map(task => {
      if (task.id === id) {
        return { ...task, tags: task.tags.includes("archived") ? task.tags : [...task.tags, "archived"] };
      }
      return task;
    }));
  };

  const handleDateChange = (e) => {
    const newDate = new Date(e.target.value);
    setDueDate(newDate);
  };

  const addTask = () => {
    if (newTask.trim() !== '') {
      const newId = lastId + 1;
      setLastId(newId);
      // Ensure the task has the "main" tag by default.
      const finalTags = newTaskTags.includes("main") ? newTaskTags : ["main", ...newTaskTags];
      setTasks([...tasks, { id: newId, name: newTask, date: dueDate, importance, tags: finalTags }]);
      setNewTask('');
      setNewTaskTags([]);
    }
  };

  const handleEnter = (e) => {
    if (e.key === 'Enter') addTask();
  };

  const handleAddTag = () => {
    if (newTag.trim() !== '') {
      setNewTaskTags([...newTaskTags, newTag.trim()]);
      setNewTag('');
    }
  };

  const removeTag = (index) => {
    setNewTaskTags(newTaskTags.filter((_, i) => i !== index));
  };

  const mainTasks = tasks.filter(task => task.tags.includes("main") && !task.tags.includes("archived"));
  const archivedTasks = tasks.filter(task => task.tags.includes("archived"));

  const sections = [
    { title: 'Main List', data: mainTasks },
    { title: 'Archive', data: archivedTasks },
  ];

  return (
    <View style={styles.container}>
      <List sections={sections} archiveItem={archiveTask} />

      <View style={styles.inputContainer}>
        <TextInput
          style={styles.input}
          placeholder="Enter a new task"
          value={newTask}
          onChangeText={setNewTask}
          onKeyPress={handleEnter}
        />

        {/* Tag Input Section */}
        <View style={styles.tagInputContainer}>
          <TextInput
            style={styles.tagInput}
            placeholder="Enter tag"
            value={newTag}
            onChangeText={setNewTag}
          />
          <Button title="Add Tag" onPress={handleAddTag} />
        </View>
        {/* Display added tags */}
        <View style={styles.tagsContainer}>
          {newTaskTags.map((tag, index) => (
            <View key={index} style={styles.tagChip}>
              <Text style={styles.tagText}>{tag}</Text>
              <TouchableOpacity onPress={() => removeTag(index)}>
                <Text style={styles.removeTag}>X</Text>
              </TouchableOpacity>
            </View>
          ))}
        </View>

        {/* Date/Time Picker */}
        <Button title="Date" onPress={() => setShowDPicker(!showDPicker)} />
        {showDPicker && (
          Platform.OS === 'web' ? (
            <input type="datetime-local" onChange={handleDateChange} />
          ) : (
            <DateTimePicker
              value={dueDate}
              mode="datetime"
              display={Platform.OS === 'ios' ? 'spinner' : 'default'}
              onChange={(event, selectedDate) => {
                if (selectedDate) {
                  setDueDate(selectedDate);
                }
              }}
            />
          )
        )}

        {/* Importance Dropdown */}
        <View style={styles.pickerContainer}>
          <Picker
            selectedValue={importance}
            style={{ height: 20, width: 150 }}
            onValueChange={(itemValue) => setImportance(itemValue)}
          >
            {Array.from({ length: 10 }, (_, i) => i + 1).map(val => (
              <Picker.Item key={val} label={String(val)} value={val} />
            ))}
          </Picker>
          <Text>Importance: {importance}</Text>
        </View>

        <Button title="Add" onPress={addTask} />
      </View>

      <StatusBar style="auto" />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    paddingHorizontal: 20,
  },
  inputContainer: {
    flexDirection: 'column',
    alignItems: 'center',
    marginBottom: 20,
  },
  input: {
    width: '100%',
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 8,
    padding: 10,
    marginBottom: 10,
  },
  pickerContainer: {
    alignItems: 'center',
    marginVertical: 10,
  },
  tagInputContainer: {
    flexDirection: 'row',
    width: '100%',
    alignItems: 'center',
    marginBottom: 5,
  },
  tagInput: {
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 8,
    padding: 5,
    marginRight: 5,
  },
  tagsContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    marginBottom: 10,
  },
  tagChip: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#ddd',
    borderRadius: 15,
    paddingHorizontal: 10,
    paddingVertical: 5,
    marginRight: 5,
    marginBottom: 5,
  },
  tagText: {
    marginRight: 5,
  },
  removeTag: {
    color: 'red',
    fontWeight: 'bold',
  },
});
