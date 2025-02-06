import React, { useState } from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { CheckBox } from 'react-native-elements';

function Task(props) {
  const [checked, toggleCheck] = useState(false);

  const toggle = () => {
    toggleCheck(!checked);
    props.onDelete(props.id); // Trigger delete when checkbox toggled
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
      <View style={styles.rightSection}> {/* added later*/}
        <Text style={styles.date}>{props.date.toString() || 'None'}</Text>
        <Text style={styles.importance}>{props.importance || '3'}</Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  taskContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between', // Space between left and right sections
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
    alignItems: 'flex-end', //moved dates to the end of the task bar
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
});

export default Task;
