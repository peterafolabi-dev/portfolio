import snippets from './snippets.json';
import type { Lang } from '../lib/highlight';

export interface Peek { title: string; file: string; lang: Lang; why: string; code: string; url: string; proof: string; proofUrl?: string }

const RC = 'a534b206ab39bed9ba26232e3c097ded22bdd513';
// RedCart: verbatim lines 359-367 of products/views.py (pinned commit).
const redcartCode = [
  "cart = request.session.get('cart', {})",
  '_, cart_total = _get_cart_products(request, cart)',
  '_, coupon_discount = _get_coupon_values(request, cart_total)',
  'total_after_coupon = max(cart_total - coupon_discount, 0)',
  'insurance_cost = _calculate_insurance_cost(total_after_coupon, insurance_opted)',
  'expected_amount = round(total_after_coupon + insurance_cost, 2)',
  'if round(amount, 2) != expected_amount:',
  "    messages.error(request, '❌ Payment amount does not match the order total.')",
  "    return redirect('products:checkout')",
].join('\n');

const s = snippets as Record<string, any[]>;
const fromSnippet = (x: any, lang: Lang): Peek => ({ title: x.title, file: x.file, lang, why: x.why, code: x.code, url: x.url, proof: x.test, proofUrl: x.testUrl });

export const peeks: Record<string, Peek> = {
  'oja-ledger': fromSnippet(s['oja-ledger'][0], 'ts'),
  'travel-stays': fromSnippet(s['travel-stays'][0], 'sql'),
  redcart: {
    title: 'The server recomputes the total before accepting a payment',
    file: 'products/views.py',
    lang: 'py',
    why: 'After Paystack says “success”, the order total is rebuilt from the server-side cart, coupon and insurance. If the amount paid differs, no order is created.',
    code: redcartCode,
    url: `https://github.com/peterafolabi-dev/Retail-Logistics-Core/blob/${RC}/products/views.py#L359-L367`,
    proof: 'Tested: a test in products/tests.py replays a Paystack response with the wrong amount and asserts no order is created and the cart is kept; I confirmed it fails when the check is removed. Honest caveat: amounts are float naira rounded to 2 places, unlike Oja Ledger’s whole kobo.',
  },
};
