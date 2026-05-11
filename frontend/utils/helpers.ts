export const formatDate = (date: string | Date) => {
  return new Date(date).toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  });
};

export const formatTime = (minutes: number) => {
  if (minutes < 60) return `${minutes}m`;
  const hours = Math.floor(minutes / 60);
  const mins = minutes % 60;
  return `${hours}h ${mins}m`;
};

export const getDifficultyColor = (difficulty: string) => {
  switch (difficulty) {
    case 'beginner':
      return 'text-soc-green';
    case 'intermediate':
      return 'text-soc-yellow';
    case 'advanced':
      return 'text-soc-red';
    case 'expert':
      return 'text-soc-purple';
    default:
      return 'text-gray-400';
  }
};

export const getDifficultyBgColor = (difficulty: string) => {
  switch (difficulty) {
    case 'beginner':
      return 'bg-green-900/30';
    case 'intermediate':
      return 'bg-yellow-900/30';
    case 'advanced':
      return 'bg-red-900/30';
    case 'expert':
      return 'bg-purple-900/30';
    default:
      return 'bg-gray-900/30';
  }
};

export const slugify = (str: string) => {
  return str
    .toLowerCase()
    .trim()
    .replace(/[^\w\s-]/g, '')
    .replace(/[\s_]+/g, '-')
    .replace(/^-+|-+$/g, '');
};

export const truncate = (str: string, length: number) => {
  return str.length > length ? str.slice(0, length) + '...' : str;
};

export const delay = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms));
