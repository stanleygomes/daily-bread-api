import { findOne, create, update } from '../services/mongoService';
import { renderHtml } from '../utils/buildTemplate';

export async function getForm() {
  const renderPage = renderHtml({}, 'page', 'subscribe.html')
  return renderHtml({ content: renderPage }, 'page', 'layout.html');
}

export async function subscribeSave(email) {
  await updateSubscription(email, true);

  const renderPage = renderHtml({}, 'page', 'subscribe-success.html')
  return renderHtml({ content: renderPage }, 'page', 'layout.html');
}

async function updateSubscription(email, enabled) {
  let subscription = await findOne('subscription', { email: email });

  if (!subscription) {
    subscription = {
      email,
      enabled: enabled,
      created_at: new Date(),
    };
    await create('subscription', subscription);
  } else {
    subscription.enabled = true;
    await update('subscription', { _id: subscription._id}, subscription);
  }
}
