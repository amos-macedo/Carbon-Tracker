 const getEmissionColor = (emission: number) => {
    if (emission < 5) return "text-green-400";
    if (emission < 15) return "text-yellow-400";
    return "text-red-400";
  };

  const getEmissionBadge = (emission: number) => {
    if (emission < 5)
      return { text: "🟢 Baixa Emissão", color: "text-green-400" };
    if (emission < 15)
      return { text: "🟡 Emissão Moderada", color: "text-yellow-400" };
    return { text: "🔴 Alta Emissão", color: "text-red-400" };
  };

  export { getEmissionColor, getEmissionBadge };