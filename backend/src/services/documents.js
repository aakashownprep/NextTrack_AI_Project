import fs from 'node:fs/promises';
import path from 'node:path';
import pdf from 'pdf-parse/lib/pdf-parse.js';
import xlsx from 'xlsx';
import mammoth from 'mammoth';
export async function extractText(file){
 const ext=path.extname(file.originalname).toLowerCase();
 if(ext==='.pdf'){const r=await pdf(await fs.readFile(file.path));return r.text||'';}
 if(ext==='.docx'){const r=await mammoth.extractRawText({path:file.path});return r.value||'';}
 if(ext==='.xlsx'||ext==='.xls'){const wb=xlsx.readFile(file.path);return wb.SheetNames.map(n=>'SHEET: '+n+'\n'+xlsx.utils.sheet_to_csv(wb.Sheets[n])).join('\n\n');}
 if(ext==='.txt'||ext==='.csv')return await fs.readFile(file.path,'utf8');
 throw new Error('Unsupported file type. Upload PDF, DOCX, XLSX, XLS, CSV or TXT.');
}
