import { useEffect, useState } from "react";
import { getDayMatches } from "@/services/matchesService";
import {
  Accordion,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { TodayMatchToogle } from "./TodayMatchToogle";

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

  useEffect(() => {
    if (!loading) {
      getMatches();
    }
  }, [loading]);

  return (
    <div className="flex flex-col justify-center w-full p-5 space-y-5 bg-slate-900 rounded-md">
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
                <div className="flex flex-col w-full">
                  <AccordionTrigger>{group?.competition?.name}</AccordionTrigger>
                  <div className="flex items-center space-x-2">
                    <img
                      src={group.matches[0].area.flag}
                      alt={`${group.matches[0].area.name}  flag`}
                      className="w-[1.0rem] h-[1.0rem] object-contain"
                    />
                    <h3 className="text-slate-500">
                      {group.matches[0].area.name} | {group.matches.length} matches
                    </h3>
                  </div>
                </div>
              </div>
              <TodayMatchToogle group={group} />
            </AccordionItem>
          </Accordion>
        ))
      )}
    </div>
  );
};