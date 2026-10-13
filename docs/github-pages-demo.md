# Demonstração no GitHub Pages

O usuário autorizou publicar uma demonstração interativa estática, após receber a explicação de que GitHub Pages não executa FastAPI nem PostgreSQL. A entrega atual usa React/TypeScript e dados fictícios; não é o ERP transacional descrito no plano.

## O que está disponível

Dashboard por contexto demonstrativo, filtros, cards de projeto, cadastro/edição de projetos fictícios, tarefas e subtarefas, responsáveis elegíveis, Kanban com ação de status por teclado, regra de conclusão/progresso por folhas, criação de pessoas/departamentos fictícios e histórico local. A seleção de persona simula diferentes visões sem autenticação. Projeto sem trabalho ou com tarefa incompleta não pode concluir no protótipo.

Dados ficam em `localStorage` sob `terra.demo.v1`; não são enviados a servidor e não se sincronizam entre navegadores. Não inserir dados reais ou credenciais. “Restaurar demonstração” remove apenas as mudanças fictícias locais e recarrega fixtures. Datas de prazo usam o calendário local do navegador para a simulação, não substituem a futura política de fuso corporativo.

O histórico pode ser alterado/restaurado pelo próprio navegador e não tem garantia de auditoria. Permissões visuais não representam controles seguros do backend. Não existe login, sessão real, banco, API ou migração nesta entrega. O repo é público; apenas build estático fica na branch `gh-pages`, sem merge na principal.

## Instalação e validação

Na pasta `frontend/`, execute `npm ci`, `npm run build` e `npm run test:e2e`. Playwright requer navegador instalado por `npx playwright install chromium`, ou `PLAYWRIGHT_CHROMIUM_EXECUTABLE` apontando a um Chromium compatível já disponível. Base do projeto é `/silexin/` e rotas usam hash, compatíveis com Pages sem servidor de rotas.

Os testes cobrem dashboard/75%, fechamento negado e permitido, persistência local, cadastro de tarefa/subtarefa, busca, Kanban, personas/administração fictícia e navegação/formulário em 360px. Esses testes não validam o futuro backend ou segurança corporativa.

## Publicação

Fonte React fica na branch `feat/erp-projetos-terra-spec`. Build produzido por `npm run build` é copiado para a raiz de uma branch de publicação `gh-pages`, com `.nojekyll` e `release.json` identificando o commit de origem. O GitHub Pages usa essa branch e caminho `/` via configuração oficial do repositório. URL esperada: `https://lcs-casagrande.github.io/silexin/`.

Para atualizar, faça novo build da fonte revisada, publique os assets e nova identificação de release na branch de publicação e confirme o build do Pages e a resposta pública. Não faça force push na principal nem exponha secrets em configuração versionada. Host/API/banco do ERP real devem ser aprovados separadamente.

## Resultado de execução

Verificado nesta execução: build TypeScript/Vite concluído; **6 testes Playwright passaram**, cobrindo os fluxos acima e 360px; npm audit reportou **zero vulnerabilidades**, inclusive dependências de desenvolvimento. Revisão visual do dashboard concluída. Nenhum teste de backend foi executado, porque ele não está implementado.

Build estático publicado na branch `gh-pages`, commit `b41970d`, com `release.json` apontando para o commit de origem `0e05583`. O repositório é público e a branch principal permanece sem merge.

**Pendência externa**: o GitHub recusou `POST /repos/lcs-casagrande/silexin/pages` com HTTP 403, “Resource not accessible by integration”. A credencial desta sessão permite push mas não criação do site Pages; o envio do build não habilita o site automaticamente.

Para concluir, o administrador precisa abrir [Settings → Pages](https://github.com/lcs-casagrande/silexin/settings/pages), escolher **Deploy from a branch**, branch **gh-pages**, pasta **/ (root)** e salvar. Depois aguardar o build do GitHub. URL alvo: https://lcs-casagrande.github.io/silexin/. Até a ativação e a verificação, não afirmar que o site está acessível.
