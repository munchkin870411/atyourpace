import { StyleSheet } from 'react-native';

export const bottomSheetStyles = StyleSheet.create({
  bottomSheetToggle: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    backgroundColor: '#3baf50',
    alignItems: 'center',
    zIndex: 100,
    borderTopColor: '#05890e',
    paddingBottom: 70,
  },
  dragArrow: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#068111',
    marginBottom: -10,
  },
  topLine: {
    width: 400,
    height: 2,
    backgroundColor: '#068111',
    borderRadius: 2,
    marginBottom: 3,
  },
  secondLine: {
    width: 400,
    height: 1,
    backgroundColor: '#068111',
    borderRadius: 2,
    marginBottom: 1,
  },
  bottomLine: {
    width: 400,
    height: 1,
    backgroundColor: '#068111',
    borderRadius: 2,
  },
  lightSection: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    height: 70,
    backgroundColor: 'rgba(255, 255, 255, 0.35)',
  },
  bottomSheet: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    backgroundColor: '#5abc6c',
    borderTopColor: '#088d04',
    maxHeight: '60%',
    paddingBottom: 40,
  },
  bottomSheetHandle: {
    alignItems: 'center',
  },
  bottomSection: {
    marginBottom: 15,
    paddingHorizontal: 20,
  },
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 15,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 10,
    color: '#000000',
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
  emptyText: {
    fontSize: 16,
    color: '#999',
    textAlign: 'center',
    paddingVertical: 20,
  },
  bottomSheetWithOverflow: {
    overflow: 'hidden',
  },
  gradientOverlay: {
    position: 'absolute',
    left: 0,
    right: 0,
    top: 0,
    bottom: 0,
  },
  scrollViewContent: {
    paddingBottom: 20,
  },
  scrollView: {
    backgroundColor: 'transparent',
  },
  sectionTitleBlack: {
    color: '#000000',
  },
  addButtonWithShadow: {
    borderRadius: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.3,
    shadowRadius: 4,
    elevation: 5,
  },
  bottomSectionLast: {
    marginBottom: 0,
  },
});
