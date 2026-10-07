const {test} = require('node:test');
const assert = require('node:assert/strict');
const fs = require('node:fs');
const vm = require('node:vm');
function render(extra = []) {
  const node = tag => ({tag, children:[], append(...items){this.children.push(...items);}, replaceChildren(fragment){this.children=[...fragment.children];}, setAttribute(k,v){this[k]=v;},addEventListener(){}});
  const grid = node('div'), updated = node('p');
  const document = {documentElement:{lang:'pt-BR'},getElementById(id){return id==='credly-grid'?grid:updated;},createElement:node,createDocumentFragment:()=>node('fragment')};
  let onLanguage;
  const context = vm.createContext({window:{}, document,Intl, Date,Set,MutationObserver:class {constructor(callback){onLanguage=callback;}observe(){}}});
  vm.runInContext(fs.readFileSync('credly-data.js','utf8'),context);
  context.window.credlySnapshot.badges.push(...extra);
  vm.runInContext(fs.readFileSync('credly.js','utf8'),context);
  return {grid,document,onLanguage,data:context.window.credlySnapshot};
}
test('verified snapshot, HTTPS links and PT/EN dates',()=>{
  const result = render();
  assert.equal(result.grid.children.length,16);
  for(const badge of result.data.badges){
    assert.equal(new URL(badge.image).hostname,'images.credly.com');
    assert.equal(badge.url,'https://www.credly.com/badges/'+badge.id);
  }
  assert.match(result.grid.children[0].children.find(n=>n.className==='badge-date').textContent,/2026/);
  result.document.documentElement.lang='en';result.onLanguage();
  assert.equal(result.grid.children[0].children.at(-1).textContent,'Verify credential ↗');
});
test('isolated new badge is added, repeated ID is deduplicated',()=>{
  const initial=render();
  const fixture={...initial.data.badges[0],id:'fixture-only',name:'TEST ONLY',url:'https://www.credly.com/badges/fixture-only'};
  const result=render([fixture,fixture]);
  assert.equal(result.grid.children.length,17);
  assert.equal(render().grid.children.length,16);
});
test('display has no network dependency for credential text and verification links',()=>{
  // No fetch implementation is supplied to the isolated runtime.
  // Badge metadata remains available when the external image host is unavailable.
  assert.equal(render().grid.children.length,16);
});
