
# Design do Jogo

* Definir o resultado visual almejada usando ferramentas como o Inkscape para desenhar cenas do jogo
* Definir algumas "mesas" especiais, com desgine fora do tradicional? (apenas uma ideia)

# Implementar e testar física

* Implementar o sistema de constraints com integração verlet
  * Portar/adaptar o código que tenho em C++ para javascript -- ok
  * Implementar um box constraint seria importante para a simulação
* Estudar e configurar ferramentas para auxiliar com a criação de código webassembly, como por exemplo Assemblyscript: https://www.assemblyscript.org/
  * Montar um exemplo básico com webassembly, preferencialemnte passando objetos "complexos" (não apenas primitivos, string, number e afins) para dentro e recebendo eles de "volta", avaliar como esse tipo de coisa é feito
* Teste de funcionalidade para evitar regressão conforme for refatorando, otimizando e calibrando parâmetros da "física"
* Criar cenas de testes específicas para simular movimentos que se espera que o jogar faça no jogo final -- trabalho em progresso
* Validar movimentos individuais e usar para testes de regressão conforme a física for sendo calibrada com os parâmetros ideias

