import React, { useState, useId } from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { CheckBox } from 'react-native-elements';


function Task(props){
    const [checked,toggleCheck] = useState(false);
    const toggle = () => { //check for toggling checkbox
        toggleCheck(!checked);
        props.onDelete(props.id);
    }
    return (
        <View style={styles.taskContainer}>
            <CheckBox checked={checked}
            onPress={toggle}
            containerStyle = {styles.checkbox}
            ></CheckBox>
            <Text style={styles.taskText}>{props.name}</Text>
        </View>
    );

}

const styles = StyleSheet.create({
    taskContainer: {
      flexDirection: 'row',
      alignItems: 'center',
      marginVertical: 8,
      padding: 10,
      backgroundColor: '#f9f9f9',
      borderRadius: 8,
      shadowColor: '#000',
      shadowOpacity: 0.1,
      shadowRadius: 4,
      elevation: 2,
    },
    checkbox: {
      margin: 0,
      padding: 0,
    },
    taskText: {
      fontSize: 16,
      marginLeft: 10,
    },
  });

export default Task;