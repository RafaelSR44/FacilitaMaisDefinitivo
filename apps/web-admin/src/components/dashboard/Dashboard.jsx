import { 
  TrendingUp, 
  TrendingDown, 
  Users, 
  Calendar, 
  CreditCard, 
  Clock,
  CheckCircle,
  AlertCircle,
  DollarSign,
  Star
} from 'lucide-react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Button } from '@/components/ui/button';
import { 
  BarChart, 
  Bar, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer,
  LineChart,
  Line,
  PieChart,
  Pie,
  Cell
} from 'recharts';

// Dados simulados baseados na análise da Porto Seguro
const kpiData = [
  {
    title: "GMV Total",
    value: "R$ 2.847.320",
    change: "+12.5%",
    trend: "up",
    icon: DollarSign,
    description: "vs. mês anterior"
  },
  {
    title: "Agendamentos",
    value: "1.247",
    change: "+8.2%",
    trend: "up",
    icon: Calendar,
    description: "este mês"
  },
  {
    title: "Prestadores Ativos",
    value: "3.892",
    change: "+15.7%",
    trend: "up",
    icon: Users,
    description: "verificados e disponíveis"
  },
  {
    title: "SLA Médio",
    value: "18 min",
    change: "-23.1%",
    trend: "up",
    icon: Clock,
    description: "tempo de resposta"
  }
];

const revenueData = [
  { month: 'Jan', revenue: 2100000, bookings: 980 },
  { month: 'Fev', revenue: 2300000, bookings: 1120 },
  { month: 'Mar', revenue: 2450000, bookings: 1180 },
  { month: 'Abr', revenue: 2680000, bookings: 1290 },
  { month: 'Mai', revenue: 2520000, bookings: 1210 },
  { month: 'Jun', revenue: 2847320, bookings: 1347 },
];

const categoryData = [
  { name: 'Encanador', value: 35, color: '#FFD700' },
  { name: 'Eletricista', value: 28, color: '#FFA500' },
  { name: 'Chaveiro', value: 18, color: '#FF6B35' },
  { name: 'Vidraceiro', value: 12, color: '#4ECDC4' },
  { name: 'Outros', value: 7, color: '#45B7D1' },
];

const recentBookings = [
  {
    id: 'BK001',
    client: 'Maria Silva',
    service: 'Reparo de Encanamento',
    provider: 'João Santos',
    status: 'completed',
    value: 'R$ 280',
    time: '2h atrás'
  },
  {
    id: 'BK002',
    client: 'Carlos Oliveira',
    service: 'Instalação Elétrica',
    provider: 'Ana Costa',
    status: 'in_progress',
    value: 'R$ 450',
    time: '1h atrás'
  },
  {
    id: 'BK003',
    client: 'Fernanda Lima',
    service: 'Abertura de Porta',
    provider: 'Pedro Alves',
    status: 'pending',
    value: 'R$ 120',
    time: '30min atrás'
  }
];

const getStatusBadge = (status) => {
  const statusConfig = {
    completed: { label: 'Concluído', variant: 'success', icon: CheckCircle },
    in_progress: { label: 'Em Andamento', variant: 'warning', icon: Clock },
    pending: { label: 'Pendente', variant: 'secondary', icon: AlertCircle }
  };
  
  const config = statusConfig[status] || statusConfig.pending;
  const Icon = config.icon;
  
  return (
    <Badge variant={config.variant} className="flex items-center gap-1">
      <Icon className="h-3 w-3" />
      {config.label}
    </Badge>
  );
};

