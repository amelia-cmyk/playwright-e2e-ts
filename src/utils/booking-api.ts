import { APIRequestContext, APIResponse } from '@playwright/test';
import { BookingData } from './data-factory';
import { env } from './env';

/** Thin client for the Restful-Booker API (https://restful-booker.herokuapp.com/apidoc). */
export class BookingApi {
  private token?: string;

  constructor(private readonly request: APIRequestContext) {}

  async authenticate(): Promise<string> {
    const res = await this.request.post('/auth', {
      data: { username: env.api.username, password: env.api.password },
    });
    const body = await res.json();
    if (!body.token) throw new Error(`Auth failed: ${JSON.stringify(body)}`);
    this.token = body.token as string;
    return this.token;
  }

  private authHeaders(): Record<string, string> {
    if (!this.token) throw new Error('Call authenticate() first');
    return { Cookie: `token=${this.token}`, Accept: 'application/json' };
  }

  create(booking: BookingData): Promise<APIResponse> {
    return this.request.post('/booking', { data: booking, headers: { Accept: 'application/json' } });
  }

  get(id: number): Promise<APIResponse> {
    return this.request.get(`/booking/${id}`, { headers: { Accept: 'application/json' } });
  }

  list(params: Record<string, string> = {}): Promise<APIResponse> {
    return this.request.get('/booking', { params });
  }

  update(id: number, booking: BookingData): Promise<APIResponse> {
    return this.request.put(`/booking/${id}`, { data: booking, headers: this.authHeaders() });
  }

  partialUpdate(id: number, patch: Partial<BookingData>): Promise<APIResponse> {
    return this.request.patch(`/booking/${id}`, { data: patch, headers: this.authHeaders() });
  }

  delete(id: number, authenticated = true): Promise<APIResponse> {
    return this.request.delete(`/booking/${id}`, { headers: authenticated ? this.authHeaders() : {} });
  }
}
