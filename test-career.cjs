const {test}=require('node:test');
const assert=require('node:assert/strict');
const fs=require('node:fs');
const vm=require('node:vm');
const {resolveStatus,period,mount}=require('./career-status.js');
const current={id:'example',startDate:'2025-11',endDate:null,isCurrent:true};
const ended={...current,endDate:'2026-10',isCurrent:false};
test('employment states and explicit preferences',()=>{
  assert.equal(resolveStatus({experiences:[current]}),'employed');
  assert.equal(resolveStatus({experiences:[ended]}),'available');
  for(const experiences of [[],[{}],[{startDate:'2025',endDate:null}],[{...current,endDate:'2026'}]]) assert.equal(resolveStatus({experiences}),'unknown');
  for(const experiences of [[current],[ended],[]]) assert.equal(resolveStatus({experiences,openToOpportunities:true}),'open');
  assert.equal(resolveStatus({experiences:[current],openToOpportunities:false}),'employed');
  assert.equal(resolveStatus({experiences:[ended],openToOpportunities:false}),'contact');
  assert.equal(resolveStatus({experiences:[],openToOpportunities:false}),'contact');
});
test('same data updates the badge and period in both languages',()=>{
  const badge={dataset:{}},label={},date={};
  const doc={documentElement:{lang:'pt-BR'},querySelectorAll(){return [{dataset:{careerId:'example'},querySelector(){return date;}}];},getElementById(id){return id==='career-status'?badge:label;}};
  const data={experiences:[current]};const render=mount(doc,()=>data);
  assert.equal(label.textContent,'ATUANDO PROFISSIONALMENTE');assert.match(date.textContent,/ATUAL/);
  doc.documentElement.lang='en';render();assert.equal(label.textContent,'CURRENTLY EMPLOYED');assert.match(date.textContent,/PRESENT/);
  data.experiences=[ended];render();assert.equal(label.textContent,'AVAILABLE FOR NEW OPPORTUNITIES');assert.ok(!date.textContent.includes('PRESENT'));assert.equal(badge.dataset.status,'available');
  doc.documentElement.lang='pt-BR';render();assert.equal(label.textContent,'DISPONÍVEL PARA NOVOS DESAFIOS');
  data.experiences=[];render();assert.equal(badge.dataset.status,'neutral');
});
test('all 15 HTML experiences have structured data; preference remains unspecified',()=>{
  const sandbox={window:{}};vm.runInNewContext(fs.readFileSync('career-data.js','utf8'),sandbox);
  const data=sandbox.window.careerData;
  const ids=[...fs.readFileSync('index.html','utf8').matchAll(/data-career-id="([^"]+)"/g)].map(m=>m[1]);
  assert.equal(ids.length,15);assert.deepEqual(ids,[...data.experiences.map(j=>j.id)]);assert.equal(data.openToOpportunities,null);
  assert.equal(resolveStatus(data),'employed');assert.match(period(data.experiences[0],'pt'),/ATUAL/);
});
test('all status text/background pairs exceed WCAG AA contrast',()=>{
  const lum=hex=>hex.match(/\w\w/g).map(v=>parseInt(v,16)/255).map(v=>v<=.04045?v/12.92:((v+.055)/1.055)**2.4).reduce((s,v,i)=>s+v*[.2126,.7152,.0722][i],0);
  for(const [bg,fg] of [['e6f0ff','10366b'],['e2f5e9','14532d'],['edf0f5','334155']])assert.ok((lum(bg)+.05)/(lum(fg)+.05)>4.5);
});
