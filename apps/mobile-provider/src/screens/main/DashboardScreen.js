import React, { useState, useEffect } from 'react';
import {
  View,
  StyleSheet,
  ScrollView,
  RefreshControl,
  Alert,
  Dimensions,
} from 'react-native';
import {
  Text,
  Card,
  Button,
  Chip,
  Avatar,
  Switch,
  FAB,
  ProgressBar,
  Badge,
} from 'react-native-paper';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { LineChart } from 'react-native-chart-kit';
import { useAuth } from '../../contexts/AuthContext';
import { providerTheme as theme } from '../../utils/theme';

const { width } = Dimensions.get('window');

// Dados simulados baseados na análise da Porto Seguro
const todayStats = {
  earnings: 450.00,
  jobs: 3,
  rating: 4.8,
  completionRate: 95,
};

const weeklyEarnings = {
  labels: ['Seg', 'Ter', 'Qua', 'Qui', 'Sex', 'Sáb', 'Dom'],
  datasets: [{
    data: [120, 180, 250, 320, 280, 450, 380],
    strokeWidth: 3,
  }],
};

const pendingJobs = [
  {
    id: 'BK001',
    client: 'Maria Silva',
    service: 'Reparo de Encanamento',
    location: 'Vila Madalena, SP',
    scheduledTime: '14:30',
    value: 180.00,
    urgent: true,
    distance: '1.2 km',
  },
  {
    id: 'BK002',
    client: 'Carlos Oliveira',
    service: 'Instalação Elétrica',
    location: 'Pinheiros, SP',
    scheduledTime: '16:00',
    value: 320.00,
    urgent: false,
    distance: '2.8 km',
  },
];

const recentJobs = [
  {
    id: 'BK003',
    client: 'Ana Costa',
    service: 'Troca de Fechadura',
    completedAt: '12:45',
    value: 150.00,
    rating: 5,
    status: 'completed',
  },
  {
    id: 'BK004',
    client: 'Pedro Santos',
    service: 'Reparo Elétrico',
    completedAt: '10:20',
    value: 200.00,
    rating: 4,
    status: 'completed',
  },
];

