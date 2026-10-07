import test from 'node:test';
import assert from 'node:assert/strict';
import * as PDFLib from '../../public/tools/link-tagger/vendor/pdf-lib.esm.min.js';
import {makeTags,withTags,cleanPasted,retagLink,retagPdf,taggedFileName} from '../../public/tools/link-tagger/link-tagger.js';

const tags=makeTags({company:'Sandbox AQ',medium:'application',campaign:'Job Search'});

test('Tags are slugged and replace any old UTM tags',()=>{
 assert.deepEqual(tags,{utm_source:'sandbox-aq',utm_medium:'application',utm_campaign:'job-search'});
 assert.equal(withTags('https://www.omoniyialimi.com/house?utm_source=cloaked&utm_content=x',tags),'https://www.omoniyialimi.com/house?utm_source=sandbox-aq&utm_medium=application&utm_campaign=job-search');
});

test('Pasted links lose stray punctuation',()=>{
 assert.equal(cleanPasted('(omoniyialimi.com/athletico).'),'https://omoniyialimi.com/athletico');
});

test('Only omoniyialimi.com links are tagged; broken paths are fixed',()=>{
 assert.equal(retagLink('https://www.linkedin.com/in/someone/',tags).kind,'skipped');
 assert.equal(retagLink('mailto:hi@example.com',tags).kind,'skipped');
 assert.equal(retagLink('not a link',tags).kind,'broken');
 const fixed=retagLink('https://omoniyialimi.com/house).',tags);
 assert.equal(fixed.kind,'tagged');assert.equal(fixed.fixed,true);
 assert.equal(fixed.after,'https://omoniyialimi.com/house?utm_source=sandbox-aq&utm_medium=application&utm_campaign=job-search');
});

test('File names get the company once',()=>{
 assert.equal(taggedFileName('Resume.pdf','sandbox-aq'),'Resume-sandbox-aq.pdf');
 assert.equal(taggedFileName('Resume-sandbox-aq.pdf','sandbox-aq'),'Resume-sandbox-aq.pdf');
});

test('Every link annotation in a PDF is rewritten and other sites are kept',async()=>{
 const {PDFDocument,PDFName,PDFString}=PDFLib;
 const doc=await PDFDocument.create();
 const page=doc.addPage([300,300]);
 const urls=['https://www.omoniyialimi.com/?utm_source=cloaked&utm_medium=application&utm_campaign=job-search','https://www.omoniyialimi.com/usda','https://www.linkedin.com/in/someone/'];
 const annots=urls.map((uri,i)=>doc.context.register(doc.context.obj({Type:'Annot',Subtype:'Link',Rect:[10,10+i*20,100,25+i*20],Border:[0,0,0],A:{Type:'Action',S:'URI',URI:PDFString.of(uri)}})));
 page.node.set(PDFName.of('Annots'),doc.context.obj(annots));
 const {bytes,results}=await retagPdf(await doc.save(),tags,PDFLib);
 assert.deepEqual(results.map(r=>r.kind),['tagged','tagged','skipped']);

 const out=await PDFDocument.load(bytes);
 const found=out.getPages()[0].node.Annots().asArray().map(ref=>out.context.lookup(ref).lookup(PDFName.of('A')).lookup(PDFName.of('URI')).decodeText());
 assert.deepEqual(found,[
  'https://www.omoniyialimi.com/?utm_source=sandbox-aq&utm_medium=application&utm_campaign=job-search',
  'https://www.omoniyialimi.com/usda?utm_source=sandbox-aq&utm_medium=application&utm_campaign=job-search',
  'https://www.linkedin.com/in/someone/',
 ]);
});
