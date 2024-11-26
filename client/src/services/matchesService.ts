import { apiClientConfig } from "./apiClientConfig";

const getFromCache = (key: string) => {
  const cachedData = localStorage.getItem(key);
  return cachedData ? JSON.parse(cachedData) : null;
};

const saveToCache = (key: string, data: any) => {
  localStorage.setItem(key, JSON.stringify(data));
};

export const getLeaguesDayMatches = async (leagues: Array<string>) => {
  try {
    const leaguesData = await Promise.all(
      leagues.map(async (league) => {
        if (getFromCache(league)) {
          const cached = getFromCache(league);
          return { data: cached };
        }

        if (localStorage.getItem(`inProgress-${league}`)) {
          return new Promise(resolve => {
            const interval = setInterval(() => {
              if (!localStorage.getItem(`inProgress-${league}`)) {
                clearInterval(interval);
                resolve(getFromCache(league));
              }
            }, 100);
          });
        }
        
        localStorage.setItem(`inProgress-${league}`, 'true');
        
        const response = await apiClientConfig.get(`competitions/${league}`);
        const data = response.data.footballData;

        saveToCache(league, data);

        localStorage.removeItem(`inProgress-${league}`);
        return { data };
      })
    );

    return leaguesData;
  } catch (error) {
    console.error(error);
  }
};

export const getMatchesByLeague = async (leagues: Array<string>) => {
  const today = new Date();
  const year = today.getFullYear();
  const day = String(today.getDate()).padStart(2, '0');
  const month = String(today.getMonth() + 1).padStart(2, '0');
  const formattedDate = `${year}-${month}-${day}`;

  try {
    const leaguesData: any = await getLeaguesDayMatches(leagues);

    const leagueMatches = await Promise.all(
      leagues.map(async (_, index) => {
        const leagueCode = leaguesData[index].data.code;
        
        if (getFromCache(`${leagueCode}-matches`)) {
          const cachedMatches = getFromCache(`${leagueCode}-matches`);
          return { data: cachedMatches };
        }

        if (localStorage.getItem(`inProgress-${leagueCode}-matches`)) {
          return new Promise(resolve => {
            const interval = setInterval(() => {
              if (!localStorage.getItem(`inProgress-${leagueCode}-matches`)) {
                clearInterval(interval);
                resolve(getFromCache(`${leagueCode}-matches`));
              }
            }, 100);
          });
        }

        localStorage.setItem(`inProgress-${leagueCode}-matches`, 'true');
        
        const response = await apiClientConfig.get(
          `competitions/${leagueCode}/matches?dateTo=${formattedDate}&dateFrom=${formattedDate}`
        );
        const data = response.data.footballData;

        saveToCache(`${leagueCode}-matches`, data);

        localStorage.removeItem(`inProgress-${leagueCode}-matches`);
        return { data };
      })
    );

    return leagueMatches;
  } catch (error) {
    console.error(error);
  }
};

export const getDayMatches = async () => {
  try {
    const cacheKey = 'dayMatches';
    if (getFromCache(cacheKey)) {
      return getFromCache(cacheKey);
    }

    const responseData = await (await apiClientConfig.get('/matches')).data.footballData;
    const competitionsCode = responseData?.resultSet?.competitions.trim().split(/\s*,\s*/);

    const [leaguesData, leaguesMatches] = await Promise.all([
      getLeaguesDayMatches(competitionsCode),
      getMatchesByLeague(competitionsCode),
    ]);

    saveToCache(cacheKey, { leaguesData, responseData, leaguesMatches });

    return { leaguesData, responseData, leaguesMatches };
  } catch (error) {
    console.error(error);
  }
};