import { Progress } from '@/components/ui/progress';
import { cn } from '@/lib/utils';

type OccupancyBarProps = {
  occupied: number;
  total: number;
};

export default function OccupancyBar({ occupied, total }: OccupancyBarProps) {
  const percentage = total > 0 ? (occupied / total) * 100 : 0;
  
  const progressBarColor = () => {
    if (percentage > 90) return 'bg-red-500';
    if (percentage > 70) return 'bg-yellow-500';
    return 'bg-green-500';
  };

  return (
    <Progress
      value={percentage}
      className="h-3 transition-all"
      indicatorClassName={cn("transition-all", progressBarColor())}
    />
  );
}
