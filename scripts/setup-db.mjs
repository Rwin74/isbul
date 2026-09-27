import {readFileSync} from 'node:fs';
import {query} from '../lib/server.ts';
// Run only once against a new, empty database. Never runs during a build.
for(const file of ['drizzle/0000_last_hammerhead.sql','drizzle/0001_gray_bruce_banner.sql']){
  for(const sql of readFileSync(file,'utf8').split('--> statement-breakpoint').filter(s=>s.trim())) await query(sql);
}
console.log('Veritabanı tabloları hazır.');
