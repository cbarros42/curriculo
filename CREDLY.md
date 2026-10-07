# Emblemas do Credly

## Entrega atual

16 emblemas encontrados no perfil público de Claudio Barros em 5 de outubro de 2026. Dados em `credly-data.js`, apresentação em `credly.js`. Funciona abrindo `index.html` diretamente; não exige servidor para carregar os dados. As imagens oficiais são carregadas de images.credly.com e exigem internet. Em falha de imagem, o card mantém título, emissor e link de verificação.

As datas registradas são as apresentadas na carteira pública: algumas credenciais mostram emissão e outras validade. Campos não apresentados permanecem nulos. Não foram inferidas datas. As duas concessões de SentinelOne Sales Engineer Expert têm IDs e validades diferentes e foram preservadas como credenciais distintas.

Os cursos adicionados manualmente continuam no HTML, separados dos emblemas. O agrupamento anterior de CDSA/CDSE e SentinelOne foi substituído pelos emblemas correspondentes. Forcepoint DLP e SolarWinds continuam na lista complementar.

## Atualização automática: NÃO ATIVA

Foi feita uma consulta pontual ao perfil público, não uma sincronização agendada. Não há repositório remoto ou hospedagem configurados neste projeto. Nenhuma tarefa recorrente foi instalada.

A documentação oficial consultada oferece incorporação de emblemas individuais e API autenticada para organizações. Não foi confirmada uma API pública oficial para descobrir automaticamente todos os novos emblemas deste perfil pessoal. O endpoint Workforce exige uma organização e conexão aceita pelo titular; não é uma integração pública anônima.

- API: https://api.credly.com/docs/web_service_api
- Workforce: https://www.credly.com/docs/workforce
- Incorporação individual: https://support.credly.com/hc/en-us/articles/360043782632-How-can-I-embed-my-badge-in-a-website
- Perfil: https://www.credly.com/users/claudio-barros.0e471876/badges/credly

## Caminho proposto

1. Confirmar com o Credly uma integração autorizada para a conta ou fornecer uma exportação oficial. Não enviar senhas ou tokens no chat.
2. Com acesso autorizado e hospedagem definidos, implementar um adaptador que leia todas as páginas, valide titularidade, visibilidade, IDs, datas e URLs e gere uma nova versão do arquivo de dados.
3. Configurar execução diária e manual no serviço de hospedagem (por exemplo, GitHub Actions para GitHub Pages). Guardar credenciais exclusivamente em Secrets.
4. Publicar apenas após resposta completa e válida. Falhas e respostas incompletas preservam a última versão; revogações/remoções precisam de confirmação explícita na fonte. Atualizações não alteram os cursos manuais.
5. Registrar a última sincronização bem-sucedida e testar indisponibilidade, paginação, novos IDs, alterações de estado e duplicações antes de ativar.

Alternativa imediata: enviar novos links individuais ou arquivos exportados pelo Credly para atualizar o snapshot. Isso exige intervenção e não é atualização automática. Coleta recorrente de páginas ou uso de endpoints não documentados não foram implementados: requerem avaliação e decisão antes de seguir.

## Validação

`node --test test-credly.cjs` verifica renderização PT/EN, IDs e hosts oficiais, inserção de um emblema simulado isolado, deduplicação e funcionamento dos textos sem rede. Não testa uma integração agendada, pois essa integração ainda depende da fonte autorizada. A apresentação visual local não foi confirmada no navegador integrado.
