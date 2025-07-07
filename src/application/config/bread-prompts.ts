// bread-prompts.ts
// Mapeia tipos de "bread" para seus prompts. Permite fácil extensão para novos tipos.

import { BreadType } from '../../domain/enums/bread-type.enum.js';

export const breadPrompts: Record<string, string> = {
  [BreadType.DEVOTIONAL]: `

Responda sempre em português do Brasil.

Escolha um versículo da Bíblia que transmita um ensinamento, uma reflexão, uma lei ou um chamado — ou seja, que não seja apenas um trecho preso ao contexto histórico, mas que contenha um princípio atemporal, útil para orientação prática e espiritual profunda.

A resposta deve estar exatamente no seguinte formato markdown. Exemplo de estrutura do campo text em markdown:

# 🙏 Título do Devocional

## Hebreus 12:1-2

> Portanto, também nós, visto que estamos rodeados de tão grande nuvem de testemunhas, deixemos todo o peso e o pecado que tenazmente nos assedia, e corramos com perseverança a corrida que nos está proposta, olhando para Jesus, autor e consumador da fé, o qual, pelo gozo que lhe estava proposto, suportou a cruz, desprezando a vergonha, e assentou-se à direita do trono de Deus.

**Resumo:**  
Neste versículo, somos convidados a reconhecer a iminente corrida da vida cristã, onde a perseverança é essencial. A "nuvem de testemunhas" nos inspira e nos fortalece, lembrando que não estamos sozinhos na nossa jornada de fé...

### Reflexão Devocional

- A vida cristã é frequentemente comparada a uma corrida...
- Tentar viver a vida em nossa própria força...
- Olhando para Jesus — o "autor e consumador da fé"...
- A disposição de Jesus em suportar a cruz...
- À medida que avançamos em nossa jornada...

### Oração

Senhor Deus, te louvo pela grandeza do Teu plano em minha vida.  
Que eu possa sempre olhar para Jesus, encontrando Nele a força necessária para continuar...

A reflexão devocional deve ser profunda, com foco em missão, transformação de vida, obediência e chamado. Evite superficialidade ou mensagens genéricas de conforto. Evite enviar a mesma resposta. Tente ser original e relevante para o dia de hoje.

Apenas responda com o markdown. Não adicione comentários nem explicações fora do markdown.
`,
  [BreadType.STUDY]: `

Responda sempre em português do Brasil.

Escreva um conteúdo no formato de uma newsletter cristã diária, utilizando a linguagem Markdown.

O conteúdo deve conter os seguintes blocos, cada um com seu título destacado (use títulos markdown, como #, ##, ###), emojis moderados e organização visual agradável:

# 🙏 Estudo bíblico

Escolha um versículo significativo (preferencialmente na versão Almeida Revista e Atualizada). Explique seu contexto e como ele pode ser aplicado na vida prática.
➤ Traga versículos variados a cada edição, incluindo trechos menos populares da Bíblia, de diferentes livros (Antigo e Novo Testamento), evitando repetições frequentes.

## 🙏 Reflexão Devocional

Um pequeno devocional baseado no versículo do dia, com aplicação prática para a vida cristã.
➤ Cada reflexão deve ser única, trazendo novas formas de aplicar a Palavra, mesmo quando o tema parecer familiar.

## 📖 Conhecimento Bíblico

Compartilhe uma curiosidade, explicação ou detalhe sobre algum personagem, lugar, evento ou conceito da Bíblia.
➤ Evite repetir os mesmos personagens ou fatos em edições próximas. Dê preferência a conteúdos menos explorados, oferecendo ângulos novos até sobre personagens conhecidos.

## ⛪ História do Cristianismo

Traga um fato marcante da história da Igreja Cristã, de qualquer época ou região.
➤ Varie entre períodos (igreja primitiva, Idade Média, Reforma, século XX…), locais (Oriente, Ocidente, África, Américas) e temas (pessoas, concílios, missões, perseguições, avivamentos). Não se limite a uma vertente ou tradição específica.

## 📜 A Lei de Deus

Apresente um princípio da Lei de Deus ou um mandamento, e mostre sua relevância à luz da graça e da obra de Cristo.
➤ Alterne entre os Dez Mandamentos, princípios espirituais da Torá, ética de Jesus nos Evangelhos, e ensinamentos das cartas do Novo Testamento. Mantenha o foco na transformação do coração.

## 🙌 Dica de Oração

Sugira um tema ou direção para a oração do dia. Pode estar relacionado ao conteúdo anterior ou a uma necessidade espiritual pessoal ou coletiva.
➤ Varie os temas ao longo dos dias (ex: gratidão, arrependimento, intercessão, cura, sabedoria, perseverança).

---

**Formato da resposta:**

O conteúdo deve ser entregue inteiramente em Markdown, com cada bloco bem separado e titulado conforme acima. Não adicione comentários, explicações ou qualquer texto fora do markdown.

**Exemplo de estrutura:**

# 🙏 Estudo bíblico
...texto...

## 🙏 Reflexão Devocional
...texto...

## 📖 Conhecimento Bíblico
...texto...

## ⛪ História do Cristianismo
...texto...

## 📜 A Lei de Deus
...texto...

## 🙌 Dica de Oração
...texto...
`,
  [BreadType.CHARACTER_FACT]: `

Responda sempre em português do Brasil.

Gere um fato, curiosidade ou informação interessante sobre um personagem bíblico, de qualquer parte da Bíblia (Antigo ou Novo Testamento). Varie ao máximo os personagens, incluindo tanto figuras muito conhecidas quanto personagens menos populares, para garantir diversidade e surpresa a cada dia.

Regras:
- O personagem pode ser homem, mulher, criança, rei, profeta, discípulo, apóstolo, servo, inimigo, estrangeiro, etc.
- Não repita o mesmo personagem em dias próximos.
- O fato deve ser relevante, curioso ou pouco conhecido, mas sempre fiel ao texto bíblico.
- Inclua o nome do personagem, referência bíblica e um breve contexto.
- Se possível, relacione o fato com uma lição prática ou espiritual.

Formato da resposta (em Markdown):

# 👤 Aprendendo com Nome do Personagem

**📖 Referência (Livro, capítulo e versículo(s))**

*Mostrar o versiculo*

**✨ Fato:**

Breve descrição do fato ou curiosidade.

**📝 Contexto:**

Breve explicação do contexto bíblico.

**💡 Lição:**

Aplicação prática ou espiritual.

Apenas responda com o markdown, sem comentários ou explicações fora do formato.
`,
};

export function getBreadPrompt(type: string): string {
  const prompt = breadPrompts[type];
  if (!prompt) throw new Error(`Prompt não encontrado para o tipo: ${type}`);
  return prompt;
}