export default function DashboardScreen({ navigation }) {
  const { user } = useAuth();
  const [isAvailable, setIsAvailable] = useState(true);
  const [refreshing, setRefreshing] = useState(false);

  const onRefresh = React.useCallback(() => {
    setRefreshing(true);
    setTimeout(() => {
      setRefreshing(false);
    }, 2000);
  }, []);

  const handleAvailabilityToggle = () => {
    setIsAvailable(!isAvailable);
    Alert.alert(
      isAvailable ? 'Ficar Indisponível' : 'Ficar Disponível',
      isAvailable 
        ? 'Você não receberá novos agendamentos enquanto estiver indisponível.'
        : 'Você começará a receber novos agendamentos.',
      [
        { text: 'Cancelar', style: 'cancel', onPress: () => setIsAvailable(isAvailable) },
        { text: 'Confirmar', onPress: () => {} },
      ]
    );
  };

  const handleAcceptJob = (jobId) => {
    Alert.alert(
      'Aceitar Agendamento',
      'Deseja aceitar este agendamento?',
      [
        { text: 'Recusar', style: 'cancel' },
        { 
          text: 'Aceitar', 
          onPress: () => {
            navigation.navigate('JobDetails', { jobId });
          }
        },
      ]
    );
  };

  const formatCurrency = (value) => {
    return new Intl.NumberFormat('pt-BR', {
      style: 'currency',
      currency: 'BRL',
    }).format(value);
  };

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView
        style={styles.scrollView}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
        }
      >
        {/* Header */}
        <View style={styles.header}>
          <View style={styles.headerInfo}>
            <Text style={styles.greeting}>Olá, {user?.profile?.fullName || 'Prestador'}!</Text>
            <Text style={styles.subGreeting}>
              {isAvailable ? 'Você está disponível' : 'Você está indisponível'}
            </Text>
          </View>
          <View style={styles.headerActions}>
            <View style={styles.availabilityContainer}>
              <Text style={styles.availabilityLabel}>
                {isAvailable ? 'Online' : 'Offline'}
              </Text>
              <Switch
                value={isAvailable}
                onValueChange={handleAvailabilityToggle}
                color={theme.colors.primary}
              />
            </View>
            <Avatar.Text
              size={50}
              label={user?.profile?.fullName?.charAt(0) || 'P'}
              style={[styles.avatar, { backgroundColor: isAvailable ? theme.colors.primary : theme.colors.disabled }]}
            />
          </View>
        </View>

        {/* Today's Stats */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Hoje</Text>
          <View style={styles.statsGrid}>
            <Card style={styles.statCard}>
              <Card.Content style={styles.statContent}>
                <Ionicons name="wallet" size={24} color={theme.colors.earning} />
                <Text style={styles.statValue}>{formatCurrency(todayStats.earnings)}</Text>
                <Text style={styles.statLabel}>Ganhos</Text>
              </Card.Content>
            </Card>

            <Card style={styles.statCard}>
              <Card.Content style={styles.statContent}>
                <Ionicons name="briefcase" size={24} color={theme.colors.info} />
                <Text style={styles.statValue}>{todayStats.jobs}</Text>
                <Text style={styles.statLabel}>Serviços</Text>
              </Card.Content>
            </Card>

            <Card style={styles.statCard}>
              <Card.Content style={styles.statContent}>
                <Ionicons name="star" size={24} color={theme.colors.warning} />
                <Text style={styles.statValue}>{todayStats.rating}</Text>
                <Text style={styles.statLabel}>Avaliação</Text>
              </Card.Content>
            </Card>

            <Card style={styles.statCard}>
              <Card.Content style={styles.statContent}>
                <Ionicons name="checkmark-circle" size={24} color={theme.colors.success} />
                <Text style={styles.statValue}>{todayStats.completionRate}%</Text>
                <Text style={styles.statLabel}>Conclusão</Text>
              </Card.Content>
            </Card>
          </View>
        </View>

        {/* Weekly Earnings Chart */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Ganhos da Semana</Text>
          <Card style={styles.chartCard}>
            <Card.Content>
              <LineChart
                data={weeklyEarnings}
                width={width - theme.spacing.lg * 4}
                height={200}
                chartConfig={{
                  backgroundColor: theme.colors.surface,
                  backgroundGradientFrom: theme.colors.surface,
                  backgroundGradientTo: theme.colors.surface,
                  decimalPlaces: 0,
                  color: (opacity = 1) => `rgba(40, 167, 69, ${opacity})`,
                  labelColor: (opacity = 1) => `rgba(51, 51, 51, ${opacity})`,
                  style: {
                    borderRadius: 16,
                  },
                  propsForDots: {
                    r: '6',
                    strokeWidth: '2',
                    stroke: theme.colors.primary,
                  },
                }}
                bezier
                style={styles.chart}
              />
              <Text style={styles.chartTotal}>
                Total da semana: {formatCurrency(1980)}
              </Text>
            </Card.Content>
          </Card>
        </View>

        {/* Pending Jobs */}
        {pendingJobs.length > 0 && (
          <View style={styles.section}>
            <View style={styles.sectionHeader}>
              <Text style={styles.sectionTitle}>Agendamentos Pendentes</Text>
              <Badge style={styles.badge}>{pendingJobs.length}</Badge>
            </View>
            {pendingJobs.map((job) => (
              <Card key={job.id} style={styles.jobCard}>
                <Card.Content style={styles.jobContent}>
                  <View style={styles.jobHeader}>
                    <View style={styles.jobInfo}>
                      <Text style={styles.jobClient}>{job.client}</Text>
                      <Text style={styles.jobService}>{job.service}</Text>
                      <View style={styles.jobMeta}>
                        <Ionicons name="location" size={14} color={theme.colors.onSurface} />
                        <Text style={styles.jobLocation}>{job.location}</Text>
                        <Text style={styles.jobDistance}>• {job.distance}</Text>
                      </View>
                    </View>
                    <View style={styles.jobActions}>
                      {job.urgent && (
                        <Chip
                          mode="outlined"
                          compact
                          style={styles.urgentChip}
                          textStyle={styles.urgentChipText}
                        >
                          Urgente
                        </Chip>
                      )}
                      <Text style={styles.jobValue}>{formatCurrency(job.value)}</Text>
                    </View>
                  </View>
                  
                  <View style={styles.jobFooter}>
                    <View style={styles.jobTime}>
                      <Ionicons name="time" size={16} color={theme.colors.primary} />
                      <Text style={styles.jobScheduledTime}>{job.scheduledTime}</Text>
                    </View>
                    <View style={styles.jobButtons}>
                      <Button
                        mode="outlined"
                        compact
                        onPress={() => navigation.navigate('JobDetails', { jobId: job.id })}
                        style={styles.detailsButton}
                      >
                        Detalhes
                      </Button>
                      <Button
                        mode="contained"
                        compact
                        onPress={() => handleAcceptJob(job.id)}
                        style={styles.acceptButton}
                      >
                        Aceitar
                      </Button>
                    </View>
                  </View>
                </Card.Content>
              </Card>
            ))}
          </View>
        )}

        {/* Recent Jobs */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Serviços Recentes</Text>
          {recentJobs.map((job) => (
            <Card key={job.id} style={styles.recentJobCard}>
              <Card.Content style={styles.recentJobContent}>
                <View style={styles.recentJobHeader}>
                  <View style={styles.recentJobInfo}>
                    <Text style={styles.recentJobClient}>{job.client}</Text>
                    <Text style={styles.recentJobService}>{job.service}</Text>
                  </View>
                  <View style={styles.recentJobMeta}>
                    <Text style={styles.recentJobValue}>{formatCurrency(job.value)}</Text>
                    <Text style={styles.recentJobTime}>{job.completedAt}</Text>
                  </View>
                </View>
                <View style={styles.recentJobFooter}>
                  <View style={styles.ratingContainer}>
                    {[...Array(5)].map((_, i) => (
                      <Ionicons
                        key={i}
                        name={i < job.rating ? 'star' : 'star-outline'}
                        size={16}
                        color={theme.colors.warning}
                      />
                    ))}
                    <Text style={styles.ratingText}>({job.rating})</Text>
                  </View>
                  <Chip
                    mode="outlined"
                    compact
                    style={styles.completedChip}
                    textStyle={styles.completedChipText}
                  >
                    Concluído
                  </Chip>
                </View>
              </Card.Content>
            </Card>
          ))}
          <Button
            mode="outlined"
            onPress={() => navigation.navigate('History')}
            style={styles.viewAllButton}
          >
            Ver Histórico Completo
          </Button>
        </View>

        {/* Performance Metrics */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Performance</Text>
          <Card style={styles.performanceCard}>
            <Card.Content>
              <View style={styles.metricRow}>
                <Text style={styles.metricLabel}>Taxa de Aceitação</Text>
                <Text style={styles.metricValue}>92%</Text>
              </View>
              <ProgressBar progress={0.92} color={theme.colors.primary} style={styles.progressBar} />
              
              <View style={styles.metricRow}>
                <Text style={styles.metricLabel}>Tempo de Resposta</Text>
                <Text style={styles.metricValue}>2.3 min</Text>
              </View>
              <ProgressBar progress={0.85} color={theme.colors.info} style={styles.progressBar} />
              
              <View style={styles.metricRow}>
                <Text style={styles.metricLabel}>Satisfação do Cliente</Text>
                <Text style={styles.metricValue}>4.8/5</Text>
              </View>
              <ProgressBar progress={0.96} color={theme.colors.warning} style={styles.progressBar} />
            </Card.Content>
          </Card>
        </View>
      </ScrollView>

      {/* Floating Action Button */}
      <FAB
        icon="plus"
        style={styles.fab}
        onPress={() => navigation.navigate('NewService')}
        label="Novo Serviço"
        visible={isAvailable}
      />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: theme.colors.background,
  },
  scrollView: {
    flex: 1,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: theme.spacing.lg,
    paddingVertical: theme.spacing.md,
    backgroundColor: theme.colors.surface,
    borderBottomWidth: 1,
    borderBottomColor: theme.colors.disabled,
  },
  headerInfo: {
    flex: 1,
  },
  greeting: {
    fontSize: 24,
    fontWeight: 'bold',
    color: theme.colors.text,
  },
  subGreeting: {
    fontSize: 16,
    color: theme.colors.onSurface,
    marginTop: 4,
  },
  headerActions: {
    alignItems: 'flex-end',
  },
  availabilityContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: theme.spacing.sm,
  },
  availabilityLabel: {
    fontSize: 14,
    fontWeight: '500',
    color: theme.colors.text,
    marginRight: theme.spacing.sm,
  },
  avatar: {
    backgroundColor: theme.colors.primary,
  },
  section: {
    paddingHorizontal: theme.spacing.lg,
    marginBottom: theme.spacing.lg,
  },
  sectionHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: theme.spacing.md,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: theme.colors.text,
    marginBottom: theme.spacing.md,
  },
  badge: {
    backgroundColor: theme.colors.primary,
    marginLeft: theme.spacing.sm,
  },
  statsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
  },
  statCard: {
    width: (width - theme.spacing.lg * 2 - theme.spacing.md) / 2,
    marginBottom: theme.spacing.md,
  },
  statContent: {
    alignItems: 'center',
    paddingVertical: theme.spacing.md,
  },
  statValue: {
    fontSize: 24,
    fontWeight: 'bold',
    color: theme.colors.text,
    marginVertical: theme.spacing.xs,
  },
  statLabel: {
    fontSize: 14,
    color: theme.colors.onSurface,
  },
  chartCard: {
    alignItems: 'center',
  },
  chart: {
    marginVertical: theme.spacing.sm,
    borderRadius: 16,
  },
  chartTotal: {
    fontSize: 16,
    fontWeight: 'bold',
    color: theme.colors.primary,
    textAlign: 'center',
    marginTop: theme.spacing.sm,
  },
  jobCard: {
    marginBottom: theme.spacing.md,
    borderLeftWidth: 4,
    borderLeftColor: theme.colors.primary,
  },
  jobContent: {
    paddingVertical: theme.spacing.md,
  },
  jobHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: theme.spacing.md,
  },
  jobInfo: {
    flex: 1,
  },
  jobClient: {
    fontSize: 18,
    fontWeight: 'bold',
    color: theme.colors.text,
  },
  jobService: {
    fontSize: 16,
    color: theme.colors.onSurface,
    marginTop: 2,
  },
  jobMeta: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: theme.spacing.xs,
  },
  jobLocation: {
    fontSize: 14,
    color: theme.colors.onSurface,
    marginLeft: 4,
  },
  jobDistance: {
    fontSize: 14,
    color: theme.colors.onSurface,
  },
  jobActions: {
    alignItems: 'flex-end',
  },
  urgentChip: {
    backgroundColor: theme.colors.error,
    borderColor: theme.colors.error,
    marginBottom: theme.spacing.xs,
  },
  urgentChipText: {
    color: 'white',
    fontSize: 12,
  },
  jobValue: {
    fontSize: 20,
    fontWeight: 'bold',
    color: theme.colors.earning,
  },
  jobFooter: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  jobTime: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  jobScheduledTime: {
    fontSize: 16,
    fontWeight: '500',
    color: theme.colors.primary,
    marginLeft: 4,
  },
  jobButtons: {
    flexDirection: 'row',
    gap: theme.spacing.sm,
  },
  detailsButton: {
    minWidth: 80,
  },
  acceptButton: {
    minWidth: 80,
  },
  recentJobCard: {
    marginBottom: theme.spacing.md,
  },
  recentJobContent: {
    paddingVertical: theme.spacing.md,
  },
  recentJobHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: theme.spacing.sm,
  },
  recentJobInfo: {
    flex: 1,
  },
  recentJobClient: {
    fontSize: 16,
    fontWeight: '500',
    color: theme.colors.text,
  },
  recentJobService: {
    fontSize: 14,
    color: theme.colors.onSurface,
    marginTop: 2,
  },
  recentJobMeta: {
    alignItems: 'flex-end',
  },
  recentJobValue: {
    fontSize: 16,
    fontWeight: 'bold',
    color: theme.colors.earning,
  },
  recentJobTime: {
    fontSize: 14,
    color: theme.colors.onSurface,
    marginTop: 2,
  },
  recentJobFooter: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  ratingContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  ratingText: {
    fontSize: 14,
    color: theme.colors.onSurface,
    marginLeft: 4,
  },
  completedChip: {
    backgroundColor: theme.colors.success,
    borderColor: theme.colors.success,
  },
  completedChipText: {
    color: 'white',
    fontSize: 12,
  },
  viewAllButton: {
    marginTop: theme.spacing.sm,
  },
  performanceCard: {
    paddingVertical: theme.spacing.md,
  },
  metricRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: theme.spacing.xs,
  },
  metricLabel: {
    fontSize: 16,
    color: theme.colors.text,
  },
  metricValue: {
    fontSize: 16,
    fontWeight: 'bold',
    color: theme.colors.primary,
  },
  progressBar: {
    height: 8,
    borderRadius: 4,
    marginBottom: theme.spacing.md,
  },
  fab: {
    position: 'absolute',
    margin: theme.spacing.lg,
    right: 0,
    bottom: 0,
    backgroundColor: theme.colors.primary,
  },
});
