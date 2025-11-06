import React from 'react';
import { View, Text, ScrollView, StyleSheet } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { colors, spacing, typography } from '../theme/colors';
import { 
  GradientButton, 
  GlassCard, 
  AnimatedCard, 
  GradientHeader, 
  StatusChip 
} from '../components/UI';

const DemoScreen = () => {
  return (
    <LinearGradient
      colors={['#F8FAFC', '#E2E8F0']}
      style={styles.container}
    >
      <ScrollView style={styles.scrollView} showsVerticalScrollIndicator={false}>
        <GradientHeader 
          title="Enhanced UI Demo"
          subtitle="Colorful components showcase"
          gradient={colors.primaryGradient}
        />

        <Text style={styles.sectionTitle}>Gradient Buttons</Text>
        <View style={styles.buttonRow}>
          <GradientButton
            title="Primary"
            gradient={colors.primaryGradient}
            icon="star"
            style={styles.demoButton}
          />
          <GradientButton
            title="Success"
            gradient={colors.successGradient}
            icon="checkmark"
            style={styles.demoButton}
          />
        </View>

        <Text style={styles.sectionTitle}>Status Chips</Text>
        <View style={styles.chipRow}>
          <StatusChip label="Available" status="success" icon="checkmark" />
          <StatusChip label="Pending" status="warning" icon="time" />
          <StatusChip label="Error" status="error" icon="close" />
          <StatusChip label="Info" status="info" icon="information" />
        </View>

        <Text style={styles.sectionTitle}>Glass Cards</Text>
        <GlassCard style={styles.demoCard}>
          <Text style={styles.cardTitle}>Glass Morphism Card</Text>
          <Text style={styles.cardText}>
            This card uses glass morphism effects with backdrop blur and transparency.
          </Text>
        </GlassCard>

        <Text style={styles.sectionTitle}>Animated Cards</Text>
        <AnimatedCard style={styles.demoCard}>
          <Text style={styles.cardTitle}>Interactive Card</Text>
          <Text style={styles.cardText}>
            This card has hover effects and can be selected with visual feedback.
          </Text>
        </AnimatedCard>

        <AnimatedCard selected style={styles.demoCard}>
          <Text style={styles.cardTitle}>Selected Card</Text>
          <Text style={styles.cardText}>
            This card shows the selected state with enhanced styling.
          </Text>
        </AnimatedCard>
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
  sectionTitle: {
    ...typography.h3,
    color: colors.textPrimary,
    marginTop: spacing.xl,
    marginBottom: spacing.md,
  },
  buttonRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: spacing.lg,
  },
  demoButton: {
    flex: 1,
    marginHorizontal: spacing.xs,
  },
  chipRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: spacing.sm,
    marginBottom: spacing.lg,
  },
  demoCard: {
    marginBottom: spacing.md,
  },
  cardTitle: {
    ...typography.h4,
    color: colors.textPrimary,
    marginBottom: spacing.xs,
  },
  cardText: {
    ...typography.body,
    color: colors.textSecondary,
    lineHeight: 22,
  },
});

export default DemoScreen;