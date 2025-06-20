import { Square, Circle, Triangle} from 'lucide-react';



export function ScoreIcon({score}: {score:number}) {
  if (score <= 0.49) {
    return <Triangle fill="#f33" className="text-[#f33] w-3 h-3" />;
  } else if (score >= 0.5 && score <= 0.89) {
    return <Square fill="#fa3" className="text-[#fa3] w-3 h-3" />;
  } else {
    return <Circle fill="#00cc66" className="text-[#00cc66] w-3 h-3" />;
  }
}