export function Dashboard() {
  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-3xl font-bold tracking-tight text-gray-900">
            Dashboard Executivo
          </h2>
          <p className="text-gray-600">
            Visão geral da operação Porto Serviço em tempo real
          </p>
        </div>
        <div className="flex items-center space-x-2">
          <Badge variant="outline" className="bg-green-50 text-green-700 border-green-200">
            <div className="w-2 h-2 bg-green-500 rounded-full mr-2"></div>
            Sistema Online
          </Badge>
          <Button variant="outline">
            Exportar Relatório
          </Button>
        </div>
      </div>

      {/* KPIs */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {kpiData.map((kpi, index) => {
          const Icon = kpi.icon;
          return (
            <Card key={index} className="relative overflow-hidden">
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium text-gray-600">
                  {kpi.title}
                </CardTitle>
                <Icon className="h-4 w-4 text-gray-400" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-gray-900">{kpi.value}</div>
                <div className="flex items-center text-xs text-gray-600 mt-1">
                  {kpi.trend === 'up' ? (
                    <TrendingUp className="h-3 w-3 text-green-500 mr-1" />
                  ) : (
                    <TrendingDown className="h-3 w-3 text-red-500 mr-1" />
                  )}
                  <span className={kpi.trend === 'up' ? 'text-green-600' : 'text-red-600'}>
                    {kpi.change}
                  </span>
                  <span className="ml-1">{kpi.description}</span>
                </div>
              </CardContent>
            </Card>
          );
        })}
      </div>

      {/* Charts Row */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Revenue Chart */}
        <Card>
          <CardHeader>
            <CardTitle>Receita e Agendamentos</CardTitle>
            <CardDescription>
              Evolução mensal da receita bruta e volume de agendamentos
            </CardDescription>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={revenueData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="month" />
                <YAxis />
                <Tooltip 
                  formatter={(value, name) => [
                    name === 'revenue' ? `R$ ${(value / 1000000).toFixed(1)}M` : value,
                    name === 'revenue' ? 'Receita' : 'Agendamentos'
                  ]}
                />
                <Bar dataKey="revenue" fill="#FFD700" />
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        {/* Service Categories */}
        <Card>
          <CardHeader>
            <CardTitle>Categorias de Serviço</CardTitle>
            <CardDescription>
              Distribuição de agendamentos por tipo de serviço
            </CardDescription>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <PieChart>
                <Pie
                  data={categoryData}
                  cx="50%"
                  cy="50%"
                  outerRadius={80}
                  dataKey="value"
                  label={({ name, value }) => `${name}: ${value}%`}
                >
                  {categoryData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      </div>

      {/* Performance Metrics */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Star className="h-5 w-5 text-yellow-500" />
              NPS Score
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-gray-900 mb-2">78</div>
            <Progress value={78} className="mb-2" />
            <p className="text-sm text-gray-600">
              Meta: 80+ (faltam 2 pontos)
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>SLA Compliance</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-green-600 mb-2">94.2%</div>
            <Progress value={94.2} className="mb-2" />
            <p className="text-sm text-gray-600">
              Meta: 95% (quase lá!)
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Taxa de Conversão</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-blue-600 mb-2">87.5%</div>
            <Progress value={87.5} className="mb-2" />
            <p className="text-sm text-gray-600">
              Leads → Agendamentos confirmados
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Recent Bookings */}
      <Card>
        <CardHeader>
          <CardTitle>Agendamentos Recentes</CardTitle>
          <CardDescription>
            Últimas atividades da plataforma
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {recentBookings.map((booking) => (
              <div key={booking.id} className="flex items-center justify-between p-4 border rounded-lg">
                <div className="flex items-center space-x-4">
                  <div className="font-mono text-sm text-gray-500">
                    #{booking.id}
                  </div>
                  <div>
                    <div className="font-medium text-gray-900">
                      {booking.client}
                    </div>
                    <div className="text-sm text-gray-600">
                      {booking.service} • {booking.provider}
                    </div>
                  </div>
                </div>
                <div className="flex items-center space-x-4">
                  <div className="text-right">
                    <div className="font-medium text-gray-900">{booking.value}</div>
                    <div className="text-sm text-gray-500">{booking.time}</div>
                  </div>
                  {getStatusBadge(booking.status)}
                </div>
              </div>
            ))}
          </div>
          <div className="mt-4 text-center">
            <Button variant="outline">
              Ver Todos os Agendamentos
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
