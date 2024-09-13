class RecintosZoo {
  constructor() {
    this.recintos = [
      { numero: 1, bioma: "savana", tamanho: 10, animais: [{ tipo: "MACACO", quantidade: 3 }] },
      { numero: 2, bioma: "floresta", tamanho: 5, animais: [] },
      { numero: 3, bioma: "savana e rio", tamanho: 7, animais: [{ tipo: "GAZELA", quantidade: 1 }] },
      { numero: 4, bioma: "rio", tamanho: 8, animais: [] },
      { numero: 5, bioma: "savana", tamanho: 9, animais: [{ tipo: "LEAO", quantidade: 1 }] },
    ];

    this.animaisInfo = {
      "LEAO": { tamanho: 3, biomas: ["savana"], carnivoro: true },
      "LEOPARDO": { tamanho: 2, biomas: ["savana"], carnivoro: true },
      "CROCODILO": { tamanho: 3, biomas: ["rio"], carnivoro: true },
      "MACACO": { tamanho: 1, biomas: ["savana", "floresta"], carnivoro: false },
      "GAZELA": { tamanho: 2, biomas: ["savana"], carnivoro: false },
      "HIPOPOTAMO": { tamanho: 4, biomas: ["savana e rio"], carnivoro: false }
    };
  }

  analisaRecintos(animal, quantidade) {
    // Validação de entradas
    if (!this.animaisInfo[animal]) {
      return { erro: "Animal inválido" };
    }
    if (isNaN(quantidade) || quantidade <= 0) {
      return { erro: "Quantidade inválida" };
    }

    const animalInfo = this.animaisInfo[animal];
    const espacoNecessario = animalInfo.tamanho * quantidade;
    const biomasPermitidos = animalInfo.biomas;
    const carnivoro = animalInfo.carnivoro;

    const recintosViaveis = this.recintos
      .filter((recinto) => {
        const biomaAdequado = biomasPermitidos.includes(recinto.bioma) || (animal === "HIPOPOTAMO" && recinto.bioma === "savana e rio");
        if (!biomaAdequado) return false;

        let espacoOcupado = 0;
        let temOutraEspecie = false;
        let temCarnivoro = false;

        recinto.animais.forEach((animalExistente) => {
          const infoAnimalExistente = this.animaisInfo[animalExistente.tipo];
          espacoOcupado += infoAnimalExistente.tamanho * animalExistente.quantidade;

          if (animalExistente.tipo !== animal) temOutraEspecie = true;
          if (infoAnimalExistente.carnivoro) temCarnivoro = true;
        });

        // Regras de compatibilidade
        if (carnivoro && (temOutraEspecie || temCarnivoro)) return false;
        if (animal === "HIPOPOTAMO" && temOutraEspecie && recinto.bioma !== "savana e rio") return false;
        if (animal === "MACACO" && recinto.animais.length === 0 && quantidade === 1) return false;

        // Considerar espaço extra se houver múltiplas espécies
        if (temOutraEspecie) espacoOcupado += 1;

        const espacoLivre = recinto.tamanho - espacoOcupado;
        return espacoLivre >= espacoNecessario;
      })
      .map((recinto) => {
        let espacoOcupado = 0;
        recinto.animais.forEach((animalExistente) => {
          const infoAnimalExistente = this.animaisInfo[animalExistente.tipo];
          espacoOcupado += infoAnimalExistente.tamanho * animalExistente.quantidade;
        });

        // Calcula o espaço livre após adicionar os novos animais
        let espacoLivre = recinto.tamanho - espacoOcupado;
        if (recinto.animais.length > 0) {
          espacoLivre -= 1; // Espaço extra quando há múltiplas espécies
        }
        espacoLivre -= espacoNecessario;

        return `Recinto ${recinto.numero} (espaço livre: ${espacoLivre} total: ${recinto.tamanho})`;
      });

    if (recintosViaveis.length === 0) return { erro: "Não há recinto viável" };

    return { recintosViaveis };
  }
}

export { RecintosZoo as RecintosZoo };
