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
import TagChip from './TagChip';
import { app, db } from './firebase'; // adjust the path if needed
import { collection, addDoc, deleteDoc, doc, getDocs, updateDoc, onSnapshot, query, where, Timestamp } from 'firebase/firestore';
import { FlatList } from 'react-native';

import List from './List';


export default function App() {
  const [tasks, setTasks] = useState([
  ]);
  const [newTask, setNewTask] = useState('');
  const [dueDate, setDueDate] = useState(new Date());
  const [importance, setImportance] = useState(5);
  const [lastId, setLastId] = useState(5);
  const [showDPicker, setShowDPicker] = useState(false);
  const [newTag, setNewTag] = useState('');
  const [newTaskTags, setNewTaskTags] = useState([]);
  const [sortBy, setSortBy] = useState('date');
  const [sortOrder, setSortOrder] = useState('asc');
  const [filterTag, setFilterTag] = useState(null);


  const sortTasks = (taskList) => {
    const sorted = [...taskList].sort((a, b) => {
      let aVal, bVal;
      if (sortBy === 'date') {
        aVal = a.date; bVal = b.date;
      } else if (sortBy === 'importance') {
        aVal = a.importance; bVal = b.importance;
      } else if (sortBy === 'alphabetical') {
        aVal = a.name.toLowerCase(); bVal = b.name.toLowerCase();
      } else if (sortBy === 'suggested') {
        const days = (d) => Math.max((d.date - new Date()) / (1000 * 60 * 60 * 24), 1);
        aVal = a.importance / days(a);
        bVal = b.importance / days(b);
      }
      if (aVal < bVal) return sortOrder === 'asc' ? -1 : 1;
      if (aVal > bVal) return sortOrder === 'asc' ? 1 : -1;
      return 0;
    });
    return sorted;
  };

  React.useEffect(() => {
    const unsubscribe = onSnapshot(collection(db, "tasks"), (querySnapshot) => {
      const tasksFromFirestore = [];
      querySnapshot.forEach((doc) => {
        tasksFromFirestore.push({
          ...doc.data(),
          id: doc.id,
          date: doc.data().date?.toDate?.() ?? new Date(),
        });
      });
      setTasks(tasksFromFirestore);
    });

    // Clean up listener on unmount
    return () => unsubscribe();
  }, []);
  const addTaskToFirestore = async (task) => {
    try {
      // Validate the date field
      const firestoreTask = {
        ...task,
        date: task.date instanceof Date && !isNaN(task.date)
          ? Timestamp.fromDate(task.date)
          : Timestamp.fromDate(new Date()), // fallback if needed

      };

      await addDoc(collection(db, "tasks"), firestoreTask);
    } catch (error) {
      console.error("Error adding task to Firestore:", error);
    }
  };

  const deleteTaskFromFirestore = async (taskId) => {
    try {
      await deleteDoc(doc(db, "tasks", taskId));
      setTasks(prev => prev.filter(task => task.id !== taskId)); // remove from local state
    } catch (error) {
      console.error("Error deleting task:", error);
    }
  };

  const recycleTasks = async () => {
    try {
      // Query tasks with the "recycled" tag
      if (!confirm("Are you sure you want to permanently delete all tasks in the recycling bin?")) return;
      const q = query(collection(db, "tasks"), where("tags", "array-contains", "recycled"));
      const querySnapshot = await getDocs(q);

      const deletePromises = [];
      const recycledIds = [];

      querySnapshot.forEach((docSnap) => {
        deletePromises.push(deleteDoc(doc(db, "tasks", docSnap.id)));
        recycledIds.push(docSnap.id);
      });


      await Promise.all(deletePromises);

      // Remove from local state
      setTasks(prevTasks => prevTasks.filter(task => !recycledIds.includes(task.id)));

      alert("recycle bin emptied!");
    } catch (error) {
      console.error("Error deleting recycled tasks:", error);
    }
  };

  const editTaskInFirestore = async (taskId, updatedFields) => {
    try {
      const taskRef = doc(db, "tasks", taskId);
      await updateDoc(taskRef, updatedFields);

      // Optional: update local state
      setTasks(prev =>
        prev.map(task =>
          task.id === taskId ? { ...task, ...updatedFields } : task
        )
      );
    } catch (error) {
      console.error("Error updating task:", error);
    }
  };

  const recycleTask = (id) => {
    setTasks(tasks.map(task => {
      if (task.id === id) {
        editTaskInFirestore(task.id, {
          tags: [...task.tags, "recycled"]
        });
        return { ...task, tags: task.tags.includes("recycled") ? task.tags : [...task.tags, "recycled"] };

      }
      return task;
    }));

  };

  const handleDateChange = (e) => {
    const newDate = new Date(e.target.value);
    setDueDate(newDate);
  };

  const addTask = async () => {
    if (newTask.trim() !== '') {
      const finalTags = newTaskTags.includes("main") ? newTaskTags : ["main", ...newTaskTags];
      const taskToAdd = {
        name: newTask,
        date: dueDate,
        importance,
        tags: finalTags,
      };
      setNewTask('');
      setNewTaskTags([]);
      await addTaskToFirestore(taskToAdd); // Firestore listener updates local state
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
  // in App()
  const removeTagFromTask = (taskId, tagIndex) => {
    // Update local state first
    setTasks(prevTasks => {
      return prevTasks.map(task => {
        if (task.id !== taskId) return task;

        const newTags = task.tags.filter((_, i) => i !== tagIndex);

        // Async Firestore update (outside of map)
        editTaskInFirestore(task.id, { tags: newTags });

        return { ...task, tags: newTags };
      });
    });
  };


  const removeTagtoAdd = (index) => {
    setNewTaskTags(newTaskTags.filter((_, i) => i !== index));
  };

  const filteredTasks = (list) =>
    sortTasks(
      list.filter(
        (task) =>
          task.tags.includes("main") &&
          !task.tags.includes("recycled") &&
          (!filterTag || task.tags.includes(filterTag))
      )
    );

  const mainTasks = filteredTasks(tasks);
  const recycledTasks = tasks.filter((task) => task.tags.includes("recycled"));


  const sections = [
    { title: 'Main List', data: mainTasks },
    { title: 'Recycle Bin', data: recycledTasks },
  ];
  const allTags = [...new Set(tasks.flatMap(task => task.tags))];
  return (

    <View style={styles.container}>
      <View style={{ flexDirection: 'row', justifyContent: 'space-around', marginBottom: 10 }}>
        <Picker
          selectedValue={sortBy}
          style={{ height: 50, width: 160 }}
          onValueChange={(val) => setSortBy(val)}
        >
          <Picker.Item label="Date" value="date" />
          <Picker.Item label="Importance" value="importance" />
          <Picker.Item label="Alphabetical" value="alphabetical" />
          <Picker.Item label="Suggested" value="suggested" />
        </Picker>

        <Picker
          selectedValue={sortOrder}
          style={{ height: 50, width: 140 }}
          onValueChange={(val) => setSortOrder(val)}
        >
          <Picker.Item label="Ascending" value="asc" />
          <Picker.Item label="Descending" value="desc" />
        </Picker>

        <Picker
          selectedValue={filterTag ?? ''}
          style={{ height: 50, width: 140 }}
          onValueChange={(val) => setFilterTag(val)}
        >
          {allTags.map((tag, idx) => (
            <Picker.Item key={idx} label={tag} value={tag} />
          ))}
        </Picker>
      </View>

      <List
        sections={sections}
        recycleItem={recycleTask}
        removeTag={(taskId, tagIndex) => removeTagFromTask(taskId, tagIndex)}
        onEditTask={editTaskInFirestore}
        allTags={allTags}
      />
      <Button title="Recycle Tasks" color="red" onPress={recycleTasks} />



      <View style={styles.inputContainer}>
        <TextInput
          style={styles.input}
          placeholder="Enter a new task"
          value={newTask}
          onChangeText={setNewTask}
          onKeyPress={handleEnter}
        />
        {/* Date/Time Picker */}

        <View style={{ flexDirection: 'row', alignItems: 'center', width: '100%', marginBottom: 10 }}>
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
          <View style={{ marginLeft: 10 }}>
            <Text>Importance: </Text>
            <Picker
              selectedValue={importance}
              style={{ height: 20, width: 60 }}
              onValueChange={val => setImportance(val)}
            >
              {Array.from({ length: 10 }, (_, i) => i + 1).map(val => (
                <Picker.Item key={val} label={String(val)} value={val} />
              ))}
            </Picker>
          </View>
        </View>

        <View style={styles.tagInputWrapper}>
          <TextInput
            style={styles.tagInput}
            placeholder="Enter tag"
            value={newTag}
            onChangeText={setNewTag}
          />
          <Button title="Add Tag" onPress={handleAddTag} />

          {newTag.trim().length > 0 && (
            <View style={styles.suggestionOverlay}>
              <FlatList
                data={allTags.filter(tag =>
                  tag.toLowerCase().includes(newTag.toLowerCase()) &&
                  !newTaskTags.includes(tag)
                )}
                keyExtractor={(item) => item}
                renderItem={({ item }) => (
                  <TouchableOpacity
                    onPress={() => {
                      setNewTaskTags([...newTaskTags, item]);
                      setNewTag('');
                    }}
                  >
                    <Text style={styles.suggestionItem}>{item}</Text>
                  </TouchableOpacity>
                )}
              />
            </View>
          )}
        </View>


        {/* Display added tags */}
        <View style={styles.tagsContainer}>
          {newTaskTags.map((tag, idx) => (
            <TagChip
              key={idx}
              label={tag}
              onRemove={() => removeTagtoAdd(idx)}
            />
          ))}

        </View>

        <Button title="Add" onPress={addTask} />
      </View>

      <StatusBar style="auto" />
    </View>
  );
}

const styles = StyleSheet.create({
  tagInputWrapper: {
    width: '100%',
    position: 'relative',
    zIndex: 1,
    marginBottom: 10,
  },

  suggestionOverlay: {
    position: 'absolute',
    top: 40,
    left: 0,
    width: 200, // fixed width
    backgroundColor: '#fff',
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 6,
    maxHeight: 120,
    zIndex: 999,
    padding: 4,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 3
  },

  suggestionItem: {
    padding: 8,
    fontSize: 14,
    borderBottomWidth: 1,
    borderBottomColor: '#eee',
  },
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
  removeTagtoAdd: {
    color: 'red',
    fontWeight: 'bold',
  },
});
