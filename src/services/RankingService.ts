import UserService from './UserService';

const topRanks = [
  { id: 'third', position: 3 },
  { id: 'second', position: 2 },
  { id: 'first', position: 1 },
];

export const ranks = [
  { id: 'unranked', from: 0 },
  { id: 'bronze', from: 80 },
  { id: 'silver', from: 150 },
  { id: 'gold', from: 250 },
  { id: 'platinum', from: 400, highest: true },
  ...topRanks,
];

export const POINTS_PER_WIN = 5;
export const POINTS_PER_LOSE = -2;
export const POINTS_PER_DRAW = 1;

export default class RankingService {
  /**
   * Get the rank of a user
   * @param userId The user id
   * @returns The rank
   * @throws Error if the user is not found
   */
  static async getRank(userId: string) {
    const user = await UserService.get(userId);
    if (!user) throw new Error('User not found');
    const rank = ranks.find((r) => ('from' in r ? user.rating >= r.from : false));
    if (!rank) return ranks[0];

    if ('highest' in rank && rank.highest) {
      const position = await UserService.getPositionByRating(user.rating);
      const topRank = topRanks.find((r) => r.position === position + 1);
      return topRank || rank;
    } return rank;
  }
}
