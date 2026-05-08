import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { useNavigate } from 'react-router-dom';
import { useStore } from '@/store/useStore';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { Label } from '@/components/ui/Label';
import { Package2 } from 'lucide-react';

const loginSchema = z.object({
  email: z.string().email('Please enter a valid email address'),
  password: z.string().min(1, 'Password is required'),
});

type LoginFormValues = z.infer<typeof loginSchema>;

export function Login() {
  const navigate = useNavigate();
  const { login } = useStore();
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<LoginFormValues>({
    resolver: zodResolver(loginSchema),
  });

  const onSubmit = async (data: LoginFormValues) => {
    setIsLoading(true);
    setError('');
    
    // Simulate API delay
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    if (data.password === 'password123') {
      login(data.email);
      navigate('/dashboard');
    } else {
      setError('Invalid email or password. Hint: try password123');
      setIsLoading(false);
    }
  };

  return (
    <div className="flex min-h-screen w-full bg-slate-100 dark:bg-slate-900">
      {/* Left Panel */}
      <div className="hidden w-1/2 bg-gradient-to-br from-slate-900 to-slate-800 lg:block relative overflow-hidden">
        {/* Animated subtle grid */}
        <div className="absolute inset-0 bg-[linear-gradient(rgba(255,255,255,0.03)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.03)_1px,transparent_1px)] bg-[size:40px_40px] animate-[slide_20s_linear_infinite] opacity-50" style={{ backgroundImage: 'linear-gradient(rgba(255,255,255,0.05) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.05) 1px, transparent 1px)' }}></div>
        <style dangerouslySetInnerHTML={{__html: `
          @keyframes slide {
            0% { transform: translateY(0); }
            100% { transform: translateY(40px); }
          }
        `}} />
        <div className="absolute inset-0 bg-gradient-to-t from-slate-900/80 to-transparent"></div>
        <div className="relative z-10 flex h-full flex-col justify-center px-20">
          <div className="flex items-center gap-3 mb-8 text-white">
            <div className="rounded-xl bg-primary/20 p-3">
              <Package2 className="h-10 w-10 text-primary animate-pulse-glow" />
            </div>
            <span className="text-4xl font-heading font-bold tracking-tight">SwiftSales</span>
          </div>
          <h2 className="text-3xl font-heading font-semibold text-slate-100 mb-4 leading-tight">
            Enterprise Grade <br/>Retail Analytics
          </h2>
          <p className="text-lg text-slate-400 max-w-md leading-relaxed">
            Gain actionable insights, monitor KPIs, and generate comprehensive reports for your retail business all in one powerful dashboard.
          </p>
        </div>
      </div>

      {/* Right Panel */}
      <div className="flex w-full items-center justify-center lg:w-1/2 p-8">
        <Card className="w-full max-w-md animate-slide-up-fade border-0 shadow-none bg-transparent sm:border sm:shadow-lg sm:bg-white dark:sm:bg-slate-800">
          <CardHeader className="space-y-2 text-center">
            <div className="flex justify-center mb-4 lg:hidden">
              <div className="rounded-xl bg-primary/20 p-3">
                <Package2 className="h-8 w-8 text-primary" />
              </div>
            </div>
            <CardTitle className="text-3xl tracking-tight">Welcome back</CardTitle>
            <CardDescription className="text-base">
              Enter your credentials to access your account
            </CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
              <div className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="email">Email</Label>
                  <Input
                    id="email"
                    type="email"
                    placeholder="admin@swiftsales.com"
                    {...register('email')}
                    className={errors.email ? 'border-danger focus-visible:ring-danger' : ''}
                  />
                  {errors.email && <p className="text-xs text-danger">{errors.email.message}</p>}
                </div>
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <Label htmlFor="password">Password</Label>
                    <a href="#" className="text-sm font-medium text-primary hover:underline">
                      Forgot password?
                    </a>
                  </div>
                  <Input
                    id="password"
                    type="password"
                    placeholder="••••••••"
                    {...register('password')}
                    className={errors.password ? 'border-danger focus-visible:ring-danger' : ''}
                  />
                  {errors.password && <p className="text-xs text-danger">{errors.password.message}</p>}
                </div>
              </div>

              {error && (
                <div className="rounded-md bg-danger/10 p-3 text-sm text-danger">
                  {error}
                </div>
              )}

              <Button type="submit" className="w-full h-11 text-base" isLoading={isLoading}>
                Sign in to Dashboard
              </Button>
            </form>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
