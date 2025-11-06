import React, { useState } from 'react';
import { View, Text, ScrollView, StyleSheet } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { useAuth } from '../../context/AuthContext';
import { colors, spacing, borderRadius, typography } from '../../theme/colors';
import { SimpleButton, SimpleCard, Header, SectionHeader, Badge } from '../../components/UI';

const DemoReportsScreen = () => {
  const { logout } = useAuth();
  const [selectedDate] = useState('2024-01-15');

  const mockReport = {
    date: '2024-01-15',
    total_employees: 50,
    report: {
      breakfast: [
        { item_name: 'Idli Sambar', count: 25 },
        { item_name: 'Poha', count: 15 },
        { item_name: 'Upma', count: 8 }
      ],
      lunch: [
        { item_name: 'Rice & Dal', count: 35 },
        { item_name: 'Roti & Sabzi', count: 20 },
        { item_name: 'Biryani', count: 12 }
      ],
      snacks: [
        { item_name: 'Tea & Biscuits', count: 40 },
        { item_name: 'Coffee & Samosa', count: 18 },
        { item_name: 'Juice & Sandwich', count: 10 }
      ]
    }
  };

  const getTotalCount = () => {
    const breakfastTotal = mockReport.report.breakfast.reduce((sum, item) => sum + item.count, 0);
    const lunchTotal = mockReport.report.lunch.reduce((sum, item) => sum + item.count, 0);
    const snacksTotal = mockReport.report.snacks.reduce((sum, item) => sum + item.count, 0);
    return breakfastTotal + lunchTotal + snacksTotal;
  };

  const getMealIcon = (mealType) => {
    switch (mealType) {
      case 'breakfast': return '🍳';
      case 'lunch': return '🍲';
      case 'snacks': return '🍪';
      default: return '🍽️';
    }
  };

  const getMealColor = (mealType) => {
    switch (mealType) {
      case 'breakfast': return colors.breakfast;
      case 'lunch': return colors.lunch;
      case 'snacks': return colors.snacks;
      default: return colors.primary;
    }
  };

  const renderMealReport = (mealType, items) => {
    const totalCount = items.reduce((sum, item) => sum + item.count, 0);
    
    return (
      <SimpleCard 
        style={[
          styles.mealSection,
          { borderLeftColor: getMealColor(mealType) }
        ]}
        elevated
      >
        <SectionHeader
          title={mealType.charAt(0).toUpperCase() + mealType.slice(1)}
          icon={<Text style={styles.mealIcon}>{getMealIcon(mealType)}</Text>}
          action={
            <Badge 
              text={`${totalCount} portions`} 
              variant={mealType === 'breakfast' ? 'warning' : 
                     mealType === 'lunch' ? 'success' : 'info'} 
              size="small" 
            />
          }
        />
        
        {items.length === 0 ? (
          <View style={styles.emptyMeal}>
            <Text style={styles.emptyMealText}>No orders for this meal</Text>
          </View>
        ) : (
          items.map((item, index) => (
            <View key={index} style={styles.reportItem}>
              <Text style={styles.itemName}>{item.item_name}</Text>
              <Badge 
                text={`${item.count}`} 
                variant="success" 
                size="small" 
              />
            </View>
          ))
        )}
      </SimpleCard>
    );
  };

  return (
    <LinearGradient colors={['#F8FAFC', '#E2E8F0']} style={styles.container}>
      <Header 
        title="Daily Reports"
        subtitle={`Demo Mode • ${selectedDate}`}
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
          <Text style={styles.demoText}>Demo Mode - Sample daily meal report</Text>
        </View>

        <SimpleCard style={styles.summaryCard} elevated>
          <SectionHeader
            title="Daily Summary"
            icon={<Text style={styles.summaryIcon}>📊</Text>}
          />
          
          <View style={styles.summaryGrid}>
            <View style={styles.summaryItem}>
              <Text style={styles.summaryNumber}>{mockReport.total_employees}</Text>
              <Text style={styles.summaryLabel}>Total Employees</Text>
            </View>
            
            <View style={styles.summaryItem}>
              <Text style={styles.summaryNumber}>{getTotalCount()}</Text>
              <Text style={styles.summaryLabel}>Meal Portions</Text>
            </View>
            
            <View style={styles.summaryItem}>
              <Text style={styles.summaryNumber}>
                {Math.round((getTotalCount() / (mockReport.total_employees * 3)) * 100)}%
              </Text>
              <Text style={styles.summaryLabel}>Participation</Text>
            </View>
          </View>
        </SimpleCard>

        {renderMealReport('breakfast', mockReport.report.breakfast)}
        {renderMealReport('lunch', mockReport.report.lunch)}
        {renderMealReport('snacks', mockReport.report.snacks)}
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
  summaryCard: {
    marginBottom: spacing.lg,
    borderLeftWidth: 4,
    borderLeftColor: colors.primary,
  },
  summaryIcon: {
    fontSize: 20,
  },
  summaryGrid: {
    flexDirection: 'row',
    justifyContent: 'space-around',
  },
  summaryItem: {
    alignItems: 'center',
    flex: 1,
  },
  summaryNumber: {
    ...typography.h1,
    color: colors.primary,
    marginBottom: spacing.xs,
  },
  summaryLabel: {
    ...typography.caption,
    color: colors.textSecondary,
    textAlign: 'center',
  },
  mealSection: {
    marginBottom: spacing.lg,
    borderLeftWidth: 4,
  },
  mealIcon: {
    fontSize: 20,
  },
  emptyMeal: {
    alignItems: 'center',
    padding: spacing.lg,
  },
  emptyMealText: {
    ...typography.body,
    color: colors.textTertiary,
    fontStyle: 'italic',
  },
  reportItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: spacing.sm,
    borderBottomWidth: 1,
    borderBottomColor: colors.borderLight,
  },
  itemName: {
    ...typography.body,
    color: colors.textPrimary,
    flex: 1,
  },
});

export default DemoReportsScreen;