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
    <div className="flex flex-col w-full h-full p-5 space-y-5 bg-slate-900 rounded-md">
    <h1 className="font-semibold">Today's Matches</h1>
    {loading ? (
      <div>Loading...</div>
    ) : (
      matches?.map((group: any, key: number) => (
        <Accordion type="multiple" key={key}>
          <AccordionItem value={group?.competition?.code}>
            <div className="flex items-center py-5 space-x-5">
              <div className="w-[3.0rem] h-[3.0rem] rounded-full bg-white flex items-center justify-center">
                <img
                  src={group?.competition?.emblem}
                  alt={`${group?.competition?.name} logo`}
                  className="p-2 w-full h-full object-contain"
                />
              </div>
              <div className="flex flex-col">
                <AccordionTrigger>{group?.competition?.name}</AccordionTrigger>
                <div className="flex items-center space-x-2">
                  <img src={group.matches[0].area.flag} alt={`${group.matches[0].area.name}  flag`} className="w-[1.0rem] h-[1.0rem] object-contain" />
                  <h3 className="text-slate-500">{group.matches[0].area.name} | {group.matches.length} matches</h3>
                </div>
              </div>
            </div>
            <AccordionContent className="space-y-5">
              {group?.matches?.map((leagueMatch: any, matchKey: number) => (
                <div
                  key={matchKey}
                  className="flex items-center justify-between p-3 rounded-md border-2 border-slate-800"
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
                      <Badge className="w-14 flex items-center justify-center" variant="default">{leagueMatch?.status}</Badge>
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