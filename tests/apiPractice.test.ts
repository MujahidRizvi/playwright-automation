import { test, expect, request } from '@playwright/test';

test.describe('GET /users API Tests', () => {
    const BASE_URL: string = 'https://reqres.in/api';

    test('Verify API responds with 200 status', async () => {
        // Create a new API request context with SSL errors ignored
        const context = await request.newContext({ ignoreHTTPSErrors: true });

        // Send GET request
        const response = await context.get(`${BASE_URL}/users`);

        // Assertions
        expect(response.status()).toBe(200);
        
        const responseBody: { data: any[] } = await response.json();
        expect(responseBody).toHaveProperty('data');
        expect(responseBody.data.length).toBeGreaterThan(0);
    });

    test('Verify response contains pagination fields', async () => {
        const context = await request.newContext({ ignoreHTTPSErrors: true });
        const response = await context.get(`${BASE_URL}/users`);
        const responseBody: Record<string, unknown> = await response.json();

        expect(responseBody).toHaveProperty('page');
        expect(responseBody).toHaveProperty('per_page');
        expect(responseBody).toHaveProperty('total');
        expect(responseBody).toHaveProperty('total_pages');
    });

    test('Verify each user object has required fields', async () => {
        const context = await request.newContext({ ignoreHTTPSErrors: true });
        const response = await context.get(`${BASE_URL}/users`);
        const responseBody: { data: Array<Record<string, unknown>> } = await response.json();

        responseBody.data.forEach((user: Record<string, unknown>) => {
            expect(user).toHaveProperty('id');
            expect(user).toHaveProperty('email');
            expect(user).toHaveProperty('first_name');
            expect(user).toHaveProperty('last_name');
            expect(user).toHaveProperty('avatar');
        });
    });

    test('Verify request with query parameters', async () => {
        const context = await request.newContext({ ignoreHTTPSErrors: true });
        const response = await context.get(`${BASE_URL}/users?page=2`);
        expect(response.status()).toBe(200);
    });
});
