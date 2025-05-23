import React, { useState } from 'react';
import { View, Text, StyleSheet, Button,
  TextInput,
  Platform,
  TouchableOpacity,} from 'react-native';
import { CheckBox } from 'react-native-elements';
import { StatusBar } from 'expo-status-bar';
import DateTimePicker from '@react-native-community/datetimepicker';
import { Picker } from '@react-native-picker/picker';
import TagChip from './TagChip';
import List from './List';

function Task(props, {onDeleteTag}) {
  const [checked, toggleCheck] = useState(false);
  // if (props.tags.includes('archived')) {
  //   toggleCheck(true);
  // }

  const toggle = () => {
    toggleCheck(!checked);
    props.onArchive(props.id); // Instead of deleting, this adds the "archived" tag
  };

  return (
    <View style={styles.taskContainer}>
      <View style={styles.leftSection}>
        <CheckBox
          checked={checked}
          onPress={toggle}
          containerStyle={styles.checkbox}
        />
        <Text style={styles.taskText}>{props.name}</Text>
      </View>
      <View style={styles.rightSection}>
        <Text style={styles.date}>{props.date || 'None'}</Text>
        <Text style={styles.importance}>{props.importance || 'None'}</Text>
        {props.tags.map((tag, idx) => (
          <TagChip
            key={idx}
            label={tag}
            onRemove={() => props.onDeleteTag(idx)} 
          />
        ))}


      </View>
    </View>
  );
}

const styles = StyleSheet.create({
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
  taskContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginVertical: 8,
    padding: 10,
    backgroundColor: '#f9f9f9',
    borderRadius: 8,
    shadowColor: '#000',
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  leftSection: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  rightSection: {
    alignItems: 'flex-end',
  },
  checkbox: {
    margin: 0,
    padding: 0,
  },
  taskText: {
    fontSize: 16,
    marginLeft: 10,
  },
  date: {
    fontSize: 14,
    color: '#666',
  },
  importance: {
    fontSize: 14,
    color: '#333',
    fontWeight: 'bold',
  },
  removeTag: {
    color: 'red',
    fontWeight: 'bold',
  },
});

export default Task;
