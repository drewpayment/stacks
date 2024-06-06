import { http, HttpResponse } from 'msw';
import { nanoid } from 'nanoid';

export const handlers = [
  
  http.post('https://localhost:5173/app/employee', ({ request }) => {
    const query = new URL(request.url);
    const hasAdd = query.searchParams.has('add');  
    
    if (!hasAdd) return new HttpResponse(null, { status: 404 });
  
    return HttpResponse.json({
      id: nanoid(),
    });
  }),
  
];