import * as readline from 'readline/promises';
import { stdin as input, stdout as output } from 'process';
import { db } from './db';
import { uf, cidade, noticia, tag, noticia_tag } from './schema';
import { eq, asc, desc } from 'drizzle-orm';

const rl = readline.createInterface({ input, output });

async function aguardarVoltar() {
  while (true) {
    const opcao = await rl.question('\n(z) Voltar\n> ');
    if (opcao.toLowerCase() === 'z') {
      break;
    } else {
      console.log('Opção inválida.');
    }
  }
}

async function exibirMenu() {
  while (true) {
    console.log(`
--- MENU PRINCIPAL ---
0 - Cadastrar notícia
1 - Exibir todas as notícias (mais recentes primeiro)
2 - Exibir todas as notícias (mais antigas primeiro)
3 - Exibir notícias de um estado específico
4 - Exibir todas as notícias agrupadas por estado
5 - Cadastrar UF
6 - Cadastrar cidade
7 - Sair
`);

    const opcao = await rl.question('Escolha uma opção: ');

    switch (opcao) {
      case '0': {
        console.log('\n--- CADASTRAR NOTÍCIA ---');
        const titulo = await rl.question('Título da notícia: ');
        const texto = await rl.question('Texto da notícia: ');

        const cidadesCadastradas = await db.select().from(cidade);
        if (cidadesCadastradas.length === 0) {
          console.log('Nenhuma cidade cadastrada. Cadastre uma cidade (Opção 6) primeiro.');
          break;
        }

        console.log('\nCidades disponíveis:');
        cidadesCadastradas.forEach(c => console.log(`[${c.id}] ${c.nome}`));
        
        const cidadeIdStr = await rl.question('Digite o ID da cidade: ');
        const cidadeId = parseInt(cidadeIdStr);

        // Insere a notícia e usa .returning() para capturar o ID que o banco gerou
        const noticiaInserida = await db.insert(noticia).values({
          titulo: titulo,
          texto: texto,
          cidade_id: cidadeId
        }).returning({ id: noticia.id });

        const novaNoticiaId = noticiaInserida[0].id;

        // Lógica de cadastro das Tags
        const tagsInput = await rl.question('Digite as tags (separadas por vírgula) ou deixe em branco:\n> ');
        if (tagsInput.trim()) {
          const listaTags = tagsInput.split(',').map(t => t.trim().toLowerCase()).filter(t => t !== '');
          
          for (const nomeTag of listaTags) {
            // Verifica se a tag já existe no banco
            let tagBanco = await db.select().from(tag).where(eq(tag.nome, nomeTag));
            let tagId;
            
            if (tagBanco.length === 0) {
              // Se não existe, insere a nova tag
              const tagInserida = await db.insert(tag).values({ nome: nomeTag }).returning({ id: tag.id });
              tagId = tagInserida[0].id;
            } else {
              // Se já existe, pega o ID dela
              tagId = tagBanco[0].id;
            }

            // Cria o vínculo na tabela associativa N:M
            await db.insert(noticia_tag).values({
              noticia_id: novaNoticiaId,
              tag_id: tagId
            });
          }
        }

        console.log('Notícia (e tags) cadastrada com sucesso!');
        break;
      }

      case '1':
      case '2': {
        console.log(`\n--- TODAS AS NOTÍCIAS (${opcao === '1' ? 'Mais Recentes' : 'Mais Antigas'}) ---`);
        const ordem = opcao === '1' ? desc(noticia.data_criacao) : asc(noticia.data_criacao);

        const noticias = await db.select({
          titulo: noticia.titulo,
          data: noticia.data_criacao,
          cidade: cidade.nome,
          uf: uf.sigla
        })
        .from(noticia)
        .innerJoin(cidade, eq(noticia.cidade_id, cidade.id))
        .innerJoin(uf, eq(cidade.uf_id, uf.id))
        .orderBy(ordem);

        if (noticias.length === 0) console.log('Nenhuma notícia encontrada.');
        noticias.forEach(n => console.log(`\n[${n.data}] ${n.titulo}\n ${n.cidade}/${n.uf}`));

        await aguardarVoltar();
        break;
      }

      case '3': {
        console.log('\n--- NOTÍCIAS POR ESTADO ---');
        const ufs = await db.select().from(uf);
        if (ufs.length === 0) {
          console.log('Nenhum estado cadastrado.');
          break;
        }

        console.log('Estados disponíveis:');
        ufs.forEach(estado => console.log(`[${estado.id}] ${estado.sigla} - ${estado.nome}`));
        
        const ufIdStr = await rl.question('\nDigite o ID do estado desejado: ');
        const ufId = parseInt(ufIdStr);

        const ordemOpcao = await rl.question('\n(a) Ordenar por mais recentes\n(b) Ordenar por mais antigas\n> ');
        if (ordemOpcao.toLowerCase() !== 'a' && ordemOpcao.toLowerCase() !== 'b') {
            console.log('Opção de ordenação inválida.');
            break;
        }

        const ordem = ordemOpcao.toLowerCase() === 'a' ? desc(noticia.data_criacao) : asc(noticia.data_criacao);

        const noticiasFiltradas = await db.select({
            titulo: noticia.titulo,
            data: noticia.data_criacao,
            cidade: cidade.nome
        })
        .from(noticia)
        .innerJoin(cidade, eq(noticia.cidade_id, cidade.id))
        .where(eq(cidade.uf_id, ufId))
        .orderBy(ordem);

        if (noticiasFiltradas.length === 0) {
            console.log('\nNenhuma notícia para este estado.');
        } else {
            console.log('\nResultados:');
            noticiasFiltradas.forEach(n => console.log(`[${n.data}] ${n.titulo} - ${n.cidade}`));
        }

        await aguardarVoltar();
        break;
      }

      case '4': {
        console.log('\n--- LISTA AGRUPADA POR ESTADOS ---');
        
        const resultados = await db.select({
          noticiaId: noticia.id,
          titulo: noticia.titulo,
          texto: noticia.texto,
          cidade: cidade.nome,
          ufSigla: uf.sigla
        })
        .from(noticia)
        .innerJoin(cidade, eq(noticia.cidade_id, cidade.id))
        .innerJoin(uf, eq(cidade.uf_id, uf.id))
        .orderBy(asc(uf.sigla), desc(noticia.data_criacao));

        if (resultados.length === 0) {
          console.log('Nenhuma notícia cadastrada.');
          await aguardarVoltar();
          break;
        }

        let ufAtual = '';
        let contador = 1;
        const mapaNoticias = new Map();

        resultados.forEach(linha => {
          if (linha.ufSigla !== ufAtual) {
            console.log(`\n# ${linha.ufSigla}`);
            ufAtual = linha.ufSigla;
          }
          console.log(`${contador} - ${linha.titulo} - ${linha.cidade}`);
          mapaNoticias.set(contador.toString(), linha);
          contador++;
        });

        while (true) {
          const acao = await rl.question('\n(d) Detalhar notícia\n(z) Voltar\n> ');
          if (acao.toLowerCase() === 'z') {
            break;
          } else if (acao.toLowerCase() === 'd') {
            const numeroStr = await rl.question('Informe o número da notícia: ');
            const detalhe = mapaNoticias.get(numeroStr);
            
            if (detalhe) {
              console.log(`\nTítulo: ${detalhe.titulo}\nTexto: ${detalhe.texto}`);
              
              // Busca as tags vinculadas cruzando a tabela associativa com a de tags
              const tagsDaNoticia = await db.select({ nome: tag.nome })
                .from(noticia_tag)
                .innerJoin(tag, eq(noticia_tag.tag_id, tag.id))
                .where(eq(noticia_tag.noticia_id, detalhe.noticiaId));
                
              if (tagsDaNoticia.length > 0) {
                const nomesTags = tagsDaNoticia.map(t => `#${t.nome}`).join(' ');
                console.log(`Tags: ${nomesTags}`);
              }
            } else {
              console.log('Número de notícia inválido.');
            }
          } else {
            console.log('Opção inválida.');
          }
        }
        break;
      }

      case '5': {
        console.log('\n--- CADASTRAR UF ---');
        const nomeUF = await rl.question('Nome do Estado: ');
        const siglaUF = await rl.question('Sigla do Estado (ex: DF, SP): ');

        await db.insert(uf).values({ nome: nomeUF, sigla: siglaUF.toUpperCase() });
        console.log('Estado cadastrado com sucesso!');
        break;
      }

      case '6': {
        console.log('\n--- CADASTRAR CIDADE ---');
        const nomeCidade = await rl.question('Nome da Cidade: ');

        const ufs = await db.select().from(uf);
        if (ufs.length === 0) {
          console.log('Nenhuma UF cadastrada. Cadastre uma UF (Opção 5) primeiro.');
          break;
        }

        console.log('\nEstados disponíveis:');
        ufs.forEach(estado => console.log(`[${estado.id}] ${estado.sigla} - ${estado.nome}`));
        
        const ufIdStr = await rl.question('Digite o ID do estado ao qual a cidade pertence: ');
        
        await db.insert(cidade).values({ nome: nomeCidade, uf_id: parseInt(ufIdStr) });
        console.log('Cidade cadastrada com sucesso!');
        break;
      }

      case '7':
        console.log('Saindo do programa...');
        rl.close();
        process.exit(0);

      default:
        console.log('Opção inválida. Tente novamente.');
        break;
    }
  }
}

exibirMenu();