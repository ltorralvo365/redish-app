import { Trophy, Medal, Award, TrendingUp, Flame } from "lucide-react";
import { achievements } from "../data/mockData";

interface LeaderboardUser {
  rank: number;
  name: string;
  points: number;
  mealsSaved: number;
  avatar: string;
  isCurrentUser?: boolean;
}

const leaderboard: LeaderboardUser[] = [
  { rank: 1, name: "João Silva", points: 2450, mealsSaved: 87, avatar: "👨" },
  { rank: 2, name: "Ana Costa", points: 2180, mealsSaved: 76, avatar: "👩" },
  { rank: 3, name: "Pedro Santos", points: 1950, mealsSaved: 68, avatar: "👨‍🦱" },
  { rank: 4, name: "Maria Oliveira", points: 1820, mealsSaved: 64, avatar: "👩‍🦰" },
  { rank: 5, name: "Carlos Ferreira", points: 1650, mealsSaved: 58, avatar: "👨‍🦲" },
  { rank: 6, name: "Sofia Rodrigues", points: 1520, mealsSaved: 53, avatar: "👩‍🦳" },
  { rank: 7, name: "Você", points: 285, mealsSaved: 12, avatar: "🙋", isCurrentUser: true },
  { rank: 8, name: "Ricardo Alves", points: 240, mealsSaved: 9, avatar: "👨‍💼" },
  { rank: 9, name: "Beatriz Lima", points: 185, mealsSaved: 7, avatar: "👩‍💻" },
  { rank: 10, name: "Miguel Sousa", points: 120, mealsSaved: 5, avatar: "👨‍🎓" },
];

