export const API_ENDPOINTS = {
  TFT: {
    // RIOT_API_BASE_URL_ASIA
    MATCHES: {
      BY_MEMBER_PUUID: (memberPuuid: string) =>
        `/tft/match/v1/matches/by-puuid/${memberPuuid}/ids`,
      BY_MATCH_ID: (matchId: string) => `/tft/match/v1/matches/${matchId}`,
    },
    LEAGUE: {
      // RIOT_API_BASE_URL_KR
      CHALLENGER: "tft/league/v1/challenger",
    },
  },
  ACCOUNT: {
    // RIOT_API_BASE_URL_ASIA
    BY_RIOT_ID: (gameName: string, tagLine: string) =>
      `riot/account/v1/accounts/by-riot-id/${gameName}/${tagLine}`,
  },
  LOL: {
    // RIOT_API_BASE_URL_ASIA
    MATCHES: {
      BY_MEMBER_PUUID: (memberPuuid: string) =>
        `lol/match/v5/matches/by-puuid/${memberPuuid}/ids`,
      BY_MATCH_ID: (matchId: string) => `lol/match/v5/matches/${matchId}`,
    },
  },
  LOL_IMAGE: {
    PROFILE_ICON: (profileIconId: number) =>
      `${process.env.NEXT_PUBLIC_IMAGE_BASE_URL}/profileicon/${profileIconId}.png`,
    SPELL: (spellName: string) =>
      `${process.env.NEXT_PUBLIC_IMAGE_BASE_URL}/spell/${spellName}`,
    ITEM: (itemId: number) =>
      `${process.env.NEXT_PUBLIC_IMAGE_BASE_URL}/item/${itemId}.png`,
    RUNE: (runeName: string) =>
      `${process.env.NEXT_PUBLIC_IMAGE_BASE_URL}/${runeName}`,
    CHAMPION: (championName: string) =>
      `${process.env.NEXT_PUBLIC_IMAGE_BASE_URL}/champion/${championName}`,
  },
  TFT_IMAGE: {
    CHAMPION: (championName: string) =>
      `${process.env.NEXT_PUBLIC_IMAGE_BASE_URL}/tft-champion/${championName}`,
    ITEM: (itemName: string) =>
      `${process.env.NEXT_PUBLIC_IMAGE_BASE_URL}/tft-item/${itemName}.png`,
  },
};
