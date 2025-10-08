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
  Badge,
  FAB,
  Searchbar,
} from 'react-native-paper';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import MapView, { Marker } from 'react-native-maps';
import { useAuth } from '../../contexts/AuthContext';
import { theme } from '../../utils/theme';

const { width } = Dimensions.get('window');

// Dados simulados baseados na análise da Porto Seguro
const serviceCategories = [
  { id: 1, name: 'Encanador', icon: 'water', color: '#4ECDC4', urgent: true },
  { id: 2, name: 'Eletricista', icon: 'flash', color: '#FFD700', urgent: true },
  { id: 3, name: 'Chaveiro', icon: 'key', color: '#FF6B35', urgent: true },
  { id: 4, name: 'Vidraceiro', icon: 'square', color: '#45B7D1', urgent: false },
  { id: 5, name: 'Pintor', icon: 'brush', color: '#96CEB4', urgent: false },
  { id: 6, name: 'Marceneiro', icon: 'hammer', color: '#FFEAA7', urgent: false },
];

const recentBookings = [
  {
    id: 'BK001',
    service: 'Reparo de Encanamento',
    provider: 'João Santos',
    status: 'completed',
    date: '2h atrás',
    rating: 4.8,
  },
  {
    id: 'BK002',
    service: 'Instalação Elétrica',
    provider: 'Ana Costa',
    status: 'in_progress',
    date: '1h atrás',
    rating: null,
  },
];

const nearbyProviders = [
  {
    id: 1,
    name: 'Carlos Silva',
    service: 'Encanador',
    rating: 4.9,
    distance: '0.8 km',
    latitude: -23.5505,
    longitude: -46.6333,
    available: true,
  },
  {
    id: 2,
    name: 'Maria Santos',
    service: 'Eletricista',
    rating: 4.7,
    distance: '1.2 km',
    latitude: -23.5515,
    longitude: -46.6343,
    available: true,
  },
];

