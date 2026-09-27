import {env} from 'cloudflare:workers';
export function db(){if(!env.DB)throw Error('Database unavailable');return env.DB}
export function identity(r:Request){return r.headers.get('oai-authenticated-user-id')}
export function failure(){return Response.json({error:'İşlem tamamlanamadı. Lütfen tekrar deneyin.'},{status:503})}
export function unauthorized(){return Response.json({error:'İşleme devam etmek için siteye giriş yapmalısın.'},{status:401})}
export function validOrigin(r:Request){return !r.headers.get('origin')||r.headers.get('origin')===new URL(r.url).origin}
