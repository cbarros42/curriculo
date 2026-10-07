# Indicador profissional

Edite `career-data.js` para atualizar as datas e a situação profissional. O indicador e os períodos exibidos no histórico são gerados a partir desse único arquivo ao abrir a página. As traduções e o tema funcionam sem recarregamento.

- Vínculo atual: `isCurrent: true` e `endDate: null`.
- Encerrado: `isCurrent: false` e data de término em `AAAA-MM` ou `AAAA` (a precisão existente foi mantida).
- Vínculo encerrado com data desconhecida: `isCurrent: false` e `endDate: null`.
- Situação desconhecida: `isCurrent: null` e `endDate: null`. Uma data ausente por si só não significa vínculo atual.
- Campos conflitantes, como vínculo atual com data de término, são tratados como informações incompletas.

`openToOpportunities` está como `null`, sem preferência atribuída. `true` exibe abertura a oportunidades; `false` exibe atuação profissional quando houver vínculo atual ou contato profissional nos demais casos.

Para adicionar uma experiência, inclua um registro com ID único no arquivo e um artigo no HTML com o mesmo `data-career-id` e um elemento `.job-period`. O texto “Atual” não precisa ser escrito no HTML.

Depois de alterar o arquivo, atualize a página (e publique os arquivos na hospedagem, caso use uma). Uma futura interface de edição pode disparar `window.dispatchEvent(new Event('career-data-changed'))` após atualizar `window.careerData` para refletir a mudança imediatamente.

O recurso acompanha os dados cadastrados no site, não consulta empregadores, LinkedIn ou outras fontes externas.

Verificação: `node --test test-career.cjs`. Inclui situações profissionais, preferências, atualização conjunta dos períodos/indicador, PT/EN, cobertura dos 15 registros e contraste AA. Não houve inspeção visual em navegador nesta alteração.
