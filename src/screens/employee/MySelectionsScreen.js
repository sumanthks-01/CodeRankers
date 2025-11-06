import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Dimensions, RefreshControl } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { Ionicons } from '@expo/vector-icons';
import { useFocusEffect } from '@react-navigation/native';
import api from '../../services/api';

const { width } = Dimensions.get('window');

const MySelectionsScreen = ({ navigation }) => {
  const [selections, setSelections] = useState([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);

  useEffect(() => {
    fetchMySelections();
  }, []);

  // Auto-refresh when screen comes into focus
  useFocusEffect(
    React.useCallback(() => {
      fetchMySelections();
    }, [])
  );

  const fetchMySelections = async (isRefresh = false) => {
    if (isRefresh) {
      setRefreshing(true);
    }
    
    try {
      // Get current selections and menu to build selection history
      const [selectionsResponse, menuResponse] = await Promise.all([
        api.get('/employee/selections/'),
        api.get('/menu/tomorrow/')
      ]);
      
      const currentSelections = selectionsResponse.data.selections;
      const menuItems = menuResponse.data.meals;
      
      // Build selection history from current selections
      const selectionHistory = [];
      const today = new Date().toISOString().split('T')[0];
      
      Object.entries(currentSelections).forEach(([mealType, itemIds]) => {
        itemIds.forEach(itemId => {
          // Find the menu item
          const menuItem = Object.values(menuItems).flat().find(item => item.id === itemId);
          if (menuItem) {
            selectionHistory.push({
              date: today,
              opted: true,
              menu_item: menuItem
            });
          }
        });
      });
      
      console.log('Selection history updated:', selectionHistory);
      setSelections(selectionHistory);
    } catch (error) {
      console.error('Error fetching selections:', error);
      setSelections([]);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  const onRefresh = () => {
    fetchMySelections(true);
  };

  const getMealTypeDisplay = (mealType) => {
    const displays = {
      'breakfast': 'Breakfast',
      'lunch': 'Lunch',
      'snacks': 'Evening Snacks'
    };
    return displays[mealType] || mealType;
  };

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      weekday: 'short',
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };

  const groupSelectionsByDate = () => {
    const grouped = {};
    selections.forEach(selection => {
      const date = selection.date;
      if (!grouped[date]) {
        grouped[date] = [];
      }
      grouped[date].push(selection);
    });
    return grouped;
  };

  if (loading) {
    return (
      <LinearGradient colors={['#667eea', '#764ba2']} style={styles.container}>
        <View style={styles.loadingContainer}>
          <Text style={styles.loadingText}>Loading your selections...</Text>
        </View>
      </LinearGradient>
    );
  }

  const groupedSelections = groupSelectionsByDate();

  return (
    <LinearGradient colors={['#667eea', '#764ba2']} style={styles.container}>
      <ScrollView 
        style={styles.scrollView} 
        showsVerticalScrollIndicator={false}
        refreshControl={
          <RefreshControl 
            refreshing={refreshing} 
            onRefresh={onRefresh}
            tintColor="white"
            colors={['white']}
          />
        }
      >
        <View style={styles.header}>
          <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backButton}>
            <Ionicons name="arrow-back" size={24} color="white" />
          </TouchableOpacity>
          <Text style={styles.title}>My Selections</Text>
          <TouchableOpacity onPress={onRefresh} style={styles.refreshButton}>
            <Ionicons name="refresh" size={24} color="white" />
          </TouchableOpacity>
        </View>

        {Object.keys(groupedSelections).length === 0 ? (
          <View style={styles.emptyState}>
            <Ionicons name="restaurant-outline" size={64} color="rgba(255, 255, 255, 0.5)" />
            <Text style={styles.emptyText}>No meal selections found</Text>
            <Text style={styles.emptySubtext}>Start selecting meals to see your history here</Text>
          </View>
        ) : (
          Object.entries(groupedSelections)
            .sort(([a], [b]) => new Date(b) - new Date(a))
            .map(([date, daySelections]) => (
              <View key={date} style={styles.dateSection}>
                <Text style={styles.dateTitle}>{formatDate(date)}</Text>
                
                <View style={styles.selectionsContainer}>
                  {daySelections.map((selection, index) => (
                    <View key={index} style={styles.selectionCard}>
                      <View style={styles.selectionHeader}>
                        <View style={styles.mealTypeContainer}>
                          <Ionicons 
                            name={
                              selection.menu_item.meal_type === 'breakfast' ? 'sunny-outline' :
                              selection.menu_item.meal_type === 'lunch' ? 'restaurant-outline' :
                              'cafe-outline'
                            } 
                            size={20} 
                            color="#667eea" 
                          />
                          <Text style={styles.mealType}>
                            {getMealTypeDisplay(selection.menu_item.meal_type)}
                          </Text>
                        </View>
                        <View style={[
                          styles.statusBadge,
                          selection.opted ? styles.optedBadge : styles.skippedBadge
                        ]}>
                          <Text style={styles.statusText}>
                            {selection.opted ? 'Opted' : 'Skipped'}
                          </Text>
                        </View>
                      </View>
                      
                      <Text style={styles.itemName}>{selection.menu_item.name}</Text>
                      
                      {selection.menu_item.description ? (
                        <Text style={styles.itemDescription}>
                          {selection.menu_item.description}
                        </Text>
                      ) : null}
                      
                      <View style={styles.selectionFooter}>
                        <Text style={styles.itemPrice}>₹{selection.menu_item.price}</Text>
                        <Ionicons 
                          name={selection.opted ? "checkmark-circle" : "close-circle"} 
                          size={20} 
                          color={selection.opted ? "#10b981" : "#ef4444"} 
                        />
                      </View>
                    </View>
                  ))}
                </View>
              </View>
            ))
        )}
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
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 24,
    paddingHorizontal: 4,
  },
  backButton: {
    padding: 8,
  },
  title: {
    fontSize: width > 400 ? 22 : 20,
    fontWeight: '700',
    color: 'white',
    flex: 1,
    textAlign: 'center',
  },
  refreshButton: {
    padding: 8,
  },
  dateSection: {
    marginBottom: 24,
  },
  dateTitle: {
    fontSize: width > 400 ? 16 : 14,
    fontWeight: '700',
    color: 'white',
    marginBottom: 10,
    textShadowColor: 'rgba(0, 0, 0, 0.2)',
    textShadowOffset: { width: 0, height: 2 },
    textShadowRadius: 4,
  },
  selectionsContainer: {
    marginBottom: 8,
  },
  selectionCard: {
    backgroundColor: 'white',
    borderRadius: 10,
    padding: 14,
    marginBottom: 10,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  selectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  mealTypeContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  mealType: {
    fontSize: 14,
    fontWeight: '600',
    color: '#667eea',
    marginLeft: 6,
  },
  statusBadge: {
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
  },
  optedBadge: {
    backgroundColor: '#10b981',
  },
  skippedBadge: {
    backgroundColor: '#ef4444',
  },
  statusText: {
    fontSize: 12,
    color: 'white',
    fontWeight: '600',
  },
  itemName: {
    fontSize: 16,
    fontWeight: '700',
    color: '#2d3748',
    marginBottom: 4,
  },
  itemDescription: {
    fontSize: 14,
    color: '#718096',
    marginBottom: 12,
    lineHeight: 20,
  },
  selectionFooter: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  itemPrice: {
    fontSize: 16,
    fontWeight: '700',
    color: '#2d3748',
  },
  emptyState: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 80,
  },
  emptyText: {
    fontSize: 20,
    fontWeight: '600',
    color: 'white',
    marginTop: 16,
    marginBottom: 8,
  },
  emptySubtext: {
    fontSize: 16,
    color: 'rgba(255, 255, 255, 0.7)',
    textAlign: 'center',
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
});

export default MySelectionsScreen;