export default function HomeScreen({ navigation }) {
  const { user } = useAuth();
  const [refreshing, setRefreshing] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState(null);

  const onRefresh = React.useCallback(() => {
    setRefreshing(true);
    // Simular carregamento de dados
    setTimeout(() => {
      setRefreshing(false);
    }, 2000);
  }, []);

  const handleEmergency = () => {
    Alert.alert(
      'Emergência',
      'Você será conectado imediatamente com o prestador mais próximo disponível.',
      [
        { text: 'Cancelar', style: 'cancel' },
        { text: 'Continuar', onPress: () => navigation.navigate('Booking', { emergency: true }) },
      ]
    );
  };

  const handleCategorySelect = (category) => {
    setSelectedCategory(category);
    navigation.navigate('Booking', { category });
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'completed': return theme.colors.success;
      case 'in_progress': return theme.colors.warning;
      case 'pending': return theme.colors.info;
      default: return theme.colors.onSurface;
    }
  };

  const getStatusText = (status) => {
    switch (status) {
      case 'completed': return 'Concluído';
      case 'in_progress': return 'Em Andamento';
      case 'pending': return 'Pendente';
      default: return 'Desconhecido';
    }
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
          <View>
            <Text style={styles.greeting}>Olá, {user?.profile?.fullName || 'Cliente'}!</Text>
            <Text style={styles.subGreeting}>Como podemos ajudar você hoje?</Text>
          </View>
          <Avatar.Text
            size={50}
            label={user?.profile?.fullName?.charAt(0) || 'C'}
            style={styles.avatar}
          />
        </View>

        {/* Emergency Button */}
        <Card style={styles.emergencyCard}>
          <Card.Content style={styles.emergencyContent}>
            <View style={styles.emergencyInfo}>
              <Ionicons name="warning" size={24} color={theme.colors.error} />
              <View style={styles.emergencyText}>
                <Text style={styles.emergencyTitle}>Emergência?</Text>
                <Text style={styles.emergencySubtitle}>
                  Conecte-se imediatamente com um prestador
                </Text>
              </View>
            </View>
            <Button
              mode="contained"
              onPress={handleEmergency}
              buttonColor={theme.colors.error}
              style={styles.emergencyButton}
            >
              SOS
            </Button>
          </Card.Content>
        </Card>

        {/* Search */}
        <Searchbar
          placeholder="Buscar serviços..."
          onChangeText={setSearchQuery}
          value={searchQuery}
          style={styles.searchbar}
          iconColor={theme.colors.primary}
        />

        {/* Service Categories */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Serviços Disponíveis</Text>
          <View style={styles.categoriesGrid}>
            {serviceCategories.map((category) => (
              <Card
                key={category.id}
                style={[styles.categoryCard, { borderLeftColor: category.color }]}
                onPress={() => handleCategorySelect(category)}
              >
                <Card.Content style={styles.categoryContent}>
                  <View style={styles.categoryHeader}>
                    <Ionicons name={category.icon} size={24} color={category.color} />
                    {category.urgent && (
                      <Badge style={styles.urgentBadge} size={8} />
                    )}
                  </View>
                  <Text style={styles.categoryName}>{category.name}</Text>
                  {category.urgent && (
                    <Chip
                      mode="outlined"
                      compact
                      style={styles.urgentChip}
                      textStyle={styles.urgentChipText}
                    >
                      24h
                    </Chip>
                  )}
                </Card.Content>
              </Card>
            ))}
          </View>
        </View>

        {/* Recent Bookings */}
        {recentBookings.length > 0 && (
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Agendamentos Recentes</Text>
            {recentBookings.map((booking) => (
              <Card key={booking.id} style={styles.bookingCard}>
                <Card.Content style={styles.bookingContent}>
                  <View style={styles.bookingHeader}>
                    <Text style={styles.bookingService}>{booking.service}</Text>
                    <Chip
                      mode="outlined"
                      textStyle={{ color: getStatusColor(booking.status) }}
                      style={{ borderColor: getStatusColor(booking.status) }}
                    >
                      {getStatusText(booking.status)}
                    </Chip>
                  </View>
                  <View style={styles.bookingDetails}>
                    <Text style={styles.bookingProvider}>
                      <Ionicons name="person" size={14} /> {booking.provider}
                    </Text>
                    <Text style={styles.bookingDate}>{booking.date}</Text>
                  </View>
                  {booking.rating && (
                    <View style={styles.ratingContainer}>
                      <Ionicons name="star" size={16} color={theme.colors.warning} />
                      <Text style={styles.rating}>{booking.rating}</Text>
                    </View>
                  )}
                </Card.Content>
              </Card>
            ))}
            <Button
              mode="outlined"
              onPress={() => navigation.navigate('Agendamentos')}
              style={styles.viewAllButton}
            >
              Ver Todos os Agendamentos
            </Button>
          </View>
        )}

        {/* Map */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Prestadores Próximos</Text>
          <Card style={styles.mapCard}>
            <MapView
              style={styles.map}
              initialRegion={{
                latitude: -23.5505,
                longitude: -46.6333,
                latitudeDelta: 0.01,
                longitudeDelta: 0.01,
              }}
            >
              {nearbyProviders.map((provider) => (
                <Marker
                  key={provider.id}
                  coordinate={{
                    latitude: provider.latitude,
                    longitude: provider.longitude,
                  }}
                  title={provider.name}
                  description={`${provider.service} • ${provider.rating}⭐ • ${provider.distance}`}
                />
              ))}
            </MapView>
          </Card>
        </View>

        {/* Nearby Providers List */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Disponíveis Agora</Text>
          {nearbyProviders.map((provider) => (
            <Card key={provider.id} style={styles.providerCard}>
              <Card.Content style={styles.providerContent}>
                <Avatar.Text
                  size={40}
                  label={provider.name.charAt(0)}
                  style={styles.providerAvatar}
                />
                <View style={styles.providerInfo}>
                  <Text style={styles.providerName}>{provider.name}</Text>
                  <Text style={styles.providerService}>{provider.service}</Text>
                  <View style={styles.providerMeta}>
                    <View style={styles.ratingContainer}>
                      <Ionicons name="star" size={14} color={theme.colors.warning} />
                      <Text style={styles.providerRating}>{provider.rating}</Text>
                    </View>
                    <Text style={styles.providerDistance}>{provider.distance}</Text>
                  </View>
                </View>
                <View style={styles.providerActions}>
                  <Chip
                    mode="outlined"
                    compact
                    style={[styles.availableChip, { borderColor: theme.colors.success }]}
                    textStyle={{ color: theme.colors.success }}
                  >
                    Disponível
                  </Chip>
                  <Button
                    mode="contained"
                    compact
                    onPress={() => navigation.navigate('Booking', { providerId: provider.id })}
                    style={styles.contactButton}
                  >
                    Contratar
                  </Button>
                </View>
              </Card.Content>
            </Card>
          ))}
        </View>
      </ScrollView>

      {/* Floating Action Button */}
      <FAB
        icon="plus"
        style={styles.fab}
        onPress={() => navigation.navigate('Booking')}
        label="Novo Agendamento"
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
    backgroundColor: theme.colors.primary,
  },
  greeting: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#333',
  },
  subGreeting: {
    fontSize: 16,
    color: '#666',
    marginTop: 4,
  },
  avatar: {
    backgroundColor: theme.colors.secondary,
  },
  emergencyCard: {
    margin: theme.spacing.lg,
    backgroundColor: '#FFF5F5',
    borderLeftWidth: 4,
    borderLeftColor: theme.colors.error,
  },
  emergencyContent: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  emergencyInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  emergencyText: {
    marginLeft: theme.spacing.md,
    flex: 1,
  },
  emergencyTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: theme.colors.error,
  },
  emergencySubtitle: {
    fontSize: 14,
    color: theme.colors.onSurface,
    marginTop: 2,
  },
  emergencyButton: {
    minWidth: 80,
  },
  searchbar: {
    marginHorizontal: theme.spacing.lg,
    marginBottom: theme.spacing.md,
  },
  section: {
    paddingHorizontal: theme.spacing.lg,
    marginBottom: theme.spacing.lg,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: theme.colors.text,
    marginBottom: theme.spacing.md,
  },
  categoriesGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
  },
  categoryCard: {
    width: (width - theme.spacing.lg * 2 - theme.spacing.md) / 2,
    marginBottom: theme.spacing.md,
    borderLeftWidth: 4,
  },
  categoryContent: {
    alignItems: 'center',
    paddingVertical: theme.spacing.md,
  },
  categoryHeader: {
    position: 'relative',
    marginBottom: theme.spacing.sm,
  },
  urgentBadge: {
    position: 'absolute',
    top: -4,
    right: -4,
    backgroundColor: theme.colors.error,
  },
  categoryName: {
    fontSize: 16,
    fontWeight: '500',
    color: theme.colors.text,
    textAlign: 'center',
    marginBottom: theme.spacing.xs,
  },
  urgentChip: {
    backgroundColor: theme.colors.error,
    borderColor: theme.colors.error,
  },
  urgentChipText: {
    color: 'white',
    fontSize: 10,
  },
  bookingCard: {
    marginBottom: theme.spacing.md,
  },
  bookingContent: {
    paddingVertical: theme.spacing.md,
  },
  bookingHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: theme.spacing.sm,
  },
  bookingService: {
    fontSize: 16,
    fontWeight: '500',
    color: theme.colors.text,
    flex: 1,
  },
  bookingDetails: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: theme.spacing.sm,
  },
  bookingProvider: {
    fontSize: 14,
    color: theme.colors.onSurface,
  },
  bookingDate: {
    fontSize: 14,
    color: theme.colors.onSurface,
  },
  ratingContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  rating: {
    marginLeft: 4,
    fontSize: 14,
    color: theme.colors.text,
  },
  viewAllButton: {
    marginTop: theme.spacing.sm,
  },
  mapCard: {
    height: 200,
    overflow: 'hidden',
  },
  map: {
    flex: 1,
  },
  providerCard: {
    marginBottom: theme.spacing.md,
  },
  providerContent: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  providerAvatar: {
    backgroundColor: theme.colors.primary,
  },
  providerInfo: {
    flex: 1,
    marginLeft: theme.spacing.md,
  },
  providerName: {
    fontSize: 16,
    fontWeight: '500',
    color: theme.colors.text,
  },
  providerService: {
    fontSize: 14,
    color: theme.colors.onSurface,
    marginTop: 2,
  },
  providerMeta: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 4,
  },
  providerRating: {
    marginLeft: 4,
    fontSize: 14,
    color: theme.colors.text,
  },
  providerDistance: {
    fontSize: 14,
    color: theme.colors.onSurface,
    marginLeft: theme.spacing.md,
  },
  providerActions: {
    alignItems: 'flex-end',
  },
  availableChip: {
    marginBottom: theme.spacing.xs,
  },
  contactButton: {
    minWidth: 80,
  },
  fab: {
    position: 'absolute',
    margin: theme.spacing.lg,
    right: 0,
    bottom: 0,
    backgroundColor: theme.colors.primary,
  },
});
