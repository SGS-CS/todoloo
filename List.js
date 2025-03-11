import React from 'react';
import { View, Text, StyleSheet, SectionList } from 'react-native';
import Task from './Task';

function List({ sections, archiveItem }) {
  // Render each task item
  const renderItem = ({ item }) => (
    <Task
      name={item.name}
      id={item.id}
      onDelete={archiveItem}
      // or onDelete / onArchive, depending on your naming
    />
  );

  // Render each section header
  const renderSectionHeader = ({ section }) => (
    <Text style={styles.sectionHeader}>{section.title}</Text>
  );

  return (
    <View style={styles.container}>
      <SectionList
        sections={sections}
        keyExtractor={(item) => item.id.toString()}
        renderItem={renderItem}
        renderSectionHeader={renderSectionHeader}
        // optional props
      />
    </View>
  );
}

export default List;

const styles = StyleSheet.create({
  container: {
    flex: 1, // Make sure it can scroll
    backgroundColor: '#eee',
    borderRadius: 8,
    padding: 10,
  },
  sectionHeader: {
    fontSize: 20,
    fontWeight: 'bold',
    marginVertical: 10,
    backgroundColor: '#ccc', // optional for visual separation
    padding: 5,
    borderRadius: 4,
  },
});
