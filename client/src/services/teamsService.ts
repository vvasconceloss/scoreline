import { apiClientConfig } from "./apiClientConfig";

const getFromCache = (key: string) => {
  try {
    const cachedData = localStorage.getItem(key);
    if (!cachedData) return null;

    const { data, expiry } = JSON.parse(cachedData);

    if (expiry && Date.now() > expiry) {
      localStorage.removeItem(key);
      return null;
    }

    return data;
  } catch (error) {
    console.error(`Erro ao ler o cache para a chave: ${key}`, error);
    localStorage.removeItem(key);
    return null;
  }
};

const saveToCache = (key: string, data: any, ttl: number) => {
  try {
    const expiry = ttl ? Date.now() + ttl : null;
    const cachedData = { data, expiry };

    localStorage.setItem(key, JSON.stringify(cachedData));
  } catch (error) {
    console.error(`Erro ao salvar no cache para a chave: ${key}`, error);
  }
};

export const getTeamLastFiveMatches = async (teamId: number) => {
  const cacheKey = `team-${teamId}-last-five-matches`;
  const ttl = 1000 * 60 * 60;

  try {
    const cachedMatches = getFromCache(cacheKey);
    if (cachedMatches) {
      return cachedMatches;
    }

    const response = (await apiClientConfig.get(`teams/${teamId}/matches?status=FINISHED`)).data.footballData;
    const matches = response.matches.slice(-5).reverse();

    saveToCache(cacheKey, matches, ttl);

    return matches;
  } catch (error) {
    console.error(`Erro ao obter dados para o time ${teamId}`, error);
    return [];
  }
};