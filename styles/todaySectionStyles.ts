import { StyleSheet } from 'react-native';

export const todaySectionStyles = StyleSheet.create({
  section: {
    marginTop: 20,
  },
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 15,
  },
  sectionTitle: {
    fontSize: 24,
    fontWeight: 'bold',
  },
  addButton: {
    backgroundColor: '#278a2a98',
    paddingHorizontal: 15,
    paddingVertical: 8,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#0273069c',
  },
  addButtonText: {
    fontSize: 14,
    fontWeight: '600',
    color: '#000000',
  },
  taskContainer: {
    backgroundColor: '#cdffd7',
    borderRadius: 12,
    padding: 15,
    borderWidth: 1,
    borderColor: '#058a19',
  },
  doneAtContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingTop: 15,
    marginTop: 5,
    borderTopWidth: 0,
  },
  doneAtLabel: {
    fontSize: 16,
    fontWeight: '600',
  },
  doneAtTime: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#4CAF50',
  },
});
