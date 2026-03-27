'use client';

import React, { useState, useActionState } from 'react';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import toast from 'react-hot-toast';
import { useLoginMutation } from '@/Redux/Services/AuthApi';
import { useAppDispatch } from '@/Redux/hooks';
import { setCredentials } from '@/Redux/Slices/AuthSlice';
import { Lock, Mail, Eye, EyeOff, ShieldCheck, Loader2 } from 'lucide-react';
import { type Language, useI18n } from '@/context/I18nContext';

interface LoginPageProps {
  className?: string;
}

interface LoginState {
  error: string | null;
  success: boolean;
}

const initialState: LoginState = {
  error: null,
  success: false,
};

const loginCopy: Record<Language, Record<string, string>> = {
  en: {
    loginSuccess: 'Login Successful',
    loginFail: 'Login failed. Please try again.',
    pageSrTitle: 'Login to Your Account - Saleh Marketplace',
    welcomeBack: 'Welcome Back',
    subtitle: 'Sign in to access your account and continue shopping',
    cardTitle: 'Login to your account',
    cardDescription: 'Enter your credentials below to access your account',
    formAria: 'Login form',
    emailAddress: 'Email Address',
    emailAria: 'Email address',
    password: 'Password',
    forgotPassword: 'Forgot password?',
    passwordPlaceholder: 'Enter your password',
    passwordAria: 'Password',
    hidePassword: 'Hide password',
    showPassword: 'Show password',
    signingIn: 'Signing In...',
    signIn: 'Sign In',
    signinAria: 'Login to your account',
    noAccount: "Don't have an account?",
    signUp: 'Sign up',
    secureLogin: 'Secure login with encrypted connection',
  },
  fr: {
    loginSuccess: 'Connexion reussie',
    loginFail: 'Echec de connexion. Veuillez reessayer.',
    pageSrTitle: 'Connexion a votre compte - Saleh Marketplace',
    welcomeBack: 'Bon retour',
    subtitle: 'Connectez-vous pour acceder a votre compte et continuer vos achats',
    cardTitle: 'Connectez-vous a votre compte',
    cardDescription: 'Entrez vos identifiants pour acceder a votre compte',
    formAria: 'Formulaire de connexion',
    emailAddress: 'Adresse e-mail',
    emailAria: 'Adresse e-mail',
    password: 'Mot de passe',
    forgotPassword: 'Mot de passe oublie ?',
    passwordPlaceholder: 'Entrez votre mot de passe',
    passwordAria: 'Mot de passe',
    hidePassword: 'Masquer le mot de passe',
    showPassword: 'Afficher le mot de passe',
    signingIn: 'Connexion en cours...',
    signIn: 'Se connecter',
    signinAria: 'Se connecter au compte',
    noAccount: "Vous n'avez pas de compte ?",
    signUp: "S'inscrire",
    secureLogin: 'Connexion securisee avec liaison chiffree',
  },
  ar: {
    loginSuccess: 'تم تسجيل الدخول بنجاح',
    loginFail: 'فشل تسجيل الدخول. حاول مرة اخرى.',
    pageSrTitle: 'تسجيل الدخول الى حسابك - صالح ماركت',
    welcomeBack: 'مرحبا بعودتك',
    subtitle: 'سجل الدخول للوصول الى حسابك ومتابعة التسوق',
    cardTitle: 'تسجيل الدخول الى حسابك',
    cardDescription: 'ادخل بيانات الدخول للوصول الى حسابك',
    formAria: 'نموذج تسجيل الدخول',
    emailAddress: 'البريد الالكتروني',
    emailAria: 'البريد الالكتروني',
    password: 'كلمة المرور',
    forgotPassword: 'نسيت كلمة المرور؟',
    passwordPlaceholder: 'ادخل كلمة المرور',
    passwordAria: 'كلمة المرور',
    hidePassword: 'اخفاء كلمة المرور',
    showPassword: 'اظهار كلمة المرور',
    signingIn: 'جار تسجيل الدخول...',
    signIn: 'تسجيل الدخول',
    signinAria: 'تسجيل الدخول الى الحساب',
    noAccount: 'ليس لديك حساب؟',
    signUp: 'انشاء حساب',
    secureLogin: 'تسجيل دخول آمن عبر اتصال مشفر',
  },
};

