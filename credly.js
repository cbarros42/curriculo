(() => {
  const data = window.credlySnapshot;
  const grid = document.getElementById('credly-grid');
  if (!data || !grid) return;
  function render() {
    const en = document.documentElement.lang === 'en';
    const date = value => new Intl.DateTimeFormat(en ? 'en-US' : 'pt-BR', {dateStyle:'medium',timeZone:'UTC'}).format(new Date(value+'T00:00:00Z'));
    const fragment = document.createDocumentFragment();
    const seen = new Set();
    for (const badge of data.badges) {
      if (seen.has(badge.id)) continue;
      seen.add(badge.id);
      const card = document.createElement('article');
      card.className = 'credly-card';
      const img = document.createElement('img');
      img.src = badge.image; img.alt = (en ? 'Badge: ' : 'Emblema: ')+badge.name;
      img.width = 64; img.height = 64; img.loading = 'lazy';
      img.addEventListener('error', () => { img.hidden = true; });
      card.append(img);
      const issuer = document.createElement('p'); issuer.className = 'badge-issuer'; issuer.textContent = badge.issuer; card.append(issuer);
      const title = document.createElement('h4'); title.textContent = badge.name; card.append(title);
      for (const [key, label] of [['issued', en ? 'Issued' : 'Emissão'], ['expires', en ? 'Expires' : 'Validade']]) {
        if (!badge[key]) continue;
        const p = document.createElement('p'); p.className = 'badge-date'; p.textContent = label+': '+date(badge[key]); card.append(p);
      }
      const link = document.createElement('a'); link.href = badge.url; link.target = '_blank'; link.rel = 'noopener noreferrer';
      link.textContent = en ? 'Verify credential ↗' : 'Verificar credencial ↗';
      link.setAttribute('aria-label', link.textContent+' — '+badge.name); card.append(link);
      fragment.append(card);
    }
    grid.replaceChildren(fragment);
    document.getElementById('credly-updated').textContent = (en ? 'Profile reviewed on ' : 'Perfil consultado em ')+date(data.verifiedOn);
  }
  render();
  new MutationObserver(render).observe(document.documentElement, {attributes:true, attributeFilter:['lang']});
})();
