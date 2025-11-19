
import { Goal } from '../types';
import type { QuizData, WorkoutPlan, MealPlan } from '../types';

// --- Mock Data ---

const weightLossWorkoutPlan: WorkoutPlan = {
    monday: [
        { 
            name: 'Polichinelos', 
            sets: '3', 
            reps: '45 seg', 
            description: 'Aquecimento cardiovascular.',
            detailedInstructions: [
                "Fique em pé com as pernas juntas e os braços ao lado do corpo.",
                "Dê um pequeno salto, afastando as pernas além da largura dos ombros.",
                "Ao mesmo tempo, levante os braços acima da cabeça até que as mãos quase se toquem.",
                "Salte novamente para voltar à posição inicial, fechando as pernas e abaixando os braços.",
                "Mantenha um ritmo constante."
            ]
        },
        { 
            name: 'Agachamento Livre', 
            sets: '4', 
            reps: '15', 
            description: 'Mantenha a postura e desça o máximo que conseguir.',
            detailedInstructions: [
                "Fique em pé, com os pés afastados na largura dos ombros.",
                "Estenda os braços à frente para equilíbrio.",
                "Flexione os joelhos e empurre o quadril para trás, como se fosse sentar em uma cadeira.",
                "Mantenha as costas retas e o peito aberto. Desça até que as coxas fiquem paralelas ao chão.",
                "Empurre o chão com os calcanhares para voltar à posição inicial."
            ]
        },
        { 
            name: 'Flexão de Braço', 
            sets: '3', 
            reps: 'Até a falha', 
            description: 'Pode ser feito com joelhos no chão para facilitar.',
            detailedInstructions: [
                "Deite-se de barriga para baixo e apoie as mãos no chão, afastadas um pouco além da largura dos ombros.",
                "Estenda as pernas (ou apoie os joelhos se for iniciante) mantendo o corpo reto.",
                "Flexione os cotovelos para descer o peito em direção ao chão.",
                "Empurre o chão para voltar à posição inicial, estendendo os braços.",
                "Mantenha o abdômen contraído durante todo o movimento."
            ]
        },
        { 
            name: 'Prancha Frontal', 
            sets: '3', 
            reps: '30-60 seg', 
            description: 'Mantenha o abdômen contraído.',
            detailedInstructions: [
                "Deite-se de barriga para baixo e apoie os antebraços no chão.",
                "Eleve o corpo, apoiando-se apenas nos antebraços e nas pontas dos pés.",
                "Mantenha o corpo em linha reta da cabeça aos calcanhares.",
                "Contraia forte o abdômen e os glúteos para não deixar o quadril cair.",
                "Respire normalmente enquanto segura a posição."
            ]
        },
        { 
            name: 'Elevação de Joelhos', 
            sets: '3', 
            reps: '45 seg', 
            description: 'Corra no lugar elevando bem os joelhos.',
            detailedInstructions: [
                "Fique em pé com a coluna reta.",
                "Simule uma corrida no lugar, mas eleve os joelhos o mais alto que conseguir, preferencialmente até a altura do quadril.",
                "Mova os braços alternadamente (braço direito com perna esquerda e vice-versa).",
                "Aterrisse suavemente na ponta dos pés."
            ]
        },
        { 
            name: 'Afundo Alternado', 
            sets: '3', 
            reps: '12 por perna', 
            description: 'Dê um passo à frente e flexione os dois joelhos.',
            detailedInstructions: [
                "Fique em pé, pés juntos.",
                "Dê um passo grande para frente com uma perna.",
                "Flexione os dois joelhos até que o joelho de trás quase toque o chão (ambos devem formar ângulo de 90 graus).",
                "Empurre com o pé da frente para voltar à posição inicial.",
                "Repita com a outra perna."
            ]
        },
        { 
            name: 'Remada Curvada com Mochila', 
            sets: '3', 
            reps: '15', 
            description: 'Use uma mochila com livros ou garrafas PET como peso.',
            detailedInstructions: [
                "Segure a mochila com as duas mãos.",
                "Incline o tronco à frente (aprox. 45 graus), mantendo as costas retas e joelhos levemente flexionados.",
                "Puxe a mochila em direção ao abdômen, fechando as escápulas.",
                "Estenda os braços controlando a descida do peso.",
                "Não curve a coluna durante o movimento."
            ]
        },
        { 
            name: 'Abdominal Supra', 
            sets: '3', 
            reps: '20', 
            description: 'Deite-se e eleve o tronco, focando no abdômen.',
            detailedInstructions: [
                "Deite-se de costas com os joelhos flexionados e pés no chão.",
                "Coloque as mãos atrás da cabeça ou cruzadas no peito.",
                "Eleve a parte superior das costas do chão, contraindo o abdômen.",
                "Solte o ar ao subir e inspire ao descer.",
                "Não force o pescoço com as mãos."
            ]
        },
        { 
            name: 'Corrida Leve/Caminhada no Lugar', 
            sets: '1', 
            reps: '20 min', 
            description: 'Para finalizar, mantenha o movimento constante.',
            detailedInstructions: [
                "Realize uma caminhada ou trote leve sem sair do lugar.",
                "Mantenha uma respiração controlada.",
                "O objetivo é manter o corpo em movimento contínuo para queimar calorias extras."
            ]
        }
    ],
    tuesday: [
        { 
            name: 'Corrida Estacionária', 
            sets: '3', 
            reps: '45 seg', 
            description: 'Simule uma corrida sem sair do lugar.',
            detailedInstructions: [
                "Fique em pé e inicie um movimento de corrida sem sair do lugar.",
                "Eleve os calcanhares em direção aos glúteos.",
                "Mantenha um ritmo acelerado e use os braços para ganhar impulso."
            ]
        },
        { 
            name: 'Agachamento Sumô', 
            sets: '4', 
            reps: '15', 
            description: 'Pernas afastadas e pontas dos pés para fora.',
            detailedInstructions: [
                "Afaste as pernas mais que a largura dos ombros.",
                "Aponte os pés para fora (cerca de 45 graus).",
                "Mantenha o tronco reto e agache até as coxas ficarem paralelas ao chão.",
                "Concentre a força nos calcanhares e na parte interna da coxa para subir."
            ]
        },
        { 
            name: 'Flexão Inclinada', 
            sets: '3', 
            reps: '12', 
            description: 'Apoie as mãos em um sofá ou cadeira firme.',
            detailedInstructions: [
                "Apoie as mãos em uma superfície elevada (sofá, banco ou cadeira firme).",
                "Mantenha o corpo em linha reta (posição de prancha).",
                "Flexione os braços descendo o peito em direção ao apoio.",
                "Empurre para voltar à posição inicial."
            ]
        },
        { 
            name: 'Elevação Pélvica', 
            sets: '4', 
            reps: '20', 
            description: 'Deite-se de costas e eleve o quadril.',
            detailedInstructions: [
                "Deite-se de barriga para cima, joelhos dobrados e pés no chão.",
                "Mantenha os braços ao lado do corpo.",
                "Eleve o quadril o máximo que conseguir, contraindo os glúteos no topo.",
                "Desça devagar sem encostar o bumbum totalmente no chão antes da próxima repetição."
            ]
        },
        { 
            name: 'Prancha Lateral', 
            sets: '3', 
            reps: '30 seg por lado', 
            description: 'Trabalha os músculos oblíquos do abdômen.',
            detailedInstructions: [
                "Deite-se de lado apoiando o antebraço no chão.",
                "Coloque um pé sobre o outro ou um à frente do outro.",
                "Eleve o quadril do chão, formando uma linha reta da cabeça aos pés.",
                "Segure a posição mantendo o abdômen contraído.",
                "Repita do outro lado."
            ]
        },
        { 
            name: 'Afundo com Garrafas PET', 
            sets: '3', 
            reps: '12 por perna', 
            description: 'Segure garrafas d\'água para aumentar a intensidade.',
            detailedInstructions: [
                "Segure uma garrafa em cada mão ao lado do corpo.",
                "Realize o movimento de afundo: dê um passo à frente e flexione os joelhos.",
                "Mantenha o tronco ereto e o olhar para frente.",
                "Volte à posição inicial empurrando com a perna da frente."
            ]
        },
        { 
            name: 'Remada Unilateral com Garrafa', 
            sets: '3', 
            reps: '15', 
            description: 'Apoie em uma cadeira e puxe o peso caseiro.',
            detailedInstructions: [
                "Apoie o joelho e a mão esquerda em um banco ou cadeira.",
                "Segure a garrafa com a mão direita, braço estendido para baixo.",
                "Puxe a garrafa em direção à cintura, mantendo o cotovelo próximo ao corpo.",
                "Desça controlando o peso. Complete as repetições e troque o lado."
            ]
        },
        { 
            name: 'Abdominal Bicicleta', 
            sets: '3', 
            reps: '20 por lado', 
            description: 'Simule pedalar no ar, tocando o cotovelo no joelho oposto.',
            detailedInstructions: [
                "Deite-se de costas, mãos atrás da cabeça e pernas elevadas.",
                "Traga o joelho direito em direção ao peito e leve o cotovelo esquerdo de encontro a ele.",
                "Simultaneamente, estique a perna esquerda.",
                "Alterne o movimento (cotovelo direito no joelho esquerdo) continuamente, como se pedalasse."
            ]
        },
        { 
            name: 'Alongamento', 
            sets: '1', 
            reps: '10 min', 
            description: 'Foque nos principais grupos musculares.',
            detailedInstructions: [
                "Alongue o pescoço suavemente para os lados.",
                "Puxe o braço à frente do peito para alongar ombros.",
                "Tente tocar os pés com as pernas esticadas para posterior de coxa.",
                "Puxe o pé atrás para alongar o quadríceps.",
                "Respire fundo e relaxe."
            ]
        }
    ],
    wednesday: [
        { 
            name: 'Descanso Ativo', 
            sets: '-', 
            reps: '-', 
            description: 'Caminhada leve, ioga ou alongamento focado na mobilidade.',
            detailedInstructions: [
                "Realize uma atividade de baixa intensidade.",
                "Pode ser uma caminhada de 30 minutos no parque.",
                "Uma sessão de alongamento completo.",
                "O objetivo é movimentar o corpo sem gerar grande estresse muscular."
            ]
        },
    ],
    thursday: [
        { name: 'Agachamento com Salto', sets: '3', reps: '12', description: 'Exploda para cima em um salto a cada agachamento.', detailedInstructions: ["Faça um agachamento normal.", "Ao subir, use impulso para dar um salto vertical.", "Aterrisse suavemente já flexionando os joelhos para o próximo agachamento."] },
        { name: 'Flexão Diamante', sets: '3', reps: 'Até a falha', description: 'Mãos juntas formando um diamante, foca no tríceps.', detailedInstructions: ["Posição de flexão, mas junte as mãos (indicadores e polegares se tocando) sob o peito.", "Desça o peito em direção às mãos.", "Empurre para subir. Se for difícil, apoie os joelhos."] },
        { name: 'Superman', sets: '3', reps: '15', description: 'Deite de bruços e eleve braços e pernas simultaneamente.', detailedInstructions: ["Deite-se de barriga para baixo, braços esticados à frente.", "Eleve simultaneamente braços, peito e pernas do chão.", "Segure por 1 segundo e desça devagar."] },
        { name: 'Abdominal Remador', sets: '3', reps: '15', description: 'Estique o corpo e depois abrace os joelhos.', detailedInstructions: ["Deite-se totalmente esticado no chão.", "Em um movimento único, sente-se e traga os joelhos ao peito, abraçando-os.", "Volte a esticar o corpo todo sem tocar os pés no chão (se conseguir)."] },
        { name: 'Burpees Adaptados', sets: '3', reps: '10', description: 'Flexão, agachamento e salto (faça devagar se necessário).', detailedInstructions: ["Fique em pé.", "Agache e coloque as mãos no chão.", "Jogue os pés para trás (posição de prancha).", "Faça uma flexão (opcional).", "Traga os pés para frente e levante-se (ou salte)."] },
        { name: 'Elevação Pélvica Unilateral', sets: '3', reps: '15 por lado', description: 'Apoie uma perna e eleve o quadril.', detailedInstructions: ["Posição de elevação pélvica.", "Estique uma perna para o alto.", "Empurre o chão com o calcanhar da outra perna para elevar o quadril.", "Troque o lado após terminar as repetições."] },
        { name: 'Desenvolvimento com Garrafas PET', sets: '3', reps: '12', description: 'Eleve as garrafas acima da cabeça.', detailedInstructions: ["Sentado ou em pé, segure uma garrafa em cada mão na altura dos ombros.", "Empurre as garrafas para cima até esticar os braços.", "Desça controlando até a altura das orelhas/ombros."] },
        { name: 'Bicicleta no Ar', sets: '3', reps: '20 por lado', description: 'Simule pedalar no ar.', detailedInstructions: ["Deite de costas e eleve as pernas.", "Faça movimentos circulares com as pernas como se pedalasse uma bicicleta.", "Mantenha o abdômen contraído para estabilizar a lombar."] },
        { name: 'Polichinelos', sets: '3', reps: '1 min', description: 'Mantenha o ritmo intenso.', detailedInstructions: ["Realize polichinelos clássicos.", "Tente manter um ritmo mais rápido que no aquecimento.", "Foque na respiração."] }
    ],
    friday: [
        { name: 'Afundo com Salto', sets: '3', reps: '10 por perna', description: 'Alterne as pernas com um salto leve.', detailedInstructions: ["Faça um afundo.", "Ao subir, dê um salto e troque as pernas no ar.", "Aterrisse já descendo para o afundo com a outra perna à frente."] },
        { name: 'Prancha com Toque no Ombro', sets: '3', reps: '20 toques', description: 'Na posição de prancha, toque no ombro oposto.', detailedInstructions: ["Posição de prancha alta (braços esticados).", "Tire uma mão do chão e toque o ombro oposto.", "Tente não girar o quadril. Alterne os lados."] },
        { name: 'Montanhista (Mountain Climber)', sets: '3', reps: '45 seg', description: 'Puxe os joelhos em direção ao peito alternadamente no chão.', detailedInstructions: ["Posição de prancha alta.", "Traga um joelho em direção ao peito.", "Volte e traga o outro, alternando rapidamente como se corresse no chão."] },
        { name: 'Skipping Alto', sets: '3', reps: '45 seg', description: 'Corrida no lugar com elevação máxima dos joelhos.', detailedInstructions: ["Corra no lugar.", "Foque em elevar os joelhos até a altura da cintura.", "Use os braços para dar ritmo."] },
        { name: 'Agachamento Isométrico na Parede', sets: '3', reps: '30-45 seg', description: 'Sente-se no "ar" encostado na parede.', detailedInstructions: ["Encoste as costas na parede.", "Deslize para baixo até os joelhos formarem 90 graus.", "Segure a posição estático, sem apoiar as mãos nas pernas."] },
        { name: 'Abdominal Infra', sets: '3', reps: '15', description: 'Deitado, eleve as pernas esticadas.', detailedInstructions: ["Deite-se de costas, mãos sob o quadril para apoio.", "Mantenha as pernas esticadas e juntas.", "Eleve as pernas até ficarem verticais.", "Desça devagar sem tocar o chão."] },
        { name: 'Flexão Aranha', sets: '3', reps: '10 por lado', description: 'Ao descer na flexão, traga o joelho para o cotovelo.', detailedInstructions: ["Posição de flexão.", "Ao descer o corpo, traga o joelho direito em direção ao cotovelo direito.", "Volte a perna ao subir. Alterne os lados."] },
        { name: 'Polichinelo Frontal', sets: '3', reps: '45 seg', description: 'Mova os braços para frente e para trás.', detailedInstructions: ["Semelhante ao polichinelo, mas as pernas vão para frente/trás (tesoura).", "Os braços também oscilam para frente e para cima alternadamente."] },
        { name: 'Caminhada Rápida (Lugar)', sets: '1', reps: '15 min', description: 'Para desacelerar o ritmo cardíaco.', detailedInstructions: ["Caminhe no lugar reduzindo gradualmente a velocidade.", "Respire profundamente para recuperar."] }
    ],
    saturday: [
        { name: 'Descanso', sets: '-', reps: '-', description: 'Recupere as energias.', detailedInstructions: ["Dia livre de treinos.", "Mantenha a alimentação saudável e a hidratação."] },
    ],
    sunday: [
        { name: 'Descanso', sets: '-', reps: '-', description: 'Recupere as energias.', detailedInstructions: ["Dia livre de treinos.", "Prepare-se mentalmente para a próxima semana."] },
    ]
};

