import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';


export default function TagChip({ label, onRemove }) {
  return (
    <View style={styles.chip}>
      <Text style={styles.text}>{label}</Text>
      <TouchableOpacity onPress={onRemove} style={styles.closeButton}>
        <Text style={styles.closeText}>✕</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  chip: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#ddd',
    borderRadius: 15,
    paddingHorizontal: 10,
    paddingVertical: 5,
    margin: 4,
  },
  text: {
    fontSize: 14,
    marginRight: 6,
  },
  closeButton: {
    padding: 4,
  },
  closeText: {
    fontSize: 14,
    color: 'red',
  },
});
