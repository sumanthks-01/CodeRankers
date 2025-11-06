import React, { useState } from 'react';
import { View, Text, ScrollView, StyleSheet, Alert } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { useAuth } from '../../context/AuthContext';
import { colors, spacing, borderRadius, dimensions, typography } from '../../theme/colors';
import { SimpleButton, Header, SectionHeader, Badge } from '../../components/UI';
import FoodCard from '../../components/FoodCard';

const DemoMenuScreen = () => {
  const { logout } = useAuth();
  const [selections, setSelections] = useState({
    breakfast: [],
    lunch: [],
    snacks: []
  });

  const mockMenu = {
    date: "2024-01-15",
    meals: {
      breakfast: [
        { id: 1, name: "Idli Sambar", description: "South Indian breakfast" },
        { id: 2, name: "Poha", description: "Maharashtrian breakfast" }
      ],
      lunch: [
        { id: 3, name: "Rice & Dal", description: "Traditional lunch" },
        { id: 4, name: "Roti & Sabzi", description: "North Indian lunch" }
      ],
      snacks: [
        { id: 5, name: "Tea & Biscuits", description: "Evening snacks" },
        { id: 6, name: "Coffee & Samosa", description: "Evening snacks" }
      ]
    }
  };

  const toggleSelection = (mealType, itemId) => {
    setSelections(prev => {
      const currentSelections = prev[mealType] || [];
      const isSelected = currentSelections.includes(itemId);
      
      return {
        ...prev,
        [mealType]: isSelected
          ? currentSelections.filter(id => id !== itemId)
          : [...currentSelections, itemId]
      };
    });
  };

  const saveSelections = () => {
    Alert.alert('Success', 'Demo: Meal selections saved!');
  };

  const getMealIcon = (mealType) => {
    switch (mealType) {
      case 'breakfast': return '🍳';
      case 'lunch': return '🍲';
      case 'snacks': return '🍪';
      default: return '🍽️';
    }
  };

  const getTotalSelections = () => {
    return Object.values(selections).reduce((total, items) => total + (items?.length || 0), 0);
  };

  const renderMealSection = (mealType, items) => {
    const selectedCount = selections[mealType]?.length || 0;
    
    return (
      <View style={styles.mealSection}>
        <SectionHeader
          title={mealType.charAt(0).toUpperCase() + mealType.slice(1)}
          icon={<Text style={styles.mealIcon}>{getMealIcon(mealType)}</Text>}
          action={
            selectedCount > 0 && (
              <Badge 
                text={`${selectedCount} selected`} 
                variant="success" 
                size="small" 
              />
            )
          }
        />
        {items.map(item => (
          <FoodCard
            key={item.id}
            item={item}
            selected={selections[mealType]?.includes(item.id)}
            onPress={() => toggleSelection(mealType, item.id)}
            category={mealType}
          />
        ))}
      </View>
    );
  };

  return (
    <LinearGradient colors={['#F8FAFC', '#E2E8F0']} style={styles.container}>
      <Header 
        title="Tomorrow's Menu"
        subtitle={`Demo Mode • ${mockMenu.date}`}
        actions={
          <SimpleButton
            title="Logout"
            onPress={logout}
            variant="error"
            size="small"
          />
        }
      />
      
      <ScrollView style={styles.scrollView}>
        <View style={styles.demoNotice}>
          <Text style={styles.demoIcon}>🎭</Text>
          <Text style={styles.demoText}>Demo Mode - Tap items to select your meals</Text>
        </View>

        {renderMealSection('breakfast', mockMenu.meals.breakfast)}
        {renderMealSection('lunch', mockMenu.meals.lunch)}
        {renderMealSection('snacks', mockMenu.meals.snacks)}

        <View style={styles.summaryCard}>
          <Text style={styles.summaryTitle}>Selection Summary</Text>
          <Text style={styles.summaryText}>
            You have selected {getTotalSelections()} items for tomorrow
          </Text>
        </View>

        <SimpleButton
          title="Save Demo Selections"
          onPress={saveSelections}
          variant="success"
          size="large"
          style={styles.saveButton}
          icon={<Text style={styles.saveIcon}>💾</Text>}
        />
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
    padding: spacing.lg,
  },
  demoNotice: {
    backgroundColor: colors.infoLight,
    borderRadius: borderRadius.lg,
    padding: spacing.lg,
    marginBottom: spacing.lg,
    alignItems: 'center',
    borderLeftWidth: 4,
    borderLeftColor: colors.info,
  },
  demoIcon: {
    fontSize: 32,
    marginBottom: spacing.sm,
  },
  demoText: {
    ...typography.body,
    color: colors.textSecondary,
    textAlign: 'center',
    fontStyle: 'italic',
  },
  mealSection: {
    marginBottom: spacing.xl,
  },
  mealIcon: {
    fontSize: 20,
  },
  summaryCard: {
    backgroundColor: colors.primaryLight,
    borderRadius: borderRadius.lg,
    padding: spacing.lg,
    marginBottom: spacing.lg,
    borderLeftWidth: 4,
    borderLeftColor: colors.primary,
  },
  summaryTitle: {
    ...typography.h3,
    color: colors.textPrimary,
    marginBottom: spacing.xs,
  },
  summaryText: {
    ...typography.body,
    color: colors.textSecondary,
  },
  saveButton: {
    marginBottom: spacing.xl,
  },
  saveIcon: {
    fontSize: 16,
  },
});

export default DemoMenuScreen;