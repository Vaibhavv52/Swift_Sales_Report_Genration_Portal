import React, { useState, useMemo } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/Card';
import { Badge } from '@/components/ui/Badge';
import { CountUp } from '@/components/ui/CountUp';
import { mockSales } from '@/data/mockData';
import { format, subDays } from 'date-fns';
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { IndianRupee, ShoppingCart, Package, FileText, ArrowUpRight, ArrowDownRight } from 'lucide-react';
import { Button } from '@/components/ui/Button';
import { useNavigate } from 'react-router-dom';

export function Dashboard() {
  const navigate = useNavigate();
  const [timeRange, setTimeRange] = useState<'7d' | '30d'>('7d');

  const stats = useMemo(() => {
    const totalRevenue = mockSales.reduce((sum, sale) => sum + sale.amount, 0);
    const ordersThisMonth = mockSales.filter(s => new Date(s.date) > subDays(new Date(), 30)).length;
    const activeProducts = 1248; // Mock
    const pendingReports = 12; // Mock

    return {
      totalRevenue,
      ordersThisMonth,
      activeProducts,
      pendingReports
    };
  }, []);

  const chartData = useMemo(() => {
    const days = timeRange === '7d' ? 7 : 30;
    const data = [];
    for (let i = days - 1; i >= 0; i--) {
      const date = subDays(new Date(), i);
      const daySales = mockSales.filter(s => format(new Date(s.date), 'yyyy-MM-dd') === format(date, 'yyyy-MM-dd'));
      const amount = daySales.reduce((sum, s) => sum + s.amount, 0);
      data.push({
        date: format(date, 'MMM dd'),
        revenue: amount || Math.floor(Math.random() * 50000) + 10000 // Add some mock data if empty for visual
      });
    }
    return data;
  }, [timeRange]);

  const recentActivity = useMemo(() => {
    return [...mockSales].sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime()).slice(0, 5);
  }, []);

  return (
    <div className="space-y-6">
      {/* KPI Cards */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card className="border-t-4 border-t-primary hover:-translate-y-1 hover:shadow-lg transition-all duration-300">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Revenue</CardTitle>
            <div className="rounded-full bg-primary/20 p-2">
              <IndianRupee className="h-4 w-4 text-primary" />
            </div>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              <CountUp end={stats.totalRevenue} prefix="₹" />
            </div>
            <p className="text-xs text-slate-500 dark:text-slate-400 mt-1 flex items-center">
              <ArrowUpRight className="mr-1 h-3 w-3 text-success" />
              <span className="text-success font-medium">+14.5%</span> from last month
            </p>
          </CardContent>
        </Card>

        <Card className="border-t-4 border-t-success hover:-translate-y-1 hover:shadow-lg transition-all duration-300">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Orders</CardTitle>
            <div className="rounded-full bg-success/20 p-2">
              <ShoppingCart className="h-4 w-4 text-success" />
            </div>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              <CountUp end={stats.ordersThisMonth} />
            </div>
            <p className="text-xs text-slate-500 dark:text-slate-400 mt-1 flex items-center">
              <ArrowUpRight className="mr-1 h-3 w-3 text-success" />
              <span className="text-success font-medium">+5.2%</span> from last month
            </p>
          </CardContent>
        </Card>

        <Card className="border-t-4 border-t-warning hover:-translate-y-1 hover:shadow-lg transition-all duration-300">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Active Products</CardTitle>
            <div className="rounded-full bg-warning/20 p-2">
              <Package className="h-4 w-4 text-warning" />
            </div>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              <CountUp end={stats.activeProducts} />
            </div>
            <p className="text-xs text-slate-500 dark:text-slate-400 mt-1 flex items-center">
              <ArrowDownRight className="mr-1 h-3 w-3 text-danger" />
              <span className="text-danger font-medium">-1.1%</span> from last month
            </p>
          </CardContent>
        </Card>

        <Card className="border-t-4 border-t-purple-500 hover:-translate-y-1 hover:shadow-lg transition-all duration-300">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Pending Reports</CardTitle>
            <div className="rounded-full bg-purple-500/20 p-2">
              <FileText className="h-4 w-4 text-purple-500" />
            </div>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              <CountUp end={stats.pendingReports} />
            </div>
            <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
              Requires attention
            </p>
          </CardContent>
        </Card>
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-7">
        {/* Chart */}
        <Card className="col-span-4">
          <CardHeader className="flex flex-row items-center justify-between">
            <div>
              <CardTitle>Revenue Overview</CardTitle>
            </div>
            <div className="flex bg-slate-100 dark:bg-slate-800 rounded-lg p-1">
              <button
                className={`px-3 py-1 text-xs font-medium rounded-md transition-colors ${timeRange === '7d' ? 'bg-white dark:bg-slate-600 shadow-sm' : 'text-slate-500 dark:text-slate-400 hover:text-slate-900 dark:text-slate-100'}`}
                onClick={() => setTimeRange('7d')}
              >
                7d
              </button>
              <button
                className={`px-3 py-1 text-xs font-medium rounded-md transition-colors ${timeRange === '30d' ? 'bg-white dark:bg-slate-600 shadow-sm' : 'text-slate-500 dark:text-slate-400 hover:text-slate-900 dark:text-slate-100'}`}
                onClick={() => setTimeRange('30d')}
              >
                30d
              </button>
            </div>
          </CardHeader>
          <CardContent className="px-2">
            <div className="h-[300px] w-full">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={chartData} margin={{ top: 10, right: 10, left: 0, bottom: 0 }}>
                  <defs>
                    <linearGradient id="colorRevenue" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#3B82F6" stopOpacity={0.4}/>
                      <stop offset="95%" stopColor="#3B82F6" stopOpacity={0}/>
                    </linearGradient>
                  </defs>
                  <XAxis dataKey="date" stroke="#888888" fontSize={12} tickLine={false} axisLine={false} />
                  <YAxis stroke="#888888" fontSize={12} tickLine={false} axisLine={false} tickFormatter={(value) => `₹${value}`} />
                  <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#E2E8F0" className="dark:stroke-slate-700" />
                  <Tooltip 
                    contentStyle={{ backgroundColor: 'var(--card)', borderColor: 'var(--border)', borderRadius: '12px', color: 'var(--text-primary)', boxShadow: '0 10px 15px -3px rgba(0, 0, 0, 0.1)' }}
                    itemStyle={{ color: 'var(--text-primary)', fontWeight: 600 }}
                    formatter={(value: any) => [`₹${value.toLocaleString()}`, 'Revenue']}
                  />
                  <Area 
                    type="monotone" 
                    dataKey="revenue" 
                    stroke="#3B82F6" 
                    strokeWidth={3} 
                    fillOpacity={1} 
                    fill="url(#colorRevenue)"
                    activeDot={{ r: 6, fill: "#3B82F6", stroke: "var(--card)", strokeWidth: 2, className: "animate-pulse" }}
                  />
                </AreaChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>

        {/* Recent Activity */}
        <Card className="col-span-3">
          <CardHeader>
            <CardTitle>Recent Activity</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {recentActivity.map(sale => (
                <div key={sale.id} className="flex items-center justify-between border-b border-slate-200 dark:border-slate-700 pb-4 last:border-0 last:pb-0">
                  <div className="space-y-1">
                    <p className="text-sm font-medium leading-none">{sale.customerName}</p>
                    <p className="text-xs text-slate-500 dark:text-slate-400">
                      {format(new Date(sale.date), 'MMM dd, yyyy')} • {sale.department}
                    </p>
                  </div>
                  <div className="flex items-center gap-4">
                    <div className="font-medium text-sm">₹{sale.amount.toLocaleString()}</div>
                    <Badge variant={sale.status === 'Completed' ? 'success' : sale.status === 'Pending' ? 'warning' : 'danger'}>
                      {sale.status}
                    </Badge>
                  </div>
                </div>
              ))}
            </div>
            <div className="mt-6">
              <Button variant="outline" className="w-full" onClick={() => navigate('/reports')}>
                View All Reports
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
