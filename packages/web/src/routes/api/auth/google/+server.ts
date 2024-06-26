import { json } from '@sveltejs/kit';
import { OAuth2Client } from 'google-auth-library';
import type { RequestHandler } from './$types';
import { db } from '$lib/db';
import { env } from '$env/dynamic/public';
import { apiEndpoint } from '$lib/helpers/endpoints';

async function getPayloadFromJWT(token: string) {
  try {
    const clientId = env.PUBLIC_GOOGLE_CLIENT_ID;
    const client = new OAuth2Client(clientId);
    const ticket = await client.verifyIdToken({
      idToken: token,
      audience: clientId
    });
    const payload = ticket.getPayload();
    if (!payload) throw new Error('Google authentication did not get the expected payload');
    return payload;
  } catch (err) {
    let message = '';
    if (err instanceof Error) message = err.message;
    throw new Error(`Google user could not be authenticated: ${message}`);
  }
}

export type GoogleAuthReturnData = {
  message: string;
  user: import('@mpa/db').User.Session;
};

export const POST = apiEndpoint<RequestHandler>(async ({ request, cookies }) => {
  const { token } = await request.json();
  const payload = await getPayloadFromJWT(token);
  const userSession = await db.session.start(payload);

  cookies.set('session', userSession.id, { path: '/', sameSite: 'lax', httpOnly: true });

  return json({
    message: 'Successful Google Sign-In.',
    user: userSession.user
  } as GoogleAuthReturnData);
});
