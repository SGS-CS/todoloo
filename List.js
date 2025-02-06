import { View, Text, StyleSheet, FlatList } from 'react-native';
import React from 'react';
import { CheckBox } from 'react-native-elements';
import Task from './Task';

function List(props){
    
    return (
        <View style={styles.list}>
            <Text style={styles.header}>{props.header}</Text>
            <FlatList
                data={props.items}
                keyExtractor={item => item.id}
                renderItem={({ item }) => (
                <Task name={item.name} onDelete={props.deleteItem} id={item.id} />
                )}
            />
        </View>
    );

}

const styles = StyleSheet.create({
    header: {
        fontSize: 24,
        fontWeight: 'bold',
        marginBottom: 20,
      },
      list: {
        flex: 1,
        padding: 20,
        backgroundColor: '#fff',
      },
  });

export default List;