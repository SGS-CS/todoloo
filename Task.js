import React, { useState, useRef } from 'react';
import {
  View, Text, StyleSheet, TextInput, TouchableOpacity, FlatList
} from 'react-native';
import { CheckBox } from 'react-native-elements';
import TagChip from './TagChip';

function Task(props) {
  const [checked, toggleCheck] = useState(false);
  const [editing, setEditing] = useState(false);
  const [editedName, setEditedName] = useState(props.name);
  const [showTagEditor, setShowTagEditor] = useState(false);
  const [newTag, setNewTag] = useState('');
  const inputRef = useRef(null);

  const toggle = () => {
    toggleCheck(!checked);
    props.onRecycle(props.id);
  };

  const handleBlur = () => {
    const trimmed = editedName.trim();
    if (trimmed && trimmed !== props.name) {
      props.onEdit(props.id, { name: trimmed });
    }
    setEditing(false);
  };

  const handleKeyPress = (e) => {
    if (e.nativeEvent.key === 'Enter') {
      inputRef.current?.blur();
    }
  };

  const handleTagSubmit = (tag = newTag) => {
  const trimmed = tag.trim();
  if (trimmed && !props.tags.includes(trimmed)) {
    props.onEdit(props.id, { tags: [...props.tags, trimmed] });
  }
  setNewTag('');
  setShowTagEditor(false);
};


  const handleSelectTag = (tag) => {
  setNewTag(tag); // optional — still useful for UI
  handleTagSubmit(tag);
};



  return (
    <View style={styles.taskContainer}>
      {/* Left side: Checkbox and editable task name */}
      <View style={styles.leftSection}>
        <CheckBox checked={checked} onPress={toggle} containerStyle={styles.checkbox} />
        <TouchableOpacity onPress={() => setEditing(true)}>
          {editing ? (
            <TextInput
              ref={inputRef}
              style={[styles.taskText, { borderBottomWidth: 1 }]}
              value={editedName}
              onChangeText={setEditedName}
              onBlur={handleBlur}
              onKeyPress={handleKeyPress}
              autoFocus
            />
          ) : (
            <Text style={styles.taskText}>{props.name}</Text>
          )}
        </TouchableOpacity>
      </View>

      {/* Right side: Metadata and tag list */}
      <View style={styles.rightSection}>
        <Text style={styles.date}>{props.date || 'None'}</Text>
        <Text style={styles.importance}>{props.importance || 'None'}</Text>

        <View style={styles.tagsContainer}>
          {props.tags.map((tag, idx) => (
            <TagChip key={idx} label={tag} onRemove={() => props.onDeleteTag(idx)} />
          ))}
          <TouchableOpacity onPress={() => setShowTagEditor(true)}>
            <Text style={styles.plusIcon}>＋</Text>
          </TouchableOpacity>
        </View>

        {showTagEditor && (
          <View style={styles.tagEditor}
          onBlur={handleTagSubmit}
          autoFocus
          >
            <TextInput
              style={styles.tagInput}
              placeholder="Type or select a tag"
              value={newTag}
              onChangeText={setNewTag}
              onKeyPress={handleKeyPress}
            />
            <FlatList
              data={props.allTags.filter(tag => !props.tags.includes(tag))}
              keyExtractor={(item, index) => item + index}
              renderItem={({ item }) => (
                <TouchableOpacity
  onPress={() => handleSelectTag(item)}
>
  <Text style={styles.suggestion}>{item}</Text>
</TouchableOpacity>


              )}
            />
          </View>
        )}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  taskContainer: {
    flexDirection: 'row',
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
  tagsContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    marginTop: 8,
  },
  plusIcon: {
    fontSize: 20,
    marginLeft: 5,
    color: '#007AFF',
  },
  tagEditor: {
    marginTop: 10,
    alignItems: 'flex-end',
  },
  tagInput: {
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 6,
    padding: 6,
    marginBottom: 6,
    width: 160,
  },
  suggestion: {
    paddingVertical: 4,
    paddingHorizontal: 8,
    backgroundColor: '#eee',
    borderRadius: 4,
    marginBottom: 4,
  },
});

export default Task;
