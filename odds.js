export default async function handler(req, res) {
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader("Access-Control-Allow-Methods", "GET, OPTIONS");
  if (req.method === "OPTIONS") return res.status(200).end();

  const KEY = "0adb55cb535869c0e22ebc508b6efda2";
  const SPORTS = {
    NBA: "basketball_nba", NFL: "americanfootball_nfl",
    MLB: "baseball_mlb",   NHL: "icehockey_nhl",
    NCAAB: "basketball_ncaab", NCAAF: "americanfootball_ncaaf",
    MLS: "soccer_usa_mls",
  };

  const { sport = "NBA", type = "odds" } = req.query;
  const sk = SPORTS[sport];
  if (!sk) return res.status(400).json({ error: "Unknown sport" });

  const url = type === "scores"
    ? `https://api.the-odds-api.com/v4/sports/${sk}/scores/?apiKey=${KEY}&daysFrom=3`
    : `https://api.the-odds-api.com/v4/sports/${sk}/odds/?apiKey=${KEY}&regions=us&markets=h2h,spreads,totals&oddsFormat=american`;

  try {
    const r = await fetch(url);
    const data = await r.json();
    return res.status(r.status).json(data);
  } catch (e) {
    return res.status(500).json({ error: e.message });
  }
}