const LoginPage: React.FC<LoginPageProps> = ({ className }) => {
  const { language } = useI18n();
  const copy = loginCopy[language];
  const router = useRouter();
  const dispatch = useAppDispatch();
  const [showPassword, setShowPassword] = useState(false);
  const [login] = useLoginMutation();

  const loginAction = async (
    _prevState: LoginState,
    formData: FormData
  ): Promise<LoginState> => {
    const email = formData.get('email') as string;
    const password = formData.get('password') as string;

    try {
      const result = await login({ email, password }).unwrap();
      dispatch(setCredentials({ user: result.user }));
      toast.success(`${copy.loginSuccess} 🎉`);
      router.push('/');
      return { error: null, success: true };
    } catch (error: unknown) {
      const err = error as { data?: { message?: string } };
      const message = err?.data?.message || copy.loginFail;
      toast.error(message);
      return { error: message, success: false };
    }
  };

  const [, formAction, isPending] = useActionState(loginAction, initialState);

  return (
    <main className="min-h-screen flex flex-col items-center justify-center px-4 bg-linear-to-br from-background lg:py-12 via-background to-muted/30">
      <h1 className="sr-only">{copy.pageSrTitle}</h1>
      
      <div
        className={cn('flex flex-col gap-6 w-full max-w-md', className)}
      >
        {/* Logo/Brand Section */}
        <div className="text-center space-y-2 mb-4">
          <div className="flex items-center justify-center gap-2 mb-2">
            <ShieldCheck className="w-8 h-8 text-primary" aria-hidden="true" />
            <h2 className="text-3xl font-bold text-primary">
              {copy.welcomeBack}
            </h2>
          </div>
          <p className="text-muted-foreground text-sm">
            {copy.subtitle}
          </p>
        </div>

        <div className="relative overflow-hidden rounded-xl p-px bg-transparent">

          {/* Card content */}
          <div className="relative z-10  text-black dark:text-white rounded-xl  p-6 h-full">
            <Card className="border-0 shadow-none">
              <CardHeader className="space-y-3 pb-6">
                <div className="absolute top-0 left-0 w-20 h-20 bg-primary/20 blur-3xl rounded-full opacity-50 -translate-x-1/2 -translate-y-1/2 pointer-events-none" />

                <CardTitle className="text-2xl font-bold text-center">
                  {copy.cardTitle}
                </CardTitle>
                <CardDescription className="text-center">
                  {copy.cardDescription}
                </CardDescription>
              </CardHeader>
              <CardContent className="">
                <form action={formAction} aria-label={copy.formAria}>
                  <div className="flex flex-col gap-6">
                    {/* Email Field */}
                    <div className="grid gap-3">
                      <Label htmlFor="email" className="text-sm font-medium">
                        <Mail className="w-4 h-4 inline mr-2" aria-hidden="true" />
                        {copy.emailAddress}
                      </Label>
                      <Input
                        id="email"
                        name="email"
                        type="email"
                        className="h-11"
                        placeholder="name@example.com"
                        required
                        autoComplete="email"
                        aria-required="true"
                        aria-label={copy.emailAria}
                        disabled={isPending}
                      />
                    </div>

                    {/* Password Field */}
                    <div className="grid gap-3">
                      <div className="flex items-center justify-between">
                        <Label htmlFor="password" className="text-sm font-medium">
                          <Lock className="w-4 h-4 inline mr-2" aria-hidden="true" />
                          {copy.password}
                        </Label>
                        <Link
                          href="/forgot-password"
                          className="text-xs text-primary hover:underline underline-offset-4 transition-colors"
                          tabIndex={0}
                        >
                          {copy.forgotPassword}
                        </Link>
                      </div>
                      <div className="relative">
                        <Input
                          id="password"
                          name="password"
                          type={showPassword ? 'text' : 'password'}
                          className="h-11 pr-10"
                          placeholder={copy.passwordPlaceholder}
                          required
                          autoComplete="current-password"
                          aria-required="true"
                          aria-label={copy.passwordAria}
                          disabled={isPending}
                        />
                        <button
                          type="button"
                          onClick={() => setShowPassword(!showPassword)}
                          className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors"
                          aria-label={showPassword ? copy.hidePassword : copy.showPassword}
                          tabIndex={0}
                        >
                          {showPassword ? (
                            <EyeOff className="w-5 h-5" aria-hidden="true" />
                          ) : (
                            <Eye className="w-5 h-5" aria-hidden="true" />
                          )}
                        </button>
                      </div>
                    </div>

                    {/* Submit Button */}
                    <div className="flex flex-col gap-3 pt-2">
                      <Button 
                        type="submit" 
                        className="w-full h-11 font-semibold"
                        variant="default"
                        size="lg"
                        disabled={isPending}
                        aria-label={isPending ? copy.signingIn : copy.signinAria}
                      >
                        {isPending ? (
                          <>
                            <Loader2 className="w-4 h-4 mr-2 animate-spin" aria-hidden="true" />
                            {copy.signingIn}
                          </>
                        ) : (
                          copy.signIn
                        )}
                      </Button>
                    </div>
                  </div>

                  {/* Sign up link */}
                  <div className="mt-6 text-center text-sm">
                    <span className="text-muted-foreground">{copy.noAccount} </span>
                    <Link
                      href="/register"
                      className="font-medium text-primary hover:underline underline-offset-4 transition-colors"
                    >
                      {copy.signUp}
                    </Link>
                  </div>
                </form>
              </CardContent>
            </Card>
          </div>
        </div>

        {/* Security Badge */}
        <div className="flex items-center justify-center gap-2 text-xs text-muted-foreground">
          <ShieldCheck className="w-4 h-4" aria-hidden="true" />
          <span>{copy.secureLogin}</span>
        </div>
      </div>
    </main>
  );
};

export default LoginPage;