const weightLossMealPlan: MealPlan = {
    monday: [
        { name: 'Café da Manhã', description: 'Ovos mexidos com 1 fatia de pão integral.', calories: 300 },
        { name: 'Almoço', description: '100g de filé de frango grelhado, salada de folhas à vontade e 2 colheres de arroz integral.', calories: 450 },
        { name: 'Lanche', description: '1 iogurte natural com 1 colher de aveia.', calories: 150 },
        { name: 'Jantar', description: 'Sopa de legumes com pedaços de frango.', calories: 350 }
    ],
    tuesday: [
        { name: 'Café da Manhã', description: 'Vitamina de banana com 1 scoop de whey protein (opcional) ou 2 ovos.', calories: 280 },
        { name: 'Almoço', description: '1 posta de tilápia assada com brócolis no vapor.', calories: 400 },
        { name: 'Lanche', description: '1 maçã e um punhado de castanhas.', calories: 200 },
        { name: 'Jantar', description: 'Omelete com 2 ovos, queijo branco e tomate.', calories: 300 }
    ],
    wednesday: [
        { name: 'Café da Manhã', description: 'Ovos mexidos com 1 fatia de pão integral.', calories: 300 },
        { name: 'Almoço', description: '100g de filé de frango grelhado, salada de folhas à vontade e 2 colheres de arroz integral.', calories: 450 },
        { name: 'Lanche', description: '1 iogurte natural com 1 colher de aveia.', calories: 150 },
        { name: 'Jantar', description: 'Sopa de legumes com pedaços de frango.', calories: 350 }
    ],
    thursday: [
        { name: 'Café da Manhã', description: 'Vitamina de banana com leite desnatado.', calories: 280 },
        { name: 'Almoço', description: '1 posta de tilápia assada com brócolis no vapor.', calories: 400 },
        { name: 'Lanche', description: '1 maçã e um punhado de castanhas.', calories: 200 },
        { name: 'Jantar', description: 'Omelete com 2 ovos, queijo branco e tomate.', calories: 300 }
    ],
    friday: [
        { name: 'Café da Manhã', description: 'Ovos mexidos com 1 fatia de pão integral.', calories: 300 },
        { name: 'Almoço', description: '100g de filé de frango grelhado, salada de folhas à vontade e 2 colheres de arroz integral.', calories: 450 },
        { name: 'Lanche', description: '1 iogurte natural com 1 colher de aveia.', calories: 150 },
        { name: 'Jantar', description: 'Sopa de legumes com pedaços de frango.', calories: 350 }
    ],
    saturday: [
        { name: 'Café da Manhã', description: 'Vitamina de banana com aveia.', calories: 280 },
        { name: 'Almoço', description: 'Refeição livre, com moderação.', calories: 700 },
        { name: 'Lanche', description: '1 maçã.', calories: 100 },
        { name: 'Jantar', description: 'Omelete com 2 ovos, queijo branco e tomate.', calories: 300 }
    ],
    sunday: [
        { name: 'Café da Manhã', description: 'Ovos mexidos com 1 fatia de pão integral.', calories: 300 },
        { name: 'Almoço', description: 'Refeição livre, com moderação.', calories: 700 },
        { name: 'Lanche', description: '1 iogurte natural.', calories: 120 },
        { name: 'Jantar', description: 'Sopa de legumes.', calories: 300 }
    ],
};

