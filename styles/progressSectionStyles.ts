import { StyleSheet } from 'react-native';

export const progressSectionStyles = StyleSheet.create({
  section: {
    marginTop: 20,
  },
  sectionTitle: {
    fontSize: 24,
    fontWeight: 'bold',
  },
  progressContainer: {
    backgroundColor: '#cdffd7',
    borderRadius: 12,
    padding: 15,
    borderWidth: 1,
    borderColor: '#058a19',
  },
  emptyText: {
    fontSize: 16,
    color: '#999',
    textAlign: 'center',
    paddingVertical: 20,
  },
  totalTimeContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 15,
    paddingTop: 15,
    borderTopWidth: 1,
    borderTopColor: '#e0e0e0',
  },
  totalTimeLabel: {
    fontSize: 16,
    fontWeight: '600',
  },
  totalTimeValue: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#4CAF50',
  },
});
