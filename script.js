const themeButton = document.getElementById('themeToggle');
const menuButton = document.getElementById('menuToggle');
const navigation = document.querySelector('nav');
themeButton.setAttribute('aria-pressed', 'false');
menuButton.setAttribute('aria-expanded', 'false');
themeButton.addEventListener('click', () => {
  document.body.classList.toggle('dark');
  themeButton.setAttribute('aria-pressed', String(document.body.classList.contains('dark')));
});
menuButton.addEventListener('click', () => {
  navigation.classList.toggle('open');
  menuButton.setAttribute('aria-expanded', String(navigation.classList.contains('open')));
});
navigation.querySelectorAll('a').forEach(link => link.addEventListener('click', () => {
  navigation.classList.remove('open');
  menuButton.setAttribute('aria-expanded', 'false');
}));
document.querySelectorAll('.job').forEach(job => job.addEventListener('mouseenter', () => {
  document.querySelectorAll('.job').forEach(item => item.classList.remove('active'));
  job.classList.add('active');
}));
