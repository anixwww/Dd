export const DAY = 24 * 60 * 60 * 1000;

export interface HealthMilestone {
  id: string;
  title: string;
  timeMs: number;
  description: string;
  category: 'cardio' | 'lungs' | 'brain' | 'toxins' | 'taste';
  percentage?: number;
}

export const HEALTH_MILESTONES: HealthMilestone[] = [
  { id: '20m', title: 'Пульс і тиск', timeMs: 20 * 60 * 1000, description: 'Пульс та артеріальний тиск повертаються до нормальних показників.', category: 'cardio' },
  { id: '8h', title: 'Кисень у крові', timeMs: 8 * 60 * 60 * 1000, description: 'Рівень чадного газу в крові падає вдвічі, кисень повертається до норми.', category: 'cardio' },
  { id: '24h', title: 'Ризик інфаркту', timeMs: 24 * 60 * 60 * 1000, description: 'Чадний газ повністю виводиться з організму, легені починають очищуватися.', category: 'cardio' },
  { id: '48h', title: 'Смак і нюх', timeMs: 48 * 60 * 60 * 1000, description: 'Нікотин повністю виводиться. Нервові закінчення починають відновлюватися.', category: 'taste' },
  { id: '72h', title: 'Дихальні шляхи', timeMs: 72 * 60 * 60 * 1000, description: 'Бронхіоли розслаблюються, дихати стає значно легше, рівень енергії зростає.', category: 'lungs' },
  { id: '2w', title: 'Кровообіг', timeMs: 14 * DAY, description: 'Кровообіг суттєво покращується, функція легень зростає на 30%.', category: 'cardio' },
  { id: '1m', title: 'Вії легень', timeMs: 30 * DAY, description: 'Вії в легенях відновлюють рухливість, зменшується кашель та задишка.', category: 'lungs' },
  { id: '3m', title: 'Легеневий об\'єм', timeMs: 90 * DAY, description: 'Легенева місткість зростає на 10%, знижується ризик інфекцій.', category: 'lungs' },
  { id: '1y', title: 'Серцевий ризик -50%', timeMs: 365 * DAY, description: 'Ризик ішемічної хвороби серця знижується вдвічі порівняно з курцем.', category: 'cardio' },
  { id: '5y', title: 'Ризик інсульту', timeMs: 5 * 365 * DAY, description: 'Ризик інсульту знижується до рівня людини, яка ніколи не курила.', category: 'brain' },
  { id: '10y', title: 'Онкоризик -50%', timeMs: 10 * 365 * DAY, description: 'Ризик раку легень знижується на 50% порівняно з курцем.', category: 'lungs' },
];

export function getTodayHealthFact(diffMs: number): string {
  const hours = Math.floor(diffMs / (1000 * 60 * 60));
  if (hours < 24) return 'Перша доба: твої судини позбавляються спазму, а кров насичується чистим киснем.';
  if (hours < 72) return 'Нікотин повністю вийшов з організму. Твоє тіло вже вільне від токсину!';
  if (hours < 168) return 'Смакові рецептори оновлюються: смак їжі та запахи стають набагато яскравішими.';
  if (hours < 720) return 'Легені відновлюють природне самоочищення, кашель та задишка поступово зникають.';
  return 'Нейропластичність мозку відновлена: дофамінова система самостійно генерує радість та спокій!';
}

export function getBodySystemsRecovery(diffMs: number) {
  const days = diffMs / DAY;
  return [
    { name: 'Серцево-судинна система', progress: Math.min(100, Math.round(days * 3.5 + 5)), icon: '❤️' },
    { name: 'Дихальна система', progress: Math.min(100, Math.round(days * 2.8 + 3)), icon: '🫁' },
    { name: 'Нервова система (дофамін)', progress: Math.min(100, Math.round(days * 4.2 + 2)), icon: '🧠' },
    { name: 'Детоксикація крові', progress: Math.min(100, Math.round(days * 12.5 + 10)), icon: '🩸' },
  ];
}