const muscleGainWorkoutPlan: WorkoutPlan = {
    monday: [ // Peito e Tríceps
        { name: 'Flexão de Braço', sets: '4', reps: 'Até a falha', description: 'Pegada na largura dos ombros. Foco na contração do peitoral.', detailedInstructions: ["Deite-se de frente, apoie as mãos na largura dos ombros.", "Desça o corpo reto até o peito quase tocar o chão.", "Empurre para subir."] },
        { name: 'Flexão Inclinada', sets: '4', reps: '12-15', description: 'Mãos apoiadas em um sofá ou cadeira firme para focar na parte inferior do peito.', detailedInstructions: ["Apoie as mãos em uma superfície elevada.", "Mantenha o corpo reto.", "Faça o movimento de flexão."] },
        { name: 'Flexão Declinada', sets: '3', reps: 'Até a falha', description: 'Pés apoiados em um sofá para focar na parte superior do peito.', detailedInstructions: ["Apoie os pés em uma superfície elevada (sofá).", "Mãos no chão.", "Desça o peito em direção ao chão."] },
        { name: 'Flexão Diamante', sets: '3', reps: 'Até a falha', description: 'Mãos juntas abaixo do peito para focar no tríceps.', detailedInstructions: ["Posição de flexão, mãos unidas formando um triângulo.", "Mantenha cotovelos próximos ao corpo.", "Desça e suba."] },
        { name: 'Mergulho no Banco', sets: '4', reps: '15', description: 'Use uma cadeira firme. Mantenha o corpo perto do apoio.', detailedInstructions: ["Sente-se na beira de uma cadeira firme, mãos ao lado do quadril.", "Deslize o quadril para fora, apoiando o peso nas mãos.", "Flexione os cotovelos descendo o quadril.", "Empurre para subir."] },
        { name: 'Crucifixo no Chão com Garrafas', sets: '3', reps: '15', description: 'Use garrafas de água ou amaciante. Não deixe os cotovelos tocarem o chão.', detailedInstructions: ["Deite-se de costas, segurando uma garrafa em cada mão acima do peito.", "Abra os braços levemente flexionados até quase tocar o chão.", "Feche os braços voltando à posição inicial."] },
        { name: 'Extensão de Tríceps com Garrafa', sets: '3', reps: '15', description: 'Deitado, com uma garrafa cheia, estenda os braços acima da cabeça.', detailedInstructions: ["Deite-se, segure a garrafa com as duas mãos acima da cabeça.", "Flexione apenas os cotovelos levando a garrafa em direção à testa.", "Estenda os braços novamente."] },
        { name: 'Flexão Isométrica', sets: '3', reps: '30 seg', description: 'Segure na metade do movimento da flexão.', detailedInstructions: ["Desça na posição de flexão e pare na metade do caminho.", "Segure a posição imóvel pelo tempo determinado."] },
        { name: 'Alongamento Peitoral', sets: '1', reps: '30 seg', description: 'Alongue os músculos trabalhados na parede.', detailedInstructions: ["Apoie o antebraço na parede ou batente da porta.", "Gire o corpo para o lado oposto até sentir alongar o peito."] }
    ],
    tuesday: [ // Costas e Bíceps
        { name: 'Remada Curvada com Mochila', sets: '4', reps: '12', description: 'Encha uma mochila com livros/alimentos para criar peso.', detailedInstructions: ["Segure a mochila, incline o tronco.", "Puxe a mochila para o abdômen.", "Retorne devagar."] },
        { name: 'Remada Unilateral (Serrote)', sets: '4', reps: '12 por lado', description: 'Apoie uma mão no sofá e puxe a mochila com a outra.', detailedInstructions: ["Apoie mão e joelho opostos no banco/sofá.", "Costas retas.", "Puxe a carga lateralmente até a cintura."] },
        { name: 'Superman com Isometria', sets: '3', reps: '15', description: 'Deitado de barriga, eleve peito e pernas. Segure por 2s.', detailedInstructions: ["Deite de bruços.", "Eleve braços e pernas simultaneamente.", "Segure no alto e desça."] },
        { name: 'Puxada com Toalha (Isométrico)', sets: '3', reps: '30 seg', description: 'Deitado de barriga, segure uma toalha e puxe as pontas para fora e para o peito.', detailedInstructions: ["Deite de bruços, segure uma toalha à frente.", "Eleve o peito.", "Puxe a toalha em direção ao peito fazendo força para 'rasgar' a toalha para fora."] },
        { name: 'Rosca Direta com Mochila', sets: '4', reps: '15', description: 'Segure a mochila pelas alças. Movimento controlado.', detailedInstructions: ["Fique em pé, segure a mochila à frente.", "Flexione os cotovelos trazendo a carga para o ombro.", "Desça devagar."] },
        { name: 'Rosca Martelo com Garrafas', sets: '3', reps: '15', description: 'Pegada neutra (palmas para dentro), usando garrafas.', detailedInstructions: ["Em pé, garrafas ao lado do corpo, palmas viradas para a coxa.", "Eleve as garrafas mantendo a palma virada para dentro."] },
        { name: 'Rosca Concentrada', sets: '3', reps: '12 por lado', description: 'Sentado, apoie o cotovelo na parte interna do joelho, usando garrafa/saco de arroz.', detailedInstructions: ["Sente-se, pernas afastadas.", "Apoie o cotovelo na parte interna da coxa.", "Faça o movimento de rosca focando no bíceps."] },
        { name: 'Elevação Pélvica', sets: '3', reps: '20', description: 'Fortalece a lombar e glúteos, que auxiliam a postura.', detailedInstructions: ["Deite-se, joelhos dobrados.", "Eleve o quadril contraindo glúteos."] },
        { name: 'Prancha Frontal', sets: '3', reps: '1 min', description: 'Fortalece o core.', detailedInstructions: ["Apoie antebraços e pontas dos pés.", "Mantenha corpo reto e abdômen travado."] }
    ],
    wednesday: [ // Descanso
        { name: 'Descanso', sets: '-', reps: '-', description: 'Recupere as energias, foque na hidratação e alimentação.', detailedInstructions: ["Dia de recuperação."] },
    ],
    thursday: [ // Pernas
        { name: 'Agachamento Livre', sets: '5', reps: '15', description: 'Foco na amplitude e movimento controlado.', detailedInstructions: ["Pés na largura dos ombros.", "Agache jogando quadril para trás.", "Mantenha postura."] },
        { name: 'Afundo (Passada)', sets: '4', reps: '12 por perna', description: 'Segure garrafas nas mãos para maior intensidade.', detailedInstructions: ["Passo à frente.", "Desça o joelho de trás rumo ao chão.", "Volte."] },
        { name: 'Agachamento Búlgaro', sets: '3', reps: '12 por perna', description: 'Apoie o peito de um pé em um sofá/cadeira e agache.', detailedInstructions: ["Pé de trás apoiado elevado.", "Pé da frente no chão.", "Agache com a perna da frente."] },
        { name: 'Elevação Pélvica Unilateral', sets: '3', reps: '15 por perna', description: 'Deitado, uma perna no chão, outra para o alto. Eleve o quadril.', detailedInstructions: ["Deitado, uma perna esticada para o alto.", "Suba o quadril empurrando com a outra perna."] },
        { name: 'Stiff com Mochila', sets: '4', reps: '15', description: 'Segure a mochila pesada. Mantenha pernas semi-flexionadas e desça o tronco reto.', detailedInstructions: ["Segure a carga à frente.", "Joelhos levemente destravados.", "Desça o tronco reto levando o quadril para trás."] },
        { name: 'Agachamento Sumô com Mochila', sets: '4', reps: '15', description: 'Segure a mochila entre as pernas. Pés afastados.', detailedInstructions: ["Pés bem afastados, pontas para fora.", "Segure a carga no centro.", "Agache profundo."] },
        { name: 'Panturrilha em Pé', sets: '5', reps: '20', description: 'Faça em um degrau da casa para maior amplitude.', detailedInstructions: ["Pontas dos pés em um degrau.", "Desça o calcanhar máximo possível.", "Suba na ponta dos pés."] },
        { name: 'Agachamento com Salto', sets: '3', reps: '12', description: 'Adiciona potência.', detailedInstructions: ["Agache e salte explosivamente na subida."] },
        { name: 'Cadeira Isométrica na Parede', sets: '3', reps: 'Até a falha', description: 'Encoste na parede e segure na posição de 90 graus.', detailedInstructions: ["Costas na parede, pernas em 90 graus.", "Segure imóvel."] }
    ],
    friday: [ // Ombros e Abdômen
        { name: 'Pike Push-up (Flexão Pica-pau)', sets: '4', reps: 'Até a falha', description: 'Eleve o quadril formando um V invertido e desça a cabeça ao chão.', detailedInstructions: ["Mãos no chão, quadril alto (corpo em V).", "Desça a cabeça em direção ao chão flexionando braços.", "Empurre de volta."] },
        { name: 'Desenvolvimento com Garrafas/Mochila', sets: '4', reps: '15', description: 'Sentado ou em pé, empurre o peso acima da cabeça.', detailedInstructions: ["Pesos na altura do ombro.", "Empurre para cima até esticar braços.", "Desça controlado."] },
        { name: 'Elevação Lateral com Garrafas', sets: '4', reps: '15', description: 'Com garrafas de 500ml/1L, eleve os braços lateralmente.', detailedInstructions: ["Em pé, braços ao lado.", "Eleve lateralmente até altura do ombro.", "Desça devagar."] },
        { name: 'Elevação Frontal com Mochila', sets: '3', reps: '12', description: 'Segure a mochila e eleve à frente do corpo.', detailedInstructions: ["Segure a carga à frente da coxa.", "Eleve braços esticados até altura do ombro.", "Desça."] },
        { name: 'Remada Alta com Mochila', sets: '3', reps: '15', description: 'Puxe a mochila até a altura do queixo, cotovelos para o alto.', detailedInstructions: ["Segure carga na frente do quadril.", "Puxe rente ao corpo até o peito, cotovelos apontando para cima."] },
        { name: 'Prancha com elevação de braço', sets: '3', reps: '10 por lado', description: 'Na prancha, estenda um braço à frente.', detailedInstructions: ["Posição de prancha.", "Estique um braço à frente sem girar o tronco.", "Alterne."] },
        { name: 'Abdominal Remador', sets: '4', reps: '20', description: 'Movimento completo, trabalhando todo o abdômen.', detailedInstructions: ["Deitado esticado.", "Suba tronco e pernas abraçando joelhos.", "Estique novamente."] },
        { name: 'Elevação de Pernas Deitado', sets: '4', reps: '15', description: 'Foco na parte inferior do abdômen.', detailedInstructions: ["Deitado, mãos sob o glúteo.", "Eleve pernas esticadas.", "Desça sem tocar o chão."] },
        { name: 'Torção Russa (Russian Twist)', sets: '3', reps: '20 por lado', description: 'Sentado, segure um peso e gire o tronco de um lado para o outro.', detailedInstructions: ["Sentado, incline tronco levemente para trás.", "Gire o tronco levando o peso de um lado ao outro do quadril."] }
    ],
    saturday: [
        { name: 'Descanso', sets: '-', reps: '-', description: 'Recupere as energias.', detailedInstructions: ["Descanso total."] },
    ],
    sunday: [
        { name: 'Descanso', sets: '-', reps: '-', description: 'Recupere as energias.', detailedInstructions: ["Descanso total."] },
    ]
};

