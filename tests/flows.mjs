import ts from 'typescript';
import {DatabaseSync} from 'node:sqlite';
import {readFileSync} from 'node:fs';
import assert from 'node:assert/strict';
import {z} from 'zod';
const database=new DatabaseSync(':memory:');database.exec(readFileSync('drizzle/0000_last_hammerhead.sql','utf8'));
const adapter={prepare(sql){return {bind(...args){const stmt=database.prepare(sql);return {async all(){return {results:stmt.all(...args)}},async first(){return stmt.get(...args)||null},async run(){return {meta:stmt.run(...args)}}}}}}};
const catalog=await import('data:text/javascript;base64,'+Buffer.from(ts.transpile(readFileSync('lib/catalog.ts','utf8'),{module:ts.ModuleKind.ESNext})).toString('base64'));
globalThis.testDeps={z,db:()=>adapter,identity:r=>r.headers.get('oai-authenticated-user-id'),failure:()=>Response.json({error:'failure'},{status:503}),unauthorized:()=>new Response(null,{status:401}),validOrigin:r=>!r.headers.get('origin')||r.headers.get('origin')===new URL(r.url).origin,...catalog};
async function route(path){const code=readFileSync(path,'utf8').replace(/^import .*;\r?\n/gm,'');return import('data:text/javascript;base64,'+Buffer.from('const {z,db,identity,failure,unauthorized,validOrigin,cities,sectors}=globalThis.testDeps;'+ts.transpile(code,{module:ts.ModuleKind.ESNext})).toString('base64'))}
const posts=await route('app/api/posts/route.ts'), apps=await route('app/api/applications/route.ts');
const req=(path,method='GET',data,user='owner')=>new Request('https://test.local'+path,{method,headers:{...(user?{'oai-authenticated-user-id':user}:{}),'Content-Type':'application/json'},...(data?{body:JSON.stringify(data)}:{})});
const payload={kind:'job',title:'Garson aranıyor',name:'Deneme',city:'İstanbul',district:'Kadıköy',sector:'Garsonluk',date:'2026-10-01',hours:'09:00-17:00',pay:1400,description:'Bir günlük servis desteği.'};
assert.equal((await posts.POST(req('/api/posts','POST',payload,''))).status,401);
assert.equal((await posts.POST(req('/api/posts','POST',{...payload,city:'Invalid'}))).status,400);
const created=await posts.POST(req('/api/posts','POST',payload));assert.equal(created.status,201);const {id}=await created.json();
const application={postId:id,name:'Öğrenci',contact:'05551234567',message:'Bugün müsaitim.'};
assert.equal((await apps.POST(req('/api/applications','POST',application))).status,409);
assert.equal((await apps.POST(req('/api/applications','POST',application,'worker'))).status,201);
assert.equal((await apps.POST(req('/api/applications','POST',application,'worker'))).status,409);
assert.equal((await apps.GET(req('/api/applications?postId='+id,'GET',null,'stranger'))).status,404);
const received=await (await apps.GET(req('/api/applications?postId='+id))).json();assert.equal(received.applications.length,1);
assert.equal((await posts.PATCH(req('/api/posts','PATCH',{id},'stranger'))).status,404);
assert.equal((await posts.PATCH(req('/api/posts','PATCH',{id}))).status,200);
assert.equal((await apps.POST(req('/api/applications','POST',application,'worker2'))).status,409);
const listing=await (await posts.GET(req('/api/posts'))).json();assert.equal(listing.posts[0].status,'closed');assert.equal(listing.posts[0].owner,undefined);
console.log('Passed: validation, persistence, applications, duplicates, private contact access, ownership and closed listings.');

