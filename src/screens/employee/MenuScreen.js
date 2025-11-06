import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Alert, Dimensions, RefreshControl } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { useAuth } from '../../context/AuthContext';
import api from '../../services/api';

const { width } = Dimensions.get('window');

const MenuScreen = () => {
  const { user, logout } = useAuth();
  const [menuItems, setMenuItems] = useState([]);
  const [selections, setSelections] = useState({});
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [selectionClosed, setSelectionClosed] = useState(false);
  const [timeRemaining, setTimeRemaining] = useState('');

  useEffect(() => {
    fetchMenuAndSelections();
    checkSelectionTime();
    
    // Update timer every minute
    const timer = setInterval(() => {
      updateTimeRemaining();
    }, 60000);
    
    // Initial update
    updateTimeRemaining();
    
    return () => clearInterval(timer);
  }, []);

  const checkSelectionTime = () => {
    const now = new Date();
    const currentHour = now.getHours();
    
    // Close selection after 9 PM (21:00)
    if (currentHour >= 21) {
      setSelectionClosed(true);
    }
  };

  const updateTimeRemaining = () => {
    const now = new Date();
    const currentHour = now.getHours();
    const currentMinute = now.getMinutes();
    
    if (currentHour >= 21) {
      setSelectionClosed(true);
      setTimeRemaining('');
      return;
    }
    
    // Calculate time until 9 PM
    const deadline = new Date();
    deadline.setHours(21, 0, 0, 0);
    
    const timeDiff = deadline - now;
    const hoursLeft = Math.floor(timeDiff / (1000 * 60 * 60));
    const minutesLeft = Math.floor((timeDiff % (1000 * 60 * 60)) / (1000 * 60));
    
    if (hoursLeft > 0) {
      setTimeRemaining(`${hoursLeft}h ${minutesLeft}m remaining`);
    } else {
      setTimeRemaining(`${minutesLeft}m remaining`);
    }
  };

  const onRefresh = async () => {
    setRefreshing(true);
    await fetchMenuAndSelections();
    setRefreshing(false);
  };

  const fetchMenuAndSelections = async () => {
    try {
      const [menuResponse, selectionsResponse] = await Promise.all([
        api.get('/menu/tomorrow/'),
        api.get('/employee/selections/')
      ]);

      const allItems = [];
      Object.values(menuResponse.data.meals).forEach((items) => {
        allItems.push(...items);
      });
      
      console.log('Menu items loaded:', allItems.length);
      console.log('Menu items:', allItems);
      console.log('Current selections:', selectionsResponse.data.selections);
      
      setMenuItems(allItems);
      setSelections(selectionsResponse.data.selections);
    } catch (error) {
      console.error('Error fetching data:', error);
      console.error('Error details:', error.response?.data);
      Alert.alert('Error', 'Failed to load menu data');
    } finally {
      setLoading(false);
    }
  };

  const toggleSelection = async (menuId, mealType) => {
    if (selectionClosed) {
      Alert.alert('Selection Closed', 'Meal selection is closed after 9 PM. Please try again tomorrow.');
      return;
    }
    
    const currentSelections = selections[mealType] || [];
    const isSelected = currentSelections.includes(menuId);
    
    const newSelections = {
      ...selections,
      [mealType]: isSelected 
        ? currentSelections.filter(id => id !== menuId)
        : [...currentSelections, menuId]
    };
    
    console.log('Updating selections:', newSelections);
    setSelections(newSelections);
    
    try {
      const response = await api.post('/employee/selections/', {
        selections: newSelections,
        date: new Date().toISOString().split('T')[0]
      });
      
      console.log('Selection saved:', response.data);
      Alert.alert('Success', isSelected ? 'Item removed from selection' : 'Item added to selection');
    } catch (error) {
      console.error('Error saving selection:', error);
      setSelections(selections);
      Alert.alert('Error', 'Failed to update selection');
    }
  };

  const getMealTypeDisplay = (mealType) => {
    const displays = {
      'breakfast': 'Breakfast',
      'lunch': 'Lunch', 
      'snacks': 'Evening Snacks'
    };
    return displays[mealType] || mealType;
  };

  const getMealTypeColor = (mealType) => {
    const colors = {
      'breakfast': '#f59e0b',
      'lunch': '#10b981',
      'snacks': '#8b5cf6'
    };
    return colors[mealType] || '#6b7280';
  };

  const isItemSelected = (itemId, mealType) => {
    return selections[mealType]?.includes(itemId) || false;
  };

  if (loading) {
    return (
      <LinearGradient
        colors={['#667eea', '#764ba2']}
        style={styles.container}
      >
        <View style={styles.loadingContainer}>
          <Text style={styles.loadingText}>Loading menu...</Text>
        </View>
      </LinearGradient>
    );
  }

  return (
    <LinearGradient
      colors={['#667eea', '#764ba2']}
      style={styles.container}
    >
      <ScrollView 
        style={styles.scrollView} 
        showsVerticalScrollIndicator={false}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
        }
      >
        <View style={styles.header}>
          <Text style={styles.welcomeText}>Welcome, {user?.username}!</Text>
          <Text style={styles.menuTitle}>Today's Menu</Text>
          
          {selectionClosed ? (
            <View style={styles.closedBanner}>
              <Text style={styles.closedText}>Selection closed at 9 PM</Text>
            </View>
          ) : timeRemaining ? (
            <View style={styles.timerBanner}>
              <Text style={styles.timerText}>⏰ {timeRemaining}</Text>
            </View>
          ) : null}
        </View>

        <View style={styles.menuContainer}>
          {menuItems.length === 0 ? (
            <View style={styles.emptyState}>
              <Text style={styles.emptyText}>No menu items available</Text>
              <TouchableOpacity onPress={fetchMenuAndSelections} style={styles.retryButton}>
                <Text style={styles.retryText}>Retry</Text>
              </TouchableOpacity>
            </View>
          ) : (
            menuItems.map((item) => (
            <View key={item.id} style={styles.menuCard}>
              <View style={styles.cardHeader}>
                <Text style={styles.itemName}>{item.name}</Text>
                <View style={[styles.mealTypeBadge, { backgroundColor: getMealTypeColor(item.meal_type) }]}>
                  <Text style={styles.mealTypeText}>{getMealTypeDisplay(item.meal_type)}</Text>
                </View>
              </View>
              
              {item.description && (
                <Text style={styles.itemDescription}>{item.description}</Text>
              )}
              
              <View style={styles.cardFooter}>
                <Text style={styles.priceText}>₹{item.price}</Text>
                <TouchableOpacity
                  style={[
                    styles.actionButton,
                    isItemSelected(item.id, item.meal_type) ? styles.cancelButton : styles.optButton,
                    selectionClosed && styles.disabledButton
                  ]}
                  onPress={() => toggleSelection(item.id, item.meal_type)}
                  disabled={selectionClosed}
                >
                  <Text style={styles.buttonText}>
                    {isItemSelected(item.id, item.meal_type) ? 'Cancel' : 'Opt In'}
                  </Text>
                </TouchableOpacity>
              </View>
            </View>
            ))
          )}
        </View>

        <View style={styles.footer}>
          <TouchableOpacity style={styles.logoutButton} onPress={logout}>
            <LinearGradient
              colors={['#667eea', '#764ba2']}
              style={styles.logoutGradient}
            >
              <Text style={styles.logoutText}>Logout</Text>
            </LinearGradient>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </LinearGradient>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  scrollView: {
    flex: 1,
    paddingHorizontal: 16,
    paddingTop: 40,
    paddingBottom: 20,
  },
  header: {
    marginBottom: 20,
    paddingHorizontal: 4,
  },
  welcomeText: {
    fontSize: width > 400 ? 24 : 20,
    fontWeight: '700',
    color: 'white',
    marginBottom: 8,
    textShadowColor: 'rgba(0, 0, 0, 0.3)',
    textShadowOffset: { width: 0, height: 2 },
    textShadowRadius: 4,
  },
  menuTitle: {
    fontSize: width > 400 ? 18 : 16,
    fontWeight: '600',
    color: 'rgba(255, 255, 255, 0.9)',
    letterSpacing: 0.5,
  },
  menuContainer: {
    marginBottom: 30,
  },
  menuCard: {
    backgroundColor: 'white',
    borderRadius: 12,
    padding: 16,
    marginBottom: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 3,
  },
  cardHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  itemName: {
    fontSize: width > 400 ? 16 : 14,
    fontWeight: '700',
    color: '#2d3748',
    flex: 1,
    marginRight: 8,
  },
  mealTypeBadge: {
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
    marginLeft: 8,
  },
  mealTypeText: {
    color: 'white',
    fontSize: 12,
    fontWeight: '600',
  },
  itemDescription: {
    fontSize: 14,
    color: '#4a5568',
    marginBottom: 12,
    lineHeight: 20,
  },
  cardFooter: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  priceText: {
    fontSize: 18,
    fontWeight: '700',
    color: '#10b981',
  },
  actionButton: {
    paddingVertical: 8,
    paddingHorizontal: 12,
    borderRadius: 6,
    alignItems: 'center',
    minWidth: 60,
    maxWidth: 80,
  },
  optButton: {
    backgroundColor: '#10b981',
  },
  cancelButton: {
    backgroundColor: '#ef4444',
  },
  buttonText: {
    color: 'white',
    fontWeight: '600',
    fontSize: 10,
  },
  footer: {
    alignItems: 'center',
    marginBottom: 20,
  },
  logoutButton: {
    borderRadius: 6,
    overflow: 'hidden',
    shadowColor: '#667eea',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 12,
    elevation: 8,
  },
  logoutGradient: {
    paddingVertical: 12,
    paddingHorizontal: 24,
  },
  logoutText: {
    color: 'white',
    fontWeight: '600',
    fontSize: 16,
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
  closedBanner: {
    backgroundColor: '#ef4444',
    paddingVertical: 8,
    paddingHorizontal: 16,
    borderRadius: 8,
    marginTop: 12,
    alignItems: 'center',
  },
  closedText: {
    color: 'white',
    fontSize: 14,
    fontWeight: '600',
  },
  disabledButton: {
    backgroundColor: '#9ca3af',
    opacity: 0.6,
  },
  timerBanner: {
    backgroundColor: '#f59e0b',
    paddingVertical: 8,
    paddingHorizontal: 16,
    borderRadius: 8,
    marginTop: 12,
    alignItems: 'center',
  },
  timerText: {
    color: 'white',
    fontSize: 14,
    fontWeight: '600',
  },
});

export default MenuScreen;