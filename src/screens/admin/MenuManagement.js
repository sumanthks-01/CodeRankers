import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Alert, Modal, Dimensions } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { Ionicons } from '@expo/vector-icons';
import { Picker } from '@react-native-picker/picker';
import api from '../../services/api';
import { SimpleButton, SimpleInput } from '../../components/UI';

const { width } = Dimensions.get('window');

const MenuManagement = ({ navigation }) => {
  const [menuItems, setMenuItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [modalVisible, setModalVisible] = useState(false);
  const [editingItem, setEditingItem] = useState(null);
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    meal_type: 'breakfast',
    price: '',
    available: true,
  });

  useEffect(() => {
    fetchMenuItems();
  }, []);

  const fetchMenuItems = async () => {
    try {
      // Try admin endpoint first, fallback to regular menu endpoint
      let response;
      try {
        response = await api.get('/admin/menu/');
        console.log('Admin menu response:', response.data);
        setMenuItems(response.data.items || response.data.menu_items || []);
      } catch (adminError) {
        // Fallback to regular menu endpoint (same as ReportsScreen)
        console.log('Admin endpoint failed, trying regular menu endpoint');
        const menuResponse = await api.get('/menu/tomorrow/');
        console.log('Menu response:', menuResponse.data);
        
        const allItems = [];
        if (menuResponse.data && menuResponse.data.meals) {
          Object.values(menuResponse.data.meals).forEach((items) => {
            if (Array.isArray(items)) {
              allItems.push(...items);
            }
          });
        }
        
        console.log('Fallback: Loaded menu items for management:', allItems.length, allItems);
        setMenuItems(allItems);
        
        if (allItems.length === 0) {
          console.warn('No menu items found in response');
        } else {
          console.log('Successfully loaded real menu data for management');
        }
      }
    } catch (error) {
      console.error('Error fetching menu items:', error);
      console.error('Error details:', error.response?.data);
      setMenuItems([]);
    } finally {
      setLoading(false);
    }
  };

  const handleAddItem = () => {
    setEditingItem(null);
    setFormData({
      name: '',
      description: '',
      meal_type: 'breakfast',
      price: '',
      available: true,
    });
    setModalVisible(true);
  };

  const handleEditItem = (item) => {
    setEditingItem(item);
    setFormData({
      name: item.name,
      description: item.description,
      meal_type: item.meal_type,
      price: item.price.toString(),
      available: item.available,
    });
    setModalVisible(true);
  };

  const handleSaveItem = async () => {
    if (!formData.name || !formData.price) {
      Alert.alert('Error', 'Please fill in all required fields');
      return;
    }

    try {
      const data = {
        ...formData,
        price: parseFloat(formData.price),
      };

      console.log('Saving menu item:', data);
      console.log('Editing item:', editingItem);

      if (editingItem) {
        console.log('Updating item with URL:', `/admin/menu/${editingItem.id}/`);
        await api.put(`/admin/menu/${editingItem.id}/`, data);
        Alert.alert('Success', 'Menu item updated successfully');
      } else {
        console.log('Creating item with URL:', '/admin/menu/create/');
        const response = await api.post('/admin/menu/create/', data);
        console.log('Create response:', response.data);
        Alert.alert('Success', 'Menu item added successfully');
      }

      setModalVisible(false);
      fetchMenuItems();
    } catch (error) {
      console.error('Error saving menu item:', error);
      console.error('Error response:', error.response?.data);
      console.error('Error status:', error.response?.status);
      console.error('Error config:', error.config);
      Alert.alert('Error', `Failed to save menu item: ${error.response?.status || 'Network error'}`);
    }
  };

  const handleDeleteItem = (item) => {
    Alert.alert(
      'Delete Menu Item',
      `Are you sure you want to delete "${item.name}"?`,
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Delete',
          style: 'destructive',
          onPress: async () => {
            try {
              await api.delete(`/admin/menu/${item.id}/delete/`);
              Alert.alert('Success', 'Menu item deleted successfully');
              fetchMenuItems();
            } catch (error) {
              console.error('Error deleting menu item:', error);
              Alert.alert('Error', 'Failed to delete menu item');
            }
          },
        },
      ]
    );
  };

  const getMealTypeDisplay = (mealType) => {
    const displays = {
      'breakfast': 'Breakfast',
      'lunch': 'Lunch',
      'snacks': 'Evening Snacks'
    };
    return displays[mealType] || mealType;
  };

  if (loading) {
    return (
      <LinearGradient colors={['#667eea', '#764ba2']} style={styles.container}>
        <View style={styles.loadingContainer}>
          <Text style={styles.loadingText}>Loading menu items...</Text>
        </View>
      </LinearGradient>
    );
  }

  return (
    <LinearGradient colors={['#667eea', '#764ba2']} style={styles.container}>
      <ScrollView style={styles.scrollView} showsVerticalScrollIndicator={false}>
        <View style={styles.header}>
          <TouchableOpacity onPress={() => navigation.canGoBack() ? navigation.goBack() : navigation.navigate('AdminDashboard')} style={styles.backButton}>
            <Ionicons name="arrow-back" size={24} color="white" />
          </TouchableOpacity>
          <Text style={styles.title}>Menu Management</Text>
          <View style={styles.headerButtons}>
            <TouchableOpacity onPress={async () => {
              try {
                const response = await api.get('/test/');
                Alert.alert('Server Status', 'Server is online');
              } catch (error) {
                Alert.alert('Server Status', 'Server is not online');
              }
            }} style={styles.testButton}>
              <Ionicons name="flask" size={20} color="white" />
            </TouchableOpacity>
            <TouchableOpacity onPress={handleAddItem} style={styles.addButton}>
              <Ionicons name="add" size={24} color="white" />
            </TouchableOpacity>
          </View>
        </View>

        <View style={styles.menuContainer}>
          {menuItems.length === 0 ? (
            <View style={styles.emptyState}>
              <Text style={styles.emptyText}>No menu items found</Text>
              <TouchableOpacity onPress={fetchMenuItems} style={styles.retryButton}>
                <Text style={styles.retryText}>Retry</Text>
              </TouchableOpacity>
            </View>
          ) : (
            menuItems.map((item) => (
            <View key={item.id} style={styles.menuItem}>
              <View style={styles.itemContent}>
                <View style={styles.itemInfo}>
                  <Text style={styles.itemName}>{item.name}</Text>
                  <Text style={styles.itemDescription}>{item.description}</Text>
                  <View style={styles.itemDetails}>
                    <Text style={styles.itemType}>{getMealTypeDisplay(item.meal_type)}</Text>
                    <Text style={styles.itemPrice}>₹{item.price}</Text>
                    <View style={[styles.statusBadge, item.available ? styles.available : styles.unavailable]}>
                      <Text style={styles.statusText}>
                        {item.available ? 'Available' : 'Unavailable'}
                      </Text>
                    </View>
                  </View>
                </View>
                <View style={styles.itemActions}>
                  <TouchableOpacity
                    style={[styles.actionButton, styles.editButton]}
                    onPress={() => handleEditItem(item)}
                  >
                    <Ionicons name="pencil" size={16} color="white" />
                  </TouchableOpacity>
                  <TouchableOpacity
                    style={[styles.actionButton, styles.deleteButton]}
                    onPress={() => handleDeleteItem(item)}
                  >
                    <Ionicons name="trash" size={16} color="white" />
                  </TouchableOpacity>
                </View>
              </View>
            </View>
            ))
          )}
        </View>
      </ScrollView>

      <Modal
        animationType="slide"
        transparent={true}
        visible={modalVisible}
        onRequestClose={() => setModalVisible(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <Text style={styles.modalTitle}>
              {editingItem ? 'Edit Menu Item' : 'Add Menu Item'}
            </Text>

            <ScrollView showsVerticalScrollIndicator={false}>
              <View style={styles.formGroup}>
                <Text style={styles.label}>Name *</Text>
                <SimpleInput
                  value={formData.name}
                  onChangeText={(text) => setFormData({ ...formData, name: text })}
                  placeholder="Enter item name"
                  style={styles.input}
                />
              </View>

              <View style={styles.formGroup}>
                <Text style={styles.label}>Description</Text>
                <SimpleInput
                  value={formData.description}
                  onChangeText={(text) => setFormData({ ...formData, description: text })}
                  placeholder="Enter description"
                  multiline
                  numberOfLines={3}
                  style={[styles.input, styles.textArea]}
                />
              </View>

              <View style={styles.formGroup}>
                <Text style={styles.label}>Meal Type</Text>
                <View style={styles.pickerContainer}>
                  <Picker
                    selectedValue={formData.meal_type}
                    onValueChange={(value) => setFormData({ ...formData, meal_type: value })}
                    style={styles.picker}
                  >
                    <Picker.Item label="Breakfast" value="breakfast" />
                    <Picker.Item label="Lunch" value="lunch" />
                    <Picker.Item label="Evening Snacks" value="snacks" />
                  </Picker>
                </View>
              </View>

              <View style={styles.formGroup}>
                <Text style={styles.label}>Price *</Text>
                <SimpleInput
                  value={formData.price}
                  onChangeText={(text) => setFormData({ ...formData, price: text })}
                  placeholder="Enter price"
                  keyboardType="numeric"
                  style={styles.input}
                />
              </View>

              <View style={styles.checkboxContainer}>
                <TouchableOpacity
                  style={styles.checkbox}
                  onPress={() => setFormData({ ...formData, available: !formData.available })}
                >
                  <Ionicons
                    name={formData.available ? "checkbox" : "square-outline"}
                    size={24}
                    color="#667eea"
                  />
                  <Text style={styles.checkboxLabel}>Available</Text>
                </TouchableOpacity>
              </View>
            </ScrollView>

            <View style={styles.modalActions}>
              <SimpleButton
                title="Cancel"
                onPress={() => setModalVisible(false)}
                style={[styles.modalButton, styles.cancelButton]}
              />
              <SimpleButton
                title="Save"
                onPress={handleSaveItem}
                style={[styles.modalButton, styles.saveButton]}
              />
            </View>
          </View>
        </View>
      </Modal>
    </LinearGradient>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  scrollView: {
    flex: 1,
    padding: 20,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 30,
  },
  backButton: {
    padding: 8,
  },
  title: {
    fontSize: 24,
    fontWeight: '700',
    color: 'white',
    flex: 1,
    textAlign: 'center',
  },
  headerButtons: {
    flexDirection: 'row',
  },
  testButton: {
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    borderRadius: 20,
    padding: 8,
    marginRight: 8,
  },
  addButton: {
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    borderRadius: 20,
    padding: 8,
  },
  menuContainer: {
    marginBottom: 20,
  },
  menuItem: {
    backgroundColor: 'white',
    borderRadius: 12,
    marginBottom: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 4,
  },
  itemContent: {
    flexDirection: 'row',
    padding: 16,
  },
  itemInfo: {
    flex: 1,
  },
  itemName: {
    fontSize: 18,
    fontWeight: '600',
    color: '#2d3748',
    marginBottom: 4,
  },
  itemDescription: {
    fontSize: 14,
    color: '#718096',
    marginBottom: 8,
  },
  itemDetails: {
    flexDirection: 'row',
    alignItems: 'center',
    flexWrap: 'wrap',
  },
  itemType: {
    fontSize: 12,
    color: '#667eea',
    fontWeight: '500',
    marginRight: 12,
  },
  itemPrice: {
    fontSize: 16,
    fontWeight: '600',
    color: '#2d3748',
    marginRight: 12,
  },
  statusBadge: {
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
  },
  available: {
    backgroundColor: '#10b981',
  },
  unavailable: {
    backgroundColor: '#ef4444',
  },
  statusText: {
    fontSize: 12,
    color: 'white',
    fontWeight: '500',
  },
  itemActions: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  actionButton: {
    width: 36,
    height: 36,
    borderRadius: 18,
    justifyContent: 'center',
    alignItems: 'center',
    marginLeft: 8,
  },
  editButton: {
    backgroundColor: '#667eea',
  },
  deleteButton: {
    backgroundColor: '#ef4444',
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  loadingText: {
    color: 'white',
    fontSize: 18,
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  modalContent: {
    backgroundColor: 'white',
    borderRadius: 16,
    padding: 20,
    width: '100%',
    maxHeight: '80%',
  },
  modalTitle: {
    fontSize: 20,
    fontWeight: '700',
    color: '#2d3748',
    marginBottom: 20,
    textAlign: 'center',
  },
  formGroup: {
    marginBottom: 16,
  },
  label: {
    fontSize: 16,
    fontWeight: '600',
    color: '#2d3748',
    marginBottom: 8,
  },
  input: {
    borderWidth: 1,
    borderColor: '#e2e8f0',
    borderRadius: 8,
    padding: 12,
    fontSize: 16,
    color: '#2d3748',
  },
  textArea: {
    height: 80,
    textAlignVertical: 'top',
  },
  pickerContainer: {
    borderWidth: 1,
    borderColor: '#e2e8f0',
    borderRadius: 8,
    overflow: 'hidden',
  },
  picker: {
    height: 50,
  },
  checkboxContainer: {
    marginBottom: 20,
  },
  checkbox: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  checkboxLabel: {
    fontSize: 16,
    color: '#2d3748',
    marginLeft: 8,
  },
  modalActions: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  modalButton: {
    flex: 1,
    marginHorizontal: 8,
    paddingVertical: 12,
    borderRadius: 8,
  },
  cancelButton: {
    backgroundColor: '#718096',
  },
  saveButton: {
    backgroundColor: '#667eea',
  },
  emptyState: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 60,
  },
  emptyText: {
    color: 'white',
    fontSize: 18,
    marginBottom: 20,
  },
  retryButton: {
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    paddingHorizontal: 20,
    paddingVertical: 10,
    borderRadius: 8,
  },
  retryText: {
    color: 'white',
    fontSize: 16,
    fontWeight: '600',
  },
});

export default MenuManagement;