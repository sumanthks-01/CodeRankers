import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { colors, spacing, borderRadius, shadows, typography } from '../theme/colors';
import { Badge } from './UI';

const FoodCard = ({
  item,
  selected = false,
  onPress,
  category,
  showNutrition = false,
}) => {
  const getCategoryColor = () => {
    switch (category?.toLowerCase()) {
      case 'breakfast': return colors.breakfast;
      case 'lunch': return colors.lunch;
      case 'snacks': return colors.snacks;
      case 'dinner': return colors.dinner;
      default: return colors.primary;
    }
  };

  const getCategoryIcon = () => {
    switch (category?.toLowerCase()) {
      case 'breakfast': return '🍳';
      case 'lunch': return '🍲';
      case 'snacks': return '🍪';
      case 'dinner': return '🍽️';
      default: return '🍽️';
    }
  };

  const getDietaryBadges = () => {
    if (!item.dietary_info) return [];
    return item.dietary_info.split(',').map(info => info.trim());
  };

  const getSpiceLevel = () => {
    if (!item.spice_level) return null;
    const spiceIcons = {
      'mild': '🌶️',
      'medium': '🌶️🌶️',
      'hot': '🌶️🌶️🌶️',
      'very_hot': '🌶️🌶️🌶️🌶️'
    };
    return spiceIcons[item.spice_level.toLowerCase()] || null;
  };

  return (
    <TouchableOpacity
      style={[
        styles.container,
        selected && styles.selected,
        { borderLeftColor: getCategoryColor() }
      ]}
      onPress={onPress}
      activeOpacity={0.95}
    >
      {/* Header */}
      <View style={styles.header}>
        <View style={styles.titleRow}>
          <Text style={styles.categoryIcon}>{getCategoryIcon()}</Text>
          <Text style={styles.itemName} numberOfLines={2}>
            {item.name}
          </Text>
          {selected && (
            <View style={styles.selectedBadge}>
              <Text style={styles.selectedIcon}>✓</Text>
            </View>
          )}
        </View>
        
        {item.price && (
          <Text style={styles.price}>₹{item.price}</Text>
        )}
      </View>

      {/* Description */}
      <Text style={styles.description} numberOfLines={3}>
        {item.description}
      </Text>

      {/* Dietary Info & Spice Level */}
      <View style={styles.infoRow}>
        <View style={styles.badges}>
          {getDietaryBadges().map((badge, index) => (
            <Badge
              key={index}
              text={badge}
              variant="info"
              size="small"
            />
          ))}
        </View>
        
        {getSpiceLevel() && (
          <View style={styles.spiceLevel}>
            <Text style={styles.spiceText}>{getSpiceLevel()}</Text>
          </View>
        )}
      </View>

      {/* Nutrition Info (Optional) */}
      {showNutrition && item.nutrition && (
        <View style={styles.nutritionInfo}>
          <Text style={styles.nutritionTitle}>Nutrition (per serving)</Text>
          <View style={styles.nutritionRow}>
            {item.nutrition.calories && (
              <Text style={styles.nutritionItem}>
                🔥 {item.nutrition.calories} cal
              </Text>
            )}
            {item.nutrition.protein && (
              <Text style={styles.nutritionItem}>
                💪 {item.nutrition.protein}g protein
              </Text>
            )}
          </View>
        </View>
      )}

      {/* Availability Status */}
      {item.available === false && (
        <View style={styles.unavailableBadge}>
          <Text style={styles.unavailableText}>Currently Unavailable</Text>
        </View>
      )}
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: colors.surface,
    borderRadius: borderRadius.lg,
    padding: spacing.lg,
    marginBottom: spacing.md,
    borderLeftWidth: 4,
    borderWidth: 1,
    borderColor: colors.borderLight,
    ...shadows.card,
  },
  selected: {
    borderColor: colors.primary,
    backgroundColor: colors.primaryLight,
    ...shadows.medium,
  },
  header: {
    marginBottom: spacing.sm,
  },
  titleRow: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    marginBottom: spacing.xs,
  },
  categoryIcon: {
    fontSize: 20,
    marginRight: spacing.sm,
    marginTop: 2,
  },
  itemName: {
    ...typography.h3,
    color: colors.textPrimary,
    flex: 1,
    lineHeight: 22,
  },
  selectedBadge: {
    backgroundColor: colors.success,
    borderRadius: 12,
    width: 24,
    height: 24,
    justifyContent: 'center',
    alignItems: 'center',
    marginLeft: spacing.sm,
  },
  selectedIcon: {
    color: colors.textOnPrimary,
    fontSize: 14,
    fontWeight: 'bold',
  },
  price: {
    ...typography.h3,
    color: colors.success,
    fontWeight: 'bold',
  },
  description: {
    ...typography.body,
    color: colors.textSecondary,
    lineHeight: 20,
    marginBottom: spacing.md,
  },
  infoRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: spacing.sm,
  },
  badges: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    flex: 1,
    gap: spacing.xs,
  },
  spiceLevel: {
    marginLeft: spacing.sm,
  },
  spiceText: {
    fontSize: 16,
  },
  nutritionInfo: {
    backgroundColor: colors.surfaceAlt,
    borderRadius: borderRadius.md,
    padding: spacing.sm,
    marginTop: spacing.sm,
  },
  nutritionTitle: {
    ...typography.caption,
    color: colors.textSecondary,
    fontWeight: '600',
    marginBottom: spacing.xs,
  },
  nutritionRow: {
    flexDirection: 'row',
    gap: spacing.md,
  },
  nutritionItem: {
    ...typography.caption,
    color: colors.textSecondary,
  },
  unavailableBadge: {
    position: 'absolute',
    top: spacing.sm,
    right: spacing.sm,
    backgroundColor: colors.errorLight,
    borderRadius: borderRadius.sm,
    paddingHorizontal: spacing.sm,
    paddingVertical: spacing.xs,
  },
  unavailableText: {
    ...typography.caption,
    color: colors.error,
    fontWeight: '600',
  },
});

export default FoodCard;