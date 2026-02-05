import { StyleSheet } from 'react-native';

export const profileModalStyles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalContainer: {
    backgroundColor: '#91d79e',
    borderRadius: 20,
    width: '90%',
    maxHeight: '85%',
    overflow: 'hidden',
    paddingBottom: 20,
  },
  header: {
    backgroundColor: '#178a2ec6',
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingVertical: 15,
  },
  headerTitle: {
    fontSize: 22,
    fontWeight: '600',
    color: '#203922',
  },
  avatarButton: {
    backgroundColor: '#ffffff',
    borderRadius: 20,
    paddingHorizontal: 16,
    paddingVertical: 8,
  },
  avatarButtonText: {
    fontSize: 14,
    color: '#000000',
  },
  scrollContent: {
    padding: 20,
  },
  section: {
    marginBottom: 25,
  },
  sectionTitle: {
    fontSize: 18,
    color: '#2c4f30',
    marginBottom: 12,
    fontWeight: '500',
  },
  avatarGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 12,
    justifyContent: 'space-between',
  },
  avatarCircle: {
    width: 50,
    height: 50,
    borderRadius: 25,
    backgroundColor: '#ffffff',
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 2,
    borderColor: 'transparent',
  },
  avatarCircleSelected: {
    borderColor: '#2c3e50',
    borderWidth: 3,
  },
  avatarText: {
    fontSize: 28,
  },
  colorGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 12,
    justifyContent: 'space-between',
  },
  colorCircle: {
    width: 50,
    height: 50,
    borderRadius: 25,
    borderWidth: 2,
    borderColor: 'transparent',
  },
  colorCircleSelected: {
    borderWidth: 3,
    borderColor: '#2c3e50',
  },
  timeFormatContainer: {
    flexDirection: 'row',
    gap: 8,
  },
  timeFormatButton: {
    flex: 1,
    backgroundColor: '#d7fed8',
    paddingVertical: 12,
    borderRadius: 8,
    alignItems: 'center',
  },
  timeFormatButtonSelected: {
    backgroundColor: '#4eb345',
  },
  timeFormatText: {
    fontSize: 14,
    color: '#2c3e50',
  },
  timeFormatTextSelected: {
    fontWeight: '600',
  },
  saveButton: {
    backgroundColor: '#45a03d',
    paddingVertical: 14,
    borderRadius: 10,
    alignItems: 'center',
    marginTop: 10,
    marginBottom: 20,
  },
  saveButtonText: {
    color: '#ffffff',
    fontSize: 16,
    fontWeight: '600',
  },
});
