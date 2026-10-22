Este trabalho descreve o desenvolvimento do Quiro Vitae, um sistema web para agendamento online e controle de presença 
em clínicas de quiropraxia. A motivação veio da observação de uma clínica real, onde a autora era paciente, que ainda gerenciava 
agendamentos e comparecimentos com planilhas eletrônicas e anotações manuais. Esse método resultava em conflitos de horário, esquecimentos
e dificuldade em consolidar dados. A pesquisa, de natureza aplicada,envolveu o levantamento de requisitos a partir da observação do fluxo 
de trabalho, a modelagem de requisitos funcionais e não funcionais e a implementação de um protótipo funcional em HTML5, CSS3 e JavaScript. 
A persistência dos dados foi feita localmente, usando a Web Storage API.

O sistema oferece um assistente de agendamento em quatro etapas (serviço, profissional, data e horário, dados do paciente) e bloqueia
automaticamente horários já ocupados por um profissional.

Há um painel “Minhas consultas” onde o paciente, após fazer login eser identificado por um avatar com o seu nome, pode confirmar presença,
remarcar ou cancelar sem contato telefônico. Uma área restrita para aclínica permite registrar comparecimentos e faltas, calcular a taxa de 
presença, e cadastrar clientes com seus pacotes, total de sessões,progresso (realizadas e faltosas) e a forma de pagamento. 

Essas informações ficam disponíveis para o paciente em sua própria área para acompanhamento. O resultado é um protótipo que abrange todo o ciclo 
de uma consulta, substituindo os controles manuais existentes. Este trabalhotambém aborda as limitações da versão, como ausência de back-end e de 
autenticação em servidor, e propõe futuras evoluções, como a inclusãode banco de dados, notificações automáticas e adequação à Lei Geral de
Proteção de Dados.