export function EcoRanking() {
  const userPoints = 285;
  const userRank = 7;
  const nextRankPoints = 1520;
  const pointsToNext = nextRankPoints - userPoints;

  const totalPoints = achievements.reduce((sum, a) => sum + (a.unlocked ? a.points : 0), 0);
  const unlockedCount = achievements.filter(a => a.unlocked).length;

  return (
    <div className="min-h-screen bg-gradient-to-b from-amber-50 to-white">
      {/* Header */}
      <div className="bg-gradient-to-br from-amber-500 to-orange-500 text-white p-6 pb-12">
        <div className="max-w-md mx-auto">
          <div className="flex items-center gap-2 mb-2">
            <Trophy className="w-6 h-6" />
            <h1 className="text-2xl font-bold">Eco-Ranking</h1>
          </div>
          <p className="text-sm text-amber-100">
            Compete com outros heróis ambientais e sobe no ranking
          </p>
        </div>
      </div>

      <div className="max-w-md mx-auto px-4 -mt-8">
        {/* User Stats Card */}
        <div className="bg-white rounded-xl shadow-lg p-5 mb-6 border border-amber-200">
          <div className="flex items-center justify-between mb-4">
            <div>
              <div className="flex items-center gap-2 mb-1">
                <span className="text-3xl">🙋</span>
                <div>
                  <h3 className="font-bold text-gray-900">Seu Ranking</h3>
                  <p className="text-sm text-gray-600">Posição #{userRank}</p>
                </div>
              </div>
            </div>
            <div className="text-right">
              <div className="text-3xl font-bold text-amber-600">{userPoints}</div>
              <div className="text-xs text-gray-500">pontos eco</div>
            </div>
          </div>

          <div className="mb-3">
            <div className="flex justify-between text-sm text-gray-600 mb-1">
              <span>Progresso para #{userRank - 1}</span>
              <span className="text-amber-600 font-semibold">{pointsToNext} pts</span>
            </div>
            <div className="h-2 bg-gray-200 rounded-full overflow-hidden">
              <div 
                className="h-full bg-gradient-to-r from-amber-500 to-orange-500 rounded-full transition-all"
                style={{ width: `${(userPoints / nextRankPoints) * 100}%` }}
              />
            </div>
          </div>

          <div className="grid grid-cols-3 gap-3 pt-3 border-t border-gray-200">
            <div className="text-center">
              <div className="text-xl font-bold text-gray-900">12</div>
              <div className="text-xs text-gray-600">Refeições</div>
            </div>
            <div className="text-center">
              <div className="text-xl font-bold text-gray-900">{unlockedCount}/{achievements.length}</div>
              <div className="text-xs text-gray-600">Conquistas</div>
            </div>
            <div className="text-center">
              <div className="text-xl font-bold text-gray-900">30kg</div>
              <div className="text-xs text-gray-600">CO₂ evitado</div>
            </div>
          </div>
        </div>

        {/* Week Hero */}
        <div className="bg-gradient-to-r from-yellow-400 to-amber-500 rounded-xl p-5 mb-6 text-white shadow-lg">
          <div className="flex items-center gap-3 mb-3">
            <div className="w-14 h-14 bg-white rounded-full flex items-center justify-center text-3xl shadow-md">
              👨
            </div>
            <div>
              <div className="flex items-center gap-2 mb-1">
                <Flame className="w-5 h-5" />
                <span className="font-bold text-lg">Herói da Semana</span>
              </div>
              <p className="text-sm font-semibold">João Silva</p>
              <p className="text-xs text-yellow-100">17 refeições esta semana!</p>
            </div>
          </div>
          <p className="text-sm text-yellow-50">
            Será você o próximo herói? Continue salvando refeições! 🌟
          </p>
        </div>

        {/* Leaderboard */}
        <div className="bg-white rounded-xl shadow-lg overflow-hidden mb-6 border border-gray-200">
          <div className="bg-gradient-to-r from-gray-50 to-gray-100 p-4 border-b border-gray-200">
            <h2 className="font-bold text-gray-900 flex items-center gap-2">
              <TrendingUp className="w-5 h-5 text-amber-600" />
              Top 10 desta Semana
            </h2>
          </div>

          <div className="divide-y divide-gray-100">
            {leaderboard.map((user) => (
              <div
                key={user.rank}
                className={`p-4 flex items-center gap-3 transition-colors ${
                  user.isCurrentUser
                    ? "bg-amber-50 border-l-4 border-amber-500"
                    : user.rank <= 3
                    ? "bg-gradient-to-r from-yellow-50 to-transparent"
                    : "hover:bg-gray-50"
                }`}
              >
                {/* Rank Medal */}
                <div className="w-10 text-center">
                  {user.rank === 1 ? (
                    <Trophy className="w-7 h-7 text-yellow-500 mx-auto" />
                  ) : user.rank === 2 ? (
                    <Medal className="w-7 h-7 text-gray-400 mx-auto" />
                  ) : user.rank === 3 ? (
                    <Award className="w-7 h-7 text-amber-600 mx-auto" />
                  ) : (
                    <span className="text-lg font-bold text-gray-400">#{user.rank}</span>
                  )}
                </div>

                {/* Avatar */}
                <div className="w-12 h-12 bg-gradient-to-br from-green-100 to-emerald-100 rounded-full flex items-center justify-center text-2xl shadow-sm">
                  {user.avatar}
                </div>

                {/* User Info */}
                <div className="flex-1 min-w-0">
                  <p className={`font-semibold ${user.isCurrentUser ? "text-amber-700" : "text-gray-900"}`}>
                    {user.name}
                  </p>
                  <p className="text-sm text-gray-600">{user.mealsSaved} refeições salvas</p>
                </div>

                {/* Points */}
                <div className="text-right">
                  <p className={`text-lg font-bold ${user.isCurrentUser ? "text-amber-600" : "text-gray-900"}`}>
                    {user.points}
                  </p>
                  <p className="text-xs text-gray-500">pontos</p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Achievements Section */}
        <div className="bg-white rounded-xl shadow-lg p-5 mb-6 border border-gray-200">
          <h2 className="font-bold text-gray-900 mb-4 flex items-center gap-2">
            <Award className="w-5 h-5 text-green-600" />
            Suas Conquistas ({unlockedCount}/{achievements.length})
          </h2>

          <div className="space-y-3">
            {achievements.map((achievement) => (
              <div
                key={achievement.id}
                className={`p-4 rounded-lg border-2 transition-all ${
                  achievement.unlocked
                    ? "border-green-500 bg-green-50"
                    : "border-gray-200 bg-gray-50 opacity-60"
                }`}
              >
                <div className="flex items-start gap-3">
                  <div className={`text-3xl ${!achievement.unlocked && "grayscale opacity-40"}`}>
                    {achievement.icon}
                  </div>
                  <div className="flex-1">
                    <div className="flex items-start justify-between mb-1">
                      <h3 className={`font-semibold ${achievement.unlocked ? "text-gray-900" : "text-gray-500"}`}>
                        {achievement.title}
                      </h3>
                      <span className={`text-sm font-bold px-2 py-0.5 rounded ${
                        achievement.unlocked ? "bg-green-600 text-white" : "bg-gray-300 text-gray-600"
                      }`}>
                        +{achievement.points}
                      </span>
                    </div>
                    <p className={`text-sm ${achievement.unlocked ? "text-gray-600" : "text-gray-400"}`}>
                      {achievement.description}
                    </p>
                    
                    {!achievement.unlocked && achievement.progress !== undefined && achievement.maxProgress && (
                      <div className="mt-2">
                        <div className="flex justify-between text-xs text-gray-600 mb-1">
                          <span>Progresso</span>
                          <span>{achievement.progress}/{achievement.maxProgress}</span>
                        </div>
                        <div className="h-1.5 bg-gray-200 rounded-full overflow-hidden">
                          <div 
                            className="h-full bg-green-500 rounded-full transition-all"
                            style={{ width: `${(achievement.progress / achievement.maxProgress) * 100}%` }}
                          />
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Rewards Info */}
        <div className="bg-gradient-to-r from-purple-50 to-pink-50 rounded-xl p-5 mb-6 border border-purple-200">
          <div className="flex items-start gap-3">
            <div className="text-3xl">🎁</div>
            <div>
              <h3 className="font-semibold text-gray-900 mb-2">Recompensas Especiais</h3>
              <p className="text-sm text-gray-700 mb-3">
                Acumule pontos eco e troque por descontos exclusivos:
              </p>
              <div className="space-y-1.5 text-sm text-gray-700">
                <div className="flex items-center gap-2">
                  <span className="font-semibold text-purple-600">500 pts</span>
                  <span>= €5 de desconto</span>
                </div>
                <div className="flex items-center gap-2">
                  <span className="font-semibold text-purple-600">1000 pts</span>
                  <span>= €12 de desconto</span>
                </div>
                <div className="flex items-center gap-2">
                  <span className="font-semibold text-purple-600">2000 pts</span>
                  <span>= €25 de desconto + camisola eco</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
