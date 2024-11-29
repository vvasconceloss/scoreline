import { useState } from "react";
import { Info } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { AccordionContent } from "@/components/ui/accordion";
import {
  AlertDialog,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { getTeamLastFiveMatches } from "@/services/teamsService";

export const TodayMatchToogle = ({ group }: any) => {
  const [homeMatches, setHomeMatches] = useState([]);
  const [awayMatches, setAwayMatches] = useState([]);

  const filterUniqueMatches = (matches: any[]) => {
    const seenIds = new Set();
    return matches.filter((match) => {
      if (seenIds.has(match.id)) {
        return false;
      }
      seenIds.add(match.id);
      return true;
    });
  };

  const getMatchResult = (match: any, teamId: number) => {
    const homeScore = match?.score?.fullTime?.home;
    const awayScore = match?.score?.fullTime?.away;
  
    if (match.homeTeam.id === teamId) {
      if (homeScore > awayScore) {
        return "W"; 
      } else if (homeScore < awayScore) {
        return "L";
      } else {
        return "D";
      }
    }
  
    if (match.awayTeam.id === teamId) {
      if (awayScore > homeScore) {
        return "W";
      } else if (awayScore < homeScore) {
        return "L";
      } else {
        return "D";
      }
    }
  
    return "Unknown";
  };
   
  const getTeamById = async (homeId: number, awayId: number) => {
    try {
      const [responseHomeTeam, responseAwayTeam] = await Promise.all([
        getTeamLastFiveMatches(homeId),
        getTeamLastFiveMatches(awayId),
      ]);

      const uniqueHomeMatches: any = filterUniqueMatches(responseHomeTeam);
      const uniqueAwayMatches: any = filterUniqueMatches(responseAwayTeam);

      setHomeMatches(uniqueHomeMatches);
      setAwayMatches(uniqueAwayMatches);
    } catch (error) {
      console.error("Erro ao buscar dados dos times:", error);
    }
  };

  const formatDate = (isoDate: any) => {
    const date = new Date(isoDate);

    const day = String(date.getDate()).padStart(2, '0');
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const year = String(date.getFullYear()).slice(-2);
    const hours = String(date.getHours()).padStart(2, '0');
    const minutes = String(date.getMinutes()).padStart(2, '0');

    return `${day}/${month}/${year} - ${hours}:${minutes}`;
  };

  return (
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
          <h2 className="text-center">
            <Badge
              className="w-14 flex items-center justify-center"
              variant="default"
            >
              { leagueMatch.status }
            </Badge>
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
        <div className="ml-5">
          <AlertDialog>
            <AlertDialogTrigger>
              <Info onClick={() => getTeamById(leagueMatch.homeTeam.id, leagueMatch.awayTeam.id)} />
            </AlertDialogTrigger>
            <AlertDialogContent>
              <AlertDialogHeader className="flex flex-col mb-5 p-3">
                <AlertDialogTitle>Match Details</AlertDialogTitle>
              </AlertDialogHeader>
              <div className="px-8 py-6 flex items-center justify-between">
                <div className="flex items-center flex-col">
                  <div className="flex items-center flex-col">
                    <img src={leagueMatch?.homeTeam.crest} alt="" className="w-[5.5rem] h-[5.5rem]"/>
                    <h3 className="">{leagueMatch?.homeTeam?.name}</h3>
                  </div>
                  <div className="flex my-2 space-x-2">
                  {
                    homeMatches.map((match, key) => {
                      const result = getMatchResult(match, leagueMatch?.homeTeam?.id);

                      let resultColorClass = "bg-red-500";
                      if (result === "W") {
                        resultColorClass = "bg-green-500";
                      } else if (result === "D") {
                        resultColorClass = "bg-yellow-500";
                      }
                    
                      return (
                        <div key={key} className={`${resultColorClass} rounded-md p-2 w-8 h-8 flex items-center justify-center`}>
                          {result}
                        </div>
                      );
                    })
                  }
                  </div>
                </div>
                <div className="flex flex-col items-center">
                  <h2>VS</h2> 
                  <h2>{formatDate(leagueMatch.utcDate)}</h2>
                </div>
                <div className="flex flex-col items-center">
                  <div className="flex items-center flex-col">
                    <img src={leagueMatch?.awayTeam.crest} alt="" className="w-[5.5rem] h-[5.5rem]"/>
                    <h3 className="">{leagueMatch?.awayTeam?.name}</h3>
                  </div>
                  <div className="flex my-2 space-x-2">
                  {
                    awayMatches.map((match, key) => {
                      const result = getMatchResult(match, leagueMatch?.awayTeam?.id);

                      let resultColorClass = "bg-red-500";
                      if (result === "W") {
                        resultColorClass = "bg-green-500";
                      } else if (result === "D") {
                        resultColorClass = "bg-yellow-500";
                      }
                    
                      return (
                        <div key={key} className={`${resultColorClass} rounded-md p-2 w-8 h-8 flex items-center justify-center`}>
                          {result}
                        </div>
                      );
                    })
                  }
                  </div>
                </div>
              </div>
              <AlertDialogFooter className="p-3">
                <AlertDialogCancel>Close</AlertDialogCancel>
              </AlertDialogFooter> 
            </AlertDialogContent>
          </AlertDialog>
        </div>
      </div>
    ))}
  </AccordionContent>
  )
}