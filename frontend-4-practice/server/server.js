import { today, slotsByDate } from './database.js';


const DELAY_MS = 700;


const wait = (ms) => new Promise((resolve) => setTimeout(resolve, ms));


export function mockServer() {
  return {
    name: 'mock-booking-server',
    configureServer(server) {
      server.middlewares.use(async (req, res, next) => {
        const url = new URL(req.url || '/', 'http://localhost');
        if (!url.pathname.startsWith('/api/')) return next();

        res.setHeader('Content-Type', 'application/json; charset=utf-8');
        await wait(DELAY_MS);

        if (req.method === 'GET' && url.pathname === '/api/booking/today') {
          res.statusCode = 200;
          res.end(JSON.stringify(today));
          return;
        }

        if (req.method === 'GET' && url.pathname === '/api/slots') {
          const day = Number(url.searchParams.get('day'));
          const month = Number(url.searchParams.get('month'));
          const year = Number(url.searchParams.get('year'));
          const date = `${year}-${String(month + 1).padStart(2, '0')}-${String(day).padStart(2, '0')}`;
          const slots = slotsByDate[date];
          if (!slots) {
            res.statusCode = 404;
            res.end(JSON.stringify({ message: 'На выбранную дату расписание пока не задано.' }));
            return;
          }
          res.statusCode = 200;
          res.end(JSON.stringify({ date, slots }));
          return;
        }

        res.statusCode = 404;
        res.end(JSON.stringify({ message: 'API-эндпоинт не найден.' }));
      });
    }
  };
}
