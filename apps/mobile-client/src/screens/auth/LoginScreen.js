import React, { useState } from 'react';
import {
  View,
  StyleSheet,
  ScrollView,
  KeyboardAvoidingView,
  Platform,
  Alert,
} from 'react-native';
import {
  Text,
  TextInput,
  Button,
  Card,
  Divider,
  Chip,
} from 'react-native-paper';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { useAuth } from '../../contexts/AuthContext';
import { theme } from '../../utils/theme';

export default function LoginScreen({ navigation }) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  
  const { signIn } = useAuth();

  const handleLogin = async () => {
    if (!email || !password) {
      Alert.alert('Erro', 'Por favor, preencha todos os campos');
      return;
    }

    setIsLoading(true);
    const result = await signIn(email, password);
    setIsLoading(false);

    if (!result.success) {
      Alert.alert('Erro no Login', result.error);
    }
  };

  const handlePortoLogin = () => {
    // Implementar login via Porto Seguro OAuth
    Alert.alert(
      'Login Porto Seguro',
      'Redirecionando para o portal da Porto Seguro...',
      [
        { text: 'Cancelar', style: 'cancel' },
        { text: 'Continuar', onPress: () => console.log('Porto OAuth') },
      ]
    );
  };

  return (
    <SafeAreaView style={styles.container}>
      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        style={styles.keyboardView}
      >
        <ScrollView
          contentContainerStyle={styles.scrollContent}
          keyboardShouldPersistTaps="handled"
        >
          {/* Logo */}
          <View style={styles.logoContainer}>
            <View style={styles.logo}>
              <Text style={styles.logoText}>F+</Text>
            </View>
            <Text style={styles.brandText}>Facilita+</Text>
            <Text style={styles.subText}>Conectando você aos melhores prestadores</Text>
          </View>

          {/* Login Form */}
          <Card style={styles.card}>
            <Card.Content style={styles.cardContent}>
              <Text style={styles.title}>Entre na sua conta</Text>
              
              <TextInput
                label="E-mail"
                value={email}
                onChangeText={setEmail}
                mode="outlined"
                keyboardType="email-address"
                autoCapitalize="none"
                autoComplete="email"
                style={styles.input}
                left={<TextInput.Icon icon="email" />}
              />

              <TextInput
                label="Senha"
                value={password}
                onChangeText={setPassword}
                mode="outlined"
                secureTextEntry={!showPassword}
                style={styles.input}
                left={<TextInput.Icon icon="lock" />}
                right={
                  <TextInput.Icon
                    icon={showPassword ? 'eye-off' : 'eye'}
                    onPress={() => setShowPassword(!showPassword)}
                  />
                }
              />

              <Button
                mode="contained"
                onPress={handleLogin}
                loading={isLoading}
                disabled={isLoading}
                style={styles.loginButton}
                contentStyle={styles.buttonContent}
              >
                Entrar
              </Button>

              <Button
                mode="text"
                onPress={() => navigation.navigate('ForgotPassword')}
                style={styles.forgotButton}
              >
                Esqueci minha senha
              </Button>
            </Card.Content>
          </Card>

          {/* Porto Seguro Login */}
          <View style={styles.portoSection}>
            <Divider style={styles.divider} />
            <Text style={styles.orText}>ou</Text>
            <Divider style={styles.divider} />
          </View>

          <Card style={styles.portoCard}>
            <Card.Content style={styles.portoContent}>
              <View style={styles.portoHeader}>
                <Ionicons name="shield-checkmark" size={24} color={theme.colors.secondary} />
                <Text style={styles.portoTitle}>Cliente Porto Seguro?</Text>
              </View>
              <Text style={styles.portoSubtitle}>
                Entre com sua conta da Porto Seguro e tenha acesso automático aos seus dados
              </Text>
              <Button
                mode="outlined"
                onPress={handlePortoLogin}
                style={styles.portoButton}
                contentStyle={styles.buttonContent}
                buttonColor={theme.colors.secondary}
                textColor="white"
              >
                Entrar com Porto Seguro
              </Button>
            </Card.Content>
          </Card>

          {/* Register Link */}
          <View style={styles.registerContainer}>
            <Text style={styles.registerText}>Não tem uma conta? </Text>
            <Button
              mode="text"
              onPress={() => navigation.navigate('Register')}
              compact
            >
              Cadastre-se
            </Button>
          </View>

          {/* Benefits */}
          <View style={styles.benefitsContainer}>
            <Text style={styles.benefitsTitle}>Por que usar o Facilita+?</Text>
            <View style={styles.benefitsList}>
              <Chip icon="check-circle" style={styles.benefit}>
                Prestadores verificados
              </Chip>
              <Chip icon="clock" style={styles.benefit}>
                Atendimento rápido
              </Chip>
              <Chip icon="shield" style={styles.benefit}>
                Pagamento seguro
              </Chip>
              <Chip icon="star" style={styles.benefit}>
                Avaliações reais
              </Chip>
            </View>
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: theme.colors.background,
  },
  keyboardView: {
    flex: 1,
  },
  scrollContent: {
    flexGrow: 1,
    paddingHorizontal: theme.spacing.lg,
    paddingVertical: theme.spacing.xl,
  },
  logoContainer: {
    alignItems: 'center',
    marginBottom: theme.spacing.xl,
  },
  logo: {
    width: 80,
    height: 80,
    borderRadius: 20,
    backgroundColor: theme.colors.primary,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: theme.spacing.md,
    ...theme.shadows.medium,
  },
  logoText: {
    fontSize: 32,
    fontWeight: 'bold',
    color: '#333',
  },
  brandText: {
    fontSize: 28,
    fontWeight: 'bold',
    color: theme.colors.text,
    marginBottom: theme.spacing.xs,
  },
  subText: {
    fontSize: 16,
    color: theme.colors.onSurface,
    textAlign: 'center',
    fontWeight: '300',
  },
  card: {
    marginBottom: theme.spacing.lg,
    ...theme.shadows.medium,
  },
  cardContent: {
    paddingVertical: theme.spacing.lg,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: theme.colors.text,
    marginBottom: theme.spacing.lg,
    textAlign: 'center',
  },
  input: {
    marginBottom: theme.spacing.md,
  },
  loginButton: {
    marginTop: theme.spacing.md,
    marginBottom: theme.spacing.sm,
  },
  buttonContent: {
    paddingVertical: theme.spacing.xs,
  },
  forgotButton: {
    alignSelf: 'center',
  },
  portoSection: {
    flexDirection: 'row',
    alignItems: 'center',
    marginVertical: theme.spacing.lg,
  },
  divider: {
    flex: 1,
  },
  orText: {
    marginHorizontal: theme.spacing.md,
    color: theme.colors.onSurface,
    fontSize: 16,
  },
  portoCard: {
    marginBottom: theme.spacing.lg,
    backgroundColor: '#F8F9FA',
    ...theme.shadows.small,
  },
  portoContent: {
    paddingVertical: theme.spacing.lg,
  },
  portoHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: theme.spacing.sm,
  },
  portoTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: theme.colors.secondary,
    marginLeft: theme.spacing.sm,
  },
  portoSubtitle: {
    fontSize: 14,
    color: theme.colors.onSurface,
    marginBottom: theme.spacing.md,
    lineHeight: 20,
  },
  portoButton: {
    borderColor: theme.colors.secondary,
  },
  registerContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: theme.spacing.xl,
  },
  registerText: {
    fontSize: 16,
    color: theme.colors.onSurface,
  },
  benefitsContainer: {
    alignItems: 'center',
  },
  benefitsTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: theme.colors.text,
    marginBottom: theme.spacing.md,
  },
  benefitsList: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'center',
    gap: theme.spacing.sm,
  },
  benefit: {
    backgroundColor: theme.colors.primary,
    marginBottom: theme.spacing.xs,
  },
});
