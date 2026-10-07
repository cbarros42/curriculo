(function (root) {
  'use strict';
  const labels = {
    employed: {pt:'ATUANDO PROFISSIONALMENTE', en:'CURRENTLY EMPLOYED', color:'employed'},
    available: {pt:'DISPONÍVEL PARA NOVOS DESAFIOS', en:'AVAILABLE FOR NEW OPPORTUNITIES', color:'available'},
    open: {pt:'ABERTO A NOVAS OPORTUNIDADES', en:'OPEN TO NEW OPPORTUNITIES', color:'available'},
    unknown: {pt:'VAMOS CONVERSAR', en:'LET’S TALK', color:'neutral'},
    contact: {pt:'CONTATO PROFISSIONAL', en:'PROFESSIONAL CONTACT', color:'neutral'}
  };
  const validDate = value => typeof value === 'string' && /^\d{4}(?:-(?:0[1-9]|1[0-2]))?$/.test(value);
  function employmentState(job) {
    if (!job || !validDate(job.startDate)) return 'unknown';
    // Missing dates alone never imply current employment.
    if (job.isCurrent === true) return job.endDate == null ? 'current' : 'unknown';
    if (validDate(job.endDate) && job.endDate >= job.startDate.slice(0,job.endDate.length)) return 'ended';
    if (job.isCurrent === false && job.endDate == null) return 'ended';
    return 'unknown';
  }
  function resolveStatus(data = {}) {
    const states = (Array.isArray(data.experiences) ? data.experiences : []).map(employmentState);
    const employed = states.includes('current');
    if (data.openToOpportunities === true) return 'open';
    if (data.openToOpportunities === false) return employed ? 'employed' : 'contact';
    if (employed) return 'employed';
    return states.length && states.every(s=>s==='ended') ? 'available' : 'unknown';
  }
  function formatDate(value, language) {
    if (!validDate(value)) return language === 'en' ? 'Date not specified' : 'Data não informada';
    if (value.length === 4) return value;
    return new Intl.DateTimeFormat(language === 'en' ? 'en-US' : 'pt-BR', {
      month:'short', year:'numeric', timeZone:'UTC'
    }).format(new Date(value+'-01T00:00:00Z')).toLocaleUpperCase(language === 'en' ? 'en-US' : 'pt-BR');
  }
  function period(job, language) {
    const state = employmentState(job), start = formatDate(job?.startDate, language);
    if (state === 'current') return start+' — '+(language === 'en' ? 'PRESENT' : 'ATUAL');
    if (state === 'ended') return start+' — '+(validDate(job.endDate) ? formatDate(job.endDate,language) : (language === 'en' ? 'ENDED (DATE UNKNOWN)' : 'ENCERRADO (DATA NÃO INFORMADA)'));
    return start+' — '+(language === 'en' ? 'STATUS NOT SPECIFIED' : 'SITUAÇÃO NÃO INFORMADA');
  }
  function mount(document, dataProvider) {
    function render() {
      const data = dataProvider() || {};
      const language = document.documentElement.lang === 'en' ? 'en' : 'pt';
      const jobs = Array.isArray(data.experiences) ? data.experiences : [];
      const missing = [];
      document.querySelectorAll('[data-career-id]').forEach(element => {
        const job = jobs.find(item=>item.id===element.dataset.careerId);
        if (!job) missing.push({});
        element.querySelector('.job-period').textContent = period(job,language);
      });
      const status = labels[resolveStatus({...data,experiences:[...jobs,...missing]})];
      document.getElementById('career-status').dataset.status = status.color;
      document.getElementById('career-status-label').textContent = status[language];
    }
    render();
    return render;
  }
  if (typeof module !== 'undefined' && module.exports) module.exports = {resolveStatus, employmentState, period, labels, mount};
  if (typeof document !== 'undefined') {
    const render = mount(document,()=>root.careerData);
    new MutationObserver(render).observe(document.documentElement,{attributes:true,attributeFilter:['lang']});
    root.addEventListener('career-data-changed',render);
  }
})(typeof window !== 'undefined' ? window : globalThis);