const muscleGainMealPlan: MealPlan = {
    monday: [
        { name: 'Café da Manhã', description: '4 ovos mexidos, 2 fatias de pão integral e 1 banana.', calories: 500 },
        { name: 'Almoço', description: '150g de patinho moído, 150g de batata doce e salada.', calories: 600 },
        { name: 'Lanche', description: 'Vitamina com leite, aveia e 1 banana.', calories: 450 },
        { name: 'Jantar', description: '150g de filé de frango, 100g de arroz branco e brócolis.', calories: 550 }
    ],
    tuesday: [
        { name: 'Café da Manhã', description: 'Panqueca de aveia com 3 ovos, aveia e mel.', calories: 480 },
        { name: 'Almoço', description: '150g de tilápia, 150g de mandioquinha e salada.', calories: 550 },
        { name: 'Lanche', description: 'Iogurte natural com granola e frutas.', calories: 400 },
        { name: 'Jantar', description: '150g de carne vermelha magra, 100g de arroz e legumes.', calories: 600 }
    ],
    wednesday: [
        { name: 'Café da Manhã', description: '4 ovos mexidos, 2 fatias de pão integral e 1 banana.', calories: 500 },
        { name: 'Almoço', description: '150g de patinho moído, 150g de batata doce e salada.', calories: 600 },
        { name: 'Lanche', description: 'Vitamina com leite, aveia e 1 banana.', calories: 450 },
        { name: 'Jantar', description: '150g de filé de frango, 100g de arroz branco e brócolis.', calories: 550 }
    ],
    thursday: [
        { name: 'Café da Manhã', description: 'Panqueca de aveia com 3 ovos, aveia e mel.', calories: 480 },
        { name: 'Almoço', description: '150g de tilápia, 150g de mandioquinha e salada.', calories: 550 },
        { name: 'Lanche', description: 'Iogurte natural com granola e frutas.', calories: 400 },
        { name: 'Jantar', description: '150g de carne vermelha magra, 100g de arroz e legumes.', calories: 600 }
    ],
    friday: [
        { name: 'Café da Manhã', description: '4 ovos mexidos, 2 fatias de pão integral e 1 banana.', calories: 500 },
        { name: 'Almoço', description: '150g de patinho moído, 150g de batata doce e salada.', calories: 600 },
        { name: 'Lanche', description: 'Vitamina com leite, aveia e 1 banana.', calories: 450 },
        { name: 'Jantar', description: '150g de filé de frango, 100g de arroz branco e brócolis.', calories: 550 }
    ],
    saturday: [
        { name: 'Café da Manhã', description: 'Panqueca de aveia com 3 ovos, aveia e mel.', calories: 480 },
        { name: 'Almoço', description: 'Refeição livre.', calories: 1000 },
        { name: 'Lanche', description: 'Iogurte natural com granola e frutas.', calories: 400 },
        { name: 'Jantar', description: 'Refeição livre.', calories: 1000 }
    ],
    sunday: [
        { name: 'Café da Manhã', description: '4 ovos mexidos, 2 fatias de pão integral e 1 banana.', calories: 500 },
        { name: 'Almoço', description: 'Refeição livre.', calories: 1000 },
        { name: 'Lanche', description: 'Vitamina de frutas.', calories: 400 },
        { name: 'Jantar', description: '150g de filé de frango e salada.', calories: 400 }
    ],
};


export const generatePlans = (quizData: QuizData): { workoutPlan: WorkoutPlan, mealPlan: MealPlan } => {
    if (quizData.goal === Goal.GAIN_MUSCLE) {
        return {
            workoutPlan: muscleGainWorkoutPlan,
            mealPlan: muscleGainMealPlan
        };
    }
    
    // Default to weight loss
    return {
        workoutPlan: weightLossWorkoutPlan,
        mealPlan: weightLossMealPlan
    };
};
