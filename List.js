import { View, Text, StyleSheet, FlatList } from 'react-native';
import React from 'react';
import { CheckBox } from 'react-native-elements';
import Task from './Task';

function List(props){
    const [checked, toggleCheck] = useState(false);
    
    const toggle = () => {
        toggleCheck(!checked);
    };
    if (!checked){
        let show = (<FlatList
            display={disp}
            data={props.items}
            keyExtractor={item => item.id}
            renderItem={({ item }) => (
            <Task name={item.name} onDelete={props.deleteItem} id={item.id} />
            )}
        />);
    } else {
        let show;
    }
    return (
        <View style={styles.list}>
            <CheckBox
                      checked={checked}
                      onPress={toggle}
                      containerStyle={styles.checkbox}
                    />
            <Text style={styles.header}>{props.header}</Text>
            
            {show}
            
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