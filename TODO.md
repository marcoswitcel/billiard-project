
# Design do Jogo

* Definir o resultado visual almejada usando ferramentas como o Inkscape para desenhar cenas do jogo
* Definir algumas "mesas" especiais, com designe fora do tradicional? (apenas uma ideia)

# Implementar e testar física

* Implementar o sistema de constraints com integração verlet
  * Portar/adaptar o código que tenho em C++ para javascript -- ok
  * Implementar um box constraint seria importante para a simulação -- ok
* Estudar e configurar ferramentas para auxiliar com a criação de código webassembly, como por exemplo Assemblyscript: https://www.assemblyscript.org/
  * Montar um exemplo básico com webassembly, preferencialemnte passando objetos "complexos" (não apenas primitivos, string, number e afins) para dentro e recebendo eles de "volta", avaliar como esse tipo de coisa é feito
* Teste de funcionalidade para evitar regressão conforme for refatorando, otimizando e calibrando parâmetros da "física" -- parcialmente feito
* Criar cenas de testes específicas para simular movimentos que se espera que o jogar faça no jogo final -- trabalho em progresso
* Validar movimentos individuais e usar para testes de regressão conforme a física for sendo calibrada com os parâmetros ideias
* Avaliar movimentos em comparação com movimento na vida real, exemplo, avaliar a forma como a força é transferida de uma bola para a outra

# Ideias

* Implementar suporte ao mobile
 * Suporte a touch-events
 * Rotacionar a mesa?
 * Habilitar por padrão um modo de mira invertida para não precisar clicar em cima da bola e ter mais visibilidade
 * Verificar se a resolução e a proporção do canvas ficam legais no mobile

# Renderização

* Decidir e implementar forma de renderizar figuras complexas como por exemplo o taco de bilhar
* Sistema de mira para o taco
* Decidir e implementar gradientes nos locais apropriados

# Sistema de sons

* Decidir e implementar sistema de som
* Escolher sons e vinculá-los aos eventos apropriados
