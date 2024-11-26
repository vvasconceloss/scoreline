import { useEffect, useState } from "react";
import { Badge } from "@/components/ui/badge";
import { getDayMatches } from "@/services/matchesService";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";

export const TodayMatch = () => {
  const [matches, setMatches] = useState<any[]>([]);
  const [loading, setLoading] = useState<boolean>(false);

  const groupMatchesByCompetition = (matches: any[]) => {
    return matches.reduce((acc: any, match: any) => {
      const competitionCode = match?.competition?.code;
      if (!acc[competitionCode]) {
        acc[competitionCode] = {
          competition: match?.competition,
          matches: [],
        };
      }
      acc[competitionCode].matches.push(match);
      return acc;
    }, {});
  };

  const getMatches = async () => {
    setLoading(true);
    try {
      const response = await getDayMatches();
      const matchesData = response?.responseData?.matches || [];
      
      if (matchesData.length > 0) {
        const groupedMatches = groupMatchesByCompetition(matchesData);
        setMatches(Object.values(groupedMatches)); 
      }
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  const convertDate = (date: string) => {
    const convertDate = new Date(date);

    let hours: number = convertDate.getUTCHours();
    let minutes: number = convertDate.getUTCMinutes();

    const formattedHours: string = hours.toString().padStart(2, '0');
    const formattedMinutes: string = minutes.toString().padStart(2, '0');

    const formattedTime: string = `${formattedHours}h${formattedMinutes}`;

    return formattedTime;
  }

  useEffect(() => {
    if (!loading) {
      getMatches();
    }
  }, [loading]);

  return (
    <div className="flex flex-col w-[40rem] p-5 space-y-5 bg-slate-900 rounded-md">
    <h1 className="font-semibold">Today's Matches</h1>
    {loading ? (
      <div>Loading...</div>
    ) : (
      matches?.map((group: any, key: number) => (
        <Accordion type="multiple" key={key}>
          <AccordionItem value={group?.competition?.code}>
            <div className="flex items-center justify-between py-5">
              <AccordionTrigger>{group?.competition?.name}</AccordionTrigger>
              <div className="w-[3.0rem] h-[3.0rem] rounded-full bg-white flex items-center justify-center">
                <img
                  src={group?.competition?.emblem}
                  alt={`${group?.competition?.name} logo`}
                  className="p-2 w-full h-full object-contain"
                />
              </div>
            </div>
            <AccordionContent className="space-y-5">
              {group?.matches?.map((leagueMatch: any, matchKey: number) => (
                <div
                  key={matchKey}
                  className="flex items-center justify-between p-3 rounded-md bg-slate-800"
                >
                  <div className="flex items-center space-x-2 flex-1">
                    <img
                      src={leagueMatch?.homeTeam?.crest}
                      alt={leagueMatch?.homeTeam?.name}
                      className="w-[2.0rem] h-[2.0rem] object-contain"
                    />
                    <h1>{leagueMatch?.homeTeam?.name}</h1>
                  </div>
                  <div className="flex flex-col items-center justify-center flex-1 space-y-1">
                    <h2 className="text-center">{convertDate(leagueMatch?.utcDate)}</h2>
                    <h2 className="text-center">
                      <Badge variant="default">{leagueMatch?.status}</Badge>
                    </h2>
                  </div>
                  <div className="flex items-center space-x-2 flex-1 justify-end">
                    <h1 className="truncate">{leagueMatch?.awayTeam?.name}</h1>
                    <img
                      src={leagueMatch?.awayTeam?.crest}
                      alt={leagueMatch?.awayTeam?.name}
                      className="w-[2.0rem] h-[2.0rem] object-contain"
                    />
                  </div>
                </div>
              ))}
            </AccordionContent>
          </AccordionItem>
        </Accordion>
      ))
    )}
  </div>
  )
}