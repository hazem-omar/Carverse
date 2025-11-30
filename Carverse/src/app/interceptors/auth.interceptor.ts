import { HttpInterceptorFn } from '@angular/common/http';
import { inject } from '@angular/core';
import { AuthService } from '../services/auth.service';

export const authInterceptor: HttpInterceptorFn = (req, next) => {
  const authService = inject(AuthService);
  const token = authService.getToken();

  // Don't add token to auth endpoints (login/register)
  const isAuthEndpoint = req.url.includes('/auth/local') || req.url.includes('/auth/local/register');

  // Skip adding the token for certain public endpoints (e.g., cars) so that
  // Strapi evaluates the request as Public rather than Authenticated. When a
  // JWT is present the backend will evaluate the request with the Authenticated
  // role which may not have permission for public content (403). Adjust if
  // your backend is configured differently.
  const publicEndpoints = ['/api/cars', '/api/cars/', '/api/categories', '/api/categories/'];
  const isPublicEndpoint = publicEndpoints.some(p => req.url.includes(p));
  const isGetRequest = (req.method || '').toUpperCase() === 'GET';

  if (token && !isAuthEndpoint && !(isPublicEndpoint && isGetRequest)) {
    req = req.clone({
      setHeaders: {
        Authorization: `Bearer ${token}`
      }
    });
  }

  return next(req);
};

