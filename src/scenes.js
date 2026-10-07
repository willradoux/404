// Cenas, formatos e horários.

export const SCENES = ['dia', 'por-do-sol', 'noite'];

export const RATIOS = { '16x9': 16 / 9, '4x3': 4 / 3, '9x16': 9 / 16 };

// Frações da imagem: hz = linha do horizonte, sun = sol, bear = cabeça do urso
export const DATA = {
  'dia': {
    '16x9': { hz: 0.6, sun: [0, 0.274] },
    '9x16': { hz: 0.52, sun: [0, 0.282] },
    '4x3': { hz: 0.6, sun: [0, 0.333] },
  },
  'por-do-sol': {
    '16x9': { hz: 0.6, sun: [0.115, 0.385], bear: [0.323, 0.6] },
    '9x16': { hz: 0.52, sun: [0.043, 0.411], bear: [0.355, 0.55] },
    '4x3': { hz: 0.63, sun: [0.133, 0.422], bear: [0.317, 0.635] },
  },
  'noite': {
    '16x9': { hz: 0.7, bear: [0.487, 0.675] },
    '9x16': { hz: 0.69, bear: [0.44, 0.675] },
    '4x3': { hz: 0.7, bear: [0.483, 0.66] },
  },
};

// Hora → cena, com transições suaves entre os pontos
const KEYS = [
  [0, 'noite'], [4.75, 'noite'], [5.75, 'por-do-sol'], [6.75, 'por-do-sol'], [7.75, 'dia'],
  [16.5, 'dia'], [17.5, 'por-do-sol'], [19, 'por-do-sol'], [20, 'noite'], [24, 'noite'],
];

