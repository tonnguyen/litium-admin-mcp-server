import axios, { type AxiosResponse } from 'axios';
import { type TokenResponse, type AuthError, AuthenticationError, TokenExpiredError } from '../types/auth.js';
import { type LitiumConfig } from '../types/config.js';

export class TokenManager {
  private accessToken: string | null = null;
  private tokenExpiry: number | null = null;
  private refreshPromise: Promise<string> | null = null;

  constructor(private config: LitiumConfig) {}

  async getValidToken(): Promise<string> {
    // If we have a valid token, return it
    if (this.accessToken && this.tokenExpiry && Date.now() < this.tokenExpiry) {
      return this.accessToken;
    }

    // If we're already refreshing, wait for that to complete
    if (this.refreshPromise) {
      return this.refreshPromise;
    }

    // Start a new token refresh
    this.refreshPromise = this.refreshToken();
    
    try {
      const token = await this.refreshPromise;
      return token;
    } finally {
      this.refreshPromise = null;
    }
  }

  private async refreshToken(): Promise<string> {
    try {
      const tokenUrl = `${this.config.baseUrl}/Litium/api/oauth/token`;
      
      const response: AxiosResponse<TokenResponse> = await axios.post(
        tokenUrl,
        new URLSearchParams({
          grant_type: 'client_credentials',
          client_id: this.config.clientId,
          client_secret: this.config.clientSecret,
          scope: 'admin'
        }),
        {
          headers: {
            'Content-Type': 'application/x-www-form-urlencoded',
            'Accept': 'application/json'
          }
        }
      );

      this.accessToken = response.data.access_token;
      this.tokenExpiry = Date.now() + (response.data.expires_in * 1000) - 60000; // Refresh 1 minute early

      return this.accessToken;
    } catch (error) {
      if (axios.isAxiosError(error)) {
        const authError = error.response?.data as AuthError;
        const message = authError?.error_description || authError?.error || 'Authentication failed';
        throw new AuthenticationError(message, error.response?.status);
      }
      throw new AuthenticationError('Failed to authenticate with Litium API');
    }
  }

  async makeAuthenticatedRequest<T>(
    method: 'GET' | 'POST' | 'PUT' | 'DELETE' | 'PATCH',
    url: string,
    data?: any,
    additionalHeaders?: Record<string, string>
  ): Promise<T> {
    const token = await this.getValidToken();
    
    const headers = {
      'Authorization': `Bearer ${token}`,
      'Content-Type': 'application/json',
      'Accept': 'application/json',
      ...additionalHeaders
    };

    try {
      const response = await axios({
        method,
        url: url.startsWith('http') ? url : `${this.config.baseUrl}${url}`,
        data,
        headers
      });

      return response.data;
    } catch (error) {
      if (axios.isAxiosError(error)) {
        if (error.response?.status === 401) {
          // Token might be expired, clear it and retry once
          this.accessToken = null;
          this.tokenExpiry = null;
          
          const newToken = await this.getValidToken();
          const retryResponse = await axios({
            method,
            url: url.startsWith('http') ? url : `${this.config.baseUrl}${url}`,
            data,
            headers: {
              ...headers,
              'Authorization': `Bearer ${newToken}`
            }
          });
          
          return retryResponse.data;
        }
        
        const message = error.response?.data?.message || error.message || 'API request failed';
        throw new AuthenticationError(message, error.response?.status);
      }
      throw new AuthenticationError('Failed to make authenticated request');
    }
  }

  clearToken(): void {
    this.accessToken = null;
    this.tokenExpiry = null;
    this.refreshPromise = null;
  }
}