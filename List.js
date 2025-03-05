import { View, Text, StyleSheet, FlatList } from 'react-native';
import React, {useState} from 'react';
import { CheckBox } from 'react-native-elements';
import Task from './Task';


function List(props){
    const [checked, toggleCheck] = useState(false);
    
    const toggle = () => {
        toggleCheck(!checked);
    };
    
    return (
        <View style={styles.list}>
            <View style={styles.headerRow}>
          
                <Text style={styles.header}>{props.header}</Text>
                <CheckBox
                    checked={checked}
                    onPress={toggle}
                    containerStyle={styles.checkbox}
                />
            </View>
          {!checked && (
            <FlatList
              data={props.items}
              keyExtractor={(item) => item.id}
              renderItem={({ item }) => (
                <Task name={item.name} onDelete={props.deleteItem} id={item.id} />
              )}
            />
          )}
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
      checkbox: {
        marginRight: 20,
      },
      headerRow: {
        alignItems: 'center',
      },
  });

export default List;