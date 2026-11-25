import { supabase, isSupabaseConfigured } from './supabase';
import { MOCK_REQUESTS, MOCK_MEMBERS, MOCK_CATEGORIES } from '@/data/mock';
import { ServiceRequest, RequestStatus } from '@/types/database';

export async function submitServiceRequest(payload: {
  client_name: string;
  client_email: string;
  client_phone?: string;
  category_id?: string | null;
  member_id?: string | null;
  budget?: string;
  message: string;
}): Promise<ServiceRequest> {
  if (isSupabaseConfigured && supabase) {
    const { data, error } = await supabase
      .from('requests')
      .insert({
        client_name: payload.client_name,
        client_email: payload.client_email,
        client_phone: payload.client_phone || '',
        category_id: payload.category_id || null,
        member_id: payload.member_id || null,
        budget: payload.budget || '',
        message: payload.message,
        status: 'new',
      })
      .select('*, member:profiles(*), category:categories(*)')
      .single();

    if (error) throw error;
    return data;
  }

  // Demo fallback
  const member = payload.member_id ? MOCK_MEMBERS.find((m) => m.id === payload.member_id) : undefined;
  const category = payload.category_id ? MOCK_CATEGORIES.find((c) => c.id === payload.category_id) : undefined;

  const newReq: ServiceRequest = {
    id: `r-${Date.now()}`,
    client_name: payload.client_name,
    client_email: payload.client_email,
    client_phone: payload.client_phone || '',
    category_id: payload.category_id || null,
    member_id: payload.member_id || null,
    budget: payload.budget || '',
    message: payload.message,
    status: 'new',
    created_at: new Date().toISOString(),
    member,
    category,
  };

  MOCK_REQUESTS.unshift(newReq);
  return newReq;
}

export async function getRequests(options?: { memberId?: string }): Promise<ServiceRequest[]> {
  if (isSupabaseConfigured && supabase) {
    let query = supabase.from('requests').select('*, member:profiles(*), category:categories(*)');

    if (options?.memberId) {
      query = query.eq('member_id', options.memberId);
    }

    const { data, error } = await query.order('created_at', { ascending: false });
    if (!error && data) return data;
  }

  // Demo fallback
  if (options?.memberId) {
    return MOCK_REQUESTS.filter((r) => r.member_id === options.memberId);
  }
  return MOCK_REQUESTS;
}

export async function updateRequestStatus(id: string, status: RequestStatus): Promise<void> {
  if (isSupabaseConfigured && supabase) {
    await supabase.from('requests').update({ status }).eq('id', id);
    return;
  }
  const req = MOCK_REQUESTS.find((r) => r.id === id);
  if (req) req.status = status;
}
