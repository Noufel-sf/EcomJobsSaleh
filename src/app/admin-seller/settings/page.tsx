"use client";


import SidebarLayout from '@/components/SidebarLayout';
import { Button } from '@/components/ui/button';
import { useAuth } from '@/context/AuthContext';
import { AppWindowIcon, CodeIcon } from 'lucide-react';
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { useState } from 'react';
import axiosInstance from '@/lib/Api';
import toast from 'react-hot-toast';
import { ButtonLoading } from '@/components/ui/ButtonLoading';
import { type Language, useI18n } from '@/context/I18nContext';

const settingsCopy: Record<Language, Record<string, string>> = {
  en: {
    title: 'Account Settings',
    subtitle: 'View and update your personal and contact information.',
    account: 'Account',
    password: 'Password',
    accountDesc: "Make changes to your account here. Click save when you're done.",
    name: 'Name',
    email: 'Email',
    saveChanges: 'Save changes',
    passwordDesc: "Change your password here. After saving, you'll be logged out.",
    currentPassword: 'Current password',
    newPassword: 'New password',
    savePassword: 'Save password',
    profileUpdated: 'Profile updated!',
    profileFailed: 'Failed to update profile.',
  },
  fr: {
    title: 'Parametres du compte',
    subtitle: 'Consultez et mettez a jour vos informations personnelles.',
    account: 'Compte',
    password: 'Mot de passe',
    accountDesc: "Modifiez votre compte ici. Cliquez sur enregistrer a la fin.",
    name: 'Nom',
    email: 'Email',
    saveChanges: 'Enregistrer',
    passwordDesc: 'Modifiez votre mot de passe ici.',
    currentPassword: 'Mot de passe actuel',
    newPassword: 'Nouveau mot de passe',
    savePassword: 'Enregistrer le mot de passe',
    profileUpdated: 'Profil mis a jour !',
    profileFailed: 'Echec de mise a jour du profil.',
  },
  ar: {
    title: 'اعدادات الحساب',
    subtitle: 'عرض وتحديث المعلومات الشخصية ومعلومات التواصل.',
    account: 'الحساب',
    password: 'كلمة المرور',
    accountDesc: 'قم بتعديل بيانات الحساب ثم احفظ التغييرات.',
    name: 'الاسم',
    email: 'البريد الالكتروني',
    saveChanges: 'حفظ التغييرات',
    passwordDesc: 'قم بتغيير كلمة المرور من هنا.',
    currentPassword: 'كلمة المرور الحالية',
    newPassword: 'كلمة المرور الجديدة',
    savePassword: 'حفظ كلمة المرور',
    profileUpdated: 'تم تحديث الملف!',
    profileFailed: 'فشل تحديث الملف.',
  },
};



 export default function AccountSettings() {
  const { language } = useI18n();
  const copy = settingsCopy[language];
  const { user, setLoading, loading, setUser } = useAuth();
  const [name, setName] = useState(user?.name || '');
  const [email, setEmail] = useState(user?.email || '');
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');

  const handleChangeInfo = async ( e : React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoading(true);

    try {
      const res = await axiosInstance.patch('/user/updateInfo', {
        name,
        email,
      });
      toast.success(res.data.message || copy.profileUpdated);
      setUser((prev) => ({ ...prev, name, email }));
    } catch (error: any) {
      toast.error(error.response?.data?.message || copy.profileFailed);
    } finally {
      setLoading(false);
    }
  };

  const handleChangePassword = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoading(true);
    try {
      const res = await axiosInstance.patch('/user/updatePassword', {
        currentPassword,
        newPassword,
      });
      toast.success(res.data.message);
    } catch (error: any) {
      toast.error(error.response?.data?.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <SidebarLayout breadcrumbTitle="Account Settings">
      <h1 className="text-2xl font-bold">{copy.title}</h1>
      <p className="text-gray-700 dark:text-gray-400">
        {copy.subtitle}
      </p>

      <section className="px-2">
        <div className="flex w-full max-w-sm flex-col gap-6">
          <Tabs defaultValue="account">
            <TabsList>
              <TabsTrigger value="account" className="cursor-pointer">Account</TabsTrigger>
              <TabsTrigger value="account" className="cursor-pointer">{copy.account}</TabsTrigger>
              <TabsTrigger value="password"className="cursor-pointer">{copy.password}</TabsTrigger>
            </TabsList>
            <TabsContent value="account">
              <form onSubmit={handleChangeInfo}>
                <Card>
                  <CardHeader>
                    <CardTitle>{copy.account}</CardTitle>
                    <CardDescription>
                      {copy.accountDesc}
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="grid gap-6">
                    <div className="grid gap-3">
                      <Label htmlFor="tabs-demo-name">{copy.name}</Label>
                      <Input
                        id="tabs-demo-name"
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                      />
                    </div>
                    <div className="grid gap-3">
                      <Label htmlFor="tabs-demo-email">{copy.email}</Label>
                      <Input
                        id="tabs-demo-email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                      />
                    </div>
                  </CardContent>
                  <CardFooter className="mt-4">
                    {loading ? (
                      <ButtonLoading />
                    ) : (
                      <Button type="submit" >{copy.saveChanges}</Button>
                    )}
                  </CardFooter>
                </Card>
              </form>
            </TabsContent>
            <TabsContent value="password">
              <form onSubmit={handleChangePassword}>
                <Card>
                  <CardHeader>
                    <CardTitle>{copy.password}</CardTitle>
                    <CardDescription>
                      {copy.passwordDesc}
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="grid gap-6">
                    <div className="grid gap-3">
                      <Label htmlFor="tabs-demo-current">
                        {copy.currentPassword}
                      </Label>
                      <Input
                        id="tabs-demo-current"
                        type="password"
                        value={currentPassword}
                        onChange={(e) => setCurrentPassword(e.target.value)}
                      />
                    </div>
                    <div className="grid gap-3">
                      <Label htmlFor="tabs-demo-new">{copy.newPassword}</Label>
                      <Input
                        id="tabs-demo-new"
                        type="password"
                        value={newPassword}
                        onChange={(e) => setNewPassword(e.target.value)}
                      />
                    </div>
                  </CardContent>
                  <CardFooter className="mt-4">
                    <Button>{copy.savePassword}</Button>
                  </CardFooter>
                </Card>
              </form>
            </TabsContent>
          </Tabs>
        </div>
      </section>
    </SidebarLayout>
  );
}
