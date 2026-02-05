import { StyleSheet } from 'react-native';

export const taskItemStyles = StyleSheet.create({
  taskItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 8,
    borderBottomWidth: 1,
    borderBottomColor: '#8dc88474',
    gap: 2,
  },
  taskContent: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  colorIndicator: {
    width: 4,
    height: 32,
    borderRadius: 2,
    marginRight: 1,
  },
  checkbox: {
    width: 24,
    height: 24,
    borderWidth: 2,
    borderColor: '#333',
    borderRadius: 4,
    marginRight: 8,
    justifyContent: 'center',
    alignItems: 'center',
  },
  checkmark: {
    fontSize: 16,
    fontWeight: 'bold',
  },
  taskText: {
    flex: 1,
    fontSize: 16
  },
  taskTextCompleted: {
    textDecorationLine: 'line-through',
    color: '#999',
  },
  taskTime: {
    fontSize: 16,
    color: '#666',
    marginLeft: 2,
  },
  moveButton: {
    paddingHorizontal: 6,
    paddingVertical: 2,
  },
  moveIcon: {
    fontSize: 20,
    color: '#018c29',
  },
  deleteButton: {
    paddingHorizontal: 6,
    paddingVertical: 2,
  },
  deleteIcon: {
    fontSize: 20,
  },
  menuOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  menuContainer: {
    backgroundColor: '#ffffff',
    borderRadius: 12,
    padding: 8,
    minWidth: 200,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
  },
  menuItem: {
    paddingVertical: 12,
    paddingHorizontal: 16,
    borderRadius: 8,
  },
  menuItemActive: {
    backgroundColor: '#F3F4F6',
  },
  menuText: {
    fontSize: 16,
    color: '#1F2937',
  },
  menuTextActive: {
    color: '#9CA3AF',
  },
  reorderButtons: {
    flexDirection: 'column',
    gap: 1,
    marginRight: 2,
  },
  arrowButton: {
    width: 24,
    height: 18,
    justifyContent: 'center',
    alignItems: 'center',
  },
  arrowButtonDisabled: {
    opacity: 0.3,
  },
  arrowIcon: {
    fontSize: 14,
    color: '#5bc47a',
    fontWeight: 'bold',
  },
  arrowIconDisabled: {
    color: '#d0d0d0',
  },
});
