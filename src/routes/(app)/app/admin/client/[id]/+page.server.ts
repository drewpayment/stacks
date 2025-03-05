import type { InsertClient } from '$lib/drizzle/postgres/db.model.js';
import { getClient, upsertClient } from '$lib/drizzle/postgres/models/clients';
import { redirect, type Actions } from '@sveltejs/kit';


export const load = async ({ params }) => {
  const id = params.id;
  
  if (!id) redirect(301, '/app/admin/client');
  
  const client = await getClient(id);
  
  if (!client) redirect(301, '/app/admin/client');
  
  return {
    client,
  };
};

export const actions: Actions = {
  update: async ({ request }) => {
    const formData = await request.formData();
    const data = prepareFormData(formData);
    
    const entries = Object.fromEntries(data.entries()) as Partial<InsertClient>;
    
    try {
      await upsertClient(entries);
    } catch (error) {
      console.error(error);
      return false;
    }
    
    return true;
  },
};

function prepareFormData(formData: FormData): FormData {
  const data = new FormData();
  const activeTab = formData.get('activeTab') as string;
  const subTier = formData.get('subscription_tier') as string;
  
  data.set('id', formData.get('id') as string);
  
  switch (activeTab) {
    case 'billing':
      data.set('email', formData.get('email') as string);
      data.set('billingAddress', setBillingAddressFormData(formData));
      break;
    case 'contact':
      data.set('primaryContactName', formData.get('primaryContactName') as string);
      data.set('primaryContactEmail', formData.get('primaryContactEmail') as string);
      data.set('primaryContactPhone', formData.get('primaryContactPhone') as string);
      break;
    case 'tenant':
      data.set('timezone', formData.get('timezone') as string);
      data.set('locale', formData.get('locale') as string);
      break;
    case 'settings':
      data.set('maxUsers', formData.get('max_users') as string);
      data.set('subscriptionTier', subTier);
      data.set('isActive', formData.get('is_active') as string);
      if (subTier === 'trial') data.set('trialEndsAt', formData.get('trial_ends_at') as string);
      break;
    case 'overview':
    default:
      data.set('name', formData.get('name') as string);
      data.set('legalName', formData.get('legal_name') as string);
      data.set('taxId', formData.get('tax') as string);
      break;
  }
  
  return data;
}

function setBillingAddressFormData(form: FormData) {
  const result = {
    country: form.get('country') as string,
    street: form.get('street') as string,
    city: form.get('city') as string,
    state: form.get('state') as string,
    zip: form.get('postal') as string,
  } as {
    country: string;
    street: string;
    city: string;
    state: string;
    zip: string;
  };
  
  return JSON.stringify(result);
}