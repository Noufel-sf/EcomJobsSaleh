'use client';

import { memo } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import {
  FormField,
  FormItem,
  FormLabel,
  FormControl,
  FormMessage,
} from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { User, MapPin } from 'lucide-react';
import { useI18n } from '@/context/I18nContext';
import type { UseFormReturn } from 'react-hook-form';
import type { CheckoutFormValues } from '@/lib/zodValidation';

interface SellerStateOption {
  id: number | string;
  name: string;
}

interface ContactSectionProps {
  form: UseFormReturn<CheckoutFormValues>;
}

export const ContactSection = memo(function ContactSection({ form }: ContactSectionProps) {
  const { messages } = useI18n();

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <User className="w-5 h-5" aria-hidden="true" />
          {messages.checkout.contactInformation}
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="grid sm:grid-cols-2 gap-4">
          <FormField
            control={form.control}
            name="firstName"
            render={({ field }) => (
              <FormItem>
                <FormLabel>{messages.checkout.firstName}</FormLabel>
                <FormControl>
                  <Input placeholder="Ahmed" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="lastName"
            render={({ field }) => (
              <FormItem>
                <FormLabel>{messages.checkout.lastName}</FormLabel>
                <FormControl>
                  <Input placeholder="Benali" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>
        <FormField
          control={form.control}
          name="phoneNumber"
          render={({ field }) => (
            <FormItem>
              <FormLabel>{messages.checkout.phoneNumber}</FormLabel>
              <FormControl>
                <Input type="tel" placeholder="+213 555 123 456" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
      </CardContent>
    </Card>
  );
});

interface ShippingSectionProps {
  form: UseFormReturn<CheckoutFormValues>;
  sellerStates?: SellerStateOption[];
}

export const ShippingSection = memo(function ShippingSection({ form, sellerStates = [] }: ShippingSectionProps) {
  const { messages } = useI18n();

  return (
    <Card className={""}>
      <CardHeader className={""}>
        <CardTitle className="flex items-center gap-2">
          <MapPin className="w-5 h-5" aria-hidden="true" />
          {messages.checkout.shippingDetails}
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="grid sm:grid-cols-2 gap-4">
          <FormField
            control={form.control}
            name="city"
            render={({ field }) => (
              <FormItem>
                <FormLabel>{messages.checkout.city}</FormLabel>
                <FormControl>
                  <Input placeholder="Algiers" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="state"
            render={({ field }) => (
              <FormItem>
                <FormLabel>{messages.checkout.state}</FormLabel>
                <Select
                  onValueChange={field.onChange}
                  value={field.value ?? ''}
                >
                  <FormControl >
                    <SelectTrigger
                      className={""}
                    >
                      <SelectValue  placeholder={messages.checkout.selectState} />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent className={""}>
                    {sellerStates.map((state) => (
                      <SelectItem className={""} key={String(state.id)} value={String(state.id)}>
                        {state.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>
        <FormField
          control={form.control}
          name="note"
          render={({ field }) => (
            <FormItem>
              <FormLabel>{messages.checkout.orderNotes}</FormLabel>
              <FormControl>
                <textarea
                  placeholder={messages.checkout.orderNotesPlaceholder}
                  className="w-full px-3 py-2 text-sm border border-input rounded-md focus:outline-none focus:ring-2 focus:ring-primary"
                  rows={3}
                  {...field}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
      </CardContent>
    </Card>
  );
});