// Prévias de ~100 bytes de cada cena e formato, mostradas desfocadas na abertura
export const LQIP = {"dia-16x9":"data:image/webp;base64,UklGRsgAAABXRUJQVlA4ILwAAACwBQCdASogABIAPrVKnEmnJCKhMBgMAOAWiUATpmaHMgLAPiqTmnuSfOBxysqR+IjbjvhhYYAA/uuPmDbOTQt1pTWQBmUSyWF1M1jeU65Nf8E0Gt4iOGwlsdkRKGWfdfkaAxUVxLA+iAlYpk3WvQsVMzATu3ZFXJdwNb9pM4E/zztlFkH3+eo7fblbQ9ljOcACBX0cQ77gmXAbh0iyQ7jj76zmuOuFulK/nFmzHAoFyZitzEal0u91c0AAAA==","dia-9x16":"data:image/webp;base64,UklGRuQAAABXRUJQVlA4INgAAAAQBgCdASoSACAAPrVKnUmnJCKhMAgA4BaJYgC7MzQ1xf/gNmtOdpyMMrA7FNvFNitfHHWBGt1SG4AA+Wm7VRFPIS85yNcn9dTohdiR6tvbvN21yQZkm3l1R4qWdDw/7bW1v4Ik5+Au1X7g0g3pN7+xZXKXJsfYhi3A/xeYVAsQnDSSYm4qNw61zO9KoMDiukr8uAaNun/uJ0/Ou8RKthKmK9gf88h8TRPRITVQZFxMJa1F+te3bsVbxc/9Cc2+KOPmODk+HpResBa7wHkTUxi3nlVsjX8QAAA=","dia-4x3":"data:image/webp;base64,UklGRv4AAABXRUJQVlA4IPIAAADwBQCdASogABgAPrVUpE0nJKOiKAgA4BaJZgCdMuu1RCiBtX+JQnsfQZae6yz76i5WwNltYkvR4AD+x4KY/1qzsK8BWaZSJP5viOpSPcMuUrPTk5xv3t9uuyidk20U17zioNCb0b9hER01SUfKDM3NEDoL4yfw6b7amQF6mi7RVzfR1v4YmIKEHUJSMFdZc7FFQazsCYLtAkJPjZo2f751/jeJkoHix6KdK+a8PF3WUgKVWMY6tM7qi/5ITqhzYdoD1ppssq9fn541ib2jXUvhJYDvV88OL4Acdh3FUfUi+VTRPJNtiYQ88HQPyC3vmFAAAA==","por-do-sol-16x9":"data:image/webp;base64,UklGRtgAAABXRUJQVlA4IMwAAAAQBgCdASogABIAPq1Gm0mmJCKhMAwAwBWJaACdMoSCv0q4ABhGkotDecGdIXbXT5JIBwj7GuAX3AAA/sXltQI37scyvxNtBepAdKgyWae9UmU2GtPcPHuIxvV5n3JwLRX+aGMKHTjCyhJ9pnu6XazmNe1H3aUyhbwwpD7IECODqKS8DqARywkpsYX0b93RoZj7++FqdceARYugHrO+Oc8xzwo1ol+7tZGYOkX23bkt80WxNxwGlPl/KYyRUjrtR14JnijBC9jqViWUAAA=","por-do-sol-9x16":"data:image/webp;base64,UklGRuoAAABXRUJQVlA4IN4AAADQBgCdASoSACAAPrVQnUqnJSKhsBgIAOAWiWwAnTKEcCcZuinpPP/gWwqzmKo/Xshp9dO2so4HvzU8yot/u5gA/kTUgO5d8yDpkya1dxNzAO0h4gOeuRFd/Und0/ErVFu7P5jTPCk3khtqLnujFzo+MaHIHdQpuSJBtpgQI6fewWBhSkJfVVPqxhMe3794HwL0Znq2NIwfjnMPrD4RFsIZkwl0FvEO3KVywPBIPp/LA6qTZUI5qPVVJsY05gvHonUCJkXnpRVFhKltCEyMAvjsJDQKgQMM0G4nSKiwAAA=","por-do-sol-4x3":"data:image/webp;base64,UklGRhIBAABXRUJQVlA4IAYBAACwBgCdASogABgAPqlEnEmmI6MhMAwAwBUJbACdMoR6eNO50KXiZAFvOxuBuSwkt2ueVsCzuFbN+Vf5Lae5oADN4sX/3lBjrrr6Bt1m1Ld5ABHHZl4sDVUe52Tk1mNXack+ZxeJP3m9FjVM/yXkANLeblPyXEclgb9TlaDIvD3c0Z0FetiDCFujq663PyU8PKQQeF6q/jwPZ6ZUxNOjJMPjhAgXIn+0ioYUWOL2y9fhzVVqkcTVrlGdS21uqLS0hsMZiJ4Xk6BnB7TxlElx0uqQ1WHYjTer75q7KD9KFr1PAMfMUpqun1Js1axbp/JDDTTZpoTcuUAAQjw2HmmKnbBQ6sFkPWAA","noite-16x9":"data:image/webp;base64,UklGRsYAAABXRUJQVlA4ILoAAABwBQCdASogABIAPrVGnEmnI6KhMAgA4BaJQBOgBDwLIoUAIwTMUjWDnbz7yy2Kig0ewmoAAP72kcCpthc0uJsDVBvL/vdmUIurEmaeRo1YL3hsoGvBno4ZQEfmmpU35nmODEFmEIyzuHuqB3pVwh6HeV4K1QIWFvzu+c+7H9rLyJLgkKOaJM6Fv5PQs1ZvvRcMo14m164e58aos9FpN2U/RghqivSnawzJp5m+71ae1KfHAVt5MicXAAA=","noite-9x16":"data:image/webp;base64,UklGRtwAAABXRUJQVlA4INAAAABQBQCdASoSACAAPrVIoEunI6MhsBgIAOAWiWgAtOg0banjiflU7AHRIAYyZhN0fABXy4AA/vkXD2OpH6BANaJOf8lTeWrSXv5pINkm8rQBhjqlcXdNZWFsoHSDlWk0k3P2N75XtFukmAejd9EaqD5JTflmNCMdHaF53NmhSSW0U9tzdHeJj6Ol6yiReKUvs+OPDSNJj3DVx+IFuGpYYhc+bYBNNCwb2wsmrlQWf4sVoYcWJGehSmrFqzG3zwE6nDVHqmHJaEURKAbZvaCwEAAA","noite-4x3":"data:image/webp;base64,UklGRvoAAABXRUJQVlA4IO4AAABQBgCdASogABgAPrVMnksnJCKhsBgIAOAWiWYAnTOPeG8UTdFGQsH7op//04cXhjN2BOhUKBDs+JU0iAD++cjcsbgbPJSmjlN62BymHpyifjV641E4DkW2zBvPUasVV6vcAfa0sHqfCgpvMeyKKWMJoKs5t5rl/U81Z4qNEexeB+MfszvhBGXPn3tkK8Eo+kEw8eaeONeyNQqwpr5moS0P/+ugDhOxJchX+vchyjUA5DmafQRxErYKrSDNL8jhBMMG0z1Fa1dT/Rie7AA6juK6M0Q8S+rZgp/LWr4e/3w3IPlManbjucUovV4ogAAA"};

export const imageUrl = (scene, ratio) => `/assets/${scene}-${ratio}.webp`;
export const auroraUrl = ratio => `/assets/noite-${ratio}-aurora.webp`;

const clamp = (v, a, b) => Math.max(a, Math.min(b, v));
const smooth = t => t * t * (3 - 2 * t);

// ?hora=22 força um horário para revisar
export function hourNow() {
  const forced = parseFloat(new URLSearchParams(location.search).get('hora'));
  if (!Number.isNaN(forced)) return ((forced % 24) + 24) % 24;
  const d = new Date();
  return d.getHours() + d.getMinutes() / 60;
}

export function sceneWeights(h) {
  let i = 0;
  while (i < KEYS.length - 2 && h >= KEYS[i + 1][0]) i++;
  const [h0, a] = KEYS[i];
  const [h1, b] = KEYS[i + 1];
  const t = smooth(clamp((h - h0) / (h1 - h0), 0, 1));
  const w = { 'dia': 0, 'por-do-sol': 0, 'noite': 0 };
  w[a] += 1 - t;
  w[b] += t;
  return w;
}

export function pickRatio(w, h) {
  const a = w / h;
  return Object.keys(RATIOS).sort(
    (p, q) => Math.abs(Math.log(a / RATIOS[p])) - Math.abs(Math.log(a / RATIOS[q])),
  )[0];
}

export const mainScene = weights => SCENES.reduce((a, b) => (weights[b] > weights[a] ? b : a